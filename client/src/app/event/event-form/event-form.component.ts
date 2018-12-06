import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgRedux } from '@angular-redux/store';
import { IPicture } from '../../picture/picture.model';

import { AccountService } from '../../account/account.service';
import { EventService } from '../event.service';
import { GroupService } from '../../group/group.service';
import { CategoryService } from '../../category/category.service';
// import { MultiImageUploaderComponent } from '../../shared/multi-image-uploader/multi-image-uploader.component';
import { Account, Group, Event, Category, LoopBackConfig, Picture, Address, AddressApi } from '../../lb-sdk';
import { Jsonp } from '@angular/http';
import { map } from '../../../../node_modules/rxjs/operators';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit, OnChanges {
  categoryList = [];
  groupList = [];
  currentAccount;
  address = '';
  location = { city: '', street_name: '', street_number: '', sub_locality: '', postal_code: '', province: '', lat: '', lng: '' };

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

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountSvc: AccountService,
    private groupSvc: GroupService,
    private eventSvc: EventService,
    private categorySvc: CategoryService,
    private route: ActivatedRoute,
    private sharedSvc: SharedService,
    private addressApi: AddressApi,
    private rx: NgRedux<IPicture>,
    private router: Router
  ) {
    this.form = this.createForm();
  }

  createForm() {
    return this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.maxLength(980)]),
      price: new FormControl(),
      groupId: new FormControl(),
      categoryId: new FormControl(),
      // street: ['', Validators.required],
      // postal_code:['', Validators.required]
      address: this.fb.group({
        // street: ['', [Validators.required]],
        unit: ['', [Validators.required]],
        postalCode: ['', [Validators.required]],
      }),
      eventDate: ['2018-12-23T17:30:00.000Z', [Validators.required]],
      fromTime: [{ hour: 12, minute: 30 }, [Validators.required]],
      toTime: [{ hour: 14, minute: 30 }, [Validators.required]]
    });
  }

  fillForm(event) {
    this.form.get('name').setValue(event.name);
    this.form.get('description').setValue(event.description);
    // this.form.get('ownerId').setValue(event.ownerId);
    if (event.groups && event.groups.length > 0) {
      this.form.get('groupId').setValue(event.groups[0].id);
    } else {
      this.form.get('groupId').setValue(null);
    }
    if (event.categories && event.categories.length > 0) {
      this.form.get('categoryId').setValue(event.categories[0].id);
    } else {
      this.form.get('categoryId').setValue(null);
    }
    this.form.get('eventDate').setValue(this.sharedSvc.getDate(event.fromDateTime));
    // this.form.get('categories')['controls'][0].setValue(group.categories[0].id);
  }

  ngOnInit() {
    const self = this;

    if (self.event) {
      self.fillForm(self.event);
      // this.uploadedPictures = (this.event.pictures || []).map(pic => pic.url);
    }

    this.accountSvc.getCurrent().subscribe((acc: Account) => {
      this.currentAccount = acc;
      // if (acc.type === 'super') {
      //   self.accountSvc.find().subscribe(users => { // ({ where: { type: 'business' } }).subscribe(users => {
      //     self.users = users;
      //   });
      // }
    });

    self.groupSvc.find().subscribe((gs: Group[]) => {
      self.groupList = gs;
    });

    self.categorySvc.find().subscribe((cs: Category[]) => {
      self.categoryList = cs;
    });

  }

  ngOnChanges(changes) {
    if (this.form && changes.event.currentValue) {
      const event = changes.event.currentValue;
      this.fillForm(event);

      const addr = changes.event.currentValue.address;
      if (addr) {
        this.location.city = addr.city;
        this.location.street_name = addr.streetName;
        this.location.street_number = addr.streetNumber;
        this.location.sub_locality = addr.sublocality;
        this.location.postal_code = addr.postalCode;
        this.location.province = addr.province;
        this.location.lat = addr.location.lat;
        this.location.lng = addr.location.lng;

        this.address = this.sharedSvc.getAddrStringByLocation(this.location);
      } else {
        this.address = '';
      }
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

  onSelectCategory(id: string) {
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

  getDateTime(d, t) {
    return new Date(d.year, d.month - 1, d.day, t.hour, t.minute);
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

  // callback of app-address-input
  onAddressChange(e) {
    // localStorage.setItem('location-' + APP, JSON.stringify(e.addr));
    this.location = e.addr;
    this.address = e.sAddr;
    this.form.get('address').patchValue({ postalCode: this.location.postal_code });
    // this.sharedSvc.emitMsg({ name: 'OnUpdateAddress', addr: e.addr });
  }

  onRemoved(event) {
    // this.event.pictures.splice(this.event.pictures.findIndex(pic => pic.url === event.file.src));
  }

  save() {
    const self = this;
    const catIds = [this.form.get('categoryId').value];
    const groupIds = [this.form.get('groupId').value];

    this.categorySvc.find({ where: { id: { inq: catIds } } }).subscribe(cats => {
      const v = self.form.value;
      v.categories = cats;

      self.groupSvc.find({ where: { id: { inq: groupIds } } }).subscribe(groups => {
        v.groups = groups;
        const event = new Event(v);
        event.id = self.event ? self.event.id : null;
        event.fromDateTime = this.getDateTime(v.eventDate, v.fromTime);
        event.toDateTime = this.getDateTime(v.eventDate, v.toTime);
        if (!event.created) {
          event.created = new Date();
        }
        event.modified = new Date();
        if (self.currentAccount.type === 'super') {
          event.ownerId = self.event.ownerId; // self.form.get('ownerId').value;
        } else {
          event.ownerId = self.currentAccount.id;
        }

        event.address = new Address({
          id: (self.event && self.event.address) ? self.event.address.id : null,
          streetName: this.location.street_name,
          streetNumber: this.location.street_number,
          sublocality: this.location.sub_locality,
          city: this.location.city,
          province: this.location.province,
          formattedAddress: this.sharedSvc.getAddrStringByLocation(this.location),
          unit: this.form.get('address').get('unit').value,
          postalCode: this.location.postal_code,
          location: {
            lat: this.location.lat,
            lng: this.location.lng
          },
        });

        self.addressApi.replaceOrCreate(event.address).subscribe((addr: any) => {
          event.addressId = addr.id;
          if (event.id) {
            self.eventSvc.replaceById(event.id, event).subscribe((r: any) => {
              self.afterSave.emit({ event: r, action: 'update' });
            });
          } else {
            self.eventSvc.create(event).subscribe((r: any) => {
              self.afterSave.emit({ event: r, action: 'save' });
            });
          }
        });
      });
    });
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

