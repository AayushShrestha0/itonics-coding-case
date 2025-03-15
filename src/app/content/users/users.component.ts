import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { User } from '../../models/user.model';
import { Role } from '../../models/roles.model';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule, NzTableModule, NzInputModule, NzModalModule, NzIconModule, NzFormModule, NzSelectModule, NzButtonModule, NzToolTipModule, NzPopconfirmModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
  private fb = inject(FormBuilder);
  private userService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private message = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);
  
  usersList: User[] = [];
  rolesList:any = [];
  openEdit: boolean = false;
  isEdit: boolean = false;
  editId: number = 1;

  // isEditPermitted: boolean = false;
  // isDeletePermitted: boolean = false;
  // isCreatePermitted: boolean = false;

  userForm = this.fb.group({
    userName: ['', Validators.required, Validators.pattern(/\S/)],
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
      const existingUsername = this.usersList.find((user: User)=> user.userName == value );
      if(existingUsername){

      }
    });
  }

  
  checkForPermissions(permission: string){
    const user = JSON.parse(localStorage.getItem('user')|| '');
    if(user && user.role){
      const role = this.rolesList.find((role: Role)=> role.roleName == user.role )
      console.log(role, this.rolesList, 'role');
      
      if(role && role.allowedPermissions){
        const permissionSet = new Set([...(role.allowedPermissions || []), ...(role.features || [])]);
        
        // this.isCreatePermitted = permissionSet.has('Add');
        return permissionSet.has(permission);
      }
    }
    return false;
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
      this.userService.updateUser(params, this.editId).then(()=>{
        this.message.success('User updated successfully!', {
          nzDuration:3000
        })
      });
      this.editId = 0;
      return
    }
    this.userService.addUser(params).then(()=>{
      this.message.success('User added successfully!', {
        nzDuration:3000
      })
    });
    this.loadUsers();
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
    this.userService.deleteUser(id).then(()=>{
      this.message.success('User deleted successfully!', {
        nzDuration:3000
      });
      this.loadUsers();
    });
  }

  loadUsers(){
    console.log('loading users');
    
   this.userService.users.subscribe((users)=>{
      this.usersList = [...users];
      this.cdr.detectChanges();
   });
  }
}
