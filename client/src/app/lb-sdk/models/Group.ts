/* tslint:disable */
import {
  Account,
  Picture,
  Category,
  QRCode,
  Event
} from '../index';

declare var Object: any;
export interface GroupInterface {
  "name"?: string;
  "description"?: string;
  "ownerId"?: number;
  "created"?: Date;
  "modified"?: Date;
  "id"?: number;
  owner?: Account;
  pictures?: Picture[];
  categories?: Category[];
  qrcodes?: QRCode[];
  events?: Event[];
}

export class Group implements GroupInterface {
  "name": string;
  "description": string;
  "ownerId": number;
  "created": Date;
  "modified": Date;
  "id": number;
  owner: Account;
  pictures: Picture[];
  categories: Category[];
  qrcodes: QRCode[];
  events: Event[];
  constructor(data?: GroupInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Group`.
   */
  public static getModelName() {
    return "Group";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Group for dynamic purposes.
  **/
  public static factory(data: GroupInterface): Group{
    return new Group(data);
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
      name: 'Group',
      plural: 'groups',
      path: 'groups',
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
        pictures: {
          name: 'pictures',
          type: 'Picture[]',
          model: 'Picture',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'groupId'
        },
        categories: {
          name: 'categories',
          type: 'Category[]',
          model: 'Category',
          relationType: 'hasMany',
          modelThrough: 'GroupCategory',
          keyThrough: 'categoryId',
          keyFrom: 'id',
          keyTo: 'groupId'
        },
        qrcodes: {
          name: 'qrcodes',
          type: 'QRCode[]',
          model: 'QRCode',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'entityId'
        },
        events: {
          name: 'events',
          type: 'Event[]',
          model: 'Event',
          relationType: 'hasMany',
          modelThrough: 'EventGroup',
          keyThrough: 'eventId',
          keyFrom: 'id',
          keyTo: 'groupId'
        },
      }
    }
  }
}
