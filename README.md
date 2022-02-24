# Demo Angular NGRX - Step by Step

### Create New Project

    ng new app

### Install ngrx store library (https://ngrx.io/guide/store/install)

    npm install @ngrx/store --save

  or better

    ng add @ngrx/store@latest

  check StoreModule added in app.module.ts

    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    
    import { AppRoutingModule } from './app-routing.module';
    import { AppComponent } from './app.component';
    import { StoreModule } from '@ngrx/store';
    
    @NgModule({
        declarations: [
           AppComponent
        ],
        imports: [
           BrowserModule,
           AppRoutingModule,
           StoreModule.forRoot({}, {})
        ],
        providers: [],
        bootstrap: [AppComponent]
    })
    export class AppModule { }

  in app.component.html (copy img folder in /src/assets/ with some demo images)

    <hr/>
    <div>
      <span>No user logged</span><br/><br/>
      <img width="45px" height="45px" [src]="'assets/img/users/no-user.png'"/>
    </div>
    <div>
      <span>Hi, user.</span><br/><br/>
      <img width="45px" height="45px" [src]="'assets/img/users/user.png'"/>
    </div>
    <br/><hr/>
    <input #usernameInput type="text" [disabled]="false"/>
    <button style="margin-left: 5px"  [disabled]="false">LOGIN</button>
    <button  style="margin-left: 5px"  [disabled]="false">LOGOUT</button>
    <br/><hr/>
    <span style="margin-right: 5px">Books count: 0</span>
    <button [disabled]="false">LOAD</button>
    <br/><hr/>

  to check app demo look and feel, run: 

    ng serve

### Goal # 1 - check if user is logged in or not

  create a file /src/app/users/store/users.state.ts, with structure of the information you want to control

    export interface UsersState {
        logged: boolean;
    }

  create a file /src/app/users/store/users.reducers.ts, with definitions of reducers

    import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
    import { UsersState } from './users.state';
    
    export const initialUsersState: UsersState = {
        logged: false,
    };
    
    export class UsersReducers {
        private static readonly _reducersDefs: ActionReducer<UsersState, Action> =
            createReducer(
                initialUsersState,
            ) as ActionReducer<UsersState, Action>;
        
        public static getReducers(state: any, action: any) {
        return UsersReducers._reducersDefs(state, action);
        }
    }

  create a file /src/app/users/store/users.selector.ts, with criteria to observe state data

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
    }

  create a file /src/app/users/service/users.service.ts, to share state observable

    import {Injectable} from '@angular/core';
    import {Store} from '@ngrx/store';
    import {Observable} from 'rxjs';
    import {UsersSelectors} from '../store/users.selectors';
    import {UsersState} from '../store/users.state';
    
    @Injectable()
    export class UsersService {
        constructor(private store: Store<{ state: UsersState }>) {}

        public isLogged$(): Observable<boolean> {
            return this.store.select(UsersSelectors.isLogged);
        }
    }

  and configure it in app.module.ts as provider

    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    
    import { AppRoutingModule } from './app-routing.module';
    import { AppComponent } from './app.component';
    import { StoreModule } from '@ngrx/store';
    import {UsersService} from "./users/service/users.service";
    
    @NgModule({
        declarations: [
            AppComponent
        ],
        imports: [
            BrowserModule,
            AppRoutingModule,
            StoreModule.forRoot({}, {})
        ],
        providers: [UsersService],
        bootstrap: [AppComponent]
    })
    export class AppModule { }

  modify file app.component.ts, to observe configured state data

    import { Component } from '@angular/core';
    import {Observable} from "rxjs";
    import {UsersService} from "./users/service/users.service";
    
    @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    })
    export class AppComponent {
    
        logged$: Observable<boolean>;
    
        constructor(
            private usersService: UsersService
        ) {
            this.logged$ = this.usersService.isLogged$();
        }
    }

  modify file app.component.html, to change with app state data:

    <hr/>
    <div *ngIf="!(logged$ | async)">
      <span>No user logged</span><br/><br/>
      <img width="45px" height="45px" [src]="'assets/img/users/no-user.png'"/>
    </div>
    <div *ngIf="(logged$ | async)">
      <span>Hi, user.</span><br/><br/>
      <img width="45px" height="45px" [src]="'assets/img/users/user.png'"/>
    </div>
    <br/>
    <hr/>
    <input #usernameInput type="text" [disabled]="logged$ | async"/>
    <button style="margin-left: 5px" [disabled]="logged$ | async">LOGIN</button>
    <button style="margin-left: 5px" [disabled]="!(logged$ | async)">LOGOUT</button>
    <br/>
    <hr/>
    <span style="margin-right: 5px">Books count: 0</span>
    <button [disabled]="false">LOAD</button>
    <br/>
    <hr/>

  load user state definitions in app.module.ts

    import {NgModule} from '@angular/core';
    import {BrowserModule} from '@angular/platform-browser';
    
    import {AppRoutingModule} from './app-routing.module';
    import {AppComponent} from './app.component';
    import {ActionReducerMap, MetaReducer, StoreModule} from '@ngrx/store';
    import {UsersService} from "./users/service/users.service";
    import {UsersState} from "./users/store/users.state";
    import {UsersReducers} from "./users/store/users.reducers";
    
    interface AppState {
        users: UsersState;
    }
    
    const appReducers: ActionReducerMap<AppState> = {
        users: UsersReducers.getReducers,
    };
    
    const customMetaReducers: Array<MetaReducer<any, any>> = [];
    
    @NgModule({
        declarations: [
            AppComponent
        ],
        imports: [
            BrowserModule,
            AppRoutingModule,
            StoreModule.forRoot(appReducers, {
                runtimeChecks: {
                    strictActionImmutability: true,
                    strictStateImmutability: true,
                },
                metaReducers: customMetaReducers,
            })
        ],
        providers: [UsersService],
        bootstrap: [AppComponent]
    })
    export class AppModule {
    }

  run app:

    ng serve

  change initial state value in users.reducers.ts file:

    ...
    export const initialUsersState: UsersState = {
        logged: true,
    };
    ...

  change again initial state value in users.reducers.ts file:

    ...
    export const initialUsersState: UsersState = {
        logged: false,
    };
    ...

