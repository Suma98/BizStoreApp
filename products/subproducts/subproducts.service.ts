import { Injectable } from '@angular/core';
import { Subproducts } from './subproducts';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubproductsService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:81/pRESTige-master/api/subproducts/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

  getSUbproducts() {
    return this.http.get(this.url);
  }

  getSubproduct(id: string) {
    return this.http.get(this.url + id);
  }

  createSubproduct( product: Subproducts) {
    return this.http.post<Subproducts>(this.url, product, this.httpOptions);
  }

  updateSubproduct( product: Subproducts, id) {
    return this.http.put<Subproducts>(this.url + id, product, this.httpOptions);
  }

  deleteData(products){
    return this.http.delete(this.url + products.id );
  }
}
