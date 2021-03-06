import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SingleIssueComponent } from './single-issue/single-issue.component';
import { SaveCancelComponent } from './save-cancel/save-cancel.component';
import { ParseHtmlPipe } from './pipe/parse-html.pipe';
import { MatDividerModule } from '@angular/material/divider';
import { EditorComponent } from './editor/editor.component';
import { WatchersComponent } from './watchers/watchers.component';
import { RouterGuardService } from './router-guard.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    DashboardComponent,
    CreateIssueComponent,
    SingleIssueComponent,
    SaveCancelComponent,
    ParseHtmlPipe,
    EditorComponent,
    WatchersComponent,
  ],
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
    MatChipsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatProgressBarModule,
    RouterModule.forRoot([
      {
        path: 'dashboard',
        component: DashboardComponent,
        pathMatch: 'full',
        canActivate: [RouterGuardService],
      },
    ]),
  ],
  providers: [IssuesService, RouterGuardService],
  exports: [DashboardComponent],
})
export class IssuesModule {}
