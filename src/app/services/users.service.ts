import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private https = inject(HttpClient)

  //Handling all the outgoing request and response to and from the json-server

  get users(): Observable<User[]>{
    return this.https.get<User[]>('/users');
  }

  addUser(params: any){
    return new Promise((resolve, reject)=>{
    this.https.post('/users', params).subscribe({
      next: (resp) =>  resolve(resp),
      error: (err) => reject(err)
    });
  }); 
  }

  updateUser(params: any, id: string){
    return new Promise((resolve, reject)=>{
    this.https.patch(`/users/${id}`, params).subscribe({
      next: (resp) =>  resolve(resp),
      error: (err) => reject(err)
    });
  });
  }

  deleteUser(id: string){
    return new Promise((resolve, reject)=>{
      this.https.delete(`/users/${id}`).subscribe({
        next: (resp) =>  resolve(resp),
        error: (err) => reject(err)
      });
    });
  }
}
