import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CategoryService } from './category.service';
import { Category } from '../lb-sdk';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categoryList: Category[];
  fields: string[] = [];

  @Output() afterFind = new EventEmitter();

  constructor(
    private categorySvc: CategoryService
  ) {

  }

  ngOnInit() {
    const self = this;
    const category = new Category();
    this.fields = Object.getOwnPropertyNames(category);
    this.categorySvc.find().subscribe(
      (r: Category[]) => {
        self.categoryList = r;
      },
      (err: any) => {
        self.categoryList = [];
      });
  }

  find(c?: any) {
    if (c) {
      this.afterFind.emit({name: 'OnSearch', query: {category_id: c.id }});
    } else {
      this.afterFind.emit({name: 'OnSearch' });
    }
  }

}


