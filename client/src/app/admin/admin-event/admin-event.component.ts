import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Event } from '../../lb-sdk';
import { environment } from '../../../environments/environment';
import { NgRedux } from '@angular-redux/store';
// import { IAppState } from '../../store';
import { EventService } from '../../event/event.service';
import { GroupService } from '../../group/group.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-event',
  templateUrl: './admin-event.component.html',
  styleUrls: ['./admin-event.component.css']
})
export class AdminEventComponent implements OnInit {
  @Input() account;

  events;
  groupId;
  event;

  constructor(private route: ActivatedRoute,
      private groupSvc: GroupService,
      private eventSvc: EventService,
      private toastSvc: ToastrService,
      // private rx: NgRedux<IAppState>
    ) {

  }

  ngOnInit() {
    this.loadEventList();
  }

  add() {
    this.event = new Event();
  }

  onAfterSave(event) {
    this.loadEventList();
    this.toastSvc.success('Save Event Successfully!', '', { timeOut: 2000 });
  }

  onAfterDelete(event) {
    this.loadEventList();
    this.event = new Event();
    this.event.id = null;
    this.event.name = '';
    this.event.description = '';
    this.event.price = null;
    this.event.groupId = null;
  }

  onSelect(event) {
    this.event = event.event;
  }

  loadEventList() {
    const self = this;
    this.route.queryParams.subscribe(params => {
        self.groupId = params['group_id'];
        // self.groupSvc.findById(self.groupId).subscribe(
        self.eventSvc.find({ include: ['groups', 'categories'] }).subscribe(
            (ps: Event[]) => {
                self.events = ps;
            });
    });
  }

}
