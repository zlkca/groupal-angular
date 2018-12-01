/* tslint:disable */
import {
  Account,
  Group,
  Category
} from '../index';

declare var Object: any;
export interface EventInterface {
  "name"?: string;
  "description"?: string;
  "ownerId"?: number;
  "created"?: Date;
  "modified"?: Date;
  "id"?: number;
  owner?: Account;
  groups?: Group[];
  categories?: Category[];
}

export class Event implements EventInterface {
  "name": string;
  "description": string;
  "ownerId": number;
  "created": Date;
  "modified": Date;
  "id": number;
  owner: Account;
  groups: Group[];
  categories: Category[];
  constructor(data?: EventInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Event`.
   */
  public static getModelName() {
    return "Event";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Event for dynamic purposes.
  **/
  public static factory(data: EventInterface): Event{
    return new Event(data);
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
      name: 'Event',
      plural: 'events',
      path: 'events',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "ownerId": {
          name: 'ownerId',
          type: 'number'
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
        owner: {
          name: 'owner',
          type: 'Account',
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'ownerId',
          keyTo: 'id'
        },
        groups: {
          name: 'groups',
          type: 'Group[]',
          model: 'Group',
          relationType: 'hasMany',
          modelThrough: 'EventGroup',
          keyThrough: 'groupId',
          keyFrom: 'id',
          keyTo: 'eventId'
        },
        categories: {
          name: 'categories',
          type: 'Category[]',
          model: 'Category',
          relationType: 'hasMany',
          modelThrough: 'EventCategory',
          keyThrough: 'categoryId',
          keyFrom: 'id',
          keyTo: 'eventId'
        },
      }
    }
  }
}
