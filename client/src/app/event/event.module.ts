import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event.component';
import { EventFormComponent } from './event-form/event-form.component';
import { EventListComponent } from './event-list/event-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    EventListComponent,
    EventFormComponent
  ],
  declarations: [EventComponent, EventFormComponent, EventListComponent]
})
export class EventModule { }
