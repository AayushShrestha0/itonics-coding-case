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

  //Checking if the user is admin to show roles navigation on sidebar
  checkAdmin():boolean{
    const user:User = JSON.parse(sessionStorage.getItem('user') || '');
    if(user && user.role == 'ADMIN'){
      return true
    }
    return false
  }

  //Remove the item from seesion storage and navigate the user to /login page
  logOut(){
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
