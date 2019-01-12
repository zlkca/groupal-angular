import { Component, OnInit } from '@angular/core';
import { EventService } from '../event/event.service';
import { GroupService } from '../group/group.service';
import { Event, Group, Category, CookieBrowser, Account, Portrait } from '../lb-sdk';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../account/account.service';
import { NgRedux } from '@angular-redux/store';
import { AccountActions } from '../account/account.actions';

@Component({
  selector: 'app-home',
  providers: [ CookieBrowser ],
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
    private cookie: CookieBrowser,
    private accountSvc: AccountService,
    private ngRedux: NgRedux<Account>,
  ) { }

  ngOnInit() {
    const self = this;

    this.route.queryParams.subscribe(params => {
      if (params) {
        // tslint:disable-next-line:radix
        const userId = parseInt(params['user-id']);
        self.cookie.set('$LoopBackSDK$userId', userId);
        self.cookie.set('$LoopBackSDK$id', params['access-token']);
        // self.accountSvc.getCurrent().subscribe(account => {
          self.accountSvc.getGoogleIdentities(userId).subscribe((x: any) => {
              if (x) {
                const profile = x[0].profile;
                const account = new Account();
                account.id = userId;
                account.username = profile.displayName;
                account.email = profile.emails[0].value;
                account.portraits = [new Portrait({url: profile.photos[0].value, index: 0, accountId: userId })];
                self.ngRedux.dispatch({ type: AccountActions.UPDATE, payload: account });
              }
            });

          // self.account = account;
          // self.isLogin = (this.account && this.account.id > 0);
        // });
      }
    });

    self.eventSvc.find({ include: [{'owner': 'portraits'}, 'groups', 'categories', {'participants': [{'account': 'portraits'}]},
     'address'], order: 'modified DESC' }).subscribe(
      (ps: Event[]) => {
        self.events = ps;
      });

    this.groupSvc.find({ include: ['pictures', 'qrcodes', 'categories'], order: 'modified DESC' }).subscribe(
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
