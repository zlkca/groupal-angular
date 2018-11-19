import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { Account } from '../../lb-sdk';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent implements OnInit {

  accounts: Account[] = [];
  account: Account;

  constructor(private accountSvc: AccountService) { }

  ngOnInit() {
    this.loadAccountList();
  }

  add() {
    this.account = new Account();
    this.account.id = null;
    this.account.username = '';
    this.account.password = '';
  }

  onAfterSave(event) {
    this.loadAccountList();
  }

  onAfterDelete(event) {
    this.loadAccountList();
    if (event.account.id === this.account.id) {
      this.account = new Account();
      this.account.id = null;
      this.account.username = '';
      this.account.password = '';
    }
  }

  onSelect(event) {
    this.account = event.account;
  }

  loadAccountList() {
    const self = this;
    this.accountSvc.find().subscribe(
      (r: Account[]) => {
        self.accounts = r;
      },
      (err: any) => {
        self.accounts = [];
      });
  }
}

