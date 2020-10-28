import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { IssuesService } from '../issues.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.css'],
})
export class CreateIssueComponent implements OnInit {
  // Input field
  @Input() userId: string;

  public title: string;
  public reporter: string;
  public statusOptions: Array<any>;
  public status: string;
  public description: string;
  public watchList: Array<any>;
  public priorityOptions: Array<any>;
  public priority: string;
  public originalEstimates: string;
  public assigneeOptions: Array<any>;
  public assignee: string;

  constructor() {}

  ngOnInit(): void {}
}
