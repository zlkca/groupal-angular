import { Component, OnInit, Input  } from '@angular/core';
import { EventService } from '../../event/event.service';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../lb-sdk';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.css']
})
export class AdminCategoryComponent implements OnInit {
  @Input() account;

  categories: Category[] = [];
  category: Category;

  constructor(private eventSvc: EventService,
    private categorySvc: CategoryService
  ) { }

  ngOnInit() {
    this.loadCategoryList();
  }

  add() {
    this.category = new Category();
    this.category.id = null;
    this.category.name = '';
    this.category.description = '';
  }

  onAfterSave(event) {
    this.loadCategoryList();
  }

  onAfterDelete(event) {
    this.loadCategoryList();
    if (event.category.id === this.category.id) {
      this.category = new Category();
      this.category.id = null;
      this.category.name = '';
      this.category.description = '';
    }
  }

  onSelect(event) {
    this.category = event.category;
  }

  loadCategoryList() {
    const self = this;
    this.categorySvc.find().subscribe(
      (r: Category[]) => {
        self.categories = r;
        if (r && r.length > 0) {
          self.category = r[0];
        }
      },
      (err: any) => {
        self.categories = [];
      });
  }
}
