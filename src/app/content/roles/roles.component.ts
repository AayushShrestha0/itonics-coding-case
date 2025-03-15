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
  editId:number = 0;
  permissions: Permission[] = [];
  rolesList: Role[] = [];
  features = [];

  rolesForm = this.fb.group({
    roleName: ['', [Validators.required, Validators.pattern(/\S/)]],
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
      const existingRole = this.rolesList.find((role)=> role.roleName == value );
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
    if(!this.rolesForm.valid){
      this.rolesForm.markAllAsTouched();
      this.rolesForm.updateValueAndValidity();
      return
    }
    const changes = this.rolesForm.value;

    //create a new role if all okay

    if(this.isEdit){
      const role = this.rolesList[this.editId];

      if(role && role.id){
        this.rolesService.updateRole(changes, role.id).then(()=>{
          this.message.success('Role updated successfully!', {
            nzDuration:3000
          });
        this.loadRoles();

        });
        return
      }
    }
    this.rolesService.addRole(changes).then(()=>{
        this.message.success('Role added successfully!', {
          nzDuration:3000
      });
      this.loadRoles();

    });


  }

  editRole(index:number){
      let role$ = this.rolesList[index];  
      this.editId = index;
      this.rolesForm.patchValue(role$);
      this.isEdit = true;
      this.toggleEdit();
  }

    deleteRole(index:number){
      this.rolesService.deleteRole(index).then(()=>{
        this.message.success('Role deleted successfully!', {
          nzDuration:3000
        });
        this.loadRoles();
      });
    }

  loadRoles(){
    this.rolesService.roles.subscribe((roles)=>{
      this.rolesList =  [...roles];
      this.cdr.detectChanges();
    })
  }
}
