import { BrowserModule } from '@angular/platform-browser';
import '@angular/compiler';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastNotificationsModule } from 'ngx-toast-notifications';
import { UserModule } from './user/user.module';
import { IssuesModule } from './issues/issues.module';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ToastrModule } from 'ngx-toastr';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
  LinkedinLoginProvider,
} from 'ng-social-login-module';

const CONFIG = new AuthServiceConfig(
  [
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        '895741338792-t2t3ndlqu4p11qr6tv7b536dgbfve46g.apps.googleusercontent.com'
      ),
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider('2442783682683614'),
    },
    {
      id: LinkedinLoginProvider.PROVIDER_ID,
      provider: new LinkedinLoginProvider('86p5fb7z33c0xy'),
    },
  ],
  true
);

export function provideConfig(): any {
  return CONFIG;
}

@NgModule({
  declarations: [AppComponent, HomeComponent, NotfoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    UserModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    IssuesModule,
    NgbModule,
    MatTableModule,
    MatInputModule,
    CKEditorModule,
    MatSortModule,
    MatChipsModule,
    MatAutocompleteModule,
    ToastNotificationsModule.forRoot({
      duration: 1200,
      type: 'primary',
      autoClose: true,
      position: 'top-right',
    }),
    ToastrModule.forRoot({
      timeOut: 20000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    SocialLoginModule,
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
