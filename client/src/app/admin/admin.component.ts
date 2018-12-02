import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '../account/account.service';
// import { SharedService } from '../shared/shared.service';
// import { ProductService } from '../product/product.service';

// import { OrderService } from '../order/order.service';
// import { RestaurantService } from '../restaurant/restaurant.service';
import { Account, Event, Group, Category } from '../lb-sdk';
import { NgRedux } from '../../../node_modules/@angular-redux/store';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  isAdminLogin = true;
  account;
  event;

  // for business center
  groups: Group[] = [];
  events: Event[] = [];

  // for super admin
  users: Account[] = [];
  categories: Category[] = [];

  constructor(
    private router: Router,
    private accountSvc: AccountService,
    private ngRedux: NgRedux<Account>,
    // private restaurantSvc: RestaurantService,
  ) { }

  ngOnInit() {
    const self = this;
    this.accountSvc.getCurrent().subscribe(account => {
      this.account = account;
    });
      // self.account = account;

      // if (account.type === 'organizer') {
      //     // const restaurant_id = account.restaurants[0] ? account.restaurants[0].id : null;

      //     // if (restaurant_id) {
      //     //     this.unsubscribe();
      //     //     this.subscrList.push(self.restaurantSvc.findById(restaurant_id)
      //     //     .subscribe((rest: Restaurant) => {
      //     //       self.restaurant = rest;
      //     //       self.products = rest.products;
      //     //     }));

      //     //     // this.subscrList.push(self.restaurantSvc.getOrders(restaurant_id, {include: ['account', {items: {product: 'pictures'}}]})
      //     //     // .subscribe((orders: Order[]) => {
      //     //     //     self.orders = orders;
      //     //     // }));

      //     //     // this.subscrList.push(self.restaurantSvc
      //     //     // .syncOrders(restaurant_id, {include: ['account', {items: {product: 'pictures'}}]})
      //     //     // .subscribe((od: Order) => {
      //     //     //     self.orders.push(od);
      //     //     // }));

      //     //     // self.restaurantSvc.getProducts(restaurant_id).subscribe(
      //     //     //     (ps: Product[]) => {
      //     //     //         self.products = ps;
      //     //     //     });
      //     // }

      // } else if (account.type === 'super') {
      //     // this.subscrList.push(self.restaurantSvc.find().subscribe((restaurants: Restaurant[]) => {
      //     //     self.restaurants = restaurants;
      //     // }));

      //     // this.subscrList.push(self.orderSvc.find({include: ['account', 'restaurant', {items: {product: 'pictures'}}]})
      //     // .subscribe((orders: Order[]) => {
      //     //     self.orders = orders;
      //     // }));

      //   //   this.subscrList.push(self.productSvc.findCategories().subscribe((categories: Category[]) => {
      //   //     self.categories = categories;
      //   // }));
      // }
    // });

    // self.authServ.hasLoggedIn().subscribe(
    //   (r:boolean)=>{
    //     self.isLogin = r? true : false;

    //     if(self.isLogin){
    //       self.sharedServ.emitMsg({name:'OnUpdateHeader'});
    //       self.toPage("admin/users");
    //     }else{
    //       self.toPage("admin/login");
    //     }
    //   },(err:any)=>{
    //     self.toPage("admin/login");
    //   });
  }

  ngOnDestroy() {
  }

  unsubscribe() {

  }

  toPage(url: string) {
    this.router.navigate([url]);
  }
}
