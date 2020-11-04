import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from './user.service';
import { MatButtonModule } from '@angular/material/button';
import { SocialLoginComponent } from './social-login/social-login.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, SocialLoginComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
  ],
  providers: [UserService],
})
export class UserModule {}
