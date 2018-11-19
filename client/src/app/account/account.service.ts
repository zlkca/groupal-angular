import { Injectable } from '@angular/core';
import { Observable, merge } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AccountApi, Account, LoopBackFilter } from '../lb-sdk';
import { NgRedux } from '@angular-redux/store';
import { AccountActions } from './account.actions';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  DEFAULT_PASSWORD = '';

  constructor(
    private ngRedux: NgRedux<Account>,
    private accountApi: AccountApi,
  ) { }

  signup(account: Account): Observable<Account> {
    const self = this;
    return this.accountApi.create(account).pipe(
      mergeMap(
        x => {return self.accountApi.login(account.username, account.password);
      })
    );
  }

  login(username: string, password: string, rememberMe: boolean = true): Observable<Account> {
    const credentials = {
      username: username,
      password: password
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
    // const state = this.ngRedux.getState();
    // if (state && state.id) {
    //   this.ngRedux.dispatch({ type: AccountActions.UPDATE, payload: new Account() });
    // }
    return this.accountApi.logout();
  }

  getCurrent(forceGet: boolean = false): Observable<Account> {
    // const state: any = this.ngRedux.getState();
    // if (!state || !state.email || forceGet) {
    //   this.updateCurrent();
    // }
    // return this.ngRedux.select<Account>('account');
    return this.accountApi.getCurrent();
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
    return this.accountApi.create(account);
  }

  replaceOrCreate(account: Account): Observable<any> {
    return this.accountApi.replaceOrCreate(account);
  }

  replaceById(id: number, account: Account) {
    return this.accountApi.replaceById(id, account);
  }

  deleteById(id): Observable<any> {
    return this.accountApi.deleteById(id);
  }
}
