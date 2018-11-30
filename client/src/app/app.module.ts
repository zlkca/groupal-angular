import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { SDKBrowserModule, LoopBackConfig } from './lb-sdk';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { rootReducer, INITIAL_STATE } from './store';

import { AppComponent } from './app.component';
import { AccountModule } from './account/account.module';
import { GroupModule } from './group/group.module';
import { EventModule } from './event/event.module';
import { AdminModule } from './admin/admin.module';
import { SharedModule } from './shared/shared.module';
import { ImageUploaderModule } from './image-uploader/image-uploader.module';
import { CategoryModule } from './category/category.module';

import { AdminComponent } from './admin/admin.component';
import { AdminEventComponent } from './admin/admin-event/admin-event.component';

import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './account/login-form/login-form.component';
import { SignupFormComponent } from './account/signup-form/signup-form.component';
import { GroupDetailComponent } from './group/group-detail/group-detail.component';

const appRoutes: Routes = [
  { path: 'admin', component: AdminComponent },
  // // { path: 'admin/restaurant/:id', component: AdminRestaurantFormPageComponent },
  // // { path: 'admin/restaurant', component: AdminRestaurantFormPageComponent },
  { path: 'admin/events/:id', component: AdminEventComponent },
  { path: 'admin/events', component: AdminEventComponent },
  // { path: 'admin/products', component: AdminProductPageComponent },
  // { path: 'admin/edit-products', component: MultiProductFormComponent },
  // { path: 'admin/user', component: AdminAccountPageComponent },
  // { path: 'admin/users/:id', component: AdminAccountPageComponent },
  // { path: 'admin/orders', component: AdminComponent },

  // { path: 'restaurants/:id', component: RestaurantComponent },
  { path: 'groups/:id', component: GroupDetailComponent },
  // { path: 'products', component: ProductListComponent },
  // { path: 'product/:id', component: ProductComponent },
  // { path: 'orders', component: MyOrderComponent },
  // { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'signup', component: SignupFormComponent },
  // { path: 'institution-signup', component: InstitutionSignupComponent },
  { path: 'home', component: HomeComponent },
  // { path: 'my-address', component: MyAddressComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    NgReduxModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AccountModule,
    GroupModule,
    EventModule,
    AdminModule,
    RouterModule.forRoot(
      appRoutes,
      { useHash: true }
      // { enableTracing: true } // <-- debugging purposes only
    ),
    SDKBrowserModule.forRoot(),
    ImageUploaderModule,
    CategoryModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<any>) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE);
  }
}
