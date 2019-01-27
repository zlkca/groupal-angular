import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


import { AccountService } from '../account.service';
import { Account, Picture, Portrait } from '../../lb-sdk';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../shared/shared.service';
@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit, OnChanges {

  form: FormGroup;
  accountTypes: string[] = [
    'super',
    'business',
    'user'
  ];
  portraitUploadUrl: string;
  urls; // preview pictures

  @Input() account: Account;
  @Output() valueSave = new EventEmitter();

  createForm() {
    return this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      // password: ['', Validators.required],
      // type: ['', Validators.required]
    });
  }

  constructor(private fb: FormBuilder,
    private accountSvc: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private toastSvc: ToastrService,
    private sharedSvc: SharedService
  ) {
    this.form = this.createForm();
    this.portraitUploadUrl = this.sharedSvc.getContainerUrl() + 'portraits/upload';
  }

  ngOnChanges(changes) {
    if (this.form && changes.account.currentValue) {
      const account = changes.account.currentValue;
      this.form.patchValue(account);
      this.urls = [ this.accountSvc.getPortrait(account) ];
    }
  }

  ngOnInit() {
    const self = this;
    if (!this.account) {
      this.account = new Account();
    }
    this.form.patchValue(this.account);
  }

  onAfterPortraitUpload(e) {
    const self = this;
    const portraits = this.account.portraits;
    this.urls = [
      this.sharedSvc.getContainerUrl() + 'portraits/download/' + e.name,
    ];

    if (portraits && portraits.length > 0) {
      this.account.portraits = [
        new Portrait({
          id: portraits[0].id,
          name: self.account.username,
          index: 1,
          url: 'portraits/download/' + e.name,
          accountId: self.account.id,
          // width: 100,
          // height: 100,
          // created: null,
          // modified: null
        })
      ];
    } else {
      this.account.portraits = [
        new Portrait({
          name: self.account.username,
          index: 1,
          url: 'portraits/download/' + e.name,
          accountId: self.account.id,
          // width: 100,
          // height: 100,
          // created: null,
          // modified: null
        })
      ];
    }
  }

  save() {
    // This component will be used for business admin and super admin!
    const self = this;
    const v = this.form.value;
    const account = new Account(this.form.value);
    account.type = 'user';
    account.id = self.account ? self.account.id : null;
    account.portraits = this.account.portraits;

    // if (!v.password) {
    //   v.password = this.accountSvc.DEFAULT_PASSWORD;
    // }
    delete account.password;

    if (account.id) {
      self.accountSvc.patchAccount(account.id, account).subscribe((r: any) => {
        self.valueSave.emit({ name: 'OnUpdateAccount' });
      },
      err => {
        this.toastSvc.warning('Save Account Fail!', '', { timeOut: 2000, positionClass: 'toast-bottom-right' });
      });
    } else {
      // self.accountSvc.create(account).subscribe((r: any) => {
      //   self.valueSave.emit({ name: 'OnUpdateAccount' });
      // },
      // err => {
      //   this.toastSvc.warning('Save Account Fail!', '',
      //   { timeOut: 2000, positionClass: 'toast-bottom-right' });
      // });
    }
  }

  cancel() {
    const self = this;
    self.form.patchValue(this.account);
  }

}
