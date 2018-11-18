import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { SDKBrowserModule, LoopBackConfig } from '../../shared/lb-sdk';

import { CategoryModule } from '../category/category.module';
import { GroupModule } from '../group/group.module';
import { EventModule } from '../event/event.module';
import { AdminComponent } from './admin.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminGroupComponent } from './admin-group/admin-group.component';
import { AdminEventComponent } from './admin-event/admin-event.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CategoryModule,
    GroupModule,
    EventModule
  ],
  declarations: [AdminComponent, AdminCategoryComponent, AdminUserComponent, AdminGroupComponent,
    AdminEventComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AdminModule { }
