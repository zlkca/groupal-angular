import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageUploaderModule } from '../image-uploader/image-uploader.module';

import { GroupComponent } from './group.component';
import { GroupFormComponent } from './group-form/group-form.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { EventModule } from '../event/event.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImageUploaderModule,
    EventModule
  ],
  exports: [
    GroupListComponent,
    GroupFormComponent,
    GroupComponent,
    GroupDetailComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [GroupComponent, GroupFormComponent, GroupListComponent, GroupDetailComponent]
})
export class GroupModule { }
