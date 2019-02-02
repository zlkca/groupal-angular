import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event.service';
import { AccountService } from '../../account/account.service';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { CommentService } from '../../comment/comment.service';
// import { Comment } from '../../lb-sdk';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  event;
  account;
  qrcodeUrl;
  comments;
  APP_URL = environment.APP_URL;
  constructor(
    private eventSvc: EventService,
    private sharedSvc: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private accountSvc: AccountService,
    private toastSvc: ToastrService,
    private commentSvc: CommentService
  ) {

  }

  ngOnInit() {
    const self = this;

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      self.eventSvc.find({
        where: { 'id': id },
        include: ['groups', 'categories', 'address', 'qrcodes',
          { 'owner': 'portraits' },
          { 'participants': [{ 'account': 'portraits' }] },
        ],
        order: 'modified DESC'
      }).subscribe(
        (ps: any) => {
          self.event = ps[0];
          self.qrcodeUrl = self.getQrCodeUrl(self.event);
        });

      self.commentSvc.find({
        where: {eventId: id},
        include: [{'from': 'portraits'}]}).subscribe(comments => {
        self.comments = comments;
      });
    });

    this.accountSvc.getCurrent().subscribe(account => {
      self.account = account;
    });
  }

  getQrCodeUrl(event) {
    const codes = event.qrcodes.filter(x =>  x.entityType === 'Event' );
    if (codes && codes.length > 0) {
      return this.sharedSvc.getContainerUrl() + event.qrcodes[0].url;
    } else {
      return this.APP_URL + '/assets/images/empty.png';
    }
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
    return this.eventSvc.getNumOfGoing(event);
  }

  getOwnerPortrait(event) {
    if (event.owner && event.owner.portraits.length > 0) {
      return this.sharedSvc.getContainerUrl() + event.owner.portraits[0].url;
    } else {
      return this.APP_URL + '/assets/images/portrait.png';
    }
  }

  getPaticipantPortrait(p) {
    return this.accountSvc.getPortrait(p.account);
  }

  isPast(event) {
    return this.sharedSvc.isPastDate(event.toDateTime);
  }

  onAfterPostComment(e) {
    const self = this;
    self.commentSvc.find({
      where: {eventId: self.event.id},
      include: [{'from': 'portraits'}] }).subscribe(comments => {
      self.comments = comments;
    });
  }


  join(event) {
    const self = this;
    if (self.account && self.account.id) {
      if (event && event.participants && event.participants.length > 0) {
        self.eventSvc.join(self.account.id, event.id).subscribe((x: any) => {
          const ps = event.participants.filter(p => p.accountId === self.account.id);
          self.accountSvc.findPortraitsByAccountId(x.accountId).subscribe(rs => {
            x.account = { id: x.accountId, portraits: rs };
            if (!ps || ps.length === 0) {
              event.participants.push(x);
            } else {
              // ps[0].account = { portraits: rs };
              ps[0].status = 'joined';
            }
            // const xs = self.events.filter(r => r.id === event.id);
            // xs[0] = event;

            self.toastSvc.success('Join Event Successfully!', '',
              { timeOut: 2000, positionClass: 'toast-bottom-right' });
          });
        });
      } else { // if there is no paticipant;
        self.eventSvc.join(self.account.id, event.id).subscribe((x: any) => {
          self.accountSvc.findPortraitsByAccountId(x.accountId).subscribe(rs => {
            x.account = { id: x.accountId, portraits: rs };
            event.participants.push(x);
            // const xs = self.events.filter(r => r.id === event.id);
            // xs[0] = event;

            self.toastSvc.success('Join Event Successfully!', '',
              { timeOut: 2000, positionClass: 'toast-bottom-right' });
          });
        });

      }
    } else {
      self.router.navigate(['login']);
    }
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
}
