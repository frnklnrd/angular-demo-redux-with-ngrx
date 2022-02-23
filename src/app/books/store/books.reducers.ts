import { createReducer, on } from '@ngrx/store';
import { BooksActions } from './books.actions';
import { BooksState } from './books.state';

export const initialBooksState: BooksState = {
  list: [],
};

export class BooksReducers {
  private static readonly _reducersDefs = createReducer(
    initialBooksState,
    on(BooksActions.loadListSuccess, (state, { result }) => {
      console.log('BooksReducers -> BooksActions.loadListSuccess', result);
      return {
        ...state,
        list: result,
      };
    }),
    on(BooksActions.loadListError, (state, { error }) => {
      console.log('BooksReducers -> BooksActions.loadListError', error);
      return {
        ...state,
        list: [],
      };
    })
  );

  public static getReducers(state: any, action: any) {
    return BooksReducers._reducersDefs(state, action);
  }
}
