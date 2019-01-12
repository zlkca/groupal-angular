import { Injectable } from '@angular/core';
import { Observable, merge, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AccountApi, Account, LoopBackFilter, Portrait, PortraitApi, LoopBackAuth } from '../lb-sdk';
import { NgRedux } from '@angular-redux/store';
import { AccountActions } from './account.actions';

declare var gapi;

const API_URL = environment.API_URL;
const TWO_WEEKS = 60 * 60 * 24 * 7 * 2;

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  DEFAULT_PASSWORD = '';

  constructor(
    private ngRedux: NgRedux<Account>,
    private accountApi: AccountApi,
    private portraitApi: PortraitApi,
    private authApi: LoopBackAuth
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

  getGoogleIdentities(userId) {
    return this.accountApi.getIdentities(userId);
    // .subscribe((x: UserIdentity) => {
    //   if (x) {
    //     return JSON.parse(x.profile);
    //   } else {
    //     return null;
    //   }
    // });
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
        self.updatePictures(r.id, account.portraits);
      })
    );
  }

  patchAttributes(id: number, data: any): Observable<any> {
    const self = this;
    return this.accountApi.patchAttributes(id, data).pipe(
      map((r: Account) => {
        self.updatePictures(r.id, data.portraits);
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
        self.updatePictures(r.id, account.portraits);
      })
    );
  }

  deleteById(id): Observable<any> {
    return this.accountApi.deleteById(id);
  }

  inPictureArray(pictureId, pictures) {
    return pictures.findIndex(p => p.id === pictureId) !== -1;
  }

  updatePictures(id: number, newPictures: Portrait[] = null) {
    const self = this;
    this.accountApi.getPortraits(id).subscribe((pictures: Portrait[]) => {
      const picturesToRemove: Portrait[] = pictures ? pictures.filter(pic => !this.inPictureArray(pic.id, newPictures)) : [];
      const picturesToUpdate: Portrait[] = pictures ? pictures.filter(pic => this.inPictureArray(pic.id, newPictures)) : [];
      const picturesToAdd: Portrait[] = newPictures ? newPictures.filter(newPic => !newPic.id) : [];

      picturesToRemove.map(pic => {
        return this.portraitApi.deleteById(pic.id).subscribe(x => {});
      });

      if (picturesToAdd.length > 0) {
        picturesToAdd.map(pic => {
          pic.accountId = id;
          this.portraitApi.patchOrCreate(pic).subscribe(x => { });
        });
      }

      if (picturesToUpdate.length > 0) {
        picturesToUpdate.map(pic => {
          pic.accountId = id;
          return self.portraitApi.patchOrCreate(pic);
        });
      }

    });
  }
}
