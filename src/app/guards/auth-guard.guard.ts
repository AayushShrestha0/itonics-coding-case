import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const loggedInUserInfo = userInfo();
  
  if(loggedInUserInfo){
    return router.navigate(['/roles']);
  }
  return true;
}

export const authChildGuard: CanActivateChildFn = (route, state) => {
  const user = userInfo();
  if(user){
    return true;
  }
  return false;
};

const userInfo = () =>{
  return localStorage.getItem('user');
  
}