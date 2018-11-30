import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../category/category.service';
import { GroupService } from '../../group/group.service';
import { Category, Group } from '../../lb-sdk';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit {

  MEDIA_URL = environment.APP_URL + '/media/';
  categoryList: Category[] = [];
  group: Group = new Group();
  categoryName = '';
  id: any;
  emptyImage = environment.APP_URL + '/media/empty.png';
  defaultTitles: any = ['', '', '', ''];
  events;
  constructor(
    private categorySvc: CategoryService,
    private groupSvc: GroupService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  getLogo(r: Group) {
    return this.groupSvc.getImageUrl(r.pictures);
  }

  getQRCode(qr) {
    return this.groupSvc.getQRCodeUrl(qr);
  }

  ngOnInit() {
    const self = this;
    self.defaultTitles = ['a', 'b', 'c', 'd'];
    // this.commerceServ.getImageDefaultTitle(1).subscribe((r)=>{
    //   self.defaultTitles = [r.name0, r.name1, r.name2, r.name3];
    // },(err)=>{
    // });

    self.categorySvc.find().subscribe(
      (r: Category[]) => {
        self.categoryList = r;
      },
      (err: any) => {
        self.categoryList = [];
      });

    self.route.params.subscribe((params: any) => {
      self.id = params.id;
      if (params.id) {
        const query = {where: {id: params.id}, include: ['pictures', 'qrcodes', 'categories', 'events']};
        self.groupSvc.find(query).subscribe(
          (r: Group[]) => {
            // if (r.categories && r.categories.length > 0) {
            //   self.categoryName = r.categories[0].name;
            // }

            self.group = r[0];
          },
          (err: any) => {

          });
      } else {

      }
    });
  }

  // save() {
  //     let self = this;
  //     self.wechatgroup.user = {'id':1, 'name':'admin'};
  //     self.wechatgroup.id = self.id;

  //     self.commerceServ.saveWechatGroup(self.wechatgroup).subscribe(
  //         (r:any) => {
  //             //self.wechatgroup = new WechatGroup(r.data[0]);
  //             self.router.navigate(["wechatgroups"]);
  //         },
  //         (err:any) => {
  //             //self.wechatgroup = new WechatGroup();
  //             self.router.navigate(["wechatgroups"]);
  //         });
  // }

  // onFileChange(event) {
  //     let self = this;
  //     let reader = new FileReader();
  //     if(event.target.files && event.target.files.length > 0) {
  //       let file = event.target.files[0];
  //       reader.readAsDataURL(file);
  //       reader.onload = () => {
  //           //self.logo = reader.result;//.split(',')[1];
  //           self.wechatgroup.logo = event.target.files[0];
  //       //   this.form.get('avatar').setValue({
  //       //     filename: file.name,
  //       //     filetype: file.type,
  //       //     value: reader.result.split(',')[1]
  //       //   })
  //       }
  //     }
  // }
}
