import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  event;
  APP_URL = environment.APP_URL;
  constructor(
    private eventSvc: EventService,
    private sharedSvc: SharedService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const self = this;
      self.eventSvc.find({
        where: {'id': id},
        include: [{'owner': 'portraits'}, 'groups', 'categories', {'participants': [{'account': 'portraits'}]}, 'address'],
        order: 'modified DESC' }).subscribe(
        (ps: any) => {
          self.event = ps[0];
        });
    });
  }

  getDisplayDateTimeRange(event) {
    if (!event.fromDateTime || !event.fromDateTime) {
      return '';
    } else {
      return this.sharedSvc.getDisplayDate(event.fromDateTime) + ' '
        + this.sharedSvc.getDisplayTime(event.fromDateTime) + ' - ' + this.sharedSvc.getDisplayTime(event.toDateTime);
    }
  }

  getNumOfGoing(event) {
    if (event && event.participants && event.participants) {
      const participants = event.participants.filter((p: any) => p.status === 'joined');
      return participants.length;
    } else {
      return 0;
    }
  }

  getOwnerPortrait(event) {
    if (event.owner && event.owner.portraits.length > 0) {
      return this.sharedSvc.getContainerUrl() + event.owner.portraits[0].url;
    } else {
      return this.APP_URL + '/assets/images/portrait.png';
    }
  }

  getPaticipantPortrait(p) {
    if (p && p.account && p.account.portraits.length > 0) {
      return this.sharedSvc.getContainerUrl() + p.account.portraits[0].url;
    } else {
      return this.APP_URL + '/assets/images/portrait.png';
    }
  }

  isPast(event) {
    return this.sharedSvc.isPastDate(event.toDateTime);
  }
}
