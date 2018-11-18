import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private fb: FormBuilder,
    private authServ: AuthService,
    private accountSvc: AccountService,
    private router: Router) {

    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {

  }

  onSignup() {
    const v = this.form.value;
    const account = new Account({
      username: v.username,
      email: v.username + '@groupal.ca', // v.email,
      password: v.password,
      type: 'user'
    });
    this.accountSvc.signup(account).subscribe(
      (user: Account) => {
        if (user.id) {
          this.router.navigate(['home']);
        }
      },
      err => {
        this.errMsg = err.message || 'Create Account Failed';
      });
  }

}
