/* tslint:disable */

declare var Object: any;
export interface QRCodeInterface {
  "name"?: string;
  "url"?: string;
  "index"?: number;
  "entityId"?: number;
  "entityType"?: string;
  "created"?: Date;
  "modified"?: Date;
  "id"?: number;
  "imageableId"?: number;
  "imageableType"?: string;
  imageable?: any;
}

export class QRCode implements QRCodeInterface {
  "name": string;
  "url": string;
  "index": number;
  "entityId": number;
  "entityType": string;
  "created": Date;
  "modified": Date;
  "id": number;
  "imageableId": number;
  "imageableType": string;
  imageable: any;
  constructor(data?: QRCodeInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `QRCode`.
   */
  public static getModelName() {
    return "QRCode";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of QRCode for dynamic purposes.
  **/
  public static factory(data: QRCodeInterface): QRCode{
    return new QRCode(data);
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
      name: 'QRCode',
      plural: 'qrcodes',
      path: 'qrcodes',
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
        "entityId": {
          name: 'entityId',
          type: 'number'
        },
        "entityType": {
          name: 'entityType',
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
