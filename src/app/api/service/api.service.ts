import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
// import arrayShuffle from 'array-shuffle';
import {map, Observable, of} from 'rxjs';
import {UserModel} from '../../users/model/user.model';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {
  }

  //-------------------------------------------------------------

  public getUserData(username: string): Observable<UserModel> {
    return of({
      username: username,
      photoUrl: username + '.png',
    });
  }

  //-------------------------------------------------------------

  public clearUserData(): Observable<boolean> {
    return of(true);
  }

  //-------------------------------------------------------------

  public getBooksByUserName(username: string): Observable<any[]> {
    console.log('BooksService -> getBooksByUserName', username);
    if (username && username !== '') {
      return (
        this.http.get('https://api.angular.schule/books') as Observable<any[]>
      ).pipe(
        // map((result: any[]) => arrayShuffle(result)),
        map((result: any[]) => result.slice(0, 1 + Math.floor(Math.random() * (result.length - 1))))
      );
    } else {
      return this.http.get(
        'https://api.angular.schule/books-error-url'
      ) as Observable<any[]>;
    }
  }

  //-------------------------------------------------------------
}
