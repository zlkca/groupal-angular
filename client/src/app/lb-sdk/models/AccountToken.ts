/* tslint:disable */
import {
  Account
} from '../index';

declare var Object: any;
export interface AccountTokenInterface {
  "id"?: string;
  "ttl"?: number;
  "scopes"?: Array<any>;
  "created"?: Date;
  "userId"?: number;
  account?: Account;
}

export class AccountToken implements AccountTokenInterface {
  "id": string;
  "ttl": number;
  "scopes": Array<any>;
  "created": Date;
  "userId": number;
  account: Account;
  constructor(data?: AccountTokenInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `AccountToken`.
   */
  public static getModelName() {
    return "AccountToken";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of AccountToken for dynamic purposes.
  **/
  public static factory(data: AccountTokenInterface): AccountToken{
    return new AccountToken(data);
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
      name: 'AccountToken',
      plural: 'accountTokens',
      path: 'accountTokens',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "ttl": {
          name: 'ttl',
          type: 'number',
          default: 1209600
        },
        "scopes": {
          name: 'scopes',
          type: 'Array&lt;any&gt;'
        },
        "created": {
          name: 'created',
          type: 'Date'
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
      }
    }
  }
}
