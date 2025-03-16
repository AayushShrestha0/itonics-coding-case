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
  editId: string = '';


  isEditPermitted: boolean = false; //For Edit button display
  isDeletePermitted: boolean = false; //For Delete button display
  isCreatePermitted: boolean = false; //For Add button display
  isPasswordViewPermitted: boolean = false; //For Password View button display

  formPasswordVisible:boolean = false; //For password view on modal input field
  isAdmin:boolean = false; //To show Admin privilages

  userForm = this.fb.group({
    userName: ['', [Validators.required, Validators.pattern(/^\S.*\S$/)]],  //pattern validation for no spaces at the start and end of the username
    fullName:['', Validators.required],
    password: ['', [Validators.required, Validators.pattern(/^\S*\S$/), Validators.minLength(5)]],  //Patten validation restricts empty spaces in password 
    role:['', Validators.required]
  })
  
  ngOnInit() {
    //Handling the data coming in from resolver
    this.route.data.pipe(map(resolvedData=>resolvedData['data'])).subscribe(userData=>{

      //mapping show password to toggle password view control on each row individually
      this.usersList = userData['users'].map((user:User)=> ({...user, showPassword: false}));
      this.rolesList = userData['roles'];

      //creating an array of role names only to display on modal role field
      this.roleNamesList = this.rolesList.map((role: Role)=> role.roleName);
    });

    //subscribing to the control value changes to check for existing user name, to prevent duplicates
    this.userForm.get('userName')?.valueChanges.subscribe((value)=>{
      const existingUsername = this.usersList.find((user: User)=> user.userName == value );
      if(existingUsername){
        this.userForm.controls.userName.setErrors({"duplicateUserName": "Duplicate UserName."})
      }
    });
    this.checkForPermissions();
  }

  //Checking for permission by getting the role name from sessionstorage
  //finding the role data on role list and creating a set with allowedPermissions and features
  //setting the permission value to check permission in UI to show/hide actions
  checkForPermissions(){
    const user = JSON.parse(sessionStorage.getItem('user')|| '');
    if(user && user.role){
      if(user.role == 'ADMIN'){
        this.isAdmin = true;
      }
      const role = this.rolesList.find((role: Role)=> role.roleName == user.role )

      if(role && (role.allowedPermissions || role.features)){
        const permissionSet = new Set([...(role.allowedPermissions || []), ...(role.features || [])]);
        
        this.isCreatePermitted =  permissionSet.has('Add');
        this.isEditPermitted =  permissionSet.has('Edit');
        this.isDeletePermitted =  permissionSet.has('Delete');
        this.isPasswordViewPermitted =  permissionSet.has('viewPassword');
      }
    }
    return false;
  }

  //Controls the opening and closing of the modal and resets the form if an open edit is closed
  toggleEdit(){
    this.openEdit = !this.openEdit;
    if(!this.openEdit || !this.isEdit){
      this.userForm.controls.userName.enable();
      this.userForm.reset();
    }
  }

  saveChanges(){
    const params = this.userForm.value;
    if(!this.userForm.valid){
      this.message.error('Form Invalid! Please fill the required fields appropriately.', {
        nzDuration:3000
      });
      return;
    }

    //If edit mode, then call update and return or else call add to create a new role
    if(this.isEdit){
      this.userService.updateUser(params, this.editId).then((resp)=>{
        if(resp){
          this.message.success('User updated successfully!', {
            nzDuration:3000
          });
        }
        
      }).catch(error=>{
        console.log(error)
      });
      this.editId = '';
      this.toggleEdit();
      this.isEdit = false;
      return
    }

    this.userService.addUser(params).then((resp)=>{
      if(resp){
        
      this.message.success('User added successfully!', {
        nzDuration:3000
      })

      //loading the users after getting a response
      this.loadUsers();
      }
    }).catch(error=>{
      console.log(error)
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

  deleteUser(id:string){
    this.userService.deleteUser(id).then((resp)=>{
      if(resp){
        this.message.success('User deleted successfully!', {
          nzDuration:3000
        });
        this.loadUsers();  
      }
    }).catch(error=>{
      console.log(error)
    });
  }

  //load the users and force a chance detection to update data of the table
  loadUsers(){ 
    this.userService.users.subscribe((users)=>{
      this.usersList = [...users];
      this.cdr.detectChanges();
   });
  }

  //toggles password view for each row of the table
  toggleViewPasswordForRow(index: number){
    this.usersList[index].showPassword = !this.usersList[index].showPassword;
  }

  //toggles password view on the modal new user form
  togglePasswordViewInForm(){
    this.formPasswordVisible = !this.formPasswordVisible
  }
}
