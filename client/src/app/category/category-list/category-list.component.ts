import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../lb-sdk';

@Component({
  providers: [CategoryService],
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  @Input() account: Account;
  @Input() categories: Category[];
  @Output() select = new EventEmitter();
  @Output() afterDelete = new EventEmitter();
  selected = null;
  fields: string[] = [];

  constructor(
    private categorySvc: CategoryService
  ) { }

  ngOnInit() {
    const self = this;
    const category = new Category();
    this.fields = Object.getOwnPropertyNames(category);

  }

  onSelect(c) {
    this.select.emit({ category: c });
    this.selected = c;
  }

  delete(c) {
    this.categorySvc.deleteById(c.id).subscribe(x => {
      this.afterDelete.emit({category: c});
      this.selected = null;
    });
  }

}

