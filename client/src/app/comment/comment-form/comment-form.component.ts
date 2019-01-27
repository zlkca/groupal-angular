import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Comment, CommentApi } from '../../lb-sdk';
import { NgRedux } from '@angular-redux/store';
import { AccountService } from '../../account/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {

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
    private accountSvc: AccountService,
    private router: Router
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
    if (self.author) {
      c.fromId = self.author.id;
      if (!c.created) {
        c.created = new Date();
      }
      c.modified = new Date();
      self.commentSvc.create(c).subscribe((r: any) => {
        self.afterPost.emit({ name: 'OnPostComment' });
        self.form.reset();
      });
    } else {
      self.router.navigate(['login']);
    }

  }

  getPortrait(account) {
    return this.accountSvc.getPortrait(account);
  }
}
