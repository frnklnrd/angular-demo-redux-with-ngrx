import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BooksState } from './books.state';

export class BooksSelectors {
  public static readonly stateKey = 'books';

  public static readonly getState = createFeatureSelector<BooksState>(
    BooksSelectors.stateKey
  );

  public static readonly getBooks = createSelector(
    BooksSelectors.getState,
    (state: BooksState) => state.list
  );
}
