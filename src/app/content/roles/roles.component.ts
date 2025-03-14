import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { map  } from 'rxjs';
import { RolesService } from '../../services/roles.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

interface Role{
  id: number,
  roleName: string,
  allowedPermissions: string[],
  features: string[]
}

interface Permission{
  id: number,
  label:string,
  value: string
}
@Component({
  selector: 'app-roles',
  imports: [ReactiveFormsModule, NzTableModule, NzInputModule, NzModalModule, NzIconModule, NzFormModule, NzSelectModule, NzToolTipModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
})
export class RolesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private rolesService = inject(RolesService);
  
  
  openEdit:boolean = false;
  isEdit:boolean = false;
  editId:number = 0;
  permissions: Permission[] = [];
  rolesList: Role[] = [];
  features = [];

  rolesForm = this.fb.group({
    roleName: ['', [Validators.required]],
    allowedPermissions: [['']],
    features: [['']]
  });

  ngOnInit() {
    this.route.data.pipe(map(data=>data['data'])).subscribe(value=>{
      this.rolesList = value.roles;
      this.permissions = value.permissions;
      this.features = value.features;
    });

    this.rolesForm.get('userName')?.valueChanges.subscribe((value)=>{
      const existingUsername = this.rolesList.find((role)=> role.roleName == value );
    });
  }
  toggleEdit(){
    this.openEdit = !this.openEdit;
    
    if(!this.openEdit){
      this.rolesForm.reset();
      this.isEdit = false;
    }
  }

  saveChanges(){
    console.log(this.rolesForm.value, 'Form values');
    if(!this.rolesForm.valid){
      return
    }
    const changes = this.rolesForm.value;

    //create a new role if all okay
    console.log(this.isEdit);
    if(this.isEdit){
      const role = this.rolesList[this.editId];
      console.log(role, 'index');
      
      if(role && role.id){
        this.rolesService.updateRole(changes, role.id);
        return
      }
    }
    this.rolesService.addRole(changes);
  }

  editRole(index:number){
      let role$ = this.rolesList[index];  
      this.editId = index;
      this.rolesForm.patchValue(role$);
      this.isEdit = true;
      this.toggleEdit();
  }

    deleteRole(index:number){
      this.rolesService.deleteRole(index);
    }
}
