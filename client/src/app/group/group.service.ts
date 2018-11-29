import { Injectable } from '@angular/core';
import { Observable, concat } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Group, Picture, QRCode, GroupApi, PictureApi, QRCodeApi, LoopBackFilter } from '../lb-sdk';
import { identifierModuleUrl } from '../../../node_modules/@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    private groupApi: GroupApi,
    private pictureApi: PictureApi,
    private qrcodeApi: QRCodeApi
  ) { }

  create(group: Group): Observable<Group> {
    // let groupId;
    const self = this;
    return this.groupApi.create(group)
      .pipe(
        mergeMap((r: Group) => {
          self.updateLogos(r.id, group.pictures);
          self.updateQRCodes(r.id, group.qrcodes);
          return self.groupApi.linkCategories(r.id, group.categories[0].id);
        })
      );
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
    //   return this.groupApi.findByIdCategories()
    // }));
  }

  findById(id: number) {
    return this.groupApi.findById(id);
  }

  replaceById(id: number, group: Group) {
    const self = this;
    return this.groupApi.replaceById(id, group).pipe(
      mergeMap((r: Group) => {
        self.updateLogos(id, group.pictures);
        self.updateQRCodes(id, group.qrcodes);
        return self.groupApi.linkCategories(id, group.categories[0].id);
      })
    );
  }

  deleteById(id: number) {
    return this.groupApi.deleteById(id);
  }

  existsCategories(id: number, fk: number) {
    return this.groupApi.existsCategories(id, fk);
  }

  linkCategories(id: number, fk: number) {
    return this.groupApi.linkCategories(id, fk);
  }

  inPictureArray(pictureId, pictures) {
    return pictures.findIndex(p => p.id === pictureId) !== -1;
  }

  updateLogos(id: number, newPictures: Picture[] = null) {
    const self = this;
    this.groupApi.getPictures(id).subscribe((pictures: Picture[]) => {
      const picturesToRemove: Picture[] = pictures ? pictures.filter(pic => !this.inPictureArray(pic.id, newPictures)) : [];
      const picturesToUpdate: Picture[] = pictures ? pictures.filter(pic => this.inPictureArray(pic.id, newPictures)) : [];
      const picturesToAdd: Picture[] = newPictures ? newPictures.filter(newPic => !newPic.id) : [];

      picturesToRemove.map(pic => {
        return this.pictureApi.deleteById(pic.id).subscribe(x => {});
      });

      if (picturesToAdd.length > 0) {
        picturesToAdd.map(pic => {
          pic.groupId = id;
          this.pictureApi.patchOrCreate(pic).subscribe(x => { });
        });
      }

      if (picturesToUpdate.length > 0) {
        picturesToUpdate.map(pic => {
          pic.groupId = id;
          return self.pictureApi.patchOrCreate(pic);
        });
      }

    });
  }

  updateQRCodes(id: number, newPictures: QRCode[] = null) {
    const self = this;
    this.groupApi.getQrcodes(id).subscribe((pictures: QRCode[]) => {
      const picturesToRemove: QRCode[] = pictures ? pictures.filter(pic => !this.inPictureArray(pic.id, newPictures)) : [];
      const picturesToUpdate: QRCode[] = pictures ? pictures.filter(pic => this.inPictureArray(pic.id, newPictures)) : [];
      const picturesToAdd: QRCode[] = newPictures ? newPictures.filter(newPic => !newPic.id) : [];

      picturesToRemove.map(pic => {
        this.qrcodeApi.deleteById(pic.id).subscribe();
      });

      if (picturesToAdd.length > 0) {
        picturesToAdd.map(pic => {
          pic.entityId = id;
          this.qrcodeApi.patchOrCreate(pic).subscribe();
        });
      }

      if (picturesToUpdate.length > 0) {
        picturesToUpdate.map(pic => {
          pic.entityId = id;
          return self.qrcodeApi.patchOrCreate(pic);
        });
      }

    });
  }
}
