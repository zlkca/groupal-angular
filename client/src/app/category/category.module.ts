import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CategoryFormComponent,
    CategoryListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    CategoryListComponent,
    CategoryFormComponent,
  ],
})
export class CategoryModule { }
