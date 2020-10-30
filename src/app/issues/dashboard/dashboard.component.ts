import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../issues.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Cookie } from 'ng2-cookies';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

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
  public allIssues: Array<any> = [];
  public backlogsIssues: Array<any>;
  public progressIssues: Array<any>;
  public testIssues: Array<any>;
  public doneIssues: Array<any>;

  // pagination inputs
  public pageSize: number;
  public length: number;
  public pageSizeOptions: number[];

  // pagination outputs
  public pageEvent: PageEvent;
  public datasource = [];
  public activePageDataChunks = [];

  // display content
  public showCategorizedIssues: boolean;
  public showFilteredIssues: boolean;
  public displayFilterType: string;
  public isIssueListEmpty: boolean;
  public emptyIssueMessage: string;
  //sort
  public sortedData = [];

  // create issue modal
  public closeResult: string;
  public dataSource = [];

  constructor(
    private issueService: IssuesService,
    private toaster: Toaster,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.userName = Cookie.get('username');
    this.userId = Cookie.get('userId');
    this.name = Cookie.get('name');
    this.pageSizeOptions = [5, 10];
    this.sortedData = this.activePageDataChunks.slice();

    if (
      this.userName == null ||
      this.userId == null ||
      this.userName === undefined ||
      this.userId === undefined
    ) {
      this.router.navigate(['/login']);
    }
  }
  // set page chunks
  public setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput
      .split(',')
      .map((str) => +str);
  }
  ngOnInit(): void {
    this.getAllIssues();
    this.showFilteredIssues = false;
  }
  // page event change
  public onPageChanged(e) {
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut + e.pageSize;
    this.activePageDataChunks = this.allIssues.slice(firstCut, secondCut);
  }
  // listener for new issue creates
  public updateNewIssue(values): any {
    console.debug('new issue from create-issue-compoennet', values);
    this.activePageDataChunks.push(values);
  }
  // logout user
  public logout(): any {
    console.log('logout clicks');
    // delete cookies
    Cookie.delete('name');
    Cookie.delete('email');
    Cookie.delete('username');
    Cookie.delete('userId');
    Cookie.delete('authToken');

    // delete localstorage
    localStorage.removeItem('userInfo');

    setTimeout(() => this.router.navigate(['/login']), 1200);
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
        console.log('All issues response');
        this.allIssues = response.data;

        if (response.status === 200) {
          // conditional render the issue table
          if (this.allIssues.length <= 0) {
            this.showCategorizedIssues = true;
            this.isIssueListEmpty = true;
            this.emptyIssueMessage = 'No Issues Found';
            this.displayFilterType = 'your assgined issues';
          } else {
            this.showCategorizedIssues = false;
            this.displayFilterType = 'your assgined issues';
          }

          // init pagination values
          this.pageSize = 5;
          this.length = this.allIssues.length;

          // chunks
          this.activePageDataChunks = this.allIssues.slice(0, this.pageSize);
          console.debug('active page chunks:', this.activePageDataChunks);

          // toast
          this.toaster.open({ text: 'Issues Fetched', type: 'success' });
        }
      },
      // error handler
      (error) => {
        console.warn('Error Login', error);
        this.toaster.open({ text: 'Something went wrong', type: 'danger' });
      }
    );
  }

  // filter issues based on conditions
  public filterIssues(userId, option, type, name): any {
    const filterOptions = {
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
          //clear any previous data
          this.allIssues = [];
          this.allIssues = response.data;
          // conditional render issue table
          if (this.allIssues.length <= 0) {
            this.showCategorizedIssues = true;
            this.emptyIssueMessage = 'No Issues Found';
            this.isIssueListEmpty = true;
          } else {
            // init pagination values
            this.pageSize = 5;
            this.length = this.allIssues.length;

            // chunks
            this.activePageDataChunks = this.allIssues.slice(0, this.pageSize);
            console.debug('active page chunks:', this.activePageDataChunks);

            this.toaster.open({ text: 'Filtered Issues', type: 'success' });
            // show categorized view and hide the filtered one
            this.showCategorizedIssues = false;
          }
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
    // console.debug('modal open::', ops, id);

    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-create',
        size: 'lg',
        scrollable: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed`;
        }
      );
    // console.debug('Modal closed::', this.closeResult);
  }

  // sort columns asending and decending
  public sortData(sort: Sort) {
    const data = this.activePageDataChunks.slice();
    if (!sort.active || sort.direction === '') {
      this.activePageDataChunks = data;
      return;
    }

    this.activePageDataChunks = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title':
          return compareIssues(a.title, b.title, isAsc);
        case 'reporter':
          return compareIssues(a.reporter, b.reporter, isAsc);
        case 'createDate':
          return compareIssues(a.createDate, b.createDate, isAsc);
        case 'status':
          return compareIssues(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
  }
}
function compareIssues(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
