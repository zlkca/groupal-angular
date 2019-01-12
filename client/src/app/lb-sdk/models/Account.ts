/* tslint:disable */
import {
  Event,
  Portrait,
  AccountIdentity,
  AccountCredential,
  AccountToken
} from '../index';

declare var Object: any;
export interface AccountInterface {
  "phone"?: string;
  "type"?: string;
  "created"?: Date;
  "modified"?: Date;
  "realm"?: string;
  "username"?: string;
  "email": string;
  "emailVerified"?: boolean;
  "id"?: number;
  "password"?: string;
  events?: Event[];
  portraits?: Portrait[];
  identities?: AccountIdentity[];
  credentials?: AccountCredential[];
  accessTokens?: AccountToken[];
}

export class Account implements AccountInterface {
  "phone": string;
  "type": string;
  "created": Date;
  "modified": Date;
  "realm": string;
  "username": string;
  "email": string;
  "emailVerified": boolean;
  "id": number;
  "password": string;
  events: Event[];
  portraits: Portrait[];
  identities: AccountIdentity[];
  credentials: AccountCredential[];
  accessTokens: AccountToken[];
  constructor(data?: AccountInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Account`.
   */
  public static getModelName() {
    return "Account";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Account for dynamic purposes.
  **/
  public static factory(data: AccountInterface): Account{
    return new Account(data);
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
      name: 'Account',
      plural: 'accounts',
      path: 'accounts',
      idName: 'id',
      properties: {
        "phone": {
          name: 'phone',
          type: 'string',
          default: 'null'
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
        "realm": {
          name: 'realm',
          type: 'string'
        },
        "username": {
          name: 'username',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "emailVerified": {
          name: 'emailVerified',
          type: 'boolean'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "password": {
          name: 'password',
          type: 'string'
        },
      },
      relations: {
        events: {
          name: 'events',
          type: 'Event[]',
          model: 'Event',
          relationType: 'hasMany',
          modelThrough: 'Participant',
          keyThrough: 'eventId',
          keyFrom: 'id',
          keyTo: 'accountId'
        },
        portraits: {
          name: 'portraits',
          type: 'Portrait[]',
          model: 'Portrait',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'accountId'
        },
        identities: {
          name: 'identities',
          type: 'AccountIdentity[]',
          model: 'AccountIdentity',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'userId'
        },
        credentials: {
          name: 'credentials',
          type: 'AccountCredential[]',
          model: 'AccountCredential',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'userId'
        },
        accessTokens: {
          name: 'accessTokens',
          type: 'AccountToken[]',
          model: 'AccountToken',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'userId'
        },
      }
    }
  }
}
