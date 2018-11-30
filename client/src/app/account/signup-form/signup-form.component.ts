import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { AuthService } from '../auth.service';
import { AccountActions } from '../account.actions';

import { AccountService } from '../account.service';
import { Account } from '../../lb-sdk';

@Component({
  providers: [AuthService],
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {
  errMsg: string;
  form: FormGroup;
  mode;

  constructor(private fb: FormBuilder,
    private authServ: AuthService,
    private accountSvc: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private ngRedux: NgRedux<Account>
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    const self = this;
    this.route.queryParams.subscribe(params => {
      self.mode = params['mode'];
    });
  }

  onSignup() {
    const self = this;
    const v = this.form.value;
    const account = new Account({
      username: v.username,
      email: v.username + '@groupal.ca', // v.email,
      password: v.password,
      type: this.mode
    });
    this.accountSvc.signup(account).subscribe(
      (acc: Account) => {
          if (acc.id) {
            self.ngRedux.dispatch({ type: AccountActions.UPDATE, payload: acc });
            self.router.navigate(['home']);
          }
      },
      err => {
        console.log(err.message);
        this.errMsg = 'Create Account Failed';
      });
  }

}
