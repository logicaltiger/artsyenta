import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import './rxjs-extensions';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth.service';
import { DialogService } from './dialog.service';
import { GlobalsService } from './global/globals.service';
import { OptionService } from './global/option.service';
import { LoginComponent } from './login/login.component';
import { LoginRoutingModule } from './login/login-routing.module';
import { LoginService } from './login/login.service';
import { UserService } from './user/user.service';
import { SharedModule } from './shared.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    LoginRoutingModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 600 })
  ],
  declarations: [
    AppComponent,
    LoginComponent
  ],
  providers: [
    AuthService,
    DialogService,
    GlobalsService,
    LoginService,
    OptionService,
    UserService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
