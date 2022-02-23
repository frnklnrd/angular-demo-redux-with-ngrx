import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BooksService } from './books/service/books.service';
import { UsersService } from './users/service/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  logged$: Observable<boolean>;
  userName$: Observable<string>;
  userPhotoUrl$: Observable<string>;
  books$: Observable<any[]>;

  constructor(
    private usersService: UsersService,
    private booksService: BooksService
  ) {
    this.logged$ = this.usersService.isLogged$();
    this.userName$ = this.usersService.getUserName$();
    this.userPhotoUrl$ = this.usersService.getUserPhotoUrl$();
    this.books$ = this.booksService.getBooks$();
  }

  ngOnInit(): void {
    console.log('AppComponent -> ngOnInit');
    this.loadBooks();
  }

  login(username: string): void {
    console.log('AppComponent -> login', username);
    this.usersService.doLoginProcess(username);
  }

  logout(): void {
    console.log('AppComponent -> logout');
    this.usersService.doLogoutProcess();
  }

  loadBooks(): void {
    console.log('AppComponent -> loadBooks');
    this.booksService.loadBooksByCurrentUser();
  }
}
