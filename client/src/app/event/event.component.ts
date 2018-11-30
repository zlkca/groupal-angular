import { Component, OnInit, Input } from '@angular/core';
import { EventService } from './event.service';
import { Event } from '../lb-sdk';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  @Input() events;
  constructor(private eventSvc: EventService) { }

  ngOnInit() {

  }

}
