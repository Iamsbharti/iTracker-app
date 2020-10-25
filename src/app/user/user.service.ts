import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  //initialize
  public baseUrl = 'http://localhost:3001/api/v1';
  constructor(private _http: HttpClient) {}

  //handle exceptions
  public handleError(error: HttpErrorResponse) {
    console.error('Http Error:', error.message);
    return Observable.throw(error.message);
  }

  //user registration service
  public signUpService(newUser): any {
    console.log('Signup service apicall', newUser);
    let signUpRes = this._http.post(`${this.baseUrl}/user/register`, newUser);
    return signUpRes;
  }

  //login service
  public loginService(userData): any {
    console.log('Login api call', userData);
    let loginRes = this._http.post(`${this.baseUrl}/user/login`, userData);
    return loginRes;
  }

  //store authenticated user info
  public setUserAuth(data): any {
    console.log('Set user auth data', data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  //get auth info
  public getUserAuth(): any {
    console.log('get user auth');
    let authInfo = JSON.parse(localStorage.getItem('userInfo'));
    return authInfo === null ? '' : authInfo;
  }
}
