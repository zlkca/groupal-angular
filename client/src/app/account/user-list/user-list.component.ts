import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../account.service';
import { Account } from '../../lb-sdk';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @Input() accounts: Account[];
  @Output() select = new EventEmitter();
  @Output() afterDelete = new EventEmitter();
  selected = null;
  fields: string[] = [];

  constructor(
    private accountSvc: AccountService
  ) { }

  ngOnInit() {
    const self = this;
    const account = new Account();
    this.fields = Object.getOwnPropertyNames(account);
  }

  onSelect(c) {
    this.selected = c;
    this.select.emit({ account: c });
  }

  delete(c) {
    this.accountSvc.deleteById(c.id).subscribe(x => {
      this.afterDelete.emit({account: c});
      this.selected = null;
    });
  }
}

