import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';  
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';



export class User {
  email: string;
  nombres: string;
  apellidos: string;
  cargo: string;

 
  constructor(email: string, nombres: string, apellidos: string, cargo: string) {
    this.email = email;
    this.nombres = nombres;
    this.apellidos= apellidos;
    this.cargo = cargo; 
  }
}

@Injectable()
export class AuthServiceProvider {
currentUser: User;

  path : string = 'http://magapi.rotmarketing.com/get-user/?key=';

  constructor(public http: HttpClient, public storage: Storage) {
   // console.log('Hello HttpProvider Provider');
  }
 
  public login(credentials) {
    if (credentials.email === null || credentials.email == '' || credentials.password === null ||  credentials.password == '' ) {
      return Observable.throw("Por favor escriba sus datos");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        //let access = (credentials.password === "pass" && credentials.email === "email");
        let access = false;
        //let access = this.http.get(this.path+"&user="+credentials.email+"&pass="+credentials.password)
        let bypass = this.http.get(this.path+"&user="+credentials.email+"&pass="+credentials.password)
        let results = bypass.subscribe(
          (res) => { 
            //console.log(res['data']);
            access = res['result'];
            let data = res['data'];
            this.currentUser = new User(data['email'], data['nombres'], data['apellidos'], data['apellidos']);
            this.storage.set('currentAccess', true);
            this.storage.set('currentUser', {'email':data['email'], 'nombres':data['nombre'], 'apellidos':data['apellidos'], 'cargo':data['apellidos']});
            observer.next(access);
            observer.complete();
          },
          (error) =>{
            this.storage.set('currentAccess', false);
            console.error(error);
            observer.next(access);
            observer.complete();
          })

        
      });
    }
  }
 /*
  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }
 
  public getUserInfo() : User {
    return this.currentUser;
  }
 
  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }*/
}