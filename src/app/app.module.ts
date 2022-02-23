import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import {
  ActionReducer,
  ActionReducerMap,
  MetaReducer,
  StoreModule,
} from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';
import { environment } from '../environments/environment';
import { ApiService } from './api/service/api.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BooksService } from './books/service/books.service';
import { BooksEffects } from './books/store/books.effects';
import { BooksReducers } from './books/store/books.reducers';
import { BooksState } from './books/store/books.state';
import { UsersService } from './users/service/users.service';
import { UsersEffects } from './users/store/users.effects';
import { UsersReducers } from './users/store/users.reducers';
import { UsersState } from './users/store/users.state';

//----------------------------------------------------
// App State
//----------------------------------------------------

interface AppState {
  users: UsersState;
  books: BooksState;
}

//----------------------------------------------------
// App Reducers
//----------------------------------------------------

const appReducers: ActionReducerMap<AppState> = {
  users: UsersReducers.getReducers,
  books: BooksReducers.getReducers,
};

//----------------------------------------------------
// App Effects
//----------------------------------------------------

const appEffects: any[] = [UsersEffects, BooksEffects];

//----------------------------------------------------
// LocalStore for Store
//----------------------------------------------------

export function localStorageSyncReducer(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return localStorageSync({
    keys: [
      // 'users',
      { users: ['logged', 'currentUser'] },
    ],
    rehydrate: true,
    storageKeySerializer: (key) => `app_${key}`,
  })(reducer);
}

//----------------------------------------------------
// Custom Meta Reducers
//----------------------------------------------------

const customMetaReducers: Array<MetaReducer<any, any>> = [
  localStorageSyncReducer,
];

//----------------------------------------------------

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(
      //------------------------------
      appReducers,
      //------------------------------
      {
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
        //------------------------------
        metaReducers: customMetaReducers, // !environment.production ? [] : [],
        //------------------------------
      }
    ),
    //------------------------------
    EffectsModule.forRoot(appEffects),
    //------------------------------
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    //------------------------------
  ],
  providers: [
    //----------------------------
    ApiService,
    //----------------------------
    UsersService,
    //----------------------------
    BooksService,
    //----------------------------
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
