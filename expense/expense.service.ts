import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {Authkey} from '../model/authkey';
import { Expense } from './../model/expense';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  secret = Authkey.getSecret();
  api = Authkey.getAPI();
  url = Authkey.geturl();
  constructor(private http: HttpClient) { }

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

  getexpense() {
    return this.http.get(this.url+`/expenses/?secret=${this.secret}&api_key=${this.api}`);
  }

  getexpenses(id: string) {
    return this.http.get(this.url+'/expenses/' + id +`?secret=${this.secret}&api_key=${this.api}`)
  }

  createExpense(expense: Expense) {
    expense.secret = "3f3d31e0-dee0-434d-9d8b-3aafa7ea3bcf";  
    return this.http.post<Expense>(this.url+`/expenses/?api_key=${this.api}`, expense , this.httpOptions)
    .pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }

  updateExpense( expense: Expense, id) {
    expense.secret = "3f3d31e0-dee0-434d-9d8b-3aafa7ea3bcf";
    return this.http.put<Expense>(this.url+'/expenses/' + id +`?secret=${this.secret}&api_key=${this.api}`, expense, this.httpOptions)
    .pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    );
  }
  deleteData(expense){
    return this.http.delete(this.url+'/expenses/' + expense.id +`?secret=${this.secret}&api_key=${this.api}`);
  
}
}

