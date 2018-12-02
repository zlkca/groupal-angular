import { Component, OnInit, Input  } from '@angular/core';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../lb-sdk';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {
  @Input() account;

  categories: Category[] = [];
  category: Category;

  constructor(private toastSvc: ToastrService,
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

    this.toastSvc.success('Remove Category Successfully!', '',
    { timeOut: 2000, positionClass: 'toast-bottom-right' });

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
