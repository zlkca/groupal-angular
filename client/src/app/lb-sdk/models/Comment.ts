/* tslint:disable */
import {
  Event,
  Account
} from '../index';

declare var Object: any;
export interface CommentInterface {
  "eventId"?: number;
  "fromId"?: number;
  "toId"?: number;
  "body"?: string;
  "type"?: string;
  "created"?: Date;
  "modified"?: Date;
  "id"?: number;
  "accountId"?: number;
  event?: Event;
  from?: Account;
  to?: Account;
}

export class Comment implements CommentInterface {
  "eventId": number;
  "fromId": number;
  "toId": number;
  "body": string;
  "type": string;
  "created": Date;
  "modified": Date;
  "id": number;
  "accountId": number;
  event: Event;
  from: Account;
  to: Account;
  constructor(data?: CommentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Comment`.
   */
  public static getModelName() {
    return "Comment";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Comment for dynamic purposes.
  **/
  public static factory(data: CommentInterface): Comment{
    return new Comment(data);
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
      name: 'Comment',
      plural: 'comments',
      path: 'comments',
      idName: 'id',
      properties: {
        "eventId": {
          name: 'eventId',
          type: 'number'
        },
        "fromId": {
          name: 'fromId',
          type: 'number'
        },
        "toId": {
          name: 'toId',
          type: 'number'
        },
        "body": {
          name: 'body',
          type: 'string'
        },
        "type": {
          name: 'type',
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
        "accountId": {
          name: 'accountId',
          type: 'number'
        },
      },
      relations: {
        event: {
          name: 'event',
          type: 'Event',
          model: 'Event',
          relationType: 'belongsTo',
                  keyFrom: 'eventId',
          keyTo: 'id'
        },
        from: {
          name: 'from',
          type: 'Account',
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
          keyTo: 'id'
        },
        to: {
          name: 'to',
          type: 'Account',
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
          keyTo: 'id'
        },
      }
    }
  }
}
