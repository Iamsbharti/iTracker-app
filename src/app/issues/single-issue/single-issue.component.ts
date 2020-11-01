import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Issue } from '../dashboard/dashboard.component';
import { IssuesService } from '../issues.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-single-issue',
  templateUrl: './single-issue.component.html',
  styleUrls: ['./single-issue.component.css'],
})
export class SingleIssueComponent implements OnInit {
  @Input() issueDetails: Issue;

  // fields
  public showTitleInput: boolean;
  public showDescEditor: boolean;

  public updatedTitle: string;
  public editorDesc: string;

  constructor(private issueService: IssuesService, private toaster: Toaster) {
    this.showTitleInput = true;
    this.showDescEditor = true;
  }

  ngOnInit(): void {
    if (this.issueDetails) {
      console.log('UPDATING I?P FIELDS::', this.issueDetails);
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
    }
  }
  // capture the editor's content
  public onChange(event: any, field) {
    console.log(event.data);
    switch (field) {
      case 'title':
        this.updatedTitle = event.target.value;
        break;
      case 'desc':
        this.editorDesc = event.editor.getData();
        break;
    }
  }

  // update fields
  public updateField(field): any {
    console.log('updating field', field);
    let updateIssue = {
      userId: this.issueDetails.userId,
      issueId: this.issueDetails.issueId,
      updates: {},
    };
    switch (field) {
      case 'title':
        console.log('title updated,', this.updatedTitle);
        updateIssue = { ...updateIssue, updates: { title: this.updatedTitle } };
        // call update api
        this.updateFieldServiceCall(updateIssue, field);
        break;
      case 'desc':
        console.log('description updated', this.editorDesc);
        updateIssue = {
          ...updateIssue,
          updates: { description: this.editorDesc },
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
        console.log('update issue response:', response);
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
    console.log('updating current object');
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
  // upload attachments
  public handleUpload(value): any {
    console.log('handle upload', value.target.files);
    let data = new FormData();
    data.append('file', value.target.files[0]);
    const fileDetails = {
      //   userId: this.userId,
      // issueId: this.issueId,
    };
  }
}
