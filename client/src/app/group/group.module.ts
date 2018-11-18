import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupComponent } from './group.component';
import { GroupFormComponent } from './group-form/group-form.component';
import { GroupListComponent } from './group-list/group-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    GroupListComponent,
    GroupFormComponent
  ],
  declarations: [GroupComponent, GroupFormComponent, GroupListComponent]
})
export class GroupModule { }
