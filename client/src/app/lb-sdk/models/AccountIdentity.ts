/* tslint:disable */
import {
  Account
} from '../index';

declare var Object: any;
export interface AccountIdentityInterface {
  "provider"?: string;
  "authScheme"?: string;
  "externalId"?: string;
  "profile"?: any;
  "credentials"?: any;
  "created"?: Date;
  "modified"?: Date;
  "id"?: number;
  "userId"?: number;
  account?: Account;
  user?: Account;
}

export class AccountIdentity implements AccountIdentityInterface {
  "provider": string;
  "authScheme": string;
  "externalId": string;
  "profile": any;
  "credentials": any;
  "created": Date;
  "modified": Date;
  "id": number;
  "userId": number;
  account: Account;
  user: Account;
  constructor(data?: AccountIdentityInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `AccountIdentity`.
   */
  public static getModelName() {
    return "AccountIdentity";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of AccountIdentity for dynamic purposes.
  **/
  public static factory(data: AccountIdentityInterface): AccountIdentity{
    return new AccountIdentity(data);
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
      name: 'AccountIdentity',
      plural: 'accountIdentities',
      path: 'accountIdentities',
      idName: 'id',
      properties: {
        "provider": {
          name: 'provider',
          type: 'string'
        },
        "authScheme": {
          name: 'authScheme',
          type: 'string'
        },
        "externalId": {
          name: 'externalId',
          type: 'string'
        },
        "profile": {
          name: 'profile',
          type: 'any'
        },
        "credentials": {
          name: 'credentials',
          type: 'any'
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
        "userId": {
          name: 'userId',
          type: 'number'
        },
      },
      relations: {
        account: {
          name: 'account',
          type: 'Account',
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'userId',
          keyTo: 'id'
        },
        user: {
          name: 'user',
          type: 'Account',
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'userId',
          keyTo: 'id'
        },
      }
    }
  }
}
