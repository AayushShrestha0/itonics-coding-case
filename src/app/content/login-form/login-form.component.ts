import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { LoginService } from '../../services/login.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    NzFlexModule,
    NzSegmentedModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router)
  private loginService = inject(LoginService);
  private message = inject(NzMessageService);
  
  loginForm = this.fb.group({
    username:['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  submitForm() {
    console.log(this.loginForm.value, 'form values on login');
    if(!this.loginForm.valid){
      return
    }
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    if(username && password){
      this.loginService.userLogin(username, password).then((value)=>{
        if(value){
          this.message.create('success','Login Successful', {
            nzDuration: 3000
          })
          this.router.navigate(['/roles']);
        }
      }).catch((error)=>{
        this.message.error('Could not login. Invalid Credential!',
          {
            nzDuration: 5000
          }
        )
      });

    }
  }
}
