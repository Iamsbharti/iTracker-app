import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../issues.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Cookie } from 'ng2-cookies';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
    console.log('on page change event', e);
    let firstCut = e.pageIndex * e.pageSize;
    console.log(firstCut);
    let secondCut = firstCut + e.pageSize;
    console.log(secondCut);
    this.activePageDataChunks = this.allIssues.slice(firstCut, secondCut);
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
          // show categorized view and hide the filtered one
          this.showCategorizedIssues = false;

          // init pagination values

          this.pageSize = 5;
          this.length = this.allIssues.length;
          this.dataSource.push(this.allIssues);
          console.log('dataSource:', this.dataSource);
          // chunks
          this.activePageDataChunks = this.allIssues.slice(0, this.pageSize);
          console.log('active page chunks:', this.activePageDataChunks);

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
          //clear any previous data
          this.allIssues = [];
          this.allIssues = response.data;
          // splice to 8 items
          console.log(
            'size of allissues before splice,',
            this.allIssues.length
          );
          //this.allIssues = this.allIssues.splice(0, 8);

          // init pagination values
          this.pageSize = 5;

          // chunks
          this.activePageDataChunks = this.allIssues.slice(0, this.pageSize);
          console.log('active page chunks:', this.activePageDataChunks);

          this.toaster.open({ text: 'Filtered Issues', type: 'success' });
          // show categorized view and hide the filtered one
          this.showCategorizedIssues = false;
        }
      },
      // error
      (error) => {
        console.warn('Error Login', error);
        this.toaster.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
  // sort columns asending and decending
  public sortIssueColumn(sortingItem): any {
    console.log('sorting finction', sortingItem);
    this.allIssues = this.allIssues.sort((a, b) => {
      var nameA = a.status.toUpperCase(); // ignore upper and lowercase
      var nameB = b.status.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
    console.log(this.allIssues);
  }
  /**open modal */
  open(content) {
    //console.debug('modal open::', ops, id);

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
    //console.debug('Modal closed::', this.closeResult);
  }

  // listener for new created issue
  public updateIssueList(value): any {
    console.log('new issue from modal:', value);
    this.allIssues.push(value);
  }
}
