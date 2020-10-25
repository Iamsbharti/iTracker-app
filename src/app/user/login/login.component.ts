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
  constructor(
    private userService: UserService,
    private _router: Router,
    private toaster: Toaster
  ) {}

  ngOnInit(): void {}

  //login
  public loginUser(): any {
    let userData = {
      loginId: this.loginId,
      password: this.password,
    };
  }

  //naviagation
  public navigateToHome(): any {
    console.log('navigation');
    this._router.navigate(['/home']);
  }
}
