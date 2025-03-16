import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { User } from '../models/user.model';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, NzMenuModule, NzLayoutModule, NzIconModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  private router = inject(Router);

  checkAdmin():boolean{
    const user:User = JSON.parse(sessionStorage.getItem('user') || '');

    if(user && user.role == 'ADMIN'){
      return true
    }
    return false
  }

  logOut(){
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
