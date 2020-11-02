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
  // get all issues for a id
  public getAllIssuesByIdService(userInfo): any {
    console.log('Get All Issue Service', userInfo);
    const allIssuesRes = this.http.get(
      `${this.baseUrl}/issue/allIssues?userId=${userInfo.userId}`,
      this.httpHeaderOptions
    );
    return allIssuesRes;
  }

  // get allIssues in the system
  public getFilteredIssues(filterOptions): any {
    console.log('filter issues in the system', filterOptions);
    const { userId, name, option, type } = filterOptions;
    const allIssues = this.http.get(
      `${this.baseUrl}/issue/filter?userId=${userId}&name=${name}&option=${option}&type=${type}`,
      this.httpHeaderOptions
    );
    return allIssues;
  }

  // get watchlist/assignee list
  public getAllUsers(authDetails): any {
    console.log('Get all users service', authDetails);
    const { userId } = authDetails;
    const allUsers = this.http.get(
      `${this.baseUrl}/user/all?userId=${userId}`,
      this.httpHeaderOptions
    );
    return allUsers;
  }

  // create issue
  public createIssue(issueDetails): any {
    console.log('Create issue service', issueDetails);
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
    console.log('Issue Search', searchDeatils);
    const { userId, search } = searchDeatils;
    const searchResults = this.http.get(
      `${this.baseUrl}/issue/search?userId=${userId}&search=${search}`,
      this.httpHeaderOptions
    );
    return searchResults;
  }
  // upload attachment
  public uploadAttachment(fileDetails): any {
    console.log('Attachment upload:', fileDetails);
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
    console.log('Update Issue:', issueDetails);
    const { userId } = issueDetails;
    const updatedIssues = this.http.put(
      `${this.baseUrl}/issue/update?userId=${userId}`,
      issueDetails,
      this.httpHeaderOptions
    );
    return updatedIssues;
  }
  // add comment
  public manageCommentService(commentDetails): any {
    console.log('add comment:', commentDetails);
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
      body = { ...body, text: text };
    } else if (operation === 'edit') {
      commentsOpsUrl = `${this.baseUrl}/issue/edit/comment?userId=${userId}`;
      body = { ...body, text: text, commentId: commentId };
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
}
