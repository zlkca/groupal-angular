import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryComponent } from './category.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CategoryFormComponent,
    CategoryListComponent,
    CategoryComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    CategoryListComponent,
    CategoryFormComponent,
    CategoryComponent
  ],
})
export class CategoryModule { }
