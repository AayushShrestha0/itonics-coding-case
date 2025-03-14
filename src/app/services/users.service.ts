import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private https = inject(HttpClient)

  get users(){
    return this.https.get('http://localhost:3000/users');
    // this.https.get('http://localhost:3000/users').subscribe((response)=>{
    //   return response
    // })

    // return [];
  }

  addUser(params: any){
    return new Promise((resolve, reject)=>{
    this.https.post('http://localhost:3000/users', params).subscribe((resp)=>{
      if(resp){
        resolve(resp);
      }
    });
  }); 
  }

  updateUser(params: any, id: any){
    return new Promise((resolve, reject)=>{
    this.https.patch(`http://localhost:3000/users/${id}`, params).subscribe((resp)=>{
      if(resp){
        resolve(resp);
      }
    });
  });
  }

  deleteUser(id: any){
    return new Promise((resolve, reject)=>{
    this.https.delete(`https://localhost:3000/users/${id}`).subscribe((resp)=>{
      if(resp){
        resolve(resp);
      }
    });
    });
  }

}
