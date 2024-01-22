import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILogin, IResp } from '../Models/Interfaces';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  URL = environment.API;

  Login(credenciales:ILogin){
    return this.http.post<IResp>(this.URL + 'auth', credenciales);
   
  }
  LoginCliente(credenciales:ILogin):Observable<IResp>{
    return this.http.post<IResp>(this.URL + 'auth/mov', credenciales);
  }
}
