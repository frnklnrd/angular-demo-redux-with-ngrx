import { createAction, props } from '@ngrx/store';
import { UserModel } from '../model/user.model';

export class UsersActions {
  //----------------------------------------------------------------------
  public static readonly LOGIN_SUCCESS_ACTION_TYPE = '[USERS] Login SUCCESS';
  public static readonly loginSuccess = createAction(
    UsersActions.LOGIN_SUCCESS_ACTION_TYPE,
    props<{ userData: UserModel }>()
  );
  //----------------------------------------------------------------------
  public static readonly LOGOUT_SUCCESS_ACTION_TYPE = '[USERS] Logout SUCCESS';
  public static readonly logoutSuccess = createAction(UsersActions.LOGOUT_SUCCESS_ACTION_TYPE);
//----------------------------------------------------------------------
}
