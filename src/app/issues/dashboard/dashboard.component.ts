import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../issues.service';
import { UserService } from '../../user/user.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Cookie } from 'ng2-cookies';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // define fields
  public userName: string;
  public userId: string;
  public name: string;
  public allIssues: Array<any>;
  public backlogsIssues: Array<any>;
  public progressIssues: Array<any>;
  public testIssues: Array<any>;
  public doneIssues: Array<any>;

  // pagination
  public pageSize: number;

  // display content
  public showCategorizedIssues: boolean;
  public showFilteredIssues: boolean;
  public displayFilterType: string;

  // create issue modal
  public closeResult: string;
  constructor(
    private issueService: IssuesService,
    private toaster: Toaster,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.userName = Cookie.get('username');
    this.userId = Cookie.get('userId');
    this.name = Cookie.get('name');

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

    this.showFilteredIssues = false;
  }
  public getAllIssues(): any {
    console.log('get all issue api call');
    const userInfo = {
      userId: this.userId,
    };
    console.log(userInfo);
    this.issueService.getAllIssuesByIdService(userInfo).subscribe(
      // success response
      (response) => {
        console.log('All issues response', response);
        this.allIssues = response.data;
        console.log('all issues:', this.allIssues);
        if (response.status === 200) {
          this.filterIssuesBasedOnStatus(this.allIssues);
          this.toaster.open({ text: 'Issues Fetched', type: 'success' });
          // show categorized view and hide the filtered one
          this.showCategorizedIssues = false;
          this.showFilteredIssues = true;
        }
      },
      // error handler
      (error) => {
        console.warn('Error Login', error);
        this.toaster.open({ text: 'Something went wrong', type: 'danger' });
      }
    );
  }
  // filter issues based on status and allow only 3 in each category
  public filterIssuesBasedOnStatus(allIssues: Array<any>) {
    this.backlogsIssues = this.allIssues
      .filter((iss) => iss.status === 'backlog')
      .splice(0, 3);
    this.progressIssues = this.allIssues
      .filter((iss) => iss.status === 'progress')
      .splice(0, 3);
    this.testIssues = this.allIssues
      .filter((iss) => iss.status === 'test')
      .splice(0, 3);
    this.doneIssues = this.allIssues
      .filter((iss) => iss.status === 'done')
      .splice(0, 3);
  }

  // filter issues based on conditions
  public filterIssues(userId, option, type, name): any {
    let filterOptions = {
      userId,
      option,
      type,
      name,
    };
    console.log(filterOptions);
    switch (option) {
      case 'all':
        this.displayFilterType = 'All issues in the tracker';
        break;
      case 'reportedByMe':
        this.displayFilterType = 'issues reported by you';
        break;
      case 'openIssues':
        this.displayFilterType = 'your open issues';
        break;
      case 'closedIssues':
        this.displayFilterType = 'your resolved issues';
        break;
      case 'resolvedRecent':
        this.displayFilterType = 'recent resolved issues';
        break;
      case 'updatedRecent':
        this.displayFilterType = 'recent updated issues';
        break;
    }
    this.issueService.getFilteredIssues(filterOptions).subscribe(
      // success
      (response) => {
        if (response.status === 200) {
          this.allIssues = response.data;
          // splice to 8 items
          console.log(
            'size of allissues before splice,',
            this.allIssues.length
          );
          this.allIssues = this.allIssues.splice(0, 8);
          this.toaster.open({ text: 'Filtered Issues', type: 'success' });
          // show categorized view and hide the filtered one
          this.showCategorizedIssues = true;
          this.showFilteredIssues = false;
        }
      },
      // error
      (error) => {
        console.warn('Error Login', error);
        this.toaster.open({ text: error.error.message, type: 'danger' });
      }
    );
  }

  /**open modal */
  open(content) {
    //console.debug('modal open::', ops, id);

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-create' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed`;
        }
      );
    //console.debug('Modal closed::', this.closeResult);
  }
}
