import { Component, OnInit } from '@angular/core';
import { EventService } from '../event/event.service';
import { GroupService } from '../group/group.service';
import { Event, Group, Category, LoopBackAuth, Account, Portrait, SDKToken, PortraitApi } from '../lb-sdk';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../account/account.service';
import { NgRedux } from '@angular-redux/store';
import { AccountActions } from '../account/account.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  groups;
  events;
  bShowFeedbackForm = true;
  mobile = false;

  constructor(
    private groupSvc: GroupService,
    private eventSvc: EventService,
    private toastSvc: ToastrService,
    private route: ActivatedRoute,
    private authApi: LoopBackAuth,
    private accountSvc: AccountService,
    private ngRedux: NgRedux<Account>,
  ) {
  }

  ngOnInit() {
    const self = this;

    this.route.queryParams.subscribe(params => {
      if (params && !(Object.keys(params).length === 0 && params.constructor === Object)) {
        // tslint:disable-next-line:radix
        const userId = params['user-id'];

        if (userId) {
          self.authApi.setToken(new SDKToken({'id': params['access-token'], 'userId': userId, 'ttl': 6000}));
            // check if has portrait in database and check if use google account as username
            self.accountSvc.getIdentities(userId).subscribe((x: any) => {
              if (x) {
                const account = self.get3rdAccount(userId, x[0]);
                self.accountSvc.update3rdAccount(account).subscribe(() => {
                  self.ngRedux.dispatch({ type: AccountActions.UPDATE, payload: account });
                });
              } else {
                console.log('exception: failed to save 3rd login into userIdentity table');
              }
            });
        }
      } else {
        self.accountSvc.getCurrent({ include: ['portraits'] }).subscribe(account => {
          self.ngRedux.dispatch({ type: AccountActions.UPDATE, payload: account });
        });
      }
    });

    self.eventSvc.find({ include: [{'owner': 'portraits'}, 'groups', 'categories',
      {'participants': [{'account': 'portraits'}]},
      'address'], order: 'modified DESC' }).subscribe(
       (ps: Event[]) => {
         self.events = ps;
       });

    self.groupSvc.find({ include: ['pictures', 'qrcodes', 'categories'], order: 'modified DESC' }).subscribe(
      (r: Group[]) => {
        self.groups = r;
      },
      (err: any) => {
        self.groups = [];
      });

      if (window.screen.width < 768) { // 768px portrait
        this.mobile = true;
        this.bShowFeedbackForm = !this.mobile;
      }
  }

  get3rdAccount(userId, identity) {
    const self = this;
    const profile = identity.profile;
    const photoUrl = profile.photos[0].value;
    const account = new Account();
    account.id = userId;
    if (identity.provider === 'google') {
      account.username = profile.displayName;
    } else if (identity.provider === 'facebook') {
      account.username = profile.givenName;
    }
    account.type = 'user';
    const portraits = [new Portrait({
      name: identity.provider + '.' + account.username, url: photoUrl, index: 1, accountId: parseInt(userId, 10)
    })];
    account.portraits = portraits;

    return account;
  }

  hasCategory(categoryId, group) {
    const cats = group.categories.filter((cat: Category) => cat.id === categoryId);
    return cats && cats.length > 0;
  }

  onAfterFind(e) {
    const self = this;
    this.groupSvc.find({ include: ['pictures', 'qrcodes', 'categories'], order: 'modified DESC' }).subscribe(
      (r: Group[]) => {
        // for (let item of r) {
        //   item.pictures = self.getImageUrl(item.pictures);
        // }
        if (e.query) {
          const groups = [];
          r.map(x => {
            if (self.hasCategory(e.query.categoryId, x)) {
              groups.push(x);
            }
          });
          self.groups = groups;
        } else {
          self.groups = r;
        }
      },
      (err: any) => {
        self.groups = [];
      });
  }


  onAfterSendFeedback(event) {
    this.toastSvc.success('Send Feedback Successfully!', '',
    { timeOut: 2000, positionClass: 'toast-bottom-right' });
  }

  toggleFeedbackForm() {
    this.bShowFeedbackForm = !this.bShowFeedbackForm;
  }
}
