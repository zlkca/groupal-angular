import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EventComponent } from './event.component';
import { EventFormComponent } from './event-form/event-form.component';
import { EventListComponent } from './event-list/event-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    EventListComponent,
    EventFormComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [EventComponent, EventFormComponent, EventListComponent]
})
export class EventModule { }
