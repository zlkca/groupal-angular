import { Component, OnInit } from '@angular/core';
import { EventService } from '../event/event.service';
import { GroupService } from '../group/group.service';
import { Event, Group, Category } from '../lb-sdk';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  groups;
  events;
  bShowFeedbackForm = true;
  mobile = false;

  constructor(
    private groupSvc: GroupService,
    private eventSvc: EventService,
    private toastSvc: ToastrService
  ) { }

  ngOnInit() {
    const self = this;
    self.eventSvc.find({ include: [{'owner': 'portraits'}, 'groups', 'categories', {'participants': [{'account': 'portraits'}]},
     'address'], order: 'modified DESC' }).subscribe(
      (ps: Event[]) => {
        self.events = ps;
      });

    this.groupSvc.find({ include: ['pictures', 'qrcodes', 'categories'], order: 'modified DESC' }).subscribe(
      (r: Group[]) => {
        self.groups = r;
      },
      (err: any) => {
        self.groups = [];
      });

      if (window.screen.width < 768) { // 768px portrait
        this.mobile = true;
        this.bShowFeedbackForm = !this.mobile;
      }
  }

  hasCategory(categoryId, group) {
    const cats = group.categories.filter((cat: Category) => cat.id === categoryId);
    return cats && cats.length > 0;
  }

  onAfterFind(e) {
    const self = this;
    this.groupSvc.find({ include: ['pictures', 'qrcodes', 'categories'], order: 'modified DESC' }).subscribe(
      (r: Group[]) => {
        // for (let item of r) {
        //   item.pictures = self.getImageUrl(item.pictures);
        // }
        if (e.query) {
          const groups = [];
          r.map(x => {
            if (self.hasCategory(e.query.categoryId, x)) {
              groups.push(x);
            }
          });
          self.groups = groups;
        } else {
          self.groups = r;
        }
      },
      (err: any) => {
        self.groups = [];
      });
  }


  onAfterSendFeedback(event) {
    this.toastSvc.success('Send Feedback Successfully!', '',
    { timeOut: 2000, positionClass: 'toast-bottom-right' });
  }

  toggleFeedbackForm() {
    this.bShowFeedbackForm = !this.bShowFeedbackForm;
  }
}
