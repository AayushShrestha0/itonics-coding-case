import { Routes } from '@angular/router';
import { LoginFormComponent } from './content/login-form/login-form.component';
import { LayoutComponent } from './layout/layout.component';
import { authChildGuard, authGuard } from './guards/auth-guard.guard';
import { rolesResolver } from './resolvers/roles.resolver';
import { usersResolver } from './resolvers/users.resolver';

export const routes: Routes = [
  {
    path: 'login',
    canActivate:[authGuard],
    component: LoginFormComponent,
  },
  {
    path: '',
    // canActivate:[authGuard],
    canActivateChild:[authChildGuard],
    component:LayoutComponent,
    children: [
      {
        path: 'users',
        resolve: {data:usersResolver},
        loadComponent: () =>
          import('./content/users/users.component').then(
            (c) => c.UsersComponent
          ),
      },
      {
        path: 'roles',
        resolve: {data:rolesResolver},
        loadComponent: () =>
          import('./content/roles/roles.component').then(
            (c) => c.RolesComponent
          ),
      },
      {
        path:'**',
        redirectTo: '/login',
        pathMatch: 'full'
      }
    ],
  },
];
