import { BrowserModule } from '@angular/platform-browser';
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
@NgModule({
  declarations: [AppComponent, HomeComponent, NotfoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    UserModule,
    MatButtonModule,
    MatIconModule,
    IssuesModule,
    ToastNotificationsModule.forRoot({
      duration: 3500,
      type: 'primary',
      autoClose: true,
      position: 'top-right',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
