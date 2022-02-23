import { UserModel } from "../model/user.model";

export interface UsersState {
  logged: boolean;
  currentUser: UserModel | null;
}
