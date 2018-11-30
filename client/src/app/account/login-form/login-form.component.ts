import { Component, Output, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';

import { AuthService } from '../auth.service';
// import { SharedService } from '../../shared/shared.service';
import { AccountActions } from '../account.actions';
import { AccountService } from '../../account/account.service';
import { Account } from '../../lb-sdk';

@Component({
  providers: [AuthService],
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  public user;
  public account = '';
  public password = '';

  token = '';
  errMsg = '';
  auth2: any;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authServ: AuthService,
    private router: Router,
    private ngRedux: NgRedux<Account>,
    private accountServ: AccountService,
  ) {

    this.form = this.fb.group({
      account: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {

  }
  onLogin() {
    const self = this;
    const v = this.form.value;
    // if (this.form.valid) {
    this.accountServ.login(v.account, v.password)
      .subscribe((account: Account) => {
        self.ngRedux.dispatch({ type: AccountActions.UPDATE, payload: account });
        if (account.type === 'user') {
          this.router.navigate(['home']);
        } else {
          if (account.type === 'super' || account.type === 'organizer') {
            this.router.navigate(['admin']);
          } else {
            this.router.navigate(['home']);
          }
        }
      },
        (error) => {
          this.errMsg = error.message || 'login failed.';
          console.error('An error occurred', error);
        });
  }


  onForgetPassword() {
    // this.router.navigate(["/forget-password"]);;
    // return false;
  }

  onChangeAccount() {
    this.errMsg = '';
  }

  onChangePassword() {
    this.errMsg = '';
  }


  toSignup() {
    this.router.navigate(['signup'], { queryParams: { mode: 'user' } });
  }
}



