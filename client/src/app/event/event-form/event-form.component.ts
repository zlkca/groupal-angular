import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgRedux } from '@angular-redux/store';
import { IPicture } from '../../picture/picture.model';

import { EventService } from '../event.service';
import { GroupService } from '../../group/group.service';
import { CategoryService } from '../../category/category.service';
// import { MultiImageUploaderComponent } from '../../shared/multi-image-uploader/multi-image-uploader.component';
import { Group, Event, Category, LoopBackConfig, Picture } from '../../lb-sdk';
import { Jsonp } from '@angular/http';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit, OnChanges {
  categoryList = [];
  groupList = [];
  // colorList:Color[] = [];
  // id: number;
  uploadedPictures: string[] = [];
  uploadUrl: string = [
    LoopBackConfig.getPath(),
    LoopBackConfig.getApiVersion(),
    'Containers/pictures/upload'
  ].join('/');

  @Input() event: Event;
  @Output() afterSave: EventEmitter<any> = new EventEmitter();
  // @ViewChild(MultiImageUploaderComponent) uploader: any;

  // @ViewChild(ImageUploaderComponent) uploader: any;

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.maxLength(980)]),
    price: new FormControl(),
    groupId: new FormControl(),
    categoryId: new FormControl(),
  });

  constructor(
    private groupSvc: GroupService,
    private eventSvc: EventService,
    private categorySvc: CategoryService,
    private route: ActivatedRoute,
    private rx: NgRedux<IPicture>, private router: Router
  ) { }

  ngOnInit() {
    if (this.event) {
      this.form.get('name').setValue(this.event.name);
      this.form.get('description').setValue(this.event.description);
      this.form.get('categroyId').setValue(''); // this.event.categoryId);
      // this.uploadedPictures = (this.event.pictures || []).map(pic => pic.url);
      // this.form.get('price').setValue(this.event.price);
      // this.form.get('groupId').setValue(this.event.groupId);
    }

    this.groupSvc.find().subscribe(r => {
      this.groupList = r;
    });

    this.loadCategoryList();
  }

  loadCategoryList() {
    const self = this;
    this.categorySvc.find().subscribe(
      (r: Category[]) => {
        self.categoryList = r;
      },
      (err: any) => {
        self.categoryList = [];
      });
  }

  ngOnChanges(changes) {
    if (this.form && changes.event.currentValue) {
      this.form.patchValue(changes.event.currentValue);
    }
  }

  onToggleCategory(c: FormControl) {
    const v = c.value;
    if (c.value.checked) {
      v.checked = false;
    } else {
      v.checked = true;
    }
    c.patchValue(v);
  }

  onSelectGroup(id: string) {
    // let obj = this.groupList.find( x => { return x.id == id });
    // this.group.setValue(obj);
    // this.group.patchValue(m);
    // this.group.id;
  }

  onSelectColor(id: string) {
    // let obj = this.colorList.find(x => {return x.id == id});
    // this.color.patchValue(obj);
    // this.color.patchValue({'id':id});
  }

  getCheckedCategories() {
    const cs = [];
    for (let i = 0; i < this.categoryList.length; i++) {
      let c = this.categoryList[i];
      // if (this.categories.get(i.toString()).value) {
      //     cs.push(c);
      // }
    }
    return cs;
  }

  onUploadFinished(event) {
    // try {
    //   const res = JSON.parse(event.serverResponse.response._body);
    //   this.event.pictures = (this.event.pictures || []).concat(res.result.files.image.map(img => {
    //     return {
    //       url: [
    //         LoopBackConfig.getPath(),
    //         LoopBackConfig.getApiVersion(),
    //         'Containers',
    //         img.container,
    //         img.name
    //       ].join('/')
    //     };
    //   }));
    // } catch (error) {
    //   console.error(error);
    // }
  }

  onRemoved(event) {
    // this.event.pictures.splice(this.event.pictures.findIndex(pic => pic.url === event.file.src));
  }

  save() {
    const self = this;
    // const group_id = self.form.get('group_id');
    const newV = this.form.value;
    const p: Event = new Event(newV);
    // const groupId = p.groupId;

    if (this.event) {
      // p.pictures = this.event.pictures;
      this.eventSvc.replaceById(this.event.id, p).subscribe((r: any) => {
        // self.afterSave.emit({ group_id: groupId });
      });
    } else {
      this.eventSvc.create(p).subscribe((r: any) => {
        // self.afterSave.emit({ group_id: groupId });
      });
    }
  }

  // ngOnInit() {
  //     let self = this;

  //     self.commerceServ.getCategoryList().subscribe(
  //         (r:Category[]) => {
  //             self.categoryList = r;
  //         },
  //         (err:any) => {
  //             self.categoryList = [];
  //         });

  //     self.route.params.subscribe((params:any)=>{
  //         self.id = params.id;

  //         self.commerceServ.getImageDefaultTitle(1).subscribe((r)=>{
  //             self.defaultTitles = [r.name0, r.name1, r.name2, r.name3];

  //             if(params.id){
  //               self.commerceServ.getWechatGroup(params.id).subscribe(
  //                 (r:WechatGroup) => {
  //                     r.qrs = self.commerceServ.getWechatGroupQRs(r.qrs, self.defaultTitles);
  //                     self.wechatgroup = r
  //                 },
  //                 (err:any) => {
  //                     let r = new WechatGroup();
  //                     r.category = {'id':1};
  //                     r.qrs = self.commerceServ.getWechatGroupQRs(r.qrs, self.defaultTitles);
  //                     self.wechatgroup = r;
  //                 });
  //             }else{
  //                 let r = new WechatGroup();
  //                 r.category = {'id':1};
  //                 r.qrs = self.commerceServ.getWechatGroupQRs(r.qrs, self.defaultTitles);
  //                 self.wechatgroup = r;
  //             }

  //         },(err)=>{

  //         });


  //     });
  // }


}

