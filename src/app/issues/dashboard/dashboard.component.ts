import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../issues.service';
import { UserService } from '../../user/user.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Cookie } from 'ng2-cookies';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // define fields
  public userName: string;
  public userId: string;
  public allIssues: Object[];
  public backlogsIssues: Object[];
  public progressIssues: Object[];
  public testIssues: Object[];
  public doneIssues: Object[];

  constructor(
    private issueService: IssuesService,
    private toaster: Toaster,
    private router: Router
  ) {
    this.userName = Cookie.get('username');
    this.userId = Cookie.get('userId');

    if (
      this.userName == null ||
      this.userId == null ||
      this.userName === undefined ||
      this.userId === undefined
    ) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.getAllIssues();
  }
  public getAllIssues(): any {
    console.log('get all issue api call');
    const userInfo = {
      userId: this.userId,
    };
    console.log(userInfo);
    this.issueService.getAllIssuesService(userInfo).subscribe(
      // success response
      (response) => {
        console.log('All issues response', response);
        this.allIssues = response.data;
        console.log('all issues:', this.allIssues);
        if (response.status === 200) {
          this.filterIssuesBasedOnStatus(this.allIssues);
          this.toaster.open({ text: 'Issues Fetched', type: 'success' });
        }
      },
      (error) => {
        console.warn('Error Login', error);
        this.toaster.open({ text: 'Something went wrong', type: 'danger' });
      }
    );
  }
  public filterIssuesBasedOnStatus(allIssues: Object[]) {
    this.backlogsIssues = this.allIssues.filter(
      (iss) => iss.status === 'backlog'
    );
    this.progressIssues = this.allIssues.filter(
      (iss) => iss.status === 'progress'
    );
    this.testIssues = this.allIssues.filter((iss) => iss.status === 'test');
    this.doneIssues = this.allIssues.filter((iss) => iss.status === 'done');

    console.log('backlog isssue,', this.backlogsIssues);
    console.log('progress isssue,', this.progressIssues);
    console.log('test isssue,', this.testIssues);
    console.log('done isssue,', this.doneIssues);
  }
}
