import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private https = inject(HttpClient)

  get users(): Observable<User[]>{
    return this.https.get<User[]>('/users');
  }

  addUser(params: any){
    return new Promise((resolve, reject)=>{
    this.https.post('/users', params).subscribe((resp)=>{
      if(resp){
        resolve(resp);
      }
    });
  }); 
  }

  updateUser(params: any, id: string){
    return new Promise((resolve, reject)=>{
    this.https.patch(`/users/${id}`, params).subscribe((resp)=>{
      if(resp){
        resolve(resp);
      }
    });
  });
  }

  deleteUser(id: string){
    return new Promise((resolve, reject)=>{
      this.https.delete(`/users/${id}`).subscribe((resp)=>{
       if(resp){
          resolve(resp);
       }
      });
    });
  }

}
