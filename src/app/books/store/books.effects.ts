import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, switchMap, take } from 'rxjs';
import { ApiService } from '../../api/service/api.service';
import { UsersSelectors } from '../../users/store/users.selectors';
import { BooksActions } from './books.actions';

@Injectable()
export class BooksEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private store: Store
  ) {}

  // -------------------------------------------------------------------

  loadBooksByCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksActions.LOAD_BOOKS_FOR_CURRENTUSER_ACTION_TYPE),
      exhaustMap((action, state) => {
        console.log(
          'BooksEffects -> Listening actions$: ofType(BooksActions.LOAD_BOOKS_BY_CURRENTUSER_ACTION_TYPE)'
        );
        return of(true).pipe(
          switchMap(() => {
            // get current username
            return this.store.select(UsersSelectors.getUserName);
          }),
          take(1),
          switchMap((username: string) => {
            // do some stuffs to obtain result
            return this.apiService.getBooksByUserName(username);
          }),
          map((result: any[]) => {
            // dispatch action to update state with result
            console.log(
              'BooksEffects -> dispatch actions$: BooksActions.loadListSuccess({ result })'
            );
            return BooksActions.loadListSuccess({ result });
          }),
          catchError((error) => of(BooksActions.loadListError({ error })))
        );
      })
    )
  );

  // -------------------------------------------------------------------

  removeBooksByCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksActions.REMOVE_BOOKS_FOR_CURRENTUSER_ACTION_TYPE),
      exhaustMap((action, state) => {
        console.log(
          'BooksEffects -> Listening actions$: ofType(BooksActions.REMOVE_BOOKS_FOR_CURRENTUSER_ACTION_TYPE)'
        );
        return of(true).pipe(
          switchMap(() => {
            // get current username
            return this.store.select(UsersSelectors.getUserName);
          }),
          take(1),
          switchMap((username: string) => {
            // do some stuffs to obtain result
            return of([]);
          }),
          map((result: any[]) => {
            // dispatch action to update state with result
            console.log(
              'BooksEffects -> dispatch actions$: BooksActions.loadListSuccess({ result })'
            );
            return BooksActions.loadListSuccess({ result });
          }),
          catchError((error) => of(BooksActions.loadListError({ error })))
        );
      })
    )
  );

  // -------------------------------------------------------------------
}
