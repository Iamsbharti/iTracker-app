import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from './user.service';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [CommonModule, MatButtonModule],
  providers: [UserService],
})
export class UserModule {}