### Goal # 2 - modify state data through actions definitions

  create a file /src/app/users/store/users.actions.ts, with actions definitions (moments we want to change app state)

    import { createAction } from '@ngrx/store';
    
    export class UsersActions {
        public static readonly LOGIN_SUCCESS_ACTION_TYPE = '[USERS] Login SUCCESS';
        public static readonly loginSuccess = createAction(
            UsersActions.LOGIN_SUCCESS_ACTION_TYPE
        );
        public static readonly LOGOUT_SUCCESS_ACTION_TYPE = '[USERS] Logout SUCCESS';
        public static readonly logoutSuccess = createAction(
            UsersActions.LOGOUT_SUCCESS_ACTION_TYPE
        );
    }

  modify users.service.ts file adding doLoginProcess and doLogoutProcess methods, with calls to user state actions.

    ...
    public doLoginProcess(): void {
        console.log('UsersService -> doLoginProcess');
        // Do some stuffs for login process
        this.store.dispatch(UsersActions.loginSuccess());
    }
    public doLogoutProcess(): void {
        console.log('UsersService -> doLogoutProcess');
        // Do some stuffs for logout process
        this.store.dispatch(UsersActions.logoutSuccess());
    }
    ...

  modify app.component.ts with call to "login" and "logout" process in UsersService:

    ...
    login(): void {
        console.log('AppComponent -> login');
        this.usersService.doLoginProcess();
    }
    logout(): void {
        console.log('AppComponent -> logout');
        this.usersService.doLogoutProcess();
    }
    ...

  modify app.component.html with call to "login" and "logout" methods:

    <button style="margin-left: 5px" [disabled]="logged$ | async" (click)="login()">LOGIN</button>
    <button style="margin-left: 5px" [disabled]="!(logged$ | async)" (click)="logout()">LOGOUT</button>

  check if it works ok (possibly not yet), run:

    ng serve

  configure in users.reducers.ts file, how actions affect app state data through reducer definitions:

    import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
    import { UsersState } from './users.state';
    import {UsersActions} from "./users.actions";
    
    export const initialUsersState: UsersState = {
        logged: false,
    };
    
    export class UsersReducers {
        private static readonly _reducersDefs: ActionReducer<UsersState, Action> =
            createReducer(
                initialUsersState,
                on(UsersActions.loginSuccess, (state, action) => {
                    console.log('UsersActions -> UserActions.login');
                    return {
                        ...state,
                        logged: true
                    };
                }),
                on(UsersActions.logoutSuccess, (state) => {
                    console.log('UsersActions -> UserActions.logout');
                    return {
                        ...state,
                        logged: false
                    };
                })
            ) as ActionReducer<UsersState, Action>;
        
        public static getReducers(state: any, action: any) {
            return UsersReducers._reducersDefs(state, action);
        }
    }

