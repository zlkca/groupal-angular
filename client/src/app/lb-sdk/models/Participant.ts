/* tslint:disable */
import {
  Account,
  Event
} from '../index';

declare var Object: any;
export interface ParticipantInterface {
  "accountId": number;
  "eventId": number;
  "status"?: string;
  "created"?: Date;
  "modified"?: Date;
  "id"?: number;
  account?: Account;
  event?: Event;
}

export class Participant implements ParticipantInterface {
  "accountId": number;
  "eventId": number;
  "status": string;
  "created": Date;
  "modified": Date;
  "id": number;
  account: Account;
  event: Event;
  constructor(data?: ParticipantInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Participant`.
   */
  public static getModelName() {
    return "Participant";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Participant for dynamic purposes.
  **/
  public static factory(data: ParticipantInterface): Participant{
    return new Participant(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Participant',
      plural: 'participants',
      path: 'participants',
      idName: 'id',
      properties: {
        "accountId": {
          name: 'accountId',
          type: 'number'
        },
        "eventId": {
          name: 'eventId',
          type: 'number'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "created": {
          name: 'created',
          type: 'Date'
        },
        "modified": {
          name: 'modified',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        account: {
          name: 'account',
          type: 'Account',
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
          keyTo: 'id'
        },
        event: {
          name: 'event',
          type: 'Event',
          model: 'Event',
          relationType: 'belongsTo',
                  keyFrom: 'eventId',
          keyTo: 'id'
        },
      }
    }
  }
}
