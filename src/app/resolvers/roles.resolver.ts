import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RolesService } from '../services/roles.service';
import { forkJoin, Observable } from 'rxjs';

export const rolesResolver: ResolveFn<any> = (route, state) => {
  const rolesService = inject(RolesService);
  
  return forkJoin({ 
    roles: rolesService.roles,
    permissions: rolesService.permission,
    features: rolesService.features
  });
};
