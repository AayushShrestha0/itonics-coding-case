import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const loggedInUserInfo = userInfo();
  
  if(loggedInUserInfo && loggedInUserInfo.role == 'Admin'){
    
    router.navigate(['/roles']);
    return false
  }else if(loggedInUserInfo && loggedInUserInfo.role){
    router.navigate(['/users']);
    return false
  }
  return true;
}

export const authChildGuard: CanActivateChildFn = (route, state) => {
  const user = userInfo();
  const router = inject(Router);
  console.log(user, typeof user);
  
  if(state.url == '/roles' && user.role != 'Admin'){
    router.navigate(['/users']);
    return false;
 }

  if(user){
    return true;
  }
  return false;
};

const userInfo = () =>{
  const user = localStorage.getItem('user');
  if(user){
    return JSON.parse(user);
  }
  return ''
}