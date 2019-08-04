import { Injectable } from '@angular/core';
import { Products } from './products';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {Authkey} from '../model/authkey';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  secret = Authkey.getSecret();
  api = Authkey.getAPI();
  url = Authkey.geturl();
  constructor(private http: HttpClient) { }

  // urls = 'http://localhost:81/pRESTige-master/api/products/';
  // url = `http://itatonce.in:80/test/bizstore/api/products/?secret=${this.secret}&api_key=${this.api}`

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    
  };

  private _refreshNeeded$ = new Subject<void>();
  
  formData = new FormData();
  public uploadImage(file: File): Observable<Response> {
    this.formData.append('file', file, file.name);
    // console.log(formData);
    return this.http.post<any>(this.url+`/files?api_key=${this.api}`,this.formData);
  }

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  getProducts() {
    return this.http.get(this.url+`/products/?secret=${this.secret}&api_key=${this.api}`);
  }

  getProduct(id: string) {
    return this.http.get(this.url+'/products/' + id +`?secret=${this.secret}&api_key=${this.api}`)
  }

  createProduct(product: Products) {
    product.secret = "3f3d31e0-dee0-434d-9d8b-3aafa7ea3bcf";
    return this.http.post<Products>(this.url+`/products?api_key=${this.api}`, product, this.httpOptions)
    .pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  updateProduct( product: Products, id) {
    return this.http.put<Products>(this.url+'/products/' + id +`?secret=${this.secret}&api_key=${this.api}`, product, this.httpOptions)
    .pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }


  deleteData(products){
    return this.http.delete(this.url+'/products/' + products.id +`?secret=${this.secret}&api_key=${this.api}`);

    }  // url = `http://localhost:8081/pRESTige-master/api/products?secret=${this.secret}&api_key=${this.api}`;
}
