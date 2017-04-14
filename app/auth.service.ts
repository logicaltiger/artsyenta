import { Injectable } from '@angular/core';

import { Credential } from './login/credential';
import { LoginService } from './login/login.service';
import { Org } from './org/org';
import { User } from './user/user';
import { UserService } from './user/user.service';

@Injectable()
export class AuthService {
  public static HOME_ADMIN: string = "/admin";
  public static HOME_PROVIDER: string = "/provider";
  public static HOME_SERVICE: string = "/service";

  /*
    The callback tells the service caller what is happening.
    Using defaultCallback prevents program error when the callback wasn't initialized.

    How to handle the default offer will be settled when that is implemented.
  */  
  private loginCallback: Function = this.defaultCallback;
  private user: User = null;
  private defaultOfferId: number = -1;

  /*
    Store the URL so we can redirect after logging in.
    For an example, see auth-provider-guard.service.
  */
  private redirectUrl: string = null;

  constructor(private loginService: LoginService, private userService: UserService) { }

  public login(cred: Credential): void {
    this.user = null;
    let that = this;
    this.loginService
      .login(cred)
      .subscribe(
        id => { 

          if(id == -1) {
            that.logMessage("Invalid Name or Password");
            return;
          }

          that.loginSuccessHandler(id);
        },
        error => { that.logMessage(error) as void }
      );
  }

  public logout(): void {
    this.user = null;
  }

  public setLoginCallback(callback: Function): void { this.loginCallback = callback ? callback : this.defaultCallback; }
  public setRedirectUrl(url: string): void { this.redirectUrl = url; }
  public getRedirectUrl(): string { return this.redirectUrl; }
  public getEffectiveRedirectUrl(): string { return this.redirectUrl ? this.redirectUrl : this.homeUrl(); }

  /*
    Any of these functions might get called by the various components,
    even before a login occurs. 
  */
  public isLoggedIn(): boolean { return this.user !== null; }
  public getUserName(): string { return this.isLoggedIn() ? this.user.name : ''; }
  public getUserOrgId(): number { return this.isLoggedIn() ? this.user.orgId : -1; }
  public getUserOrgName(): string { return this.isLoggedIn() ? this.user.orgName : ''; }
  public getDefaultOfferId(): number { return this.defaultOfferId; }

  public hasAdminRole(): boolean { return this.isLoggedIn() ? this.user.isAdminUser : false; }
  public hasProviderRole(): boolean { return this.isLoggedIn() ? this.user.isProviderOrg : false; }
  public hasServiceRole(): boolean { return this.isLoggedIn() ? !this.user.isProviderOrg : false; }
  public homeUrl(): string { return this.hasAdminRole() ? AuthService.HOME_ADMIN : this.hasProviderRole() ? AuthService.HOME_PROVIDER : AuthService.HOME_SERVICE; }

  public setHelpedOrg(org: Org): void {

      if(!this.hasAdminRole()) {
        return;
      }

      this.user.orgId = org.id;
      this.user.orgName = org.name;
      this.user.isProviderOrg = org.isProviderOrg;
      this.defaultOfferId = org.defaultOfferId;
  }

  private loginSuccessHandler(id: number): void {
    let that = this;
    this.userService
      .getUser(id)
      .subscribe(
        (user: User): void => {

          /*
            If upstream filtering failed then getUser() tried to fetch
            a record that doesn't exist and returned null.
          */
          if(!user) {
            that.logMessage("Login Error: Tried to fetch record that doesn't exist");
            return;
          }

          that.user = user; 
          that.userFetchSuccess();
        },
        error => that.logMessage(error)
      );
  }

  private userFetchSuccess(): void {
    this.logMessage("");
  }

  private logMessage(message: string) {
    this.loginCallback(message);
  }

  private defaultCallback(message: string): void {
    console.info("From auth.service defaultCallback: " + message);
  }

}