### Goal # 3 - Observe state changes with dev tools

  install Store Dev Tools 
  
  https://ngrx.io/guide/store-devtools/install

  https://ngrx.io/guide/store-devtools

  https://github.com/zalmoxisus/redux-devtools-extension/

  https://github.com/reduxjs/redux-devtools

    ng add @ngrx/store-devtools@latest

  check it in app-module.ts

    @NgModule({
        ...
        imports: [
        ...
            StoreDevtoolsModule.instrument({
              maxAge: 25, // Retains last 25 states
              logOnly: environment.production, // Restrict extension to log-only mode
              autoPause: true, // Pauses recording actions and state changes when the extension window is not open
            }),
        ],
        ...
    })
    export class AppModule {
    }

  install Firefox and Chrome extensions

    https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/

    https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd

  check if it works ok, run:

    ng serve

### Goal # 4 - Send extra data in actions and manage app state with it

  create a file /src/app/users/model/user.model.ts, with model for users data:

    export interface UserModel {
        username: string;
        photoUrl: string;
    }

  create a file /src/app/api/service/api.service.ts, for retrieve users data from some datasource:

    import { Injectable } from '@angular/core';
    import { Observable, of } from 'rxjs';
    import { UserModel } from '../../users/model/user.model';
    
    @Injectable()
    export class ApiService {
        constructor() {}
        public getUserData(username: string): Observable<UserModel> {
            return of({
                username: username,
                photoUrl: username + '.png',
            });
        }
        public clearUserData(): Observable<boolean> {
            return of(true);
        }
    }

  configure ApiService in app-module.ts in providers section:

    @NgModule({
        ...
        providers: [
            ApiService,
            UsersService,
        ],
        ...
    })
    export class AppModule {}

  update file users.state.ts with new entry with new user data structure

    import { UserModel } from "../model/user.model";
    
    export interface UsersState {
        logged: boolean;
        currentUser: UserModel | null;
    }

  update app.component.html to send username value in login process:

    ...
    <input #usernameInput type="text" [disabled]="logged$ | async"/>
    <button style="margin-left: 5px" [disabled]="logged$ | async" (click)="login(usernameInput.value); usernameInput.value = ''">LOGIN</button>
    <button style="margin-left: 5px" [disabled]="!(logged$ | async)" (click)="logout()">LOGOUT</button>
    ...

  update app.component.ts to send username value in login process:

    ...
    login(username: string): void {
        console.log('AppComponent -> login', username);
        this.usersService.doLoginProcess(username);
    }
    ...

  update users.service.ts with ApiService interactions in login process:

    ...
    @Injectable()
    export class UsersService {
        constructor(
            private store: Store<{ state: UsersState }>,
            private apiService: ApiService
        ) {}
        ...
        public doLoginProcess(username: string): void {
            console.log('UsersService -> doLoginProcess', username);
            // Do some stuffs for login process
            this.apiService.getUserData(username).subscribe((userResult: UserModel) => {
                // dispatch login success action
                this.store.dispatch(UsersActions.loginSuccess({ userData: userResult }));
            });
        }
        public doLogoutProcess(): void {
            console.log('UsersService -> doLogoutProcess');
            // Do some stuffs for logout process
            this.apiService.clearUserData().subscribe((result: boolean) => {
                // dispatch logout success action
                this.store.dispatch(UsersActions.logoutSuccess());
            });
        }
    ...
    }

  update users.actions.ts to receive some parameters in calls:

    export class UsersActions {
        ...
        public static readonly loginSuccess = createAction(
            UsersActions.LOGIN_SUCCESS_ACTION_TYPE,
            props<{ userData: UserModel }>()
        );
        ...
    }

  update users.reducers.ts to manipulate extra user data in actions:

    export const initialUsersState: UsersState = {
        logged: false,
        currentUser: null
    };

    export class UsersReducers {
        private static readonly _reducersDefs: ActionReducer<UsersState, Action> =
            createReducer(
                initialUsersState,
                on(UsersActions.loginSuccess, (state, action) => {
                    console.log('UsersActions -> UserActions.login', action.userData);
                    return {
                        ...state,
                        logged: true,
                        currentUser: action.userData,
                    };
                }),
                on(UsersActions.logoutSuccess, (state) => {
                    console.log('UsersActions -> UserActions.logout');
                    return {
                        ...state,
                        logged: false,
                        currentUser: null,
                    };
                })
            ) as ActionReducer<UsersState, Action>;
        
        public static getReducers(state: any, action: any) {
            return UsersReducers._reducersDefs(state, action);
        }
    }

  check if it works ok, run:

    ng serve


