import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EventComponent } from './event.component';
import { EventFormComponent } from './event-form/event-form.component';
import { EventListComponent } from './event-list/event-list.component';
import { SharedModule } from '../shared/shared.module';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { CommentModule } from '../comment/comment.module';
import { CommentService } from '../comment/comment.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    CommentModule,
  ],
  exports: [
    EventListComponent,
    EventFormComponent,
    EventComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [EventComponent,
    EventFormComponent,
    EventListComponent,
    EventDetailComponent
  ],
  providers: [CommentService]
})
export class EventModule { }
