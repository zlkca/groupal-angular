import { Component, OnInit, Input } from '@angular/core';
import { EventService } from './event.service';
import { Event } from '../lb-sdk';
import { SharedService } from '../shared/shared.service';
import { environment } from '../../environments/environment.prod';

import { NgRedux } from '@angular-redux/store';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  @Input() events;

  APP_URL = environment.APP_URL;
  event;
  account;

  constructor(
    private router: Router,
    private eventSvc: EventService,
    private sharedSvc: SharedService,
    private ngRedux: NgRedux<Account>,
    private toastSvc: ToastrService,
    private accountSvc: AccountService
  ) { }

  ngOnInit() {
    const self = this;
    // this.ngRedux.select('account').subscribe(account => {
    //   self.account = account;
    // });
    this.accountSvc.getCurrent({ include: ['portraits'] }).subscribe(account => {
      this.account = account;
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

  onSelect(e) {
    this.event = e;
  }

  join(event) {
    const self = this;

    self.eventSvc.find({
      where: {'id': event.id},
      include: [{'owner': 'portraits'}, 'groups', 'categories', {'participants': [{'account': 'portraits'}]}, 'address'],
      order: 'modified DESC' }).subscribe(
      (events: any) => {
        self.event = events[0];
        if (self.account && self.account.id) {
          if (event && event.participants && event.participants.length > 0) {
            self.eventSvc.join(self.account.id, event.id).subscribe(x => {
              const ps = event.participants.filter(p => p.accountId === self.account.id);
              if (!ps || ps.length === 0) {
                self.event.participants.push(x);
              } else {
                ps[0].status = 'joined';
              }

              const xs = self.events.filter(x => x.id === self.event.id);
              xs[0] = self.event;

              self.toastSvc.success('Join Event Successfully!', '',
                { timeOut: 2000, positionClass: 'toast-bottom-right' });
            });
          } else { // if there is no paticipant;
            self.eventSvc.join(self.account.id, event.id).subscribe(x => {
              event.participants.push(x);
              self.event = event;
              const xs = self.events.filter(x => x.id === self.event.id);
              xs[0] = self.event;

              self.toastSvc.success('Join Event Successfully!', '',
                { timeOut: 2000, positionClass: 'toast-bottom-right' });
            });
          }
        } else {
          self.router.navigate(['login']);
        }
      });
  }

  quit(event) {
    if (event && this.account && this.account.id) {
      this.eventSvc.quit(this.account.id, event.id).subscribe(() => {
        const ps = event.participants.filter(x => x.accountId === this.account.id);
        if (ps && ps.length > 0) {
          ps[0].status = 'cancelled';
        }
        this.toastSvc.success('Quit Event Successfully!', '',
          { timeOut: 2000, positionClass: 'toast-bottom-right' });
      });
    }
  }

  joined(event) {
    if (this.account && event && event.participants && event.participants.length > 0) {
      const accountId = this.account.id;
      const participants = event.participants.filter((p: any) => p.accountId === accountId);
      if (participants && participants.length > 0) {
        return participants[0].status === 'joined';
      } else {
        return false;
      }
    } else {
      return false;
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
      if (event.owner.portraits[0].url.indexOf('https://') > -1) {
        return event.owner.portraits[0].url;
      } else {
        return this.sharedSvc.getContainerUrl() + event.owner.portraits[0].url;
      }
    } else {
      return this.APP_URL + '/assets/images/portrait.png';
    }
  }

  getPaticipantPortrait(p) {
    if (p && p.account && p.account.portraits.length > 0) {
      if (p.account.portraits[0].url.indexOf('https://') > -1) {
        return p.account.portraits[0].url;
      } else {
        return this.sharedSvc.getContainerUrl() + p.account.portraits[0].url;
      }
    } else {
      return this.APP_URL + '/assets/images/portrait.png';
    }
  }

  isPast(event) {
    return this.sharedSvc.isPastDate(event.toDateTime);
  }

  toDetail(event) {
    this.router.navigate(['events', event.id]);
  }
}
