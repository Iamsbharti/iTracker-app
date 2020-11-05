import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  LinkedinLoginProvider,
  SocialUser,
} from 'ng-social-login-module';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.css'],
})
export class SocialLoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toast: ToastrService
  ) {}

  private user: SocialUser;
  private loggedIn: boolean;
  public responseMsg: string;
  public responseType: boolean;

  private toastConfig = {
    timeOut: 1200,
  };
  @Output()
  loginRes: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {}

  public googleSignIn(): void {
    console.log('login with google');
    this.toast.info(
      'Please user different login methods- ClientId Error- OAuth Rejected',
      'Google Login',
      { timeOut: 22000 }
    );
    this.authService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((userdata) => {
        this.user = userdata;
        console.log('userdata-google', userdata);
      })
      .catch((error) => {
        console.log('google login error', error);
      });
  }

  public fbSignIn(): void {
    this.authService
      .signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((userdata) => {
        this.user = userdata;
        console.log('userdata -fb', userdata);
        this.setUserInfo();
      });
  }

  public linkedInSignIn(): void {
    console.log(LinkedinLoginProvider.PROVIDER_ID);
    this.toast.info(
      'Please user different login methods- OAuth Rejected by linkedin',
      'LinkenId Login',
      { timeOut: 22000 }
    );
    this.authService
      .signIn(LinkedinLoginProvider.PROVIDER_ID)
      .then((userdata) => {
        this.user = userdata;
        console.log('userdata -linked ini', userdata);
      })
      .catch((error) => {
        console.log('google login error', error);
      });
  }

  public setUserInfo(): any {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
    });
    // save user info to db
    // check email id in db , if not present trigger signup ,route to dashboard
    // if present route to dashboard
    const { email, name } = this.user;
    let userDetails = {
      email: email,
      name: name,
    };
    this.userService.verifySocialLoginService(userDetails).subscribe(
      (response) => {
        console.log('login res:', response);
        this.responseMsg = `${response.message} --taking you to dashboard`;
        this.responseType = true;

        const { name, email, username, userId, authToken } = response.data;
        Cookie.set('name', name);
        Cookie.set('email', email);
        Cookie.set('username', username);
        Cookie.set('userId', userId);
        Cookie.set('authToken', authToken);

        this.userService.setUserAuth(response.data);

        this.toast.success('Login Sucess', 'Login', this.toastConfig);
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      (error) => {
        console.warn('Error Login', error);
        this.responseMsg = error.error.message + '- Try Again';
        this.responseType = false;
        this.toast.error('Login Error', 'Login', this.toastConfig);
      }
    );
  }
}
