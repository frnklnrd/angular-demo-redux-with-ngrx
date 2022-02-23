import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.state';

export class UsersSelectors {
  public static readonly stateKey = 'users';

  public static readonly getState = createFeatureSelector<UsersState>(
    UsersSelectors.stateKey
  );

  public static readonly isLogged = createSelector(
    UsersSelectors.getState,
    (state: UsersState) => state.logged
  );

  public static readonly getUserName = createSelector(
    UsersSelectors.getState,
    (state: UsersState) =>
      state.currentUser?.username ? state.currentUser?.username : ''
  );

  public static readonly getPhotoUrl = createSelector(
    UsersSelectors.getState,
    (state: UsersState) =>
      state.currentUser?.photoUrl ? state.currentUser?.photoUrl : ''
  );
}
