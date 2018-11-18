import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-admin-event',
  templateUrl: './admin-event.component.html',
  styleUrls: ['./admin-event.component.css']
})
export class AdminEventComponent implements OnInit {
  @Input() event;
  @Input() account;

  constructor() { }

  ngOnInit() {
  }

}
