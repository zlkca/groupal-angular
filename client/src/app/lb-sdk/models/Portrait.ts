/* tslint:disable */

declare var Object: any;
export interface PortraitInterface {
  "name"?: string;
  "url"?: string;
  "index"?: number;
  "accountId"?: number;
  "created"?: Date;
  "modified"?: Date;
  "id"?: number;
  "imageableId"?: number;
  "imageableType"?: string;
  imageable?: any;
}

export class Portrait implements PortraitInterface {
  "name": string;
  "url": string;
  "index": number;
  "accountId": number;
  "created": Date;
  "modified": Date;
  "id": number;
  "imageableId": number;
  "imageableType": string;
  imageable: any;
  constructor(data?: PortraitInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Portrait`.
   */
  public static getModelName() {
    return "Portrait";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Portrait for dynamic purposes.
  **/
  public static factory(data: PortraitInterface): Portrait{
    return new Portrait(data);
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
      name: 'Portrait',
      plural: 'portraits',
      path: 'portraits',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "url": {
          name: 'url',
          type: 'string'
        },
        "index": {
          name: 'index',
          type: 'number'
        },
        "accountId": {
          name: 'accountId',
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
        "imageableId": {
          name: 'imageableId',
          type: 'number'
        },
        "imageableType": {
          name: 'imageableType',
          type: 'string'
        },
      },
      relations: {
        imageable: {
          name: 'imageable',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'imageableId',
          keyTo: 'id'
        },
      }
    }
  }
}
