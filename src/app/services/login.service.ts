import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  userService = inject(UsersService);
  userLoggedIn = false;

  constructor(private https: HttpClient) {}

  userLogin(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userService.users.subscribe((userData) => {
        const users: any = userData;
        const user = users.find(
          (udata: { userName: string; password: string }) =>
            udata.userName == username && udata.password == password
        );

        if (user) {
          this.userLoggedIn = true;
          console.log(user, 'user on login service');
          
          localStorage.setItem('user', JSON.stringify(user));
          resolve(true);
        }
        reject(false);
      });
    });
  }
}
