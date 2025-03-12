import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';

interface Role{
  roleName: string,
  allowedPermissions: string[]
}

interface Permission{
  label: string,
  value: string
}
@Component({
  selector: 'app-roles',
  imports: [ReactiveFormsModule, NzTableModule, NzInputModule, NzModalModule, NzIconModule, NzFormModule, NzSelectModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
})
export class RolesComponent {
  roleList: Role[] = [{"roleName": "testUser", "allowedPermissions": ['Add']}];
  openEdit:boolean = false;
  permissions: Permission[] = [{"label": 'Adder', "value": 'Add' }, {"label": 'Edit', "value": 'Edit' }]

  private fb = inject(FormBuilder);

  rolesForm = this.fb.group({
    roleName: ['', [Validators.required]],
    allowedPermissions: [['']]
  });

  toggleEdit(){
    this.openEdit = !this.openEdit;
    
    if(!this.openEdit){
      this.rolesForm.reset();
    }
  }

  saveChanges(){
    console.log(this.rolesForm.value, 'Form values');

    //create a new role if all okay
  }

  editRole(index:number){
    let role = this.roleList[index];  
    this.rolesForm.patchValue(role);

    this.toggleEdit();

    console.log(role, 'on edit of role')

  }
}
