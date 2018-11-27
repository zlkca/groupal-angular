/* tslint:disable */
import {
  Group,
  Event
} from '../index';

declare var Object: any;
export interface EventGroupInterface {
  "eventId"?: number;
  "groupId"?: number;
  "id"?: number;
  group?: Group;
  event?: Event;
}

export class EventGroup implements EventGroupInterface {
  "eventId": number;
  "groupId": number;
  "id": number;
  group: Group;
  event: Event;
  constructor(data?: EventGroupInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `EventGroup`.
   */
  public static getModelName() {
    return "EventGroup";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of EventGroup for dynamic purposes.
  **/
  public static factory(data: EventGroupInterface): EventGroup{
    return new EventGroup(data);
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
      name: 'EventGroup',
      plural: 'eventGroups',
      path: 'eventGroups',
      idName: 'id',
      properties: {
        "eventId": {
          name: 'eventId',
          type: 'number'
        },
        "groupId": {
          name: 'groupId',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        group: {
          name: 'group',
          type: 'Group',
          model: 'Group',
          relationType: 'belongsTo',
                  keyFrom: 'groupId',
          keyTo: 'id'
        },
        event: {
          name: 'event',
          type: 'Event',
          model: 'Event',
          relationType: 'belongsTo',
                  keyFrom: 'eventId',
          keyTo: 'id'
        },
      }
    }
  }
}
