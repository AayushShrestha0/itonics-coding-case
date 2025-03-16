import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loggedInUserInfo = userInfo();
  
  if(loggedInUserInfo && loggedInUserInfo.role == 'ADMIN'){
    
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
  
  if(state.url == '/roles' && user && user.role != 'ADMIN'){
    router.navigate(['/users']);
    return false;
 }

  if(user){
    return true;
  }
  router.navigate(['/login']);
  return false;
};

const userInfo = () =>{
  const user = sessionStorage.getItem('user');
  if(user){
    return JSON.parse(user);
  }
  return '';
}