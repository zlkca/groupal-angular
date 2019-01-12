/* tslint:disable */
import { Injectable } from '@angular/core';
import { Account } from '../../models/Account';
import { Group } from '../../models/Group';
import { Event } from '../../models/Event';
import { Picture } from '../../models/Picture';
import { Category } from '../../models/Category';
import { Address } from '../../models/Address';
import { Container } from '../../models/Container';
import { QRCode } from '../../models/QRCode';
import { EventGroup } from '../../models/EventGroup';
import { EventCategory } from '../../models/EventCategory';
import { Feedback } from '../../models/Feedback';
import { Participant } from '../../models/Participant';
import { Portrait } from '../../models/Portrait';
import { AccountIdentity } from '../../models/AccountIdentity';
import { AccountCredential } from '../../models/AccountCredential';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    Account: Account,
    Group: Group,
    Event: Event,
    Picture: Picture,
    Category: Category,
    Address: Address,
    Container: Container,
    QRCode: QRCode,
    EventGroup: EventGroup,
    EventCategory: EventCategory,
    Feedback: Feedback,
    Participant: Participant,
    Portrait: Portrait,
    AccountIdentity: AccountIdentity,
    AccountCredential: AccountCredential,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
