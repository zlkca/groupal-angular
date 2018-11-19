import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { LocationService } from '../../address/location.service';
import { GroupService } from '../group.service';
import { CategoryService } from '../../category/category.service';
// import { MultiImageUploaderComponent } from '../../shared/multi-image-uploader/multi-image-uploader.component';
import { environment } from '../../../environments/environment';
import { NgRedux } from '@angular-redux/store';
import { IPicture } from '../../picture/picture.model';
import { AccountService } from '../../account/account.service';
import { GeoPoint, Group, Category, LoopBackConfig, Address, Account } from '../../lb-sdk';
import { ILocation } from '../../address/address.model';
import { getComponentViewDefinitionFactory } from '../../../../node_modules/@angular/core/src/view';

const APP = environment.APP;
const PICTURES_FOLDER = 'pictures';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.css']
})
export class GroupFormComponent implements OnInit, OnChanges {

  currentAccount: Account;
  location: ILocation = {
    street_name: '',
    street_number: '',
    sub_locality: '',
    city: '',
    province: '',
    postal_code: '',
    lat: 0,
    lng: 0
  };

  address = '';
  id = '';
  categories: Category[] = [];
  picture;
  subscriptionPicture;
  form: FormGroup;
  users;
  uploadedPictures: string[] = [];
  uploadUrl: string = [
    LoopBackConfig.getPath(),
    LoopBackConfig.getApiVersion(),
    'Containers/pictures/upload'
  ].join('/');

  @Output() afterSave: EventEmitter<any> = new EventEmitter();
  @Input() group: Group;
  // @ViewChild(MultiImageUploaderComponent) uploader: any;

  createForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.maxLength(750)],
      // street: ['', Validators.required],
      // postal_code:['', Validators.required]
      address: this.fb.group({
        // street: ['', [Validators.required]],
        unit: ['', [Validators.required]],
        postalCode: ['', [Validators.required]],
      }),
      ownerId: new FormControl(), // ['', Validators.required]
      categories: this.fb.array([]),
      // delivery_fee: ''
    });
  }

  constructor(private fb: FormBuilder,
    private accountSvc: AccountService,
    private groupSvc: GroupService,
    private locationSvc: LocationService,
    private router: Router, private route: ActivatedRoute,
    private rx: NgRedux<IPicture>,
    private categorySvc: CategoryService,
  ) {
    this.form = this.createForm();
  }

  ngOnInit() {
    const self = this;

    if (this.group && this.group.id) {
      // this.uploadedPictures = (this.group.pictures || []).map(pic => pic.url);
      this.form.patchValue(this.group);
      // if (this.group.address) {
      //   const addr = this.group.address;
      //   this.location.city = addr.city;
      //   this.location.street_name = addr.streetName;
      //   this.location.street_number = addr.streetNumber;
      //   this.location.sub_locality = addr.sublocality;
      //   this.location.postal_code = addr.postalCode;
      //   this.location.province = addr.province;
      //   this.location.lat = addr.location.lat;
      //   this.location.lng = addr.location.lng;

      //   this.form.get('address').get('street').setValue(this.group.address.formattedAddress);
      //   this.form.get('address').get('unit').setValue(this.group.address.unit);
      //   this.form.get('address').get('postalCode').setValue(this.group.address.postalCode);
      // }
    }

    // localStorage.setItem('group_info-' + APP, JSON.stringify(self.group));
    // self.pictures = [{ index: 0, name: '', image: this.group.image }];

    // self.route.params.subscribe((params:any)=>{
    // self.commerceServ.getGroup(params.id).subscribe(
    //     (r:Group) => {
    //     	self.group = r;
    //     	self.id = r.id;
    //         self.form.patchValue(r);
    //         self.street.patchValue(r.address.street);

    //         if(r.image && r.image.data){
    //         	self.pictures = [{index:0, name:"", image:r.image}];
    //         }else{
    //         	self.pictures = [];
    //         }

    //         self.commerceServ.getCategoryList().subscribe(catList=>{
    //       self.categoryList = catList;
    //       for(let cat of catList){
    //           let c = r.categories.find(x=> x.id==cat.id );
    //           if(c){
    //               self.categories.push(new FormControl(true));
    //           }else{
    //               self.categories.push(new FormControl(false));
    //           }
    //           //self.categories.push(new FormControl(s.id));
    //       }
    //   })
    //     },
    //     (err:any) => {
    //     });

    this.accountSvc.getCurrent().subscribe((acc: Account) => {
      this.currentAccount = acc;
      if (acc.type === 'super') {
        self.accountSvc.find().subscribe(users => { // ({ where: { type: 'business' } }).subscribe(users => {
          self.users = users;
        });
      }
    });

  }

  ngOnChanges(changes) {
    if (this.form && changes.group.currentValue.id) {
      this.form.patchValue(changes.group.currentValue);

      // const addr = changes.group.currentValue.address;
      // if (addr) {
      //   this.location.city = addr.city;
      //   this.location.street_name = addr.streetName;
      //   this.location.street_number = addr.streetNumber;
      //   this.location.sub_locality = addr.sublocality;
      //   this.location.postal_code = addr.postalCode;
      //   this.location.province = addr.province;
      //   this.location.lat = addr.location.lat;
      //   this.location.lng = addr.location.lng;

      //   this.address = this.locationSvc.getAddrString(this.location);
      // }
    }
  }

  // callback of app-address-input
  onAddressChange(e) {
    // localStorage.setItem('location-' + APP, JSON.stringify(e.addr));
    this.location = e.addr;
    this.address = e.sAddr;
    this.form.get('address').patchValue({ postalCode: this.location.postal_code });
    // this.sharedSvc.emitMsg({ name: 'OnUpdateAddress', addr: e.addr });
  }

  onUploadFinished(event) {
    try {
      const self = this;
      const res = JSON.parse(event.serverResponse.response._body);
      // this.group.pictures = res.result.files.image.map(img => {
      //   return {
      //     name: self.group.name,
      //     url: [
      //       LoopBackConfig.getPath(),
      //       LoopBackConfig.getApiVersion(),
      //       'Containers',
      //       img.container, // pictures folder
      //       img.name
      //     ].join('/')
      //   };
      // });
    } catch (error) {
      console.error(error);
    }
  }

  onRemoved(event) {
    // this.group.pictures.splice(this.group.pictures.findIndex(pic => pic.url === event.file.src));
  }

  save() {
    // This component will be used for business admin and super admin!
    const self = this;
    const v = this.form.value;
    const group = new Group(this.form.value);
    // if (!this.users || !this.users.length) {
    //   group.ownerId = this.currentAccount.id;
    // }

    // group.pictures = this.group.pictures;
    // group.location = { lat: this.location.lat, lng: this.location.lng };
    // group.address = new Address({
    //   id: this.group.address ? this.group.address.id : null,
    //   streetName: this.location.street_name,
    //   streetNumber: this.location.street_number,
    //   sublocality: this.location.sub_locality,
    //   city: this.location.city,
    //   province: this.location.province,
    //   formattedAddress: this.locationSvc.getAddrString(this.location),
    //   unit: this.form.get('address').get('unit').value,
    //   postalCode: this.location.postal_code,
    //   location: {
    //     lat: this.location.lat,
    //     lng: this.location.lng
    //   },
    // });
    // {
    // city: ''
    // });
    // hardcode Toronto as default
    // if (self.group && self.group.address) {
    //   addr = self.group.address;
    //   addr.formattedAddress = v.address.street;
    // } else {
    //   addr = new Address({
    //     city: 'Toronto',
    //     province: 'ON',
    //     formattedAddress: v.address.street,
    //     unit: null,
    //     postalCode: v.address.postal_code
    //   });
    // }


    // if (self.picture) {
    //     group.image = self.picture.image;
    // }

    // group.location = { lat: this.location.lat, lng: this.location.lng };
    group.id = self.group ? self.group.id : null;
    if (group.id) {
      self.groupSvc.replaceById(group.id, group).subscribe((r: any) => {
        self.afterSave.emit({ group: r, action: 'update' });
      });
    } else {
      self.groupSvc.create(group).subscribe((r: any) => {
        self.afterSave.emit({ group: r, action: 'save' });
      });
    }
  }

  cancel() {
    const self = this;

    // const c = localStorage.getItem('group_info-' + APP);
    // const r = JSON.parse(c);

    self.form.patchValue(this.group);
    // self.pictures = [{ index: 0, name: '', image: this.group.image }];

    // localStorage.removeItem('group_info-' + APP);

    self.router.navigate(['admin']);
  }
}
