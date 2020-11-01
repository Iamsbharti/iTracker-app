import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Issue } from '../dashboard/dashboard.component';
import { IssuesService } from '../issues.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Cookie } from 'ng2-cookies';
import { runInThisContext } from 'vm';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';

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

  // fields updated values
  public updatedTitle: string;
  public editorDesc: string;
  public commentText: string;
  public commentsList: Array<any>;
  public name: string;
  public userId: string;

  constructor(private issueService: IssuesService, private toaster: Toaster) {
    this.showTitleInput = true;
    this.showDescEditor = true;
    this.showCommentEditor = true;

    this.name = Cookie.get('name');
    this.userId = Cookie.get('userId');
  }

  ngOnInit(): void {
    if (this.issueDetails) {
      console.debug('UPDATING I?P FIELDS::', this.issueDetails);
      this.updatedTitle = this.issueDetails.title;
      this.editorDesc = this.issueDetails.description;
    }
  }
  // hide and show update fields
  public showUpdateField(field): any {
    console.log('hide/show update options');

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
  public handleComments(operation): any {
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
        break;
    }
    this.showUpdateField('comment');
  }
  public manageComments(commentDetails): any {
    this.issueService.addComment(commentDetails).subscribe(
      (response) => {
        console.log('add comment res:', response);
        if (response.status === 200) {
          this.toaster.open({ text: response.message, type: 'secondary' });
        }
      },
      (error) => {
        console.warn('Error adding comment', error);
        this.toaster.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
  // upload attachments
  public handleUpload(value): any {
    console.debug('handle upload', value.target.files);
    let data = new FormData();
    data.append('file', value.target.files[0]);
    const fileDetails = {
      //   userId: this.userId,
      // issueId: this.issueId,
    };
  }
}
