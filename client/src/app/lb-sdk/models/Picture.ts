/* tslint:disable */

declare var Object: any;
export interface PictureInterface {
  "name"?: string;
  "description"?: string;
  "path"?: string;
  "created"?: Date;
  "width"?: number;
  "height"?: number;
  "id"?: number;
}

export class Picture implements PictureInterface {
  "name": string;
  "description": string;
  "path": string;
  "created": Date;
  "width": number;
  "height": number;
  "id": number;
  constructor(data?: PictureInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Picture`.
   */
  public static getModelName() {
    return "Picture";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Picture for dynamic purposes.
  **/
  public static factory(data: PictureInterface): Picture{
    return new Picture(data);
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
      name: 'Picture',
      plural: 'pictures',
      path: 'pictures',
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
        "path": {
          name: 'path',
          type: 'string'
        },
        "created": {
          name: 'created',
          type: 'Date'
        },
        "width": {
          name: 'width',
          type: 'number'
        },
        "height": {
          name: 'height',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
