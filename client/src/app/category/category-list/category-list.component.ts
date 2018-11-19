import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventService } from '../../event/event.service';
import { Category } from '../../lb-sdk';

@Component({
  providers: [EventService],
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  @Input() categories: Category[];
  @Output() select = new EventEmitter();
  @Output() afterDelete = new EventEmitter();
  selected = null;
  fields: string[] = [];

  constructor(
    private eventSvc: EventService
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
    this.eventSvc.deleteById(c.id).subscribe(x => {
      this.afterDelete.emit({category: c});
      this.selected = null;
    });
  }

}

