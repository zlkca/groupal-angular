import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AddressInputComponent } from './address-input/address-input.component';
@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AddressInputComponent
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    AddressInputComponent
  ]
})
export class SharedModule { }
