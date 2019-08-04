import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Login } from './login';
import { throwError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Authkey } from '../model/authkey';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  secret = Authkey.getSecret();
  api = Authkey.getAPI();

  users: Login[] = [];

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

//   private _refreshNeeded$ = new Subject<void>();

//   get refreshNeeded$() {
//    return this._refreshNeeded$;
//  }

  constructor(private http: HttpClient, private router: Router, private menuctrl: MenuController) { 
  }

  createPost(login) {
    console.log(login);
    // console.log(JSON.stringify(login));
    return this.http.post<Login>('http://itatonce.in:80/test/bizstore/api/users/login', JSON.stringify(login) )
    .pipe(
      catchError(this.handleError)
    );
  }

  getUser(post) {
    console.log(post);
    return this.http.get<Login>(`http://itatonce.in:80/test/bizstore/api/users/?id=${post.id}&secret=${this.secret}&api_key=${this.api}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
