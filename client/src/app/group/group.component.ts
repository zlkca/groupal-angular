import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from '../group/group.service';
import { Group } from '../lb-sdk';
import { environment } from '../../environments/environment';

const FRAME_WIDTH = 160;
const FRAME_HEIGHT = 160;
const NORMAL_HEIGHT = 140;

const TEXTAREA_HEIGHT = 48;
const MOBILE_WIDTH = 767;


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  wechatgroupList: Group[];
  fields: string[] = [];
  item: any;
  frame: any;
  MEDIA_URL = environment.APP_URL + '/media/';
  emptyImage = environment.APP_URL + '/media/empty.png';

  constructor(
    private router: Router,
    private groupSvc: GroupService) {
    const self = this;

    // this.uiServ.getMsg().subscribe(msg => {
    //     if('OnSearch' === msg.name){
    //         if(msg.query){
    //             self.doSearch(msg.query);
    //         }else{
    //             self.doSearch('');
    //         }
    //     }
    // });
  }

  ngOnInit() {
    const self = this;
    const wechatgroup = new Group();

    self.frame = self.getFrame();
    self.item = { h: self.frame.h + TEXTAREA_HEIGHT, w: self.frame.w + 1 };

    this.fields = Object.getOwnPropertyNames(wechatgroup);
    this.groupSvc.find({ include: ['pictures', 'qrcodes', 'categories'] }).subscribe(
      (r: Group[]) => {
        // for (let item of r) {
        //   item.pictures = self.getImageUrl(item.pictures);
        // }
        self.wechatgroupList = r;
        self.fields = Object.keys(r[0]);
      },
      (err: any) => {
        self.wechatgroupList = [];
      });
  }

  getContainerUrl() {
    return environment.API_BASE + '/' + environment.API_VERSION + '/Containers/';
  }

  getImageUrl(pictures) {
    const self = this;
    if (pictures && pictures.length > 0) {
      return this.getContainerUrl() + pictures[0].url;
    } else {
      return this.getContainerUrl() + 'pictures/download/empty.png'; // self.emptyImage;
    }
  }

  toDetail(r: any) {
    this.router.navigate(['wechatgroup/' + r.id]);
  }

  toQueryStr(query: any) {
    const list: string[] = [];
    if (query) {
      const keys = Object.keys(query);
      if (keys.length === 0) {
        return '';
      } else {
        for (let key in query) {
          if (query.hasOwnProperty(key) && query[key] != null && query[key] !== undefined) {
            list.push(key + '=' + query[key]);
          }
        }
        return '?' + list.join('&');
      }
    } else {
      return '';
    }
  }

  doSearch(q) {
    const self = this;
    const query = this.toQueryStr(q);
    this.groupSvc.find().subscribe(
      (r: Group[]) => {
        // for (let item of r) {
        //   item.pictures = self.getImageUrl(item.pictures);
        // }
        self.wechatgroupList = r;
      },
      (err: any) => {
        self.wechatgroupList = [];
      });
  }

  isLandscape() {
    return window.innerHeight < window.innerWidth;
  }

  getFrame() {
    const self = this;
    const w: number = window.innerWidth;
    if (w < MOBILE_WIDTH) {
      let frame_w = Math.floor((w - 80) / 2); // 2 pics per row
      if (self.isLandscape()) {
        frame_w = Math.floor((w - 94) / 3);
      }

      const frame_h = frame_w; // Math.floor(frame_w * 3 / 4);
      const min_frame_h = Math.floor(frame_h * 0.9);
      return { w: frame_w, h: frame_h, min_h: min_frame_h };
    } else {
      return { w: FRAME_WIDTH, h: FRAME_HEIGHT, min_h: NORMAL_HEIGHT };
    }
  }
}
