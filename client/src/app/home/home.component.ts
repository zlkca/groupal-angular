import { Component, OnInit } from '@angular/core';
import { EventService } from '../event/event.service';
import { GroupService } from '../group/group.service';
import { Event, Group, Category } from '../lb-sdk';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  groups;
  events;

  constructor(
    private groupSvc: GroupService,
    private eventSvc: EventService) { }

  ngOnInit() {
    const self = this;
    self.eventSvc.find({ include: ['groups', 'categories'], order: 'modified DESC' }).subscribe(
      (ps: Event[]) => {
        self.events = ps;
      });

    this.groupSvc.find({ include: ['pictures', 'qrcodes', 'categories'], order: 'modified DESC' }).subscribe(
      (r: Group[]) => {
        // for (let item of r) {
        //   item.pictures = self.getImageUrl(item.pictures);
        // }
        self.groups = r;
        // self.fields = Object.keys(r[0]);
      },
      (err: any) => {
        self.groups = [];
      });
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
}
