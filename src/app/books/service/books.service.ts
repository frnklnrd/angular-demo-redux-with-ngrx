import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {catchError, map, Observable, of, switchMap, take} from 'rxjs';
import {BooksActions} from '../store/books.actions';
import {BooksSelectors} from '../store/books.selectors';
import {BooksState} from '../store/books.state';
import {UsersSelectors} from "../../users/store/users.selectors";
import {ApiService} from "../../api/service/api.service";

@Injectable()
export class BooksService {
  constructor(private store: Store<{ state: BooksState }>,
              private apiService: ApiService) {
  }

  //-------------------------------------------------------------

  public getBooks$(): Observable<any[]> {
    return this.store.select(BooksSelectors.getBooks);
  }

  //-------------------------------------------------------------

  /*
  public loadBooksByCurrentUser() {
    console.log('BooksService -> loadBooksByCurrentUser');
    this.store.dispatch(BooksActions.loadBooksForCurrentUser());
  }*/

  public loadBooksByCurrentUser(): void {
    console.log('BooksService -> loadBooksByCurrentUser');
    this.store.select(UsersSelectors.getUserName)
      .pipe(
        take(1),
        switchMap((username: string) => {
          console.log('BooksService -> this.apiService.getBooksByUserName(username)', username);
          return this.apiService.getBooksByUserName(username);
        }),
        map((result: any[]) => {
          console.log('BooksService -> dispatch actions$: BooksActions.loadListSuccess({ result })', result);
          return this.store.dispatch(BooksActions.loadListSuccess({result}));
        }),
        catchError((error) => {
          this.store.dispatch(BooksActions.loadListError({error}));
          return of(error)
        })
      )
      .subscribe(() => {
      });
  }

  //-------------------------------------------------------------
}
