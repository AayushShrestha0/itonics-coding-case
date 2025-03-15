import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

interface UserWithPasswordVisibility extends User {
  showPassword?: boolean
}
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
  
  usersList: UserWithPasswordVisibility[] = [];
  rolesList: Role[] = [];
  roleNamesList: string[] = [];
  openEdit: boolean = false;
  isEdit: boolean = false;
  editId: number = 0;


  isEditPermitted: boolean = false;
  isDeletePermitted: boolean = false;
  isCreatePermitted: boolean = false;
  isPasswordViewPermitted: boolean = false;
  viewpassword: boolean = false;

  userForm = this.fb.group({
    userName: ['', [Validators.required, Validators.pattern(/\S/)]],
    fullName:['', Validators.required],
    password: ['', Validators.required],
    role:['', Validators.required]
  })
  
  ngOnInit() {
    this.route.data.pipe(map(data=>data['data'])).subscribe(userData=>{
      this.usersList = userData['users'].map((user:User)=> ({...user, showPassword: false}));
      this.rolesList = userData['roles'];
      this.roleNamesList = this.rolesList.map((role: Role)=> role.roleName);
    });

    this.userForm.get('userName')?.valueChanges.subscribe((value)=>{
      const existingUsername = this.usersList.find((user: User)=> user.userName == value );
      if(existingUsername){
        this.userForm.controls.userName.setErrors({"error": "Duplicate UserName."})
      }
    });
    this.checkForPermissions();
  }

  
  checkForPermissions(){
    const user = JSON.parse(sessionStorage.getItem('user')|| '');
    if(user && user.role){
      const role = this.rolesList.find((role: Role)=> role.roleName == user.role )

      if(role && role.allowedPermissions){
        const permissionSet = new Set([...(role.allowedPermissions || []), ...(role.features || [])]);
        
        // this.isCreatePermitted = permissionSet.has('Add');
        this.isCreatePermitted =  permissionSet.has('Add');
        this.isEditPermitted =  permissionSet.has('Edit');
        this.isDeletePermitted =  permissionSet.has('Delete');
        this.isPasswordViewPermitted =  permissionSet.has('viewPassword');
      }
    }
    return false;
  }

  toggleEdit(){
    this.openEdit = !this.openEdit;
    if(!this.openEdit || !this.isEdit){
      this.userForm.controls.userName.enable();
      this.userForm.reset();
    }
  }

  validateFormFields(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach((field)=>{
      const control = formGroup.get(field);
      if(control){
        control.markAsTouched;
        control.markAsDirty;
        control.updateValueAndValidity;
      }
    })
  }

  saveChanges(){
    const params = this.userForm.value;
    if(!this.userForm.valid){
      this.validateFormFields(this.userForm);
      this.message.error('Form Invalid! Cannot Proceed.', {
        nzDuration:3000
      });
      return;
    }

    if(this.isEdit){
      this.userService.updateUser(params, this.editId).then(()=>{
        this.message.success('User updated successfully!', {
          nzDuration:3000
        })
      });
      this.editId = 0;
      this.toggleEdit();
      this.isEdit = false;
      return
    }

    this.userService.addUser(params).then(()=>{
      this.message.success('User added successfully!', {
        nzDuration:3000
      })
      this.loadUsers();
    });
    this.toggleEdit();
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
    this.userService.users.subscribe((users)=>{
      this.usersList = [...users];
      this.cdr.detectChanges();
   });
  }

  toggleViewPassword(index: number){
    this.usersList[index].showPassword = !this.usersList[index].showPassword;
  }
}
