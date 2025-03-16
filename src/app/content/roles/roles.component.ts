import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
    this.route.data.pipe(map(data=>data['data'])).subscribe(value=>{
      this.rolesList = value.roles;
      this.permissions = value.permissions;
      this.features = value.features;
    });

    this.rolesForm.get('roleName')?.valueChanges.subscribe((value)=>{
     const existingRole = this.rolesList.find((role)=> role.roleName == value );
      if(existingRole){
        this.rolesForm.controls.roleName.setErrors({'duplicateRoleName': 'Duplicate RoleName'})
      }
    }); 
  }
  toggleEdit(){
    this.openEdit = !this.openEdit;
    
    if(!this.openEdit || !this.isEdit){
      this.rolesForm.reset();
    }
  }

  saveChanges(){
    if(!this.rolesForm.valid){
      this.message.error('Form Invalid! Cannot Proceed.', {
        nzDuration:3000
      });
      return
    }
    const changes = this.rolesForm.value;

    //create a new role if all okay

    if(this.isEdit){
      const role = this.rolesList.find(role=> role.id == this.editId);

      if(role && role.id){
        this.rolesService.updateRole(changes, role.id).then((resp)=>{
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
    this.rolesService.addRole(changes).then((resp)=>{
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

  loadRoles(){
    this.rolesService.roles.subscribe((roles)=>{
      this.rolesList =  [...roles];
      this.cdr.detectChanges();
    })
  }
}
