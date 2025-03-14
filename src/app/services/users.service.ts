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
    this.https.post('http://localhost:3000/users', params).subscribe((resp)=>{
      console.log("response", resp)
    })
  }

  updateUser(params: any, id: any){
    this.https.patch(`http://localhost:3000/users/${id}`, params).subscribe((resp)=>{
      console.log("Response", resp);
    })
  }

  deleteUser(id: any){
    this.https.delete(`https://localhost:3000/users/${id}`).subscribe((resp)=>{
      console.log("Response", resp);
    })
  }

}
