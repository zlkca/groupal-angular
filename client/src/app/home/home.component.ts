import { Component, OnInit } from '@angular/core';
import { EventService } from '../event/event.service';
import { Event } from '../lb-sdk';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  events;

  constructor(private eventSvc: EventService) { }

  ngOnInit() {
    const self = this;
    self.eventSvc.find({ include: ['groups', 'categories'] }).subscribe(
      (ps: Event[]) => {
          self.events = ps;
      });
  }

  onAfterFind(e) {

  }
}
