import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { IRespUser, UserRequest } from '../Models/InterfacesUsuario';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  
  constructor(private http:HttpClient) { }

  URL = environment.API;
  opt = this.createRequestOptions();


  getUsuario(){
    return this.http.get<IRespUser>(this.URL + 'users', {
      headers: this.opt,
    });
  }

  postUsuario(usuario:UserRequest) { 
    return this.http.post<IRespUser>(this.URL + 'users', usuario, {
      headers: this.opt,
    });
  }

  putCliente(usuario:UserRequest){
    return this.http.put<IRespUser>(this.URL + 'users', usuario, {
      headers: this.opt,
    });
  }

  private createRequestOptions() {
    let token =JSON.parse(localStorage.getItem("token"));
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      'x-token': token,
    });
    return headers;
  }
  
}
