import { Injectable } from '@angular/core';
import { Observable, merge, EMPTY, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AccountApi, Account, LoopBackFilter, Portrait, PortraitApi, LoopBackAuth, AccountIdentity } from '../lb-sdk';
import { NgRedux } from '@angular-redux/store';
import { AccountActions } from './account.actions';
import { SharedService } from '../shared/shared.service';

declare var gapi;

const API_URL = environment.API_URL;
const TWO_WEEKS = 60 * 60 * 24 * 7 * 2;

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  DEFAULT_PASSWORD = '';
  APP_URL = environment.APP_URL;

  constructor(
    private ngRedux: NgRedux<Account>,
    private accountApi: AccountApi,
    private portraitApi: PortraitApi,
    private authApi: LoopBackAuth,
    private sharedSvc: SharedService
  ) { }

  signup(account: Account): Observable<Account> {
    const self = this;
    return this.accountApi.create(account);
    // .pipe(
    //   mergeMap(
    //     x => {return self.accountApi.login(account.username, account.password);
    //   })
    // );
  }

  getCurrentUserData() {
    return this.authApi.getCurrentUserData();
  }

  getIdentities(userId): Observable<AccountIdentity[]> {
    return this.accountApi.getIdentities(userId);
  }

  login(username: string, password: string, rememberMe: boolean = true): Observable<Account> {
    const credentials = {
      username: username,
      password: password,
      ttl: TWO_WEEKS // keep the AccessToken alive for at least two weeks
    };
    const self = this;
    return this.accountApi.login(credentials, null, rememberMe)
      .pipe(
        mergeMap(() => {
          return self.accountApi.getCurrent();
        }),
        map((acc: Account) => {
          // self.ngRedux.dispatch({ type: AccountActions.UPDATE, payload: acc });
          return acc;
        })
      );
  }

  logout(): Observable<any> {
    // const auth2 = gapi.auth2.getAuthInstance();
    // auth2.signOut().then(function () {
    //   console.log('User signed out.');
    // });
      return this.accountApi.logout();
  }

  getCurrent(filter: LoopBackFilter = {}): Observable<Account> {
    // const state: any = this.ngRedux.getState();
    // if (!state || !state.email || forceGet) {
    //   this.updateCurrent();
    // }
    // return this.ngRedux.select<Account>('account');
    const id: any = this.authApi.getCurrentUserId();
    if (id && id !== 'NaN') {
      return this.accountApi.getCurrent(filter);
    } else {
      return EMPTY;
    }
  }

  updateCurrent() {
    const self = this;
    this.accountApi.getCurrent({ include: 'restaurants' })
      .subscribe((acc: Account) => {
        self.ngRedux.dispatch({ type: AccountActions.UPDATE, payload: acc });
      });
  }

  isAuthenticated(): boolean {
    return this.accountApi.isAuthenticated();
  }

  find(filter: LoopBackFilter = {}): Observable<Account[]> {
    return this.accountApi.find(filter);
  }

  findById(id: number, filter: LoopBackFilter = {}): Observable<Account> {
    return this.accountApi.findById(id, filter);
  }

  create(account: Account): Observable<any> {
    const self = this;
    return this.accountApi.create(account).pipe(
      map((r: Account) => {
        // self.updatePictures(r.id, account.portraits);
      })
    );
  }

  patchAttributes(id: number, data: any): Observable<any> {
    const self = this;
    return this.accountApi.patchAttributes(id, data).pipe(
      map((r: Account) => {
        // self.updatePictures(id, data.portraits);
      })
    );
  }

  // replaceOrCreate(account: Account): Observable<any> {
  //   return this.accountApi.replaceOrCreate(account);
  // }

  replaceById(id: number, account: Account) {
    const self = this;
    return this.accountApi.replaceById(id, account).pipe(
      map((r: Account) => {
        // self.updatePictures(r.id, account.portraits);
      })
    );
  }

  deleteById(id): Observable<any> {
    return this.accountApi.deleteById(id);
  }

  inPictureArray(pictureId, pictures) {
    if (pictures && pictures > 0) {
      return pictures.findIndex(p => p.id === pictureId) !== -1;
    } else {
      return false;
    }
  }

  // deprecated
  updatePictures(id: number, newPictures: Portrait[] = null) {
    const self = this;
    this.accountApi.getPortraits(id).subscribe((pictures: Portrait[]) => {
      const picturesToRemove: Portrait[] = pictures ? pictures.filter(pic => !this.inPictureArray(pic.id, newPictures)) : [];
      const picturesToUpdate: Portrait[] = pictures ? pictures.filter(pic => this.inPictureArray(pic.id, newPictures)) : [];
      const picturesToAdd: Portrait[] = newPictures ? newPictures.filter(newPic => !newPic.id) : [];

      picturesToRemove.map(pic => {
        self.portraitApi.deleteById(pic.id).subscribe(x => {});
      });

      if (picturesToAdd.length > 0) {
        picturesToAdd.map(pic => {
          pic.accountId = id;
          self.portraitApi.patchOrCreate(pic).subscribe(x => {});
        });
      }

      if (picturesToUpdate.length > 0) {
        picturesToUpdate.map(pic => {
          pic.accountId = id;
          self.portraitApi.patchOrCreate(pic).subscribe(x => {});
        });
      }
    });
  }

  patchAccount(id: number, data: any): Observable<any> {
    const self = this;
    return this.accountApi.patchAttributes(id, data).pipe(
      map((r: Account) => {
        if (data.portraits && data.portraits.length > 0) {
          // self.updatePortrait(id, data.portraits);
          self.portraitApi.patchOrCreate(data.portraits[0]).subscribe(() => {

          });
        }
      })
    );
  }

  findPortraitsByAccountId(userId): Observable<Portrait[]> {
    return this.portraitApi.find({ where: { 'accountId': userId } });
  }

  update3rdAccount(account: Account) {
    const self = this;
    return new Observable( (observer) => {
      self.portraitApi.find({ where: { 'accountId': account.id } }).subscribe(
        (r: Portrait[]) => {
          if (r && r.length > 0) {
            self.patchAccount(account.id, { 'username': account.username }).subscribe( () => {
              observer.next(account);
              observer.complete();
            });
          } else {
            self.patchAccount(account.id, { 'username': account.username, 'portraits': account.portraits }).subscribe( () => {
              observer.next(account);
              observer.complete();
            });
          }
        });
        return () => {};
    });
  }

  getPortrait(account) {
    if (account && account.portraits && account.portraits.length > 0) {
      if (account.portraits[0].url.indexOf('https://') > -1) { // for 3rd login photos
        return account.portraits[0].url;
      } else {
        return this.sharedSvc.getContainerUrl() + account.portraits[0].url;
      }
    } else {
      return this.APP_URL + '/assets/images/portrait.png';
    }
  }
}
