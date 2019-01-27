import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AddressInputComponent } from './address-input/address-input.component';
import { CommentComponent } from './comment/comment.component';
import { FormsModule, ReactiveFormsModule } from '../../../node_modules/@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AddressInputComponent,
    CommentComponent
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    AddressInputComponent,
    CommentComponent
  ]
})
export class SharedModule { }
