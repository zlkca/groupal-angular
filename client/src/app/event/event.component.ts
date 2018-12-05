import { Component, OnInit, Input } from '@angular/core';
import { EventService } from './event.service';
import { Event } from '../lb-sdk';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  @Input() events;
  constructor(
    private eventSvc: EventService,
    private sharedSvc: SharedService
  ) { }

  ngOnInit() {

  }

  getDisplayDateTimeRange(event) {
    if (!event.fromDateTime || !event.fromDateTime) {
      return '';
    } else {
      return this.sharedSvc.getDisplayDate(event.fromDateTime) + ' '
        + this.sharedSvc.getDisplayTime(event.fromDateTime) + ' - ' + this.sharedSvc.getDisplayTime(event.toDateTime);
    }
  }

  onSelect(e) {

  }
}
