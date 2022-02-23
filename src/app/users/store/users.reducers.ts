import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { UsersActions } from './users.actions';
import { UsersState } from './users.state';

export const initialUsersState: UsersState = {
  logged: false,
  currentUser: null,
};

export class UsersReducers {
  private static readonly _reducersDefs: ActionReducer<UsersState, Action> =
    createReducer(
      //-------------------------------------------------------------------
      initialUsersState,
      //-------------------------------------------------------------------
      on(UsersActions.loginSuccess, (state, action) => {
        console.log('UsersActions -> UserActions.login', action.userData);
        return {
          ...state,
          logged: true,
          currentUser: action.userData,
        };
      }),
      //-------------------------------------------------------------------
      on(UsersActions.logoutSuccess, (state) => {
        console.log('UsersActions -> UserActions.logout');
        return {
          ...state,
          logged: false,
          currentUser: null,
        };
      })
      //-------------------------------------------------------------------
    ) as ActionReducer<UsersState, Action>;

  public static getReducers(state: any, action: any) {
    return UsersReducers._reducersDefs(state, action);
  }
}
