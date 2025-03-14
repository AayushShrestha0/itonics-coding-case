import { inject, Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  userService = inject(UsersService);
  userLoggedIn = false;

  userLogin(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userService.users.subscribe((userData) => {
        const users: any = userData;
        const user = users.find(
          (udata: User) =>
            udata.userName == username && udata.password == password
        );
        if (user) {
          this.userLoggedIn = true;
          localStorage.setItem('user', JSON.stringify(user));
          resolve(true);
        }
        reject(false);
      });
    });
  }
}
