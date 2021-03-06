import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { observable, Observable, throwError } from 'rxjs';
import { UserService } from '../user/user.service';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  public httpHeaderOptions = {
    headers: new HttpHeaders({
      authToken: this.userService.getUserAuth().authToken,
    }),
  };
  // intiliaze
  // public baseUrl = 'http://localhost:3001/api/v1';
  // public socketUrl = 'http://localhost:3001/issue/notify';
  public baseUrl = 'http://api.itracker.kanbanboard.co.in/api/v1';
  public socketUrl = 'http://api.itracker.kanbanboard.co.in/issue/notify';

  private socket;
  constructor(private http: HttpClient, private userService: UserService) {
    // initialize socket client
    this.socket = io(this.socketUrl, {
      'auto connect': true,
      'max reconnection attempts': 10,
      multiplex: false,
      'try multiple transports': true,
    });
  }

  // handle exceptions
  public handleError(error: HttpErrorResponse): any {
    console.error('Http Error:', error.message);
    return throwError(error.message);
  }

  // get all issues for a id
  public getAllIssuesByIdService(userInfo): any {
    console.debug('Get All Issue Service', userInfo);
    const allIssuesRes = this.http.get(
      `${this.baseUrl}/issue/allIssues?userId=${userInfo.userId}`,
      this.httpHeaderOptions
    );
    return allIssuesRes;
  }

  // get allIssues in the system
  public getFilteredIssues(filterOptions): any {
    console.debug('filter issues in the system', filterOptions);
    const { userId, name, option, type } = filterOptions;
    const allIssues = this.http.get(
      `${this.baseUrl}/issue/filter?userId=${userId}&name=${name}&option=${option}&type=${type}`,
      this.httpHeaderOptions
    );
    return allIssues;
  }

  // get watchlist/assignee list
  public getAllUsers(authDetails): any {
    console.debug('Get all users service', authDetails);
    const { userId } = authDetails;
    const allUsers = this.http.get(
      `${this.baseUrl}/user/all?userId=${userId}`,
      this.httpHeaderOptions
    );
    return allUsers;
  }

  // create issue
  public createIssue(issueDetails): any {
    console.debug('Create issue service', issueDetails);
    const { userId } = issueDetails;
    const createdIssue = this.http.post(
      `${this.baseUrl}/issue/create?userId=${userId}`,
      issueDetails,
      this.httpHeaderOptions
    );
    return createdIssue;
  }
  // search Issue
  public searchIssues(searchDeatils): any {
    console.debug('Issue Search', searchDeatils);
    const { userId, search } = searchDeatils;
    const searchResults = this.http.get(
      `${this.baseUrl}/issue/search?userId=${userId}&search=${search}`,
      this.httpHeaderOptions
    );
    return searchResults;
  }
  // upload attachment
  public uploadAttachment(fileDetails): any {
    console.debug('Attachment upload:', fileDetails);
    const { userId, issueId, formData } = fileDetails;
    const uploadResults = this.http.post(
      `${this.baseUrl}/issue/upload?userId=${userId}&issueId=${issueId}`,
      formData,
      this.httpHeaderOptions
    );
    return uploadResults;
  }
  // update issue
  public updateIssue(issueDetails): any {
    console.debug('Update Issue:', issueDetails);
    const { userId } = issueDetails;
    const updatedIssues = this.http.post(
      `${this.baseUrl}/issue/update?userId=${userId}`,
      issueDetails,
      this.httpHeaderOptions
    );
    return updatedIssues;
  }
  // add comment
  public manageCommentService(commentDetails): any {
    console.debug('add comment:', commentDetails);
    const {
      userId,
      issueId,
      text,
      name,
      operation,
      commentId,
    } = commentDetails;
    let commentsOpsUrl = '';
    let body = {};
    if (operation === 'add') {
      commentsOpsUrl = `${this.baseUrl}/issue/comment?userId=${userId}&issueId=${issueId}&name=${name}`;
      body = { ...body, text };
    } else if (operation === 'edit') {
      commentsOpsUrl = `${this.baseUrl}/issue/edit/comment?userId=${userId}`;
      body = { ...body, text, commentId };
    } else if (operation === 'delete') {
      commentsOpsUrl = `${this.baseUrl}/issue/delete/comment?userId=${userId}&commentId=${commentId}`;
    }

    const commentActionResult = this.http.post(
      commentsOpsUrl,
      body,
      this.httpHeaderOptions
    );
    return commentActionResult;
  }
  public openImageService(imageDetails): any {
    const { userId, filename } = imageDetails;
    const img = this.http.get(
      `${this.baseUrl}/issue/attachment?userId=${userId}&filename=${filename}`,
      this.httpHeaderOptions
    );
    return img;
  }
  public deleteAttachmentService(fileDetails): any {
    const { filename, userId } = fileDetails;
    const deletedAttachment = this.http.delete(
      `${this.baseUrl}/issue/delete/attachment?userId=${userId}&filename=${filename}`,
      this.httpHeaderOptions
    );
    return deletedAttachment;
  }
  // socket emitters and listeners
  // listen to intiate authentication event
  public initSocketAuthentication = () => {
    console.debug('listen to init authentication');
    return new Observable((observer) => {
      this.socket.on('authenticate', (data) => {
        observer.next(data);
      });
    });
  };
  // emit authenticate user event
  public authenticateUser = (authDetails) => {
    console.debug('EMit Authenticate User Event', authDetails);
    this.socket.emit('auth', authDetails);
  };

  // listen to authenticated event
  public isUserSocketVerified = () => {
    console.debug('Auth Status Listener');
    return new Observable((observer) => {
      this.socket.on('authStatus', (data) => {
        observer.next(data);
      });
    });
  };

  // emit issue update event
  public notifyWatchListOnIssueUpdates = (issueDetails) => {
    console.debug('Emit issue update event:', issueDetails);
    this.socket.emit('issue-updates-client', issueDetails);
  };

  // listen to issue update event for notifying watchlist users
  public issueUpdatesForWatchListListener = () => {
    console.debug('issueupdates listener');
    return new Observable((observer) => {
      this.socket.on('issue-updates-server', (data) => {
        observer.next(data);
      });
    });
  };
}
