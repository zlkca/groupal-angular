import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

import { Group } from '../../lb-sdk';
import { GroupService } from '../../group/group.service';

const ADD_IMAGE = 'add_photo.png';

@Component({
  selector: 'app-admin-group',
  templateUrl: './admin-group.component.html',
  styleUrls: ['./admin-group.component.scss']
})
export class AdminGroupComponent implements OnInit {
  groups = [];
  group = new Group();
  MEDIA_URL = environment.MEDIA_URL;
  placeholder = environment.MEDIA_URL + ADD_IMAGE;
  alert = {
    type: 'success',
    message: 'This is an success alert',
  };
  alertClosed = false;
  subscrAccount;
  @Input() account;

  constructor(private router: Router,
    private groupSvc: GroupService,
    private toastSvc: ToastrService,
  ) { }

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

  delete(group) {
    const self = this;
    // this.commerceSvc.rmGroup(r.id).subscribe(
    //     (r:Group[]) => {
    //         self.groupList = r;
    //         if(r.length){
    //             //
    //         }else{
    //             self.router.navigate(['admin/group']);
    //         }
    //     },
    //     (err)=>{

    //     }
    // )
  }

  viewEvents(group) {
    this.router.navigate(['admin/events'], { queryParams: { group_id: group.id } });
  }

  editMultiEvents(group) {
    this.router.navigate(['admin/edit-events']);
  }

  ngOnInit() {
    const self = this;
    self.loadGroupList();
  }

  add() {
    this.group = new Group();
  }

  onAfterSave(event) {
    this.loadGroupList();
    this.group = new Group();
    this.group.id = null;
    this.group.name = '';
    this.group.description = '';
    // this.group.address = null;
    // this.group.user = null;
    // this.group.image = null;

    this.toastSvc.success('Save Group Successfully!', '',
    { timeOut: 2000, positionClass: 'toast-bottom-right' });
  }

  onAfterDelete(event) {
    this.loadGroupList();
    this.group = new Group();
    this.group.id = null;
    this.group.name = '';
    this.group.description = '';
    // this.group.address = null;
    // this.group.user = null;
    // this.group.image = null;
    this.toastSvc.success('Remove Category Successfully!', '',
    { timeOut: 2000, positionClass: 'toast-bottom-right' });
  }

  onSelect(event) {
    this.group = event.group;
  }

  loadGroupList() {
    const self = this;
    if (self.account.type === 'super') {
      const query = { include: ['pictures', 'qrcodes', 'categories'] };
      this.groupSvc.find(query).subscribe(r => {
        self.groups = r;
      });
    } else if (self.account.type === 'user') {
      const query = { where: { ownerId: self.account.id }, include: ['pictures', 'qrcodes', 'categories'] };
      this.groupSvc.find(query).subscribe(r => {
        self.groups = r;
      });
    }
    // this.groupSvc.find({ include: ['pictures', 'address'] }).subscribe(r => {

  }
}
