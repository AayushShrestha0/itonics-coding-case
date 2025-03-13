import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private https: HttpClient) { }

  get roles(){
    return this.https.get('/roles')
  }

  addRole(params){

  }

  deleteRole(id){

  }

  editRole(params){
    
  }
}
