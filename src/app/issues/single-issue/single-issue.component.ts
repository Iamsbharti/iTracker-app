import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Issue } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-single-issue',
  templateUrl: './single-issue.component.html',
  styleUrls: ['./single-issue.component.css'],
})
export class SingleIssueComponent implements OnInit {
  @Input() issueDetails: Issue;

  constructor() {
    console.log('issuedetails from dashboard:', this.issueDetails);
  }

  ngOnInit(): void {}
}
