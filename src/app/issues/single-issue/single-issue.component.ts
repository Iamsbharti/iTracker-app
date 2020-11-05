import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Issue } from '../dashboard/dashboard.component';
import { IssuesService } from '../issues.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';
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

  private toastConfig = {
    timeOut: 1000,
  };

  constructor(
    private issueService: IssuesService,
    private toaster: Toaster,
    private toast: ToastrService
  ) {
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
      console.error('UPDATING I?P FIELDS::', this.issueDetails);
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
      return usr.userId === assigneeId;
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
  public onChange(event: any, field): any {
    console.error(event.data);
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
        console.error('title updated,', this.updatedTitle);
        updateIssue = { ...updateIssue, updates: { title: this.updatedTitle } };
        // call update api
        this.updateFieldServiceCall(updateIssue, field);
        break;
      case 'desc':
        console.error('description updated', this.editorDesc);
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

        const currentUserObject: any = this.getCurrentObjectId(
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
        const currentUserWatchObject: any = this.getCurrentObjectId(
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
  public getCurrentObjectId(watchListOptions: any[]): object {
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
  ): any {
    console.log('update options body:', updateIssue);
    this.issueService.updateIssue(updateIssue).subscribe(
      (response) => {
        console.error('update issue response:', response);
        if (response.status === 200) {
          // this.toaster.open({ text: 'Issue Updated', type: 'info' });
          const toasterObj = this.toast.success(
            `${field} updated`,
            'Issue Updated'
          );
          toasterObj.onTap.subscribe(() => {
            this.toaster.open({ text: 'Issue Updated', type: 'info' });
          });
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
  ): any {
    console.error('updating current object', updateIssue);
    let message = ''; // for socket notification
    switch (field) {
      case 'title':
        this.issueDetails = {
          ...this.issueDetails,
          title: updateIssue.updates.title,
        };
        message = `${this.name} updated title to ${this.issueDetails.title}`;
        // emit update event
        this.emitIssueUpdateEvent(updateIssue, field, message);
        break;
      case 'desc':
        this.issueDetails = {
          ...this.issueDetails,
          description: updateIssue.updates.description,
        };
        message = `${this.name} added description`;
        // emit update event
        this.emitIssueUpdateEvent(updateIssue, field, message);
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
          assigneeName,
        };
        message = `${this.name} changed assignee to ${assigneeName}`;
        // emit update event
        this.emitIssueUpdateEvent(updateIssue, field, message);
        break;
      case 'watchlist':
        console.log(
          ' upating current issue with new watchlist',
          this.issueDetails.watchList
        );
        this.issueDetails.watchList.push(this.updatedWatchList);
        console.log('after new watchlist added,', this.issueDetails.watchList);
        message = `${this.name} updated watchlist`;
        // emit update event
        this.emitIssueUpdateEvent(updateIssue, field, message);
        break;
      case 'watch':
        console.log('update currentuser as watchlist');
        this.issueDetails.watchList.push(currentObject);
        if (currentObject.userId === this.userId) {
          console.log('set iswatcher flag');
          this.issueDetails.isWatcher = true;
        }
        message = `${this.name} updated watchlist`;
        // emit update event
        this.emitIssueUpdateEvent(updateIssue, field, message);
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
        message = `${this.name} updated watchlist`;
        // emit update event
        this.emitIssueUpdateEvent(updateIssue, field, message);
        break;
      case 'priority':
        this.issueDetails = {
          ...this.issueDetails,
          priority: updateIssue.updates.priority,
        };
        message = `${this.name} updated priority to ${this.issueDetails.status}`;
        // emit update event
        this.emitIssueUpdateEvent(updateIssue, field, message);
        break;
      case 'status':
        this.issueDetails = {
          ...this.issueDetails,
          status: updateIssue.updates.status,
        };
        message = `${this.name} updated status to ${this.issueDetails.status}`;
        // emit update event
        this.emitIssueUpdateEvent(updateIssue, field, message);
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
    const { operation } = commentDetails;
    this.issueService.manageCommentService(commentDetails).subscribe(
      (response) => {
        console.log('add comment res:', response);
        if (response.status === 200) {
          // this.toaster.open({ text: response.message, type: 'secondary' });
          this.toast.success(
            `${response.message}`,
            'Comments',
            this.toastConfig
          );
          console.log('created/new comments to be updated', response.data);
          if (operation === 'add') {
            this.updateCurrentCommentObject({ ...response.data, operation });
          }
        }
      },
      (error) => {
        console.warn('Error adding comment', error);
        // this.toaster.open({ text: error.error.message, type: 'danger' });
        this.toast.error(
          `${error.error.message}`,
          'Comments',
          this.toastConfig
        );
      }
    );
  }
  public updateCurrentCommentObject(newCommentObject): any {
    console.log('update current comment object', newCommentObject);
    const { operation, userId, commentId, text } = newCommentObject;
    let message = '';
    switch (operation) {
      case 'add':
        // add whole object to cuurent issues's comments's array
        this.issueDetails.comments.push(newCommentObject);
        this.selectedComment = this.issueDetails.comments;
        message = `${this.name} commented on a issue`;
        this.emitIssueUpdateEvent(
          {
            ...newCommentObject,
            issueId: this.issueDetails.issueId,
          },
          'comment',
          message
        );
        break;
      case 'edit':
        // find the current issue's commentsid and update the text
        this.issueDetails.comments = this.issueDetails.comments.map((iss) =>
          iss.commentId === commentId ? { ...iss, text } : iss
        );
        console.log('new comments list:', this.issueDetails.comments);
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
    console.error('handle upload', value.target.files);
    const data = new FormData();
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
          // this.toaster.open({ text: response.message, type: 'success' });
          this.toast.success(
            `${response.message}`,
            'Attachment',
            this.toastConfig
          );
          // update the current arrachment array of the issue
          this.issueDetails.attachment.push(response.data);
        }
      },
      (error) => {
        console.warn('Upload Error:', error);
        // this.toaster.open({ text: error.error.message, type: 'danger' });
        this.toast.success(
          `${error.error.message}`,
          'Attachment',
          this.toastConfig
        );
      }
    );
  }

  // opens image in new tab when clicked on
  public openImage(filename): any {
    const fileDetails = {
      userId: this.userId,
      filename,
    };
    this.issueService.openImageService(fileDetails).subscribe(
      (response) => {
        if (response) {
          return response;
        }
      },
      (error) => {
        console.log('Error Fecthing image', error);
        // this.toaster.open({ text: 'Something went Wrong', type: 'danger' });
        this.toast.success(
          `${error.error.message}`,
          'Image View',
          this.toastConfig
        );
      }
    );
  }
  // handles delete attachment function
  public deleteAttachment(filename): any {
    const fileDetails = {
      userId: this.userId,
      filename,
    };
    this.issueService.deleteAttachmentService(fileDetails).subscribe(
      (response) => {
        console.log('Delete Attachment Response:', response);
        if (response.status === 200) {
          // this.toaster.open({ text: response.message, type: 'success' });
          this.toast.success(
            `${response.message}`,
            'Attachment',
            this.toastConfig
          );
          // filter the current attachment array
          this.issueDetails.attachment = this.issueDetails.attachment.filter(
            (iss) => iss.filename !== filename
          );
        }
      },
      (error) => {
        console.log('Error Deleting image', error);
        // this.toaster.open({ text: 'Something went Wrong', type: 'danger' });
        this.toast.success(
          'Something went Wrong',
          'Attachment',
          this.toastConfig
        );
      }
    );
  }
  // emitt event on issueUpdate for notification to watchlists
  public emitIssueUpdateEvent(
    upadtedIssueDetails: any,
    field: string,
    message: string
  ): any {
    // get watchlist userids
    const watchListUsersIds = this.issueDetails.watchList.map((usr) => {
      return usr.userId;
    });
    console.log('watchlist with userids', watchListUsersIds);

    upadtedIssueDetails = {
      ...upadtedIssueDetails,
      field,
      message,
      watchList: watchListUsersIds.filter((ids) => ids !== this.userId),
    };

    console.log('emit event from client::issuedetails', upadtedIssueDetails);
    this.issueService.notifyWatchListOnIssueUpdates(upadtedIssueDetails);
  }
}
