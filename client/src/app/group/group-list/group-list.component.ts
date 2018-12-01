

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Group } from '../../lb-sdk';
import { GroupService } from '../group.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  @Input() groups: Group[];
  @Output() select = new EventEmitter();
  @Output() afterDelete = new EventEmitter();
  selected = null;
  MEDIA_URL = environment.MEDIA_URL;

  constructor(private router: Router,
    private groupSvc: GroupService) { }

  ngOnInit() {
  }

  toPage(url: string) {
    this.router.navigate([url]);
  }

  getImageSrc(image: any) {
    // if (image.file) {
    //     return image.data;
    // } else {
    //     if (image.data) {
    //         return this.MEDIA_URL + image.data;
    //     } else {
    //         return this.MEDIA_URL + 'add_photo.png';
    //     }
    // }
    return this.MEDIA_URL + 'add_photo.png';
  }


  onSelect(r) {
    this.selected = r;
    this.select.emit({ group: r });
  }

  viewEvents(group) {
    this.router.navigate(['admin/events'], { queryParams: { group_id: group.id } });
  }

  delete(r) {
    const self = this;
    this.groupSvc.deleteById(r.id).subscribe(
      (x: Group) => {
        self.afterDelete.emit({ group: r });
        this.selected = null;
      },
      (err) => {

      }
    );
  }
}
