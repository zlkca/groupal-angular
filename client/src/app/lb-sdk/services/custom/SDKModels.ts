/* tslint:disable */
import { Injectable } from '@angular/core';
import { Account } from '../../models/Account';
import { Group } from '../../models/Group';
import { Event } from '../../models/Event';
import { Picture } from '../../models/Picture';
import { Category } from '../../models/Category';
import { Address } from '../../models/Address';

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
