/* tslint:disable */

declare var Object: any;
export interface FeedbackInterface {
  "sender"?: string;
  "receiver"?: string;
  "message"?: string;
  "created"?: Date;
  "modified"?: Date;
  "id"?: number;
}

export class Feedback implements FeedbackInterface {
  "sender": string;
  "receiver": string;
  "message": string;
  "created": Date;
  "modified": Date;
  "id": number;
  constructor(data?: FeedbackInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Feedback`.
   */
  public static getModelName() {
    return "Feedback";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Feedback for dynamic purposes.
  **/
  public static factory(data: FeedbackInterface): Feedback{
    return new Feedback(data);
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
      name: 'Feedback',
      plural: 'feedbacks',
      path: 'feedbacks',
      idName: 'id',
      properties: {
        "sender": {
          name: 'sender',
          type: 'string'
        },
        "receiver": {
          name: 'receiver',
          type: 'string'
        },
        "message": {
          name: 'message',
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
      }
    }
  }
}
