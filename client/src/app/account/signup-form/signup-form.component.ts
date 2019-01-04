import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { AuthService } from '../auth.service';
import { AccountActions } from '../account.actions';

import { AccountService } from '../account.service';
import { Account } from '../../lb-sdk';
import { ToastrService } from '../../../../node_modules/ngx-toastr';

@Component({
  providers: [AuthService],
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
  errMsg: string;
  form: FormGroup;
  mode;
  isChecked;

  constructor(private fb: FormBuilder,
    private authServ: AuthService,
    private accountSvc: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private ngRedux: NgRedux<Account>,
    private toastSvc: ToastrService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      type: ['']
    });
  }

  ngOnInit() {
    const self = this;
    this.route.queryParams.subscribe(params => {
      self.mode = params['mode'];
      // self.form.get('type').patchValue(self.mode === 'organizer');
    });
  }

  onSignup() {
    const self = this;
    const v = this.form.value;
    const account = new Account({
      username: v.username,
      email: v.username + '@groupal.ca', // v.email,
      password: v.password,
      type: 'user' // this.mode
    });
    this.accountSvc.signup(account).subscribe(
      (acc: Account) => {
        self.accountSvc.login(account.username, account.password).subscribe(x => {
          // if (acc.id) {
            self.ngRedux.dispatch({ type: AccountActions.UPDATE, payload: acc });
            if (acc.type === 'super' || acc.type === 'organizer') {
              self.router.navigate(['admin']);
            } else {
              self.router.navigate(['home']);
            }
          // }
        });
      },
      err => {
        this.toastSvc.warning('Signup Account Fail!', '',
        { timeOut: 2000, positionClass: 'toast-bottom-right' });
        console.log(err.message);
        this.errMsg = 'Create Account Failed';
      });
  }

  // onToggleType() {
  //   this.mode = this.form.get('type').value ? 'organizer' : 'user';
  // }
}
