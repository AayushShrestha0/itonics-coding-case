import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UsersService } from '../services/users.service';
import { RolesService } from '../services/roles.service';
import { forkJoin } from 'rxjs';

export const usersResolver: ResolveFn<any> = (route, state) => {
  const usersService = inject(UsersService);
  const rolesService = inject(RolesService);

  //fetching all the required data for the component
  return forkJoin({
    users: usersService.users,
    roles: rolesService.roles
  });
};
