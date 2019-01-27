import { Injectable } from '@angular/core';
import { CommentApi } from '../lb-sdk';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private commentApi: CommentApi
  ) {
  }

  create(data) {
    return this.commentApi.create(data);
  }

  find(filter) {
    return this.commentApi.find(filter);
  }

}
