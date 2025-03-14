import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

interface User{
  id:number,
  userName: string,
  password: string,
  fullName: string,
  role: string
}
@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule, NzTableModule, NzInputModule, NzModalModule, NzIconModule, NzFormModule, NzSelectModule, NzToolTipModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
  private fb = inject(FormBuilder);
  private userService = inject(UsersService);
  private route = inject(ActivatedRoute);
  
  usersList: User[] = [];
  rolesList:any = [];
  openEdit: boolean = false;
  isEdit: boolean = false;
  editId: number = 1;

  userForm = this.fb.group({
    userName: ['', Validators.required],
    fullName:['', Validators.required],
    password: ['', Validators.required],
    role:['', Validators.required]
  })
  
  ngOnInit() {
    this.route.data.pipe(map(data=>data['data'])).subscribe(userData=>{
      console.log(userData, 'whats the user data');
      
      this.usersList = userData['users'];
      this.rolesList = userData['roles'];

      // this.rolesList = this.rolesList
    });

    this.userForm.get('userName')?.valueChanges.subscribe((value)=>{
      const existingUsername = this.usersList.find((user)=> user.userName == value );
    });
  }

  toggleEdit(){
    this.openEdit = !this.openEdit;
    if(!this.openEdit){
      this.userForm.controls.userName.enable();
      this.userForm.reset();
    }
  }

  saveChanges(){
    const params = this.userForm.value;
    if(!this.userForm.valid){
      return
    }
    if(this.isEdit){
      this.userService.updateUser(params, this.editId);
      this.editId = 0;
      return
    }
    this.userService.addUser(params);

  }

  editUser(index: number){
    const user = this.usersList[index];
    this.userForm.controls.userName.disable();
    this.userForm.patchValue(user);
    this.editId = user['id'];
    this.openEdit = true;
    this.isEdit = true;
  }

  deleteUser(id:number){
    this.userService.deleteUser(id);
  }
}
