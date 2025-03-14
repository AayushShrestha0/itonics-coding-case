import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private https: HttpClient) { }

  get roles():Observable<any>{
    return this.https.get('http://localhost:3000/roles')
  }

  get permission(){
    return this.https.get('http://localhost:3000/permissions');
  }

  get features(){
    return this.https.get('http://localhost:3000/features');
  }

  updateRole(params: any, index: any){
    console.log('calling the update roles', params);
    return new Promise((resolve, reject)=>{
    this.https.patch(`http://localhost:3000/roles/${index}`, params).subscribe(resp=>{
      if(resp){
        resolve(resp);
      }
    });
  });
  }

  addRole(params:any){
    return new Promise((resolve, reject)=>{
    this.https.post(`http://localhost:3000/roles`, params).subscribe((resp)=>{
      if(resp){
        resolve(resp);
      }
    });
  });
  }

  deleteRole(id:number){
    return new Promise((resolve, reject)=>{
      this.https.delete(`http://localhost:3000/roles/${id}`).subscribe((resp)=>{
      if(resp){
        resolve(resp);
      }
      
    });
  });
  }
}
