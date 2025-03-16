import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

//Guard for login 
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loggedInUserInfo = userInfo();
  
  //If user is loggedIn and is super admin, then can navigate to /roles
  //else other logged in users navigates to /user
  //and if user is not logged in, the can access the /login page
  if(loggedInUserInfo && loggedInUserInfo.role == 'ADMIN'){
    router.navigate(['/roles']);
    return false
  }else if(loggedInUserInfo && loggedInUserInfo.role){
    router.navigate(['/users']);
    return false
  }
  return true;
}

//Guard for child routes
export const authChildGuard: CanActivateChildFn = (route, state) => {
  const user = userInfo();
  const router = inject(Router);

  //If other user than super admin try to acess /roles, then navigate to /users
  if(state.url == '/roles' && user && user.role != 'ADMIN'){
    router.navigate(['/users']);
    return false;
 }

 //if user is logged in and acess other url, then grant acess
  if(user){
    return true;
  }

  //if user is not logged in, deny access and navigate to /login
  router.navigate(['/login']);
  return false;
};

//Getting the user info for loggin in
const userInfo = () =>{
  const user = sessionStorage.getItem('user');
  if(user){
    return JSON.parse(user);
  }
  return '';
}