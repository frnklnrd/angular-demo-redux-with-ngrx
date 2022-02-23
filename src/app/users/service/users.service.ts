import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/api/service/api.service';
import { UserModel } from '../model/user.model';
import { UsersActions } from '../store/users.actions';
import { UsersSelectors } from '../store/users.selectors';
import { UsersState } from '../store/users.state';

@Injectable()
export class UsersService {
  constructor(
    private store: Store<{ state: UsersState }>,
    private apiService: ApiService
  ) {}

  //-------------------------------------------------------------

  public isLogged$(): Observable<boolean> {
    return this.store.select(UsersSelectors.isLogged);
  }

  public getUserName$(): Observable<string> {
    return this.store.select(UsersSelectors.getUserName);
  }

  public getUserPhotoUrl$(): Observable<string> {
    return this.store.select(UsersSelectors.getPhotoUrl);
  }

  //-------------------------------------------------------------

  public doLoginProcess(username: string): void {
    console.log('UsersService -> doLoginProcess', username);

    // Do some stuffs for login process

    this.apiService.getUserData(username).subscribe((userResult: UserModel) => {
      // dispatch login success action

      this.store.dispatch(UsersActions.loginSuccess({ userData: userResult }));
    });
  }

  //-------------------------------------------------------------

  public doLogoutProcess(): void {
    console.log('UsersService -> doLogoutProcess');

    // Do some stuffs for logout process

    this.apiService.clearUserData().subscribe((result: boolean) => {
      // dispatch logout success action

      this.store.dispatch(UsersActions.logoutSuccess());
    });
  }

  //-------------------------------------------------------------
}
