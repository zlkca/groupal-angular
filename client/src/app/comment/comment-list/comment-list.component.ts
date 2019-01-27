import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  @Input() account;
  @Input() comments;

  constructor(
    private accountSvc: AccountService
  ) { }

  ngOnInit() {

  }

  getDirection(comment) {
    if (comment && this.account) {
      return comment.fromId === this.account.id ? 'l' : 'r';
    } else {
      return 'l';
    }
  }
  getPortrait(comment) {
    return this.accountSvc.getPortrait(comment.from);
  }
}
