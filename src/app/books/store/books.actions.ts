import { createAction, props } from '@ngrx/store';

export class BooksActions {
  //----------------------------------------------------------------------
  public static readonly LOAD_LIST_SUCCESS_ACTION_TYPE =
    '[BOOKS] Get Books List SUCCESS';
  public static readonly loadListSuccess = createAction(
    BooksActions.LOAD_LIST_SUCCESS_ACTION_TYPE,
    props<{ result: any[] }>()
  );
  //----------------------------------------------------------------------
  public static readonly LOAD_LIST_ERROR_ACTION_TYPE =
    '[BOOKS] Get Books List ERROR';
  public static readonly loadListError = createAction(
    BooksActions.LOAD_LIST_ERROR_ACTION_TYPE,
    props<{ error: any }>()
  );
  //----------------------------------------------------------------------
  public static readonly LOAD_BOOKS_FOR_CURRENTUSER_ACTION_TYPE =
    '[BOOKS] Load Books For Current User';
  public static readonly loadBooksForCurrentUser = createAction(
    BooksActions.LOAD_BOOKS_FOR_CURRENTUSER_ACTION_TYPE
  );
  //----------------------------------------------------------------------
  public static readonly REMOVE_BOOKS_FOR_CURRENTUSER_ACTION_TYPE =
    '[BOOKS] Remove Books For Current User';
  public static readonly removeBooksForCurrentUser = createAction(
    BooksActions.REMOVE_BOOKS_FOR_CURRENTUSER_ACTION_TYPE
  );
  //----------------------------------------------------------------------
}
