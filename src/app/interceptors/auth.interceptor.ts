import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const user = sessionStorage.getItem('user') || '';
  const message = inject(NzMessageService);
  const router = inject(Router);

  //If user is not logged in and try to do any operation,
  //then go to /login page, restricting any operation access
  if(!user && router.url != '/login'){
    message.error('No User Logged In Found. Logging Out!');
    router.navigate(['/login']);
  }

  //Intercept the outgoing request, clone it and update the url with the json-server port
  const newRequest = req.clone({
    url: `http://localhost:3000${req.url}`
  });

  //handle the new request
  return next(newRequest);
};
