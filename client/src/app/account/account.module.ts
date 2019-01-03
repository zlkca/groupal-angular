import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgReduxModule, NgRedux } from '@angular-redux/store';

import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { ImageUploaderModule } from '../image-uploader/image-uploader.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgReduxModule,
    ImageUploaderModule,
  ],
  declarations: [UserFormComponent, UserListComponent, LoginFormComponent,
    SignupFormComponent,
    ChangePasswordComponent,
    ForgetPasswordComponent,
    ProfileFormComponent
  ],
  exports: [
    UserFormComponent,
    UserListComponent,
    ProfileFormComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountModule { }
