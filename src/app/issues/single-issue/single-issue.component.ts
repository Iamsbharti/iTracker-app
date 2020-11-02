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

  // fields updated values
  public updatedTitle: string;
  public editorDesc: string;
  public commentText: string;
  public commentsList: Array<any>;
  public name: string;
  public userId: string;
  public selectedComment: any;

  public attachment: any;
  public getImageUrl: string;
  public authToken: string;

  constructor(private issueService: IssuesService, private toaster: Toaster) {
    this.showTitleInput = true;
    this.showDescEditor = true;
    this.showCommentEditor = true;
    this.showCommentUpdateEditor = true;
    this.name = Cookie.get('name');
    this.userId = Cookie.get('userId');
    this.getImageUrl = 'http://localhost:3001/api/v1/issue/attachment?';
    this.authToken = Cookie.get('authToken');
  }

  ngOnInit(): void {
    if (this.issueDetails) {
      console.debug('UPDATING I?P FIELDS::', this.issueDetails);
      this.updatedTitle = this.issueDetails.title;
      this.editorDesc = this.issueDetails.description;
      this.commentsList = this.issueDetails.comments;
    }
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
    }
  }
  // capture the editor's content
  public onChange(event: any, field) {
    console.debug(event.data);
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
    }
  }

  // update fields
  public updateField(field, operation?): any {
    console.debug('updating field', field);
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
    }
  }
  private updateFieldServiceCall(
    updateIssue: {
      userId: string;
      issueId: string;
      updates: {};
    },
    field: string
  ) {
    this.issueService.updateIssue(updateIssue).subscribe(
      (response) => {
        console.debug('update issue response:', response);
        if (response.status === 200) {
          this.toaster.open({ text: 'Issue Updated', type: 'info' });
          // close the edit option
          this.showUpdateField(field);

          // update the current issue Object
          this.updateCurrentIssueObject(field, updateIssue);
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
    updateIssue: { userId: string; issueId: string; updates: any }
  ) {
    console.debug('updating current object');
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
