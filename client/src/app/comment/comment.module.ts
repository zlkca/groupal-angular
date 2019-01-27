import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { FormsModule, ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import { RouterModule } from '../../../node_modules/@angular/router';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  declarations: [
    CommentFormComponent,
    CommentListComponent
  ],
  exports: [
    CommentFormComponent,
    CommentListComponent
  ]
})
export class CommentModule { }
