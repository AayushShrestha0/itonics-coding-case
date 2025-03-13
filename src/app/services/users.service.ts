import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private https: HttpClient) { }

  get users(){
    return this.https.get('http://localhost:3000/users');
    // this.https.get('http://localhost:3000/users').subscribe((response)=>{
    //   return response
    // })

    // return [];
  }
}
