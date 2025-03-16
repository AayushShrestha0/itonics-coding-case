import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const user = sessionStorage.getItem('user') || '';
  const message = inject(NzMessageService);
  const router = inject(Router);

  if(!user && router.url != '/login'){
    message.error('No User Logged In Found. Logging Out!');
    router.navigate(['/login']);
  }
  const newRequest = req.clone({
    url: `http://localhost:3000${req.url}`
  });
  return next(newRequest);
};
