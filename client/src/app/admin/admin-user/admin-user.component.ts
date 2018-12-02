import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { Account } from '../../lb-sdk';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {

  accounts: Account[] = [];
  selected: Account;
  @Input() account: Account;

  constructor(
    private accountSvc: AccountService,
    private toastSvc: ToastrService
  ) { }

  ngOnInit() {
    this.loadAccountList();
  }

  add() {
    this.selected = new Account();
    this.selected.id = null;
    this.selected.username = '';
    this.selected.password = '';
  }

  onAfterSave(event) {
    this.loadAccountList();
    this.toastSvc.success('Save Account Successfully!', '',
    { timeOut: 2000, positionClass: 'toast-bottom-right' });
  }

  onAfterDelete(event) {
    this.loadAccountList();
    if (event.account.id === this.selected.id) {
      this.selected = new Account();
      this.selected.id = null;
      this.selected.username = '';
      this.selected.password = '';
    }
  }

  onSelect(event) {
    this.selected = event.account;
  }

  loadAccountList() {
    const self = this;
    if (self.account.type === 'super') {
      const query = { include: ['pictures', 'qrcodes', 'categories'] };
      this.accountSvc.find().subscribe(
        (r: Account[]) => {
          self.accounts = r;
        },
        (err: any) => {
          self.accounts = [];
        });
    } else if (self.account.type === 'organizer') {
      const query = { where: { id: self.account.id }, include: ['pictures', 'qrcodes', 'categories'] };
      this.accountSvc.find().subscribe(
        (r: Account[]) => {
          self.accounts = r;
        },
        (err: any) => {
          self.accounts = [];
        });
    }
  }
}

