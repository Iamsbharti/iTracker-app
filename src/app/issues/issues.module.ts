import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class IssuesModule {}