### Goal # 5 - Read user data with observables

  update file users.selectors.ts with new data selector:

    export class UsersSelectors {
      ...
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

  update file users.service.ts to expose observables:

    @Injectable()
    export class UsersService {
        ...
        public getUserName$(): Observable<string> {
            return this.store.select(UsersSelectors.getUserName);
        }
        public getUserPhotoUrl$(): Observable<string> {
            return this.store.select(UsersSelectors.getPhotoUrl);
        }
        ...
    }

  update file app.component.ts to get observables:

    export class AppComponent implements OnInit {
        ...
        userName$: Observable<string>;
        userPhotoUrl$: Observable<string>;
        constructor(
        private usersService: UsersService
        ) {
            ...
            this.userName$ = this.usersService.getUserName$();
            this.userPhotoUrl$ = this.usersService.getUserPhotoUrl$();
        }
        ...
    }

  update file app.component.html to use new observables:

    ...
    <div *ngIf="(logged$ | async)">
      <span>Hi, {{ userName$ | async }}.</span><br/><br/>
      <img width="45px" height="45px" [src]="'assets/img/users/' + (userPhotoUrl$ | async)"/>
    </div>
    ...

  check if it works ok, run:

    ng serve

### Goal # 6 - Add more state data management with real api call

  update file api.service.ts, with call to endpoint:

    @Injectable()
    export class ApiService {
        constructor(private http: HttpClient) {}
        ...
        public getBooksByUserName(username: string): Observable<any[]> {
            console.log('BooksService -> getBooksByUserName', username);
            if (username && username !== '') {
                return (
                    this.http.get('https://api.angular.schule/books') as Observable<any[]>
                  ).pipe(
                     map((result: any[]) => result.slice(0, 1 + Math.floor(Math.random() * (result.length - 1))))
                  );
            }
            else{
                return this.http.get(
                       'https://api.angular.schule/books-error-url'
                    ) as Observable<any[]>;
            }
        }
        ...
    }

  add HttpClientModule in imports section of app.module.ts:

    @NgModule({
    declarations: [AppComponent],
        imports: [
            BrowserModule,
            HttpClientModule,
            ...
        ],
        ...
        bootstrap: [AppComponent],
    })
    export class AppModule {}

  create a file /src/app/books/store/books.state.ts:

    export interface BooksState {
        list: any[]
    }

  create a file /src/app/books/store/books.selectors.ts:

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

  create a file /src/app/books/store/books.actions.ts:

    import { createAction, props } from '@ngrx/store';
    
    export class BooksActions {
        public static readonly LOAD_LIST_SUCCESS_ACTION_TYPE =
            '[BOOKS] Get Books List SUCCESS';
        public static readonly loadListSuccess = createAction(
            BooksActions.LOAD_LIST_SUCCESS_ACTION_TYPE,
            props<{ result: any[] }>()
        );
        public static readonly LOAD_LIST_ERROR_ACTION_TYPE =
            '[BOOKS] Get Books List ERROR';
        public static readonly loadListError = createAction(
            BooksActions.LOAD_LIST_ERROR_ACTION_TYPE,
            props<{ error: any }>()
        );
    }

  create a file /src/app/books/store/books.reducers.ts:

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

  update file app.module.ts, add books reducers configuration:

    interface AppState {
        users: UsersState;
        books: BooksState;
    }
    const appReducers: ActionReducerMap<AppState> = {
        users: UsersReducers.getReducers,
        books: BooksReducers.getReducers,
    };

  create a file /src/app/books/service/books.service.ts:

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
        public getBooks$(): Observable<any[]> {
            return this.store.select(BooksSelectors.getBooks);
        } 
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
                        console.log('BooksService -> dispatch actions$: BooksActions.loadListSuccess({ result })');
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
    }

  update file app.module.ts, add BooksService in providers section:

    @NgModule({
        ...
        providers: [
            ...
            BooksService,
        ],
        bootstrap: [AppComponent],
    })
    export class AppModule {}

  update file app.component.ts:

    ...
    @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss'],
    })
    export class AppComponent {
        ...
        books$: Observable<any[]>;
        
        constructor(
            private usersService: UsersService,
            private booksService: BooksService
        ) {
            ...
            this.books$ = this.booksService.getBooks$();
        }
        ...
        loadBooks(): void {
            console.log('AppComponent -> loadBooks');
            this.booksService.loadBooksByCurrentUser();
        }
    }

  update file app.component.html:

    <span style="margin-right: 5px">Books count: {{ (books$ | async)?.length }}</span>
    <button (click)="loadBooks()" [disabled]="!(logged$ | async)">LOAD</button>

  check if it works ok, run:

    ng serve

