


import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../event.service';
import { environment } from '../../../environments/environment';
import { NgRedux } from '@angular-redux/store';
// import { IAppState } from '../../store';
import { Event } from '../../lb-sdk';

const ADD_IMAGE = 'add_photo.png';

@Component({
  providers: [EventService],
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  MEDIA_URL: string = environment.MEDIA_URL;

  @Input() events: Event[];
  @Input() mode: string;
  @Output() select = new EventEmitter();
  @Output() afterDelete = new EventEmitter();
  selected = null;

  ngOnInit() {

  }

  constructor(private eventSvc: EventService,
    private router: Router,
    // private rx: NgRedux<IAppState>
    // private actions: CartActions
  ) {

    // this.subscription = ngRedux.select<ICart>('cart').subscribe(
    //   cart=> this.cart = cart);
  }

  onClick(p) {
    // if (this.mode == 'edit') {

    // } else {
    //     this.router.navigate(["event/" + p.id]);
    // }
  }

  // addToCart(p) {
  //     this.rx.dispatch({
  //         type: CartActions.ADD_TO_CART, payload:
  //             { pid: p.id, name: p.name, price: p.price, restaurant_id: p.restaurant.id }
  //     });
  // }

  // removeFromCart(p) {
  //     this.rx.dispatch({ type: CartActions.REMOVE_FROM_CART,
  //         payload: { pid: p.id, name: p.name, price: p.price, restaurant_id: p.restaurant.id } });
  // }

  getImageSrc(p) {
    if (p.fpath) {
      return this.MEDIA_URL + p.fpath;
    } else {
      return this.MEDIA_URL + ADD_IMAGE;
    }
  }

  onSelect(p) {
    this.selected = p;
    this.select.emit({ 'event': p });
  }

  change(p: Event) {
    this.router.navigate(['admin/events/' + p.id]);
  }

  add() {
    // this.router.navigate(['admin/event']);
    this.router.navigate(['admin/event']); // { queryParams: { restaurant_id: this.restaurantId } }
  }

  delete(p) {
    const self = this;
    this.eventSvc.deleteById(p.id).subscribe(x => {
      self.selected = null;
      self.afterDelete.emit({ event: p });
    });
  }
}

