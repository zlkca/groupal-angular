
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { CategoryService } from '../category.service';
import { Category } from '../../lb-sdk';

@Component({
  providers: [CategoryService],
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, OnChanges {
  currentAccount: Account;
  form: FormGroup;

  @Input() category: Category;
  @Output() valueSave = new EventEmitter();

  createForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.maxLength(500)]
    });
  }

  constructor(
    private fb: FormBuilder,
    private categorySvc: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.createForm();
  }

  ngOnChanges(changes) {
    if (this.form && changes.category.currentValue) {
      this.form.patchValue(changes.category.currentValue);
    }
  }

  ngOnInit() {
    const self = this;
    if (!this.category) {
      this.category = new Category();
    }
    this.form.patchValue(this.category);
  }

  save() {
    // This component will be used for business admin and super admin!
    const self = this;
    const v = this.form.value;
    const category = new Category(this.form.value);

    category.id = self.category ? self.category.id : null;

    if (category.id) {
      self.categorySvc.replaceById(category.id, category).subscribe((r: any) => {
        self.valueSave.emit({ name: 'OnUpdateCategory' });
      });
    } else {
      self.categorySvc.create(category).subscribe((r: any) => {
        self.valueSave.emit({ name: 'OnUpdateCategory' });
      });
    }
  }

  cancel() {
    const self = this;
    self.form.patchValue(this.category);
  }
}

