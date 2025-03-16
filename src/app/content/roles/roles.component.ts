import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { map } from 'rxjs';
import { RolesService } from '../../services/roles.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { Role } from '../../models/roles.model';
import { Permission } from '../../models/permission.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-roles',
  imports: [ReactiveFormsModule, NzTableModule, NzInputModule, NzModalModule, NzIconModule, NzFormModule, NzSelectModule, NzButtonModule, NzToolTipModule, NzPopconfirmModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
})
export class RolesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private rolesService = inject(RolesService);
  private message = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);
  
  openEdit:boolean = false;
  isEdit:boolean = false;
  editId:string = '';
  permissions: Permission[] = [];
  rolesList: Role[] = [];
  features = [];

  rolesForm = this.fb.group({
    roleName: ['', [Validators.required,  Validators.pattern(/^\S.*\S$/)]],
    allowedPermissions: [[]],
    features: [[]]
  });

  ngOnInit() {
    //Handling the data coming in from the resolver
    this.route.data.pipe(map(resolvedData=>resolvedData['data'])).subscribe(value=>{
      this.rolesList = value.roles;
      this.permissions = value.permissions;
      this.features = value.features;
    });

    //Subscribing to the value changs of roleName to check for existing role names
    this.rolesForm.get('roleName')?.valueChanges.subscribe((value)=>{
     const existingRole = this.rolesList.find((role)=> role.roleName == value );
      if(existingRole){
        this.rolesForm.controls.roleName.setErrors({'duplicateRoleName': 'Duplicate RoleName'})
      }
    }); 
  }

  //Controls the opening and closing of the modal and resets the form if an open edit is closed
  toggleEdit(){
    this.openEdit = !this.openEdit;
    if(!this.openEdit || !this.isEdit){
      this.rolesForm.reset();
    }
  }

  saveChanges(){
    //If form invalid return and does not proceed further
    if(!this.rolesForm.valid){
      this.message.error('Form Invalid! Cannot Proceed.', {
        nzDuration:3000
      });
      return
    }
    const formValue = this.rolesForm.value;

    //If the operation is Edit, then call update and return or else call add to create a new role
    if(this.isEdit){
      const role = this.rolesList.find(role=> role.id == this.editId);
      if(role && role.id){
        this.rolesService.updateRole(formValue, role.id).then((resp)=>{
          if(resp){
            this.message.success('Role updated successfully!', {
              nzDuration:3000
            });
            this.loadRoles();
          }
        }).catch(error=>{
          console.log(error)
        });
        this.toggleEdit();
        this.isEdit = false;
        return
      }
    }
    this.rolesService.addRole(formValue).then((resp)=>{
      if(resp){
        this.message.success('Role added successfully!', {
          nzDuration:3000
      });
      this.loadRoles();
      }
    }).catch(error=>{
      console.log(error)
    });
    this.toggleEdit();
  }

  //Take the edit index, find the id of data, and store for calling the update AP, toggleEdit here opens the modal
  editRole(index:number){
      let role:any = this.rolesList[index];   
      this.editId = role['id'];
      this.rolesForm.patchValue(role);
      this.isEdit = true;
      this.toggleEdit();
  }

  deleteRole(index:string){
      this.rolesService.deleteRole(index).then((resp)=>{
        if(resp){
          this.message.success('Role deleted successfully!', {
            nzDuration:3000
          });
          this.loadRoles();
        }
      }).catch(error=>{
        console.log(error)
      });
  }

  //fetching the roles and calling the change detection to update the data on the table
  loadRoles(){
    this.rolesService.roles.subscribe((roles)=>{
      this.rolesList =  [...roles];
      this.cdr.detectChanges();
    })
  }
}
