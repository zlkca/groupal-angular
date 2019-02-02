import { Injectable } from '@angular/core';

import { throwError as observableThrowError, Observable } from 'rxjs';
// import { fromPromise } from 'rxjs/observable/fromPromise';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { EventApi, LoopBackFilter, Event, Picture, ParticipantApi, Participant, QRCodeApi, QRCode } from '../lb-sdk';
import { environment } from '../../environments/environment';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  APP_URL = environment.APP_URL;

  constructor(
    private eventApi: EventApi,
    private participantApi: ParticipantApi,
    private sharedSvc: SharedService,
    private qrCodeApi: QRCodeApi
  ) { }

  create(event: Event): Observable<Event> {
    const self = this;
    return this.eventApi.create(event)
      .pipe(
        mergeMap((r: Event, index: number) => {
          // if (event.address && event.address.id) {
          //   this.eventApi.updateAddress(r.id, event.address);
          // } else if (event.address && !event.address.id) {
          //   this.eventApi.createAddress(r.id, event.address);
          // }
          if (event.categories && event.categories.length > 0) {
            return self.eventApi.linkCategories(r.id, event.categories[0].id);
          } else {
            return new Observable(i => i.next());
          }
        // mergeMap((r: Group) => {
        //   return self.groupApi.linkCategories(group.id, group.categories[0].id);
        // }),
        // mergeMap((r: Group) => {
        //   return self.updateLogos(r.id, group.pictures);
        // }),
        // mergeMap((prod: Event) => {
        //   eventId = prod.id;
        //   if (event.pictures && event.pictures.length) {
        //     return this.updateEventImages(prod.id, event.pictures);
        //   } else {
        //     return new Observable(i => i.next());
        //   }
        // }),
        // mergeMap(() => {
        //   return this.eventApi.findById(eventId, { include: 'pictures' });
        // })
        })
      );
  }

  replaceOrCreateQRCode(event: Event, qrCode: QRCode): Observable<QRCode> {
    const self = this;
    if (event.qrcodes && event.qrcodes.length > 0) {
      qrCode.id = event.qrcodes[0].id;
    }
    return self.qrCodeApi.replaceOrCreate(qrCode);
  }

  updateEventImages(id: number, newPictures: Picture[] = null): Observable<any> {
    return this.eventApi.findById(id);
    // return this.eventApi.getPictures(id);
    //   .pipe(
    //     mergeMap((pictures: Picture[]) => {
    //       if (pictures && pictures.length
    //         && pictures.filter(pic => newPictures.findIndex(newPic => newPic.id === pic.id) === -1).length) {
    //         return Promise.all(pictures.filter(pic => newPictures.findIndex(newPic => newPic.id === pic.id) === -1).map(pic => {
    //           return this.pictureApi.deleteById(pic.id).toPromise();
    //         }))
    //           .then(() => {
    //             if (newPictures && newPictures.length && newPictures.filter(newPic => !newPic.id).length) {
    //               return this.eventApi.createManyPictures(newPictures.filter(newPic => !newPic.id));
    //             } else {
    //               return new Observable(i => i.next());
    //             }
    //           });
    //       } else if (newPictures && newPictures.length && newPictures.filter(newPic => !newPic.id).length) {
    //         return this.eventApi.createManyPictures(id, newPictures.filter(newPic => !newPic.id));
    //       } else {
    //         return new Observable(i => i.next());
    //       }
    //     })
    //   );
  }

  replaceById(id: number, event: Event): Observable<Event> {
    const self = this;
    return this.eventApi.replaceById(id, event)
      .pipe(
        mergeMap((r: Event) => {
          if (event.groups && event.groups.length > 0) {
            return self.eventApi.linkGroups(event.id, event.groups[0].id);
          } else {
            return new Observable(i => i.next());
          }
        }),
        mergeMap((r: Event) => {
          if (event.categories && event.categories.length > 0) {
            return self.eventApi.linkCategories(r.id, event.categories[0].id);
          } else {
            return new Observable(i => i.next());
          }
        })
      );
  }

  findById(id: number, filter: LoopBackFilter = { include: 'pictures' }): Observable<Event> {
    return this.eventApi.findById(id, filter);
  }

  find(filter: LoopBackFilter = { include: ['address'] }): Observable<Event[]> {
    return this.eventApi.find(filter);
  }

  deleteById(id: number) {
    return this.eventApi.deleteById(id);
  }

  sendFormData(url, formData, token, resolve, reject) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4) { // done
        if (xhr.status === 200) { // ok
          resolve(JSON.parse(xhr.response));
        } else {
          reject(xhr.response);
        }
      }
    };

    xhr.onerror = function (e) {
      reject(xhr.response);
    };

    xhr.open('POST', url, true);
    xhr.setRequestHeader('authorization', 'Bearer ' + btoa(token));
    xhr.send(formData);
  }

  join(userId, eventId) {
    const p = new Participant();
    p.accountId = userId;
    p.eventId = eventId;
    return this.participantApi.find({ where:
      {and:
        [
          { accountId: userId},
          { eventId: eventId }
        ]
      }
    }).pipe(
      mergeMap((x: any) => { // Participand
        const participant = (x && x.length > 0) ? x[0] : null;
        if (participant) {
          p.id = participant.id;
          p.created = participant.created;
        } else {
          p.created = new Date();
        }
        p.status = 'joined';
        p.modified = new Date();
        return this.participantApi.replaceOrCreate(p);
      })
    );
  }

  quit(userId, eventId) {
    return this.participantApi.find({ where:
      {and:
        [
          { accountId: userId},
          { eventId: eventId }
        ]
      }
    })
    .pipe(
      mergeMap((x: any) => { // Participant
        const participant = (x && x.length > 0) ? x[0] : null;
        if (participant) {
          return this.participantApi.replaceById(participant.id,
            { accountId: userId, eventId: eventId, status: 'cancelled', created: participant.created, modified: new Date() });
        } else {
          return new Observable(i => i.next());
        }
      })
    );
  }

  getNumOfGoing(event) {
    if (event && event.participants && event.participants) {
      const participants = event.participants.filter((p: any) => p.status === 'joined');
      return participants.length;
    } else {
      return 0;
    }
  }

}
