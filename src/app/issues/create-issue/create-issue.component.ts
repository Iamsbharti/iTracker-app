import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { IssuesService } from '../issues.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.css'],
})
export class CreateIssueComponent implements OnInit {
  // Input field
  @Input() userId: any;
  @Input() username: any;

  // component willemit
  @Output()
  closeModal: EventEmitter<String> = new EventEmitter<String>();
  @Output()
  newCreatedIssue: EventEmitter<String> = new EventEmitter<String>();

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
  public attachment: any;
  constructor(private issueService: IssuesService, private toaster: Toaster) {
    // init select type of fields
    this.statusOptions = ['Backlogs', 'Progress', 'Test', 'Done'];
    this.priorityOptions = ['High', 'Medium', 'Low'];
    //this.userId = Cookie.get('userId');
    console.log(this.userId);
  }

  ngOnInit(): void {
    this.fetchAllUsers();
  }

  public createIssue(): any {
    const newIssue = {
      userId: this.userId,
      title: this.title,
      description: this.description,
      status: this.status,
      reporter: this.reporter,
      priority: this.priority,
      estimates: this.originalEstimates,
      assignee: this.assignee,
    };
    console.log('Issue __ new:', newIssue);

    this.issueService.createIssue(newIssue).subscribe(
      (response) => {
        console.log('create issue response:', response);
        if (response.status === 200) {
          console.log('issue create success');
          this.toaster.open({ text: 'Issue Created', type: 'success' });
          this.closeModal.emit();
          this.newCreatedIssue.emit(response.data);
        }
      },
      (error) => {
        console.error('Error Creating Issue:', error);
        this.toaster.open({ text: error.error.message, type: 'danger' });
        this.closeModal.emit();
      }
    );
  }
  // fetch all users
  public fetchAllUsers(): any {
    console.log('user id from dashboard', this.userId, this.username);
    const authDetails = {
      userId: this.userId,
    };
    this.issueService.getAllUsers(authDetails).subscribe(
      // handle success response
      (response) => {
        if (response.status === 200) {
          this.assigneeOptions = response.data;
          this.watchList = response.data;
        }
        console.log(response.data);
      },
      // handle error response
      (error) => {
        console.log('Error fetching user details', error);
        this.toaster.open({ text: 'Something went wrong', type: 'danger' });
      }
    );
  }
}
