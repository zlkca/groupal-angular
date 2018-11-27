/* tslint:disable */
import {
  Event,
  Category
} from '../index';

declare var Object: any;
export interface EventCategoryInterface {
  "eventId"?: number;
  "categoryId"?: number;
  "id"?: number;
  event?: Event;
  category?: Category;
}

export class EventCategory implements EventCategoryInterface {
  "eventId": number;
  "categoryId": number;
  "id": number;
  event: Event;
  category: Category;
  constructor(data?: EventCategoryInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `EventCategory`.
   */
  public static getModelName() {
    return "EventCategory";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of EventCategory for dynamic purposes.
  **/
  public static factory(data: EventCategoryInterface): EventCategory{
    return new EventCategory(data);
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
      name: 'EventCategory',
      plural: 'eventCategories',
      path: 'eventCategories',
      idName: 'id',
      properties: {
        "eventId": {
          name: 'eventId',
          type: 'number'
        },
        "categoryId": {
          name: 'categoryId',
          type: 'number'
        },
        "id": {
          name: 'id',
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
        category: {
          name: 'category',
          type: 'Category',
          model: 'Category',
          relationType: 'belongsTo',
                  keyFrom: 'categoryId',
          keyTo: 'id'
        },
      }
    }
  }
}
