import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { IRespUser, UserRequest } from '../Models/InterfacesUsuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  URL = environment.API;
  opt = this.createRequestOptions();
  
  getUsuarios() {
    return this.http.get<IRespUser>(this.URL + 'users', {
      headers: this.opt,
    })
  }

  postUsuarios(usuario:UserRequest) {
    return this.http.post<IRespUser>(this.URL + 'users', usuario, {
      headers: this.opt,
    })
  }

  putUsuarios(usuario:UserRequest) {
    return this.http.put<IRespUser>(this.URL + 'users', usuario, {
      headers: this.opt,
    })
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
