import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Group, GroupApi, LoopBackFilter } from '../lb-sdk';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private groupApi: GroupApi) { }

  create(group: Group): Observable<Group> {
    // let groupId;
    return this.groupApi.create(group);
      // .pipe(
      //   mergeMap((rest: Group) => {
      //     groupId = rest.id;
      //     if (group.pictures && group.pictures.length) {
      //       return this.updateGroupImages(rest.id, group.pictures);
      //     } else {
      //       return new Observable(i => i.next());
      //     }
      //   }),
      //   mergeMap(() => {
      //     if (group.address) {
      //       return this.groupApi.createAddress(groupId, group.address);
      //     } else {
      //       return new Observable(i => i.next());
      //     }
      //   }),
      //   mergeMap(() => {
      //     return this.groupApi.findById(groupId, { include: ['pictures', 'address'] });
      //   })
      // );
  }

  find(filter?: LoopBackFilter) {
    return this.groupApi.find(filter);
    // .pipe(mergeMap(x => {
    //   return x;
    // }));
  }

  findById(id: number) {
    return this.groupApi.findById(id);
  }

  replaceById(id: number, group: Group) {
    return this.groupApi.replaceById(id, group);
  }
  deleteById(id: number) {
    return this.groupApi.deleteById(id);
  }
}
