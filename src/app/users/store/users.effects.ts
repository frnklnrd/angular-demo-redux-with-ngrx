import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { exhaustMap, map, of, switchMap } from 'rxjs';
import { BooksActions } from '../../books/store/books.actions';
import { UsersActions } from './users.actions';

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions, private store: Store) {}

  // -------------------------------------------------------------------

  afterLoginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.LOGIN_SUCCESS_ACTION_TYPE),
      switchMap((action, state) => {
        console.log(
          'UsersEffects -> Listening actions$: ofType(UsersActions.LOGIN_SUCCESS_ACTION_TYPE)'
        );
        return of(true).pipe(
          map(() => {
            // dispatch action to update state with result
            console.log(
              'UsersEffects -> dispatch actions$: BooksActions.loadBooksForCurrentUser()'
            );
            return BooksActions.loadBooksForCurrentUser();
          })
        );
      })
    )
  );

  // -------------------------------------------------------------------

  afterLogoutSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.LOGOUT_SUCCESS_ACTION_TYPE),
      exhaustMap((action, state) => {
        console.log(
          'UsersEffects -> Listening actions$: ofType(UsersActions.LOGOUT_SUCCESS_ACTION_TYPE)'
        );
        return of(true).pipe(
          map(() => {
            // dispatch action to update state with result
            console.log(
              'UsersEffects -> dispatch actions$: BooksActions.removeBooksForCurrentUser()'
            );
            return BooksActions.removeBooksForCurrentUser();
          })
        );
      })
    )
  );

  // -------------------------------------------------------------------
}
