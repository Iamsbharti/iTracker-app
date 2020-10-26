import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserService } from '../user/user.service';
@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  // intiliaze
  public baseUrl = 'http://localhost:3001/api/v1';
  constructor(private http: HttpClient, private userService: UserService) {}

  // handle exceptions
  public handleError(error: HttpErrorResponse): any {
    console.error('Http Error:', error.message);
    return throwError(error.message);
  }
  public httpHeaderOptions = {
    headers: new HttpHeaders({
      authToken: this.userService.getUserAuth().authToken,
    }),
  };
  // get all issues
  public getAllIssuesService(userInfo): any {
    console.log('Get All Issue Service', userInfo);
    const allIssuesRes = this.http.get(
      `${this.baseUrl}/issue/allIssues?userId=${userInfo.userId}`,
      this.httpHeaderOptions
    );
    return allIssuesRes;
  }
}
