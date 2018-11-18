/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Group } from '../../models/Group';
import { Event } from '../../models/Event';
import { Picture } from '../../models/Picture';
import { Category } from '../../models/Category';
import { Account } from '../../models/Account';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    Group: Group,
    Event: Event,
    Picture: Picture,
    Category: Category,
    Account: Account,
    
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
