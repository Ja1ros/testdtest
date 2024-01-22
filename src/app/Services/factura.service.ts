import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRespListado, RootFactPost, RootFacturaDesc } from 'app/Models/InterfaceFactura';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http:HttpClient) { }

  URL = environment.API;
  opt = this.createRequestOptions();

  getFacturaAdmin(){
    return this.http.get<IRespListado>(this.URL + 'invoice', {
      headers: this.opt,
    });
  }

  getFacturaUser(){
    return this.http.get<IRespListado>(this.URL + 'invoice/GetInvoiceUser', {
      headers: this.opt,
    });
  }


  GetFacturaDetalle(id:number): Observable<RootFacturaDesc> {
    return this.http.get<RootFacturaDesc>(this.URL + 'invoice/'+ id,{
      headers: this.opt,
    } );
  }

  PostFactura(rootFactura:RootFactPost):Observable<RootFactPost> {
    return this.http.post<RootFactPost>(this.URL + 'invoice/', rootFactura, {
      headers: this.opt,
    } );
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
