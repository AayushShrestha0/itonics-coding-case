import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../models/roles.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private https = inject(HttpClient)

  //Handling all the outgoing request and response to and from the json-server

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
    this.https.patch(`/roles/${index}`, params).subscribe({
      next: (resp) =>  resolve(resp),
      error: (err) => reject(err)
    });
  });
  }

  addRole(params:any){
    return new Promise((resolve, reject)=>{
    this.https.post(`/roles`, params).subscribe({
      next: (resp) =>  resolve(resp),
      error: (err) => reject(err)
    });
  });
  }

  deleteRole(id:string){
    return new Promise((resolve, reject)=>{
      this.https.delete(`/roles/${id}`).subscribe({
        next: (resp) =>  resolve(resp),
        error: (err) => reject(err)
    });
  });
  }
}
