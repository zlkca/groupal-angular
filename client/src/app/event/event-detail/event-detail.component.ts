import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
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
  comments;
  APP_URL = environment.APP_URL;
  constructor(
    private eventSvc: EventService,
    private sharedSvc: SharedService,
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
        include: [{ 'owner': 'portraits' }, 'groups', 'categories', { 'participants': [{ 'account': 'portraits' }] }, 'address'],
        order: 'modified DESC'
      }).subscribe(
        (ps: any) => {
          self.event = ps[0];
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
}
