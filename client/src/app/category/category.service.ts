import { Injectable } from '@angular/core';
import { Category, CategoryApi, LoopBackFilter } from '../lb-sdk';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private categoryApi: CategoryApi) { }

  create(category: Category): Observable<Category> {
    return this.categoryApi.create(category);
  }

  replaceById(id: number, category: Category): Observable<Category> {
    return this.categoryApi.replaceById(id, category);
  }

  find(filter: LoopBackFilter = {}): Observable<Category[]> {
    return this.categoryApi.find(filter);
  }

  deleteById(id): Observable<Category> {
    return this.categoryApi.deleteById(id);
  }
}
