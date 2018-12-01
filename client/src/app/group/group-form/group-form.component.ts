import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LocationService } from '../../address/location.service';
import { GroupService } from '../group.service';
import { CategoryService } from '../../category/category.service';
// import { MultiImageUploaderComponent } from '../../shared/multi-image-uploader/multi-image-uploader.component';
import { environment } from '../../../environments/environment';
import { NgRedux } from '@angular-redux/store';
import { IPicture } from '../../picture/picture.model';
import { AccountService } from '../../account/account.service';
import { GeoPoint, Group, Category, LoopBackConfig, Address, Account, Picture, QRCode } from '../../lb-sdk';
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
  account: Account;

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
  qrcodes: string[] = [];
  logos: string[] = [];

  logoUploadUrl: string;
  qrcodeUploadUrl: string;

  @Output() afterSave: EventEmitter<any> = new EventEmitter();
  @Input() group: Group;
  // @ViewChild(MultiImageUploaderComponent) uploader: any;

  createForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.maxLength(750)],
      ownerId: new FormControl(), // ['', Validators.required]
      categoryId: new FormControl()
      // categories: this.fb.array([new FormControl('')]),
      // delivery_fee: ''
    });
  }

  getContainerUrl() {
    return environment.API_BASE + '/' + environment.API_VERSION + '/Containers/';
  }

  constructor(private fb: FormBuilder,
    private accountSvc: AccountService,
    private groupSvc: GroupService,
    private locationSvc: LocationService,
    private router: Router, private route: ActivatedRoute,
    private ngRedux: NgRedux<Account>,
    private categorySvc: CategoryService,
  ) {
    this.form = this.createForm();
    this.logoUploadUrl = this.getContainerUrl() + 'logos/upload';
    this.qrcodeUploadUrl = this.getContainerUrl() + 'qrcodes/upload';
  }

  fillForm(group) {
    this.form.get('name').setValue(group.name);
    this.form.get('description').setValue(group.description);
    this.form.get('ownerId').setValue(group.ownerId);
    if (group.categories && group.categories.length > 0) {
      this.form.get('categoryId').setValue(group.categories[0].id);
    } else {
      this.form.get('categoryId').setValue('');
    }
    // this.form.get('categories')['controls'][0].setValue(group.categories[0].id);
  }

  setPictures(group) {
    if (group.qrcodes && group.qrcodes.length > 0) {
      const qrcode = group.qrcodes[0];
      this.qrcodes = [
        this.getContainerUrl() + qrcode.url,
      ];
    } else {
      this.qrcodes = [''];
    }

    if (group.pictures && group.pictures.length > 0) {
      const logo = group.pictures[0];
      this.logos = [
        this.getContainerUrl() + logo.url,
      ];
    } else {
      this.logos = [''];
    }
  }

  ngOnInit() {
    const self = this;

    if (this.group) {

      this.fillForm(this.group);
      // this.uploadedPictures = (this.group.pictures || []).map(pic => pic.url);
      // this.form.patchValue(this.group);
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

    this.ngRedux.select('account').subscribe((account: Account) => {
      this.account = account;
      if (account.type === 'super') {
        self.accountSvc.find().subscribe(users => {
          self.users = users;
        });
      }
    });

    this.categorySvc.find().subscribe(cats => {
      self.categories = cats;
    });

    this.setCategories(this.group.categories);
  }

  setCategories(categories) {
    const self = this;
    const cats = self.form.get('categories');
  }


  ngOnChanges(changes) {
    if (this.form && changes.group.currentValue) {
      const group = changes.group.currentValue;
      this.fillForm(group);
      this.setPictures(group);
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

  onLogoRemoved(event) {
    // this.group.pictures.splice(this.group.pictures.findIndex(pic => pic.url === event.file.src));
  }


  onQRCodeRemoved(event) {
    // this.group.pictures.splice(this.group.pictures.findIndex(pic => pic.url === event.file.src));
  }

  save() {
    // This component will be used for business admin and super admin!
    const self = this;
    // const catIds = this.form.get('categories').value;
    const catIds = [this.form.get('categoryId').value];
    this.categorySvc.find({ where: { id: { inq: catIds } } }).subscribe(cats => {
      const v = self.form.value;
      v.categories = cats;
      v.pictures = self.group.pictures;
      v.qrcodes = self.group.qrcodes;

      const group = new Group(v);
      group.id = self.group ? self.group.id : null;
      if (!group.created) {
        group.created = new Date();
      }
      group.modified = new Date();

      if (self.account.type === 'super') {
        group.ownerId = self.form.get('ownerId').value;
      } else {
        group.ownerId = self.account.id;
      }

      if (group.id) {
        self.groupSvc.replaceById(group.id, group).subscribe((r: any) => {
          self.afterSave.emit({ group: r, action: 'update' });
        });
      } else {
        self.groupSvc.create(group).subscribe((r: any) => {
          self.afterSave.emit({ group: r, action: 'save' });
        });
      }
    });

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

  }

  cancel() {
    const self = this;

    // const c = localStorage.getItem('group_info-' + APP);
    // const r = JSON.parse(c);

    // self.form.patchValue(this.group);
    // self.pictures = [{ index: 0, name: '', image: this.group.image }];

    // localStorage.removeItem('group_info-' + APP);

    this.fillForm(this.group);
    self.router.navigate(['admin']);
  }

  onAfterLogoUpload(e) {
    const self = this;
    this.logos = [
      this.getContainerUrl() + 'logos/download/' + e.name,
    ];

    this.group.pictures = [
      new Picture({
        name: self.group.name,
        type: 'logo',
        index: 1,
        url: 'logos/download/' + e.name,
        groupId: self.group.id,
        // width: 100,
        // height: 100,
        // created: null,
        // modified: null
      })
    ];
  }

  onAfterQRCodeUpload(e) {
    const self = this;
    this.qrcodes = [
      this.getContainerUrl() + 'qrcodes/download/' + e.name,
    ];

    this.group.qrcodes = [
      new QRCode({
        name: self.group.name,
        entityType: 'Group',
        entityId: self.group.id,
        index: 1,
        url: 'qrcodes/download/' + e.name,
      })
    ];
  }
}
