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
    
    this.https.patch(`http://localhost:3000/roles/${index}`, params).subscribe(resp=>{
      console.log(resp, 'response');
      
    });
  }

  addRole(params:any){
    this.https.post(`http://localhost:3000/roles`, params).subscribe((resp)=>{
      console.log('response', resp);
      
    });
  }

  deleteRole(id:number){
    this.https.delete(`http://localhost:3000/roles/${id}`).subscribe((resp)=>{
      console.log('response', resp);
      
    });
  }
}
