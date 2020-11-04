import { Component, OnInit } from '@angular/core';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  LinkedinLoginProvider,
  SocialUser,
} from 'ng-social-login-module';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.css'],
})
export class SocialLoginComponent implements OnInit {
  constructor(private authService: AuthService) {}

  private user: SocialUser;
  private loggedIn: boolean;

  ngOnInit(): void {}

  public googleSignIn(): void {
    console.log('login with google');
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
      });
  }

  public linkedInSignIn(): void {
    console.log(LinkedinLoginProvider.PROVIDER_ID);
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

  public signOut(): void {
    this.authService.signOut();
  }

  public setUserInfo(): any {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
    });
  }
}
