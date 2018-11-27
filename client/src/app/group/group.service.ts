import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
          return self.groupApi.linkCategories(group.id, group.categories[0].id);
        }),
        mergeMap((r: Group) => {
          return self.updateLogos(r.id, group.pictures);
        }),
        mergeMap((r: Group) => {
          return self.updateQRCodes(r.id, group.qrcodes);
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
        return self.groupApi.linkCategories(group.id, group.categories[0].id);
      }),
      mergeMap((r: Group) => {
        return self.updateLogos(id, group.pictures);
      }),
      mergeMap((r: Group) => {
        return self.updateQRCodes(id, group.qrcodes);
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

  updateLogos(id: number, newPictures: Picture[] = null): Observable<any> {
    const self = this;
    return this.groupApi.getPictures(id)
      .pipe(
        mergeMap((pictures: Picture[]) => {
          const picturesToRemove: Picture[] = pictures ? pictures.filter(pic => !this.inPictureArray(pic.id, newPictures)) : [];
          const picturesToUpdate: Picture[] = pictures ? pictures.filter(pic => this.inPictureArray(pic.id, newPictures)) : [];
          const picturesToAdd: Picture[] = newPictures ? newPictures.filter(newPic => !newPic.id) : [];

          return Promise.all(picturesToRemove.map(pic => {
            return this.pictureApi.deleteById(pic.id).toPromise();
          }))
          .then(() => {
            if (picturesToAdd.length) {
              // return this.groupApi.createManyLogos(id, picturesToAdd);
              picturesToAdd.map(pic => {
                return this.pictureApi.patchOrCreate(pic).toPromise();
              });
            }
            return new Observable(i => i.next());
          })
          .then(() => {
            Promise.all(picturesToUpdate.map(pic => {
              return self.pictureApi.patchOrCreate(pic);
            }));
          });
        })
      );
  }

  updateQRCodes(id: number, newPictures: QRCode[] = null): Observable<any> {
    const self = this;
    return this.groupApi.getQrcodes(id)
      .pipe(
        mergeMap((pictures: QRCode[]) => {
          const picturesToRemove: QRCode[] = pictures ? pictures.filter(pic => !this.inPictureArray(pic.id, newPictures)) : [];
          const picturesToUpdate: QRCode[] = pictures ? pictures.filter(pic => this.inPictureArray(pic.id, newPictures)) : [];
          const picturesToAdd: QRCode[] = newPictures ? newPictures.filter(newPic => !newPic.id) : [];

          return Promise.all(picturesToRemove.map(pic => {
            return this.qrcodeApi.deleteById(pic.id).toPromise();
          }))
          .then(() => {
            if (picturesToAdd.length) {
              // return this.groupApi.createManyQRCodes(id, picturesToAdd);
              picturesToAdd.map(pic => {
                return this.qrcodeApi.patchOrCreate(pic).toPromise();
              });
            }
            return new Observable(i => i.next());
          })
          .then(() => {
            Promise.all(picturesToUpdate.map(pic => {
              return self.qrcodeApi.patchOrCreate(pic);
            }));
          });
        })
      );
  }
}
