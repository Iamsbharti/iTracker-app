import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Issue } from '../dashboard/dashboard.component';

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
  constructor() {
    console.log('issuedetails from dashboard:', this.issueDetails);
    this.showTitleInput = true;
    this.showDescEditor = true;
  }

  ngOnInit(): void {}
  // hide and show update fields
  public showUpdateField(field): any {
    switch (field) {
      case 'title':
        this.showTitleInput = false;
        break;
      case 'desc':
        this.showDescEditor = false;
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
