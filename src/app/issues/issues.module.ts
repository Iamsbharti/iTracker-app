import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { IssuesService } from './issues.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateIssueComponent } from './create-issue/create-issue.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatSortModule } from '@angular/material/sort';
@NgModule({
  declarations: [DashboardComponent, CreateIssueComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    NgbModule,
    MatTableModule,
    MatInputModule,
    CKEditorModule,
    MatSortModule,
  ],
  providers: [IssuesService],
})
export class IssuesModule {}
