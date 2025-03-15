import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, NzMenuModule, NzLayoutModule, NzIconModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  private router = inject(Router);

  checkAdmin():boolean{
    const user:any = JSON.parse(sessionStorage.getItem('user') || '');

    if(user && user.role == 'Admin'){
      return true
    }
    return false
  }

  logOut(){
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
