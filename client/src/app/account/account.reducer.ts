import { AccountActions } from './account.actions';
import { User } from '../lb-sdk';


export const DEFAULT_USER = new User();

export function accountReducer(state: User = DEFAULT_USER, action: any) {
  if (action.payload) {
    const payload = action.payload;

    switch (action.type) {
      case AccountActions.UPDATE:
        return payload;
    }
  }

  return state;
}
