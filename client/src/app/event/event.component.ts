import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { Event } from '../lb-sdk';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  events;
  constructor(private eventSvc: EventService) { }

  ngOnInit() {
    const self = this;
    self.eventSvc.find({ include: ['groups', 'categories'] }).subscribe(
      (ps: Event[]) => {
          self.events = ps;
      });
  }

}
