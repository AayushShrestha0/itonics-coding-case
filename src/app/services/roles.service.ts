import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../models/roles.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private https: HttpClient) { }

  get roles():Observable<Role[]>{
    return this.https.get<Role[]>('/roles')
  }

  get permission(){
    return this.https.get('/permissions');
  }

  get features(){
    return this.https.get('/features');
  }

  updateRole(params: any, index: string){
    return new Promise((resolve, reject)=>{
    this.https.patch(`/roles/${index}`, params).subscribe(resp=>{
      if(resp){
        resolve(resp);
      }
    });
  });
  }

  addRole(params:any){
    return new Promise((resolve, reject)=>{
    this.https.post(`/roles`, params).subscribe((resp)=>{
      if(resp){
        resolve(resp);
      }
    });
  });
  }

  deleteRole(id:string){
    return new Promise((resolve, reject)=>{
      this.https.delete(`/roles/${id}`).subscribe((resp)=>{
      if(resp){
        resolve(resp);
      }
      
    });
  });
  }
}