### Goal # 7 - chain events to load books after login and reset books after logout

  install ngrx effects library:

    ng add @ngrx/effects

  check default configuration in app.module.ts

    @NgModule({
        imports: [
            ...
            EffectsModule.forRoot([]),
        ],
        ...
    })
    export class AppModule {
    }

  update file books.actions.ts, add new actions definitions:

    export class BooksActions {
        ...
        public static readonly LOAD_BOOKS_FOR_CURRENTUSER_ACTION_TYPE =
           '[BOOKS] Load Books For Current User';
        public static readonly loadBooksForCurrentUser = createAction(
            BooksActions.LOAD_BOOKS_FOR_CURRENTUSER_ACTION_TYPE
        );
        public static readonly REMOVE_BOOKS_FOR_CURRENTUSER_ACTION_TYPE =
            '[BOOKS] Remove Books For Current User';
        public static readonly removeBooksForCurrentUser = createAction(
            BooksActions.REMOVE_BOOKS_FOR_CURRENTUSER_ACTION_TYPE
        );
    }

  create a file /src/app/users/store/users.effects.ts

    import { Injectable } from '@angular/core';
    import { Actions, createEffect, ofType } from '@ngrx/effects';
    import { Store } from '@ngrx/store';
    import { exhaustMap, map, of, switchMap } from 'rxjs';
    import { BooksActions } from '../../books/store/books.actions';
    import { UsersActions } from './users.actions';
    
    @Injectable()
    export class UsersEffects {
        constructor(private actions$: Actions, private store: Store) {}
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
    }

  create a file /src/app/books/store/books.effects.ts

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
    }

  update app.module.ts with effects definitions:

    ...
    const appEffects: any[] = [UsersEffects, BooksEffects];
    ...
    @NgModule({
        imports: [
            ...
            EffectsModule.forRoot(appEffects),
        ],
        ...
    })
    export class AppModule {
    }

  check if it works ok, run:

    ng serve

### Goal # 8 - persist state in localstorage

  install ngrx localstorage library 

  https://github.com/btroncone/ngrx-store-localstorage

  https://blog.briebug.com/blog/how-to-add-ngrx-store-slices-into-localstorage
    
    npm install ngrx-store-localstorage

  update app.module.ts

    export function localStorageSyncReducer(
        reducer: ActionReducer<AppState>
    ): ActionReducer<AppState> {
          return localStorageSync({
          keys: [
                  'users', // { users: ['logged', 'currentUser'] },
                  'books',
              ],
          rehydrate: true,
          storageKeySerializer: (key) => `app_${key}`,
          })(reducer);
    }
    
    const customMetaReducers: Array<MetaReducer<any, any>> = [
        localStorageSyncReducer
    ];
    
    @NgModule({
      ...
    })
    export class AppModule {
    }

  check if it works ok, run:

    ng serve

### Goal # 9 - save in localstorage only not volatile data

  change file app.module.ts:

    export function localStorageSyncReducer(
        reducer: ActionReducer<AppState>
    ): ActionReducer<AppState> {
        return localStorageSync({
            keys: [
                'users', // { users: ['logged', 'currentUser'] },
                // 'books',
            ],
            rehydrate: true,
            storageKeySerializer: (key) => `app_${key}`,
        })(reducer);
    }

### Goal # 10 - load initial volatile data

  update file app.component.ts:

    ...
    export class AppComponent implements OnInit {
        ...
        ngOnInit(): void {
            console.log('AppComponent -> ngOnInit');
            this.loadBooks();
        }
        ...
    }

### Final Goal - Let's Practice!!!
