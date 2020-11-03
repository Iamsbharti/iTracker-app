import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Issue } from '../dashboard/dashboard.component';
import { IssuesService } from '../issues.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-single-issue',
  templateUrl: './single-issue.component.html',
  styleUrls: ['./single-issue.component.css'],
})
export class SingleIssueComponent implements OnInit {
  @Input() issueDetails: Issue;

  // fields hide and show editor
  public showTitleInput: boolean;
  public showDescEditor: boolean;
  public showCommentEditor: boolean;
  public showCommentUpdateEditor: boolean;
  public showAssigneeList: boolean;
  public showUpdateWatchList: boolean;
  public showPriorityList: boolean;
  public showStatusList: boolean;

  // fields updated values
  public updatedTitle: string;
  public editorDesc: string;
  public commentText: string;
  public commentsList: Array<any>;
  public name: string;
  public userId: string;
  public selectedComment: any;
  public updatedWatchList: Array<any>;

  public attachment: any;
  public getImageUrl: string;
  public authToken: string;

  public statusOptions: Array<string>;
  public priorityOptions: Array<string>;
  public watchListOptions: Array<any>;
  public assigneeOptions: Array<any>;
  public currentAssignee: string;
  public currentPriority: string;
  public currentStatus: string;

  constructor(private issueService: IssuesService, private toaster: Toaster) {
    this.showTitleInput = true;
    this.showDescEditor = true;
    this.showCommentEditor = true;
    this.showCommentUpdateEditor = true;
    this.showAssigneeList = true;
    this.showUpdateWatchList = true;
    this.showPriorityList = true;
    this.showStatusList = true;
    this.name = Cookie.get('name');
    this.userId = Cookie.get('userId');
    this.getImageUrl = 'http://localhost:3001/api/v1/issue/attachment?';
    this.authToken = Cookie.get('authToken');

    this.statusOptions = ['Backlogs', 'Progress', 'Test', 'Done'];
    this.priorityOptions = ['High', 'Medium', 'Low'];
  }

  ngOnInit(): void {
    if (this.issueDetails) {
      console.debug('UPDATING I?P FIELDS::', this.issueDetails);
      this.updatedTitle = this.issueDetails.title;
      this.editorDesc = this.issueDetails.description;
      this.commentsList = this.issueDetails.comments;
    }
  }
  // fetch all users
  public fetchAllUsers(): any {
    console.log('user id from dashboard', this.userId);
    const authDetails = {
      userId: this.userId,
    };
    this.issueService.getAllUsers(authDetails).subscribe(
      // handle success response
      (response) => {
        if (response.status === 200) {
          this.assigneeOptions = response.data;
          this.watchListOptions = response.data;

          // update the assignee name
          const assigneeName = this.getAssigneeName(
            this.watchListOptions,
            this.issueDetails.assignee
          );
          this.issueDetails.assigneeName = assigneeName;
        }
      },
      // handle error response
      (error) => {
        console.log('Error fetching user details', error);
        this.toaster.open({ text: 'Something went wrong', type: 'danger' });
      }
    );
  }
  public getAssigneeName(userList, assigneeId): string {
    // update the assignee name
    console.log('get assignee name user list:', userList, assigneeId);
    const currentAssigneeObject = userList.find((usr) => {
      return usr.userId == assigneeId;
    });
    return currentAssigneeObject.name;
  }
  public getUsersObjectIds(userList): Array<any> {
    const objectIdList = userList.map((usr) => {
      return usr._id;
    });
    return objectIdList;
  }
  // hide and show update fields
  public showUpdateField(field, selectedObj?): any {
    console.log('hide/show update options', selectedObj);

    switch (field) {
      case 'title':
        this.showTitleInput = !this.showTitleInput;
        break;
      case 'desc':
        this.showDescEditor = !this.showDescEditor;
        break;
      case 'comment':
        this.showCommentEditor = !this.showCommentEditor;
        this.commentsList = this.issueDetails.comments;
        break;
      case 'edit-comment':
        this.showCommentUpdateEditor = !this.showCommentUpdateEditor;
        this.selectedComment = selectedObj;
        break;
      case 'assignee':
        this.showAssigneeList = !this.showAssigneeList;
        break;
      case 'watchlist':
        this.showUpdateWatchList = !this.showUpdateWatchList;
        break;
      case 'priority':
        this.showPriorityList = !this.showPriorityList;
        break;
      case 'status':
        this.showStatusList = !this.showStatusList;
        break;
    }
  }
  // capture the editor's content
  public onChange(event: any, field) {
    console.debug(event.data);
    console.log('event__change--watch,', event, field);
    switch (field) {
      case 'title':
        this.updatedTitle = event.target.value;
        break;
      case 'desc':
        this.editorDesc = event.editor.getData();
        break;
      case 'comment':
        this.commentText = event.editor.getData();
        break;
      case 'watchlist':
        this.updatedWatchList = event;
        break;
      case 'unwatchlist':
        this.updatedWatchList = event;
    }
  }

