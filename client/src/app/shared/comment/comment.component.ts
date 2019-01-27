import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Comment, CommentApi } from '../../lb-sdk';
import { NgRedux } from '@angular-redux/store';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  form;
  account;
  portrait;

  @Output() afterPost = new EventEmitter();
  @Input() author;
  @Input() event;

  constructor(
    private fb: FormBuilder,
    private commentSvc: CommentApi,
    private ngRedux: NgRedux<Account>,
    private accountSvc: AccountService
  ) { }

  ngOnInit() {
    const self = this;
    this.form = this.createForm();
    // Header event handler, when refresh redux data gone
    this.ngRedux.select('account').subscribe((account: Account) => {
      self.account = account;
      self.portrait = self.accountSvc.getPortrait(self.account);
    });
  }

  createForm() {
    return this.fb.group({
      // author: ['', [Validators.required, Validators.minLength(3)]],
      body: ['', Validators.maxLength(750)]
    });
  }

  postComment() {
    const self = this;
    const v = this.form.value;
    const c = new Comment(v);
    c.eventId = self.event.id;
    c.fromId = self.author.id;
    if (!c.created) {
      c.created = new Date();
    }
    c.modified = new Date();
    self.commentSvc.create(c).subscribe((r: any) => {
      self.afterPost.emit({ name: 'OnPostComment' });
      self.form.reset();
    });
  }

  getPortrait(account) {
    return this.accountSvc.getPortrait(account);
  }
}

