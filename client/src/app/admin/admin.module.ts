import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { SDKBrowserModule, LoopBackConfig } from '../../shared/lb-sdk';
import { ToastrModule } from 'ngx-toastr';

import { CategoryModule } from '../category/category.module';
import { GroupModule } from '../group/group.module';
import { EventModule } from '../event/event.module';
import { AccountModule } from '../account/account.module';

import { AdminComponent } from './admin.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminGroupComponent } from './admin-group/admin-group.component';
import { AdminEventComponent } from './admin-event/admin-event.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot(),
    CategoryModule,
    GroupModule,
    EventModule,
    AccountModule
  ],
  exports: [AdminEventComponent],
  declarations: [AdminComponent, AdminCategoryComponent, AdminUserComponent, AdminGroupComponent,
    AdminEventComponent,
    AdminProfileComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AdminModule { }
