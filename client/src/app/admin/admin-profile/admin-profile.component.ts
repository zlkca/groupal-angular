import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { Account } from '../../lb-sdk';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {

  accounts: Account[] = [];
  selected: Account;
  @Input() account: Account;

  constructor(
    private accountSvc: AccountService,
    private toastSvc: ToastrService
  ) { }

  ngOnInit() {

  }

  onAfterSave(event) {
    this.toastSvc.success('Save Account Successfully!', '',
    { timeOut: 2000, positionClass: 'toast-bottom-right' });
  }

}

