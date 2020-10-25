import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  /**define fields */
  public name: String;
  public email: String;
  public username: String;
  public password: String;
  public cfnPassword: String;
  public equalPwd: Boolean = false;
  public acceptedPwd: Boolean = false;
  public signUpResponse: String;
  public passwordError: String;
  public responseType: Boolean;
  constructor(
    private userService: UserService,
    private _router: Router,
    private toaster: Toaster
  ) {
    this.passwordError = `Password should have at least 1 Lowercase,Uppercase,Special
    Character & of min length 8 `;
  }

  ngOnInit(): void {}

  //register user
  public registerUser(): any {
    const userData = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password,
    };
    this.userService.signUpService(userData).subscribe(
      (response) => {
        console.log('register user', userData);
        if (response.status === 200) {
          this.responseType = true;
        }
        this.signUpResponse = response.message + 'Redirecting to Login page';
        this.toaster.open({ text: 'SignUp Succes', type: 'success' });

        /**redirect to login page */
        setTimeout(() => this._router.navigate(['/login']), 2000);
      },
      (error) => {
        console.warn('Error Login', error);
        this.signUpResponse = error.error.message + '- Try Again';
        this.responseType = false;
        this.toaster.open({ text: 'SignUp Error', type: 'danger' });
        /**clear input field */
        setTimeout(() => {
          this.name = '';
          this.password = '';
          this.username = '';
          this.password = '';
          this.cfnPassword = '';
          this.signUpResponse = '';
        }, 3000);
      }
    );
  }
  /**compare password */
  public comparePassword(): Boolean {
    this.equalPwd = this.password === this.cfnPassword;
    return this.equalPwd;
  }
  public validatePassword(): Boolean {
    let pattern = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    );
    if (this.password === undefined) return true;
    this.acceptedPwd = pattern.test(this.password.toString());
    return this.acceptedPwd;
  }
  //naviagation
  public navigateToHome(): any {
    console.log('navigation');
    this._router.navigate(['/home']);
  }
}
