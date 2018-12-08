import { Injectable } from '@angular/core';

import { throwError as observableThrowError, Observable } from 'rxjs';
// import { fromPromise } from 'rxjs/observable/fromPromise';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { EventApi, LoopBackFilter, Event, Category, CategoryApi, Picture, PictureApi, ParticipantApi, Participant } from '../lb-sdk';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private eventApi: EventApi,
    private participantApi: ParticipantApi
  ) { }

  create(event: Event): Observable<Event> {
    const self = this;
    return this.eventApi.create(event)
      .pipe(
        mergeMap((r: Event) => {
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
        // mergeMap((r: Group) => {
        //   return self.updateQRCodes(r.id, group.qrcodes);
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
}
