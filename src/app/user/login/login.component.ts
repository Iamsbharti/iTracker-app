import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginId: string;
  public password: string;
  public loginResponse: string;
  public responseType: boolean;
  private toastConfig = {
    timeOut: 1000,
  };
  constructor(
    private userService: UserService,
    private router: Router,
    private toaster: Toaster,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {}

  public loginUser(): any {
    const userData = {
      loginId: this.loginId,
      password: this.password,
    };

    this.userService.loginService(userData).subscribe(
      (response) => {
        console.log('login res:', response);
        this.loginResponse = `${response.message} --taking you to dashboard`;
        this.responseType = true;

        const { name, email, username, userId, authToken } = response.data;
        Cookie.set('name', name);
        Cookie.set('email', email);
        Cookie.set('username', username);
        Cookie.set('userId', userId);
        Cookie.set('authToken', authToken);

        this.userService.setUserAuth(response.data);

        //this.toaster.open({ text: response.message, type: 'success' });
        this.toast.success(`${response.message}`, 'Login', this.toastConfig);

        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },

      (error) => {
        console.warn('Error Login', error);
        this.loginResponse = error.error.message + '- Try Again';
        this.responseType = false;
        //this.toaster.open({ text: 'Login Error', type: 'danger' });
        this.toast.error('Login Error', 'Login', this.toastConfig);

        setTimeout(() => {
          (this.loginId = ''), (this.password = '');
          this.loginResponse = '';
        }, 3000);
      }
    );
  }

  public navigateToHome(): any {
    console.log('navigation');
    this.router.navigate(['/home']);
  }
}
