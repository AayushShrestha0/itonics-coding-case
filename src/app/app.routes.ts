import { Routes } from '@angular/router';
import { LoginFormComponent } from './content/login-form/login-form.component';
import { LayoutComponent } from './layout/layout.component';
import { authChildGuard, authGuard } from './guards/auth-guard.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate:[authGuard],
    component: LoginFormComponent,
  },
  {
    path: '',
    canActivateChild:[authChildGuard],
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
