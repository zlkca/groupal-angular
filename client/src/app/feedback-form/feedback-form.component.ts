import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Feedback, FeedbackApi } from '../lb-sdk';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent implements OnInit {
  form;
  @Output() afterSend = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private feedbackApi: FeedbackApi
  ) { }

  ngOnInit() {
    this.form = this.createForm();
  }

  createForm() {
    return this.fb.group({
      sender: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', Validators.maxLength(750)]
    });
  }

  sendFeedback() {
    const self = this;
    const v = this.form.value;
    const feedback = new Feedback(v);
    if (!feedback.created) {
      feedback.created = new Date();
    }
    feedback.modified = new Date();
    self.feedbackApi.create(feedback).subscribe((r: any) => {
      self.afterSend.emit({ name: 'OnSendFeedback' });
      self.form.reset();
    });
  }
}
