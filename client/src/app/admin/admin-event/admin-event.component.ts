import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Event } from '../../lb-sdk';
import { environment } from '../../../environments/environment';
import { NgRedux } from '@angular-redux/store';
// import { IAppState } from '../../store';
import { EventService } from '../../event/event.service';
import { GroupService } from '../../group/group.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-admin-event',
  templateUrl: './admin-event.component.html',
  styleUrls: ['./admin-event.component.scss']
})
export class AdminEventComponent implements OnInit {
  @Input() account;

  events;
  groupId;
  event;
  subscrAccount;

  constructor(private route: ActivatedRoute,
    private groupSvc: GroupService,
    private eventSvc: EventService,
    private toastSvc: ToastrService,
    // private rx: NgRedux<IAppState>
  ) {

  }

  ngOnInit() {
    const self = this;
    self.loadEventList().subscribe(
      (ps: Event[]) => {
        self.events = ps;
        if (ps && ps.length > 0) {
          self.event = ps[0];
        } else {
          self.event = new Event();
        }
      }
    );
    // this.route.queryParams.subscribe(params => {
    //   self.groupId = params['group_id'];
    // });
  }

  add() {
    this.event = new Event();
  }

  onAfterSave(event) {
    const self = this;
    self.loadEventList().subscribe(
      (ps: Event[]) => {
        self.events = ps;
        self.event = event;
      }
    );
    this.toastSvc.success('Save Event Successfully!', '',
    { timeOut: 2000, positionClass: 'toast-bottom-right' });
  }

  onAfterDelete(event) {
    const self = this;
    self.loadEventList().subscribe(
      (ps: Event[]) => {
        self.events = ps;
        if (ps && ps.length > 0) {
          self.event = ps[0];
        } else {
          self.event = new Event();
        }
      }
    );
    this.toastSvc.success('Remove Event Successfully!', '',
    { timeOut: 2000, positionClass: 'toast-bottom-right' });

    // this.event = new Event();
    // this.event.id = null;
    // this.event.name = '';
    // this.event.description = '';
    // this.event.price = null;
    // this.event.groupId = null;
  }

  onSelect(event) {
    this.event = event.event;
  }

  loadEventList(): Observable<Event[]> {
    const self = this;

    if (self.account.type === 'super') {
      const query = { include: ['groups', 'categories', 'address'] };
      return self.eventSvc.find(query);
    } else { // if (self.account.type === 'user')
      const query = { where: { ownerId: self.account.id }, include: ['groups', 'categories', 'address'] };
      // const query = { include: ['groups', 'categories'] };
      return self.eventSvc.find(query);
    }
  }

}