  // update fields
  public updateField(field, operation?): any {
    console.log('updating field', field);
    let updateIssue = {
      userId: this.userId,
      issueId: this.issueDetails.issueId,
      updates: {},
    };
    switch (field) {
      case 'title':
        console.debug('title updated,', this.updatedTitle);
        updateIssue = { ...updateIssue, updates: { title: this.updatedTitle } };
        // call update api
        this.updateFieldServiceCall(updateIssue, field);
        break;
      case 'desc':
        console.debug('description updated', this.editorDesc);
        updateIssue = {
          ...updateIssue,
          updates: {
            description:
              this.editorDesc === undefined
                ? this.issueDetails.description
                : this.editorDesc,
          },
        };
        // call update api
        this.updateFieldServiceCall(updateIssue, field);
        break;
      case 'assignee':
        console.log('updating assignee', this.currentAssignee);
        updateIssue = {
          ...updateIssue,
          updates: {
            assignee: this.currentAssignee,
          },
        };
        // call update api
        this.updateFieldServiceCall(updateIssue, field);
        break;
      case 'watchlist':
        console.log('updating watchlist', this.updatedWatchList);
        const updatedWatchListIds = this.getUsersObjectIds(
          this.updatedWatchList
        );
        console.log('watchlist ids to be updated', updatedWatchListIds);
        updateIssue = {
          ...updateIssue,
          updates: {
            operation: 'watch',
            watchList: updatedWatchListIds,
          },
        };
        // call update api
        this.updateFieldServiceCall(updateIssue, field);
        break;
      case 'watch':
        console.log('add current user to watchlist');

        const currentUserObject = this.getCurrentObjectId(
          this.issueDetails.watchListOptions
        );
        console.log('currentuserobjectid', currentUserObject);
        updateIssue = {
          ...updateIssue,
          updates: {
            watchList: currentUserObject._id,
            operation: 'watch',
          },
        };
        console.log('add to watch list:', updateIssue);
        // call update api
        this.updateFieldServiceCall(updateIssue, field, currentUserObject);
        break;
      case 'unwatch':
        console.log('remove current user to watchlist');
        const currentUserWatchObject = this.getCurrentObjectId(
          this.issueDetails.watchListOptions
        );
        console.log('currentuserobjectid', currentUserWatchObject);
        updateIssue = {
          ...updateIssue,
          updates: {
            watchList: currentUserWatchObject._id,
            operation: 'unwatch',
          },
        };
        console.log('add to watch list:', updateIssue);
        // call update api
        this.updateFieldServiceCall(updateIssue, field, currentUserWatchObject);
        break;
      case 'priority':
        console.log('updating priority', this.currentPriority);
        updateIssue = {
          ...updateIssue,
          updates: {
            priority: this.currentPriority,
          },
        };
        // call update api
        this.updateFieldServiceCall(updateIssue, field);
        break;
      case 'status':
        console.log('updating status', this.currentStatus);
        updateIssue = {
          ...updateIssue,
          updates: {
            status: this.currentStatus,
          },
        };
        // call update api
        this.updateFieldServiceCall(updateIssue, field);
        break;
    }
  }
  public getCurrentObjectId(watchListOptions: any[]) {
    const currentUserObject = watchListOptions.find((usr) => {
      if (usr.userId === this.userId) {
        return usr;
      }
    });
    return currentUserObject;
  }
  /**
   * These methods will add/ remove users in watchlist
   * as soon as they added as chips
   *
   */
  // add watchlist standalone rule
  public addWatchersId(toAddList): any {
    console.log('to add watchlist:', toAddList);
    const { _id } = toAddList;
    const updateIssue = {
      userId: this.userId,
      issueId: this.issueDetails.issueId,
      updates: {
        watchList: _id,
        operation: 'watch',
      },
    };
    // call update api
    this.updateFieldServiceCall(updateIssue, 'watch', toAddList);
  }
  // remove watchlist standalone rule
  public removeWatcherId(toRemoveList: any): any {
    console.log('to remove watchlist:', toRemoveList);
    const { _id } = toRemoveList;
    console.log(_id);
    const updateWatchList = {
      userId: this.userId,
      issueId: this.issueDetails.issueId,
      updates: {
        watchList: _id,
        operation: 'unwatch',
      },
    };
    console.log('updateissue:', updateWatchList);
    // call update api
    this.updateFieldServiceCall(updateWatchList, 'unwatch', toRemoveList);
  }
  private updateFieldServiceCall(
    updateIssue: {
      userId: string;
      issueId: string;
      updates: {};
    },
    field: string,
    currentObject?
  ) {
    console.log('update options body:', updateIssue);
    this.issueService.updateIssue(updateIssue).subscribe(
      (response) => {
        console.error('update issue response:', response);
        if (response.status === 200) {
          this.toaster.open({ text: 'Issue Updated', type: 'info' });
          // close the edit option
          this.showUpdateField(field);

          // update the current issue Object
          this.updateCurrentIssueObject(field, updateIssue, currentObject);
        }
      },
      (error) => {
        console.warn('Error Updating Issue:', error.error);
        this.toaster.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
  private updateCurrentIssueObject(
    field: string,
    updateIssue: { userId: string; issueId: string; updates: any },
    currentObject?
  ) {
    console.error('updating current object', updateIssue);
    switch (field) {
      case 'title':
        this.issueDetails = {
          ...this.issueDetails,
          title: updateIssue.updates.title,
        };
        break;
      case 'desc':
        this.issueDetails = {
          ...this.issueDetails,
          description: updateIssue.updates.description,
        };
        break;
      case 'assignee':
        // get name for assignee id
        const { assigneeOptions } = this.issueDetails;
        const assigneeName = this.getAssigneeName(
          assigneeOptions,
          this.currentAssignee
        );
        console.log('assigneename upating to ', assigneeName);
        this.issueDetails = {
          ...this.issueDetails,
          assigneeName: assigneeName,
        };
        break;
      case 'watchlist':
        console.log(
          ' upating current issue with new watchlist',
          this.issueDetails.watchList
        );
        this.issueDetails.watchList.push(this.updatedWatchList);
        console.log('after new watchlist added,', this.issueDetails.watchList);
        break;
      case 'watch':
        console.log('update currentuser as watchlist');
        this.issueDetails.watchList.push(currentObject);
        if (currentObject.userId === this.userId) {
          console.log('set iswatcher flag');
          this.issueDetails.isWatcher = true;
        }
        break;
      case 'unwatch':
        console.log('remove watcher', currentObject.userId);
        this.issueDetails.watchList = this.issueDetails.watchList.filter(
          (usr) => usr.userId !== currentObject.userId
        );
        if (currentObject.userId === this.userId) {
          console.log('set iswatcher flag');
          this.issueDetails.isWatcher = false;
        }
        console.log(
          'updated watchlist after removal',
          this.issueDetails.watchList
        );
        break;
      case 'priority':
        this.issueDetails = {
          ...this.issueDetails,
          priority: updateIssue.updates.priority,
        };
        break;
      case 'status':
        this.issueDetails = {
          ...this.issueDetails,
          status: updateIssue.updates.status,
        };
        break;
    }
  }

  // comments
  public handleComments(operation, selectedObj?): any {
    let commentDetails = {};
    switch (operation) {
      case 'add':
        commentDetails = {
          ...commentDetails,
          userId: this.userId,
          text: this.commentText,
          issueId: this.issueDetails.issueId,
          operation: 'add',
          name: this.name,
        };
        this.manageComments(commentDetails);
        this.showUpdateField('comment');
        break;
      case 'edit':
        commentDetails = {
          ...commentDetails,
          userId: this.userId,
          text: this.commentText,
          issueId: this.issueDetails.issueId,
          commentId: this.selectedComment.commentId,
          operation: 'edit',
        };
        this.manageComments(commentDetails);
        this.updateCurrentCommentObject(commentDetails);
        this.showUpdateField('edit-comment');
        break;
      case 'delete':
        commentDetails = {
          ...commentDetails,
          commentId: selectedObj.commentId,
          userId: this.userId,
          operation: 'delete',
        };
        this.manageComments(commentDetails);
        this.updateCurrentCommentObject(commentDetails);
        break;
    }
  }
  public manageComments(commentDetails): any {
    let { operation } = commentDetails;
    this.issueService.manageCommentService(commentDetails).subscribe(
      (response) => {
        console.log('add comment res:', response);
        if (response.status === 200) {
          this.toaster.open({ text: response.message, type: 'secondary' });

          console.log('created/new comments to be updated', response.data);
          if (operation === 'add') {
            this.updateCurrentCommentObject({ ...response.data, operation });
          }
        }
      },
      (error) => {
        console.warn('Error adding comment', error);
        this.toaster.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
  public updateCurrentCommentObject(newCommentObject): any {
    console.log('update current comment object', newCommentObject);
    const { operation, userId, commentId, text } = newCommentObject;
    switch (operation) {
      case 'add':
        // add whole object to cuurent issues's comments's array
        this.issueDetails.comments.push(newCommentObject);
        this.selectedComment = this.issueDetails.comments;
        break;
      case 'edit':
        // find the current issue's commentsid and update the text
        this.issueDetails.comments = this.issueDetails.comments.map((iss) =>
          iss.commentId === commentId ? { ...iss, text: text } : iss
        );
        console.log('new cooments list:', this.issueDetails.comments);
        break;
      case 'delete':
        // filter out the current comment id object
        this.issueDetails.comments = this.issueDetails.comments.filter(
          (iss) => iss.commentId !== commentId
        );
        break;
    }
  }
  // upload attachments
  public handleUpload(value): any {
    console.debug('handle upload', value.target.files);
    let data = new FormData();
    data.append('file', value.target.files[0]);
    const fileDetails = {
      userId: this.userId,
      issueId: this.issueDetails.issueId,
      formData: data,
    };
    this.issueService.uploadAttachment(fileDetails).subscribe(
      (response) => {
        console.log('upload response:', response);
        if (response.status === 200) {
          this.toaster.open({ text: response.message, type: 'success' });
          // update the current arrachment array of the issue
          this.issueDetails.attachment.push(response.data);
        }
      },
      (error) => {
        console.warn('Upload Error:', error);
        this.toaster.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
  public openImage(filename): any {
    let fileDetails = {
      userId: this.userId,
      filename: filename,
    };
    this.issueService.openImageService(fileDetails).subscribe(
      (response) => {
        if (response) {
          return response;
        }
      },
      (error) => {
        console.log('Error Fecthing image', error);
        this.toaster.open({ text: 'Something went Wrong', type: 'danger' });
      }
    );
  }
  public deleteAttachment(filename): any {
    const fileDetails = {
      userId: this.userId,
      filename: filename,
    };
    this.issueService.deleteAttachmentService(fileDetails).subscribe(
      (response) => {
        console.log('Delete Attachment Response:', response);
        if (response.status === 200) {
          this.toaster.open({ text: response.message, type: 'success' });
          // filter the current attachment array
          this.issueDetails.attachment = this.issueDetails.attachment.filter(
            (iss) => iss.filename !== filename
          );
        }
      },
      (error) => {
        console.log('Error Deleting image', error);
        this.toaster.open({ text: 'Something went Wrong', type: 'danger' });
      }
    );
  }
}
