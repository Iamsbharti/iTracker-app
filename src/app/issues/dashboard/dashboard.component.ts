import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../issues.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Cookie } from 'ng2-cookies';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'ng-social-login-module';
export interface Issue {
  description?: string;
  createDate?: string;
  watchList?: Array<any>;
  comments?: Array<any>;
  attachment?: Array<any>;
  issueId: string;
  userId: string;
  title: string;
  status: string;
  reporter: string;
  priority: string;
  estimates: string;
  assignee: string;
  assigneeOptions: Array<any>;
  watchListOptions: Array<any>;
  assigneeName: string;
  isWatcher: boolean;
}
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
  public search: string;
  public allIssues: Array<any> = [];
  public backlogsIssues: Array<any>;
  public progressIssues: Array<any>;
  public testIssues: Array<any>;
  public doneIssues: Array<any>;
  public allAvailableIssues: Array<any>;
  public showProgressBar: boolean;
  // pagination inputs
  public pageSize: number;
  public length: number;
  public pageSizeOptions: number[];

  // pagination outputs
  public pageEvent: PageEvent;
  public datasource = [];
  public activePageDataChunks: Array<Issue> = [];

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

  // single issue fields
  public showSingleIssue = true;
  public issueDetails: Issue;
  public allUsersList: Array<any>;
  // issue interface

  //socket fields
  public authToken: string;

  // mobile view
  public showSidebarMenu: boolean;
  private toastConfig = {
    timeOut: 1000,
  };
  constructor(
    private issueService: IssuesService,
    private toaster: Toaster,
    private router: Router,
    private modalService: NgbModal,
    private toast: ToastrService,
    private authService: AuthService
  ) {
    this.userName = Cookie.get('username');
    this.userId = Cookie.get('userId');
    this.name = Cookie.get('name');
    this.authToken = Cookie.get('authToken');
    this.pageSizeOptions = [5, 10];
    this.sortedData = this.activePageDataChunks.slice();
    this.showProgressBar = true;
    this.showSidebarMenu = true;
    if (
      this.userName == null ||
      this.userId == null ||
      this.userName === undefined ||
      this.userId === undefined
    ) {
      this.router.navigate(['/login']);
      this.authToken = Cookie.get('authToken');
    }
  }
  // mobile implementation
  public toggleSideMenu(): any {
    this.showSidebarMenu = !this.showSidebarMenu;
  }
  // init socket auth
  public handShakeAuthentication(): any {
    this.issueService.initSocketAuthentication().subscribe((data) => {
      // emit authentication with authToken
      let authDetails = { userId: this.userId, authToken: this.authToken };
      this.issueService.authenticateUser(authDetails);
    });
    this.checkSocketStatus();
  }
  // auth status listener
  private checkSocketStatus() {
    console.log('Checking for auth--status');
    this.issueService.isUserSocketVerified().subscribe((data) => {
      //this.toaster.open({ text: data, type: 'info' });
      this.toast.success(`${data}`, 'Notification', this.toastConfig);
    });
    this.listenForAnyIssueUpdates();
  }
  // listen for any issue updates and notify to the users
  private listenForAnyIssueUpdates(): any {
    console.log('listen for any issue updates');
    this.issueService.issueUpdatesForWatchListListener().subscribe((data) => {
      const { issueId, field, message, watchList } = data;
      console.log('issue update listener:', data);
      if (watchList.includes(this.userId)) {
        // current user is in the watchlist ,show notification
        const notification = this.toast.info(`${message}`, 'Issue Updated');

        // observer function when notification is clicked - show the updated issueId
        notification.onTap.subscribe(() => {
          // fetch all the issues
          //this.filterIssues(this.userId, 'all', 'status', this.name);
          this.viewSingleIssue(issueId, 'notification');
        });
      }
    });
  }
  public getAllAvalableIssues(): any {
    const filterOptions = {
      name: this.name,
      userId: this.userId,
      option: 'all',
      type: 'status',
    };
    this.issueService.getFilteredIssues(filterOptions).subscribe(
      // success
      (response) => {
        if (response.status === 200) {
          //clear any previous data
          this.allAvailableIssues = response.data;
        }
      },

      // error
      (error) => {
        console.warn('Error Login', error);
        //this.toaster.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
  // set page chunks
  public setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput
      .split(',')
      .map((str) => +str);
  }
  ngOnInit(): void {
    this.getAllIssues();
    this.fetchAllUsers();
    this.showFilteredIssues = false;
    this.handShakeAuthentication();
    setTimeout(() => this.getAllAvalableIssues(), 1200);
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
    this.showProgressBar = false;
    console.log('show progress bar:', this.showProgressBar);
    // delete cookies
    Cookie.delete('name');
    Cookie.delete('email');
    Cookie.delete('username');
    Cookie.delete('userId');
    Cookie.delete('authToken');

    // delete localstorage
    localStorage.removeItem('userInfo');
    //this.signOut();

    setTimeout(() => this.router.navigate(['/login']), 1500);
    this.showProgressBar = true;
  }
  public signOut(): void {
    this.authService.signOut();
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
          this.showSingleIssue = true;
          if (this.allIssues.length <= 0) {
            this.showCategorizedIssues = true;
            this.isIssueListEmpty = true;
            this.emptyIssueMessage = 'No Issues Found';
            this.displayFilterType = 'your assgined issues';
          } else {
            this.showCategorizedIssues = false;
            this.displayFilterType = 'your assgined issues';
            this.isIssueListEmpty = false;
          }

          // init pagination values
          this.pageSize = 5;
          this.length = this.allIssues.length;

          // chunks
          this.activePageDataChunks = this.allIssues.slice(0, this.pageSize);
          console.debug('active page chunks:', this.activePageDataChunks);

          // toast
          //this.toaster.open({ text: 'Issues Fetched', type: 'success' });
          this.toast.success(`${response.message}`, 'Issue', this.toastConfig);
        }
      },
      // error handler
      (error) => {
        console.warn('Error Login', error);
        //this.toaster.open({ text: 'Something went wrong', type: 'danger' });
        this.toast.error('Something went wrong', 'Issue', this.toastConfig);
      }
    );
  }

  // filter issues based on conditions
  public filterIssues(userId, option, type, name, view?): any {
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
            console.log('active page chunks:', this.activePageDataChunks);

            //this.toaster.open({ text: 'Filtered Issues', type: 'success' });
            this.toast.success(
              `${response.message}`,
              'Filter Issue',
              this.toastConfig
            );
            // show categorized view and hide the filtered one
            this.showCategorizedIssues = false;
            this.showSingleIssue = true;
            this.isIssueListEmpty = false;
          }
          if (view === 'mobile') {
            this.showSidebarMenu = true;
          }
        }
      },
      // error
      (error) => {
        console.warn('Error Login', error);
        //this.toaster.open({ text: error.error.message, type: 'danger' });
        this.toast.success(
          `${error.error.message}`,
          'Filter Issue',
          this.toastConfig
        );
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
  // search issues
  public searchIssues(search: string): any {
    console.log('Seach issue service call', search);
    const searchDetails = {
      userId: this.userId,
      search: search,
    };
    this.issueService.searchIssues(searchDetails).subscribe(
      // success
      (response) => {
        console.log('Search issue response:', response);
        if (response.status === 200) {
          this.allIssues = response.data;

          // conditional render the issue table

          if (this.allIssues.length <= 0) {
            this.showCategorizedIssues = true;
            this.isIssueListEmpty = true;
            this.emptyIssueMessage = 'No Issues Found';
            this.displayFilterType = 'Search Results';
          } else {
            this.showCategorizedIssues = false;
            this.showSingleIssue = true;
            this.isIssueListEmpty = false;
            this.displayFilterType = 'Search Results';
          }

          // init pagination values
          this.pageSize = 5;
          this.length = this.allIssues.length;

          // chunks
          this.activePageDataChunks = this.allIssues.slice(0, this.pageSize);
          console.debug('active page chunks:', this.activePageDataChunks);

          //this.toaster.open({ text: 'Searched Issues', type: 'success' });
          this.toast.success(
            `${response.message}`,
            'Search Issue',
            this.toastConfig
          );
        }
      },
      // error
      (error) => {
        console.error('Error Fetching Issues', error);
        //this.toaster.open({ text: error.error.message, type: 'danger' });
        this.toast.success(
          `${error.error.message}`,
          'Search Issue',
          this.toastConfig
        );
      }
    );
  }
  // fetch all users
  public fetchAllUsers(): any {
    console.log('user id from dashboard-get allusers', this.userId);
    const authDetails = {
      userId: this.userId,
    };
    this.issueService.getAllUsers(authDetails).subscribe(
      // handle success response
      (response) => {
        if (response.status === 200) {
          this.allUsersList = response.data;
        }
      },
      // handle error response
      (error) => {
        console.log('Error fetching user details', error);
        //this.toaster.open({ text: 'Something went wrong', type: 'danger' });
        this.toast.success(
          'Something went wrong',
          'All Users',
          this.toastConfig
        );
      }
    );
  }
  // single issue view
  public viewSingleIssue(issueId, type?: string): any {
    console.log('View single Issue component', issueId);

    // find the single issue details
    if (type === 'notification') {
      console.log('type:-notification', this.allAvailableIssues);
      this.issueDetails = this.allAvailableIssues.find(
        (iss) => iss.issueId === issueId
      );
    } else {
      this.issueDetails = this.activePageDataChunks.find(
        (iss) => iss.issueId === issueId
      );
    }
    console.log('issueDetails', this.issueDetails);
    this.issueDetails.assigneeOptions = this.allUsersList;
    this.issueDetails.watchListOptions = this.allUsersList;
    console.log('issuedetails-modifying additional onbj', this.issueDetails);
    // update the assignee name
    let currentAssigneeObject = this.issueDetails.watchListOptions.find(
      (usr) => {
        return usr.userId == this.issueDetails.assignee;
      }
    );
    this.issueDetails.assigneeName = currentAssigneeObject.name;
    // filter unique values of watchers
    let uniqueWatchers = this.removeDuplicates(
      this.issueDetails.watchList,
      '_id'
    );
    console.log('uniquewatchlist', uniqueWatchers);
    this.issueDetails.watchList = uniqueWatchers;
    // compute isWatcher flag for current logged in user
    console.log(
      'computing isWatcher:',
      this.issueDetails.watchList,
      this.userId
    );
    let isWatcher = false;
    this.issueDetails.watchList.map((usr) => {
      if (usr.userId === this.userId) {
        isWatcher = true;
      }
    });
    this.issueDetails.isWatcher = isWatcher;

    // hide categorized table view
    this.showCategorizedIssues = true;
    this.showSingleIssue = false;

    console.log('Single Issue details', this.issueDetails);
    /*this.toaster.open({
      text: `openning ${this.issueDetails.title}`,
      type: 'dark',
    });*/
    this.toast.success(
      `openning ${this.issueDetails.title}`,
      'View Issue',
      this.toastConfig
    );
  }
  public removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }
}

function compareIssues(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
