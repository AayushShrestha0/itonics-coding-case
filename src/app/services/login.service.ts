import { inject, Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  userService = inject(UsersService);

  userLogin(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userService.users.subscribe((userData) => {

        //Get the users list and check the username and password, and login if both match, else reject
        const usersList: User[] = userData;
        const user = usersList.find(
          (udata: User) =>
            udata.userName == username && udata.password == password
        );
        if (user) {

          //removing the password from user data before setting on session storage
          const {password, ...userWithoutPassword} = user; 
          sessionStorage.setItem('user', JSON.stringify(userWithoutPassword));
          resolve(true);
        }
        reject(false);
      });
    });
  }
}
