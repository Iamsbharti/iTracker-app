import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginId: String;
  public password: String;
  public loginResponse: String;
  public responseType: Boolean;
  public showBar: Boolean = true;
  constructor(
    private userService: UserService,
    private _router: Router,
    private toaster: Toaster
  ) {}

  ngOnInit(): void {}

  //login
  public loginUser(): any {
    const userData = {
      loginId: this.loginId,
      password: this.password,
    };

    this.userService.loginService(userData).subscribe(
      /**sucess */
      (response) => {
        this.showBar = false;
        console.log('login res:', response);
        this.loginResponse = `${response.message} --taking you to dashboard`;
        this.responseType = true;
        this.showBar = true;
        /**store userinfo for further authorizartion purpose */
        const { name, email, username, userId, authToken } = response.data;
        Cookie.set('name', name);
        Cookie.set('email', email);
        Cookie.set('username', username);
        Cookie.set('userId', userId);
        Cookie.set('authToken', authToken);

        /**set to localstorage */
        this.userService.setUserAuth(response.data);

        /**toast sucess */
        this.toaster.open({ text: response.message, type: 'success' });

        /**Redirect to Personalized Dashboard view */
        setTimeout(() => this._router.navigate(['/dashboard']), 2000);
      },
      /**error */
      (error) => {
        console.warn('Error Login', error);
        this.loginResponse = error.error.message + '- Try Again';
        this.responseType = false;
        this.toaster.open({ text: 'Login Error', type: 'danger' });
        /**clear input field */
        setTimeout(() => {
          (this.loginId = ''), (this.password = '');
          this.loginResponse = '';
        }, 3000);
      }
    );
  }

  //naviagation
  public navigateToHome(): any {
    console.log('navigation');
    this._router.navigate(['/home']);
  }
}
