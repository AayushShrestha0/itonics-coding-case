import { Routes } from '@angular/router';
import { LoginFormComponent } from './content/login-form/login-form.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginFormComponent,
  },
  {
    path: '',
    canActivate: [],
    component:LayoutComponent,
    children: [
      {
        path: 'users',
        canActivate: [],
        loadComponent: () =>
          import('./content/users/users.component').then(
            (c) => c.UsersComponent
          ),
      },
      {
        path: 'roles',
        canActivate: [],
        loadComponent: () =>
          import('./content/roles/roles.component').then(
            (c) => c.RolesComponent
          ),
      },
    ],
  },
];
