import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { AuthService } from '../auth.service';
import { Credential } from './credential';

@Component({
  moduleId: module.id,
  selector: 'my-login',
  template: `
    <h2>LOGIN</h2>
    <p>{{ message }}</p>
    <div class="container">
      <div class="row">
        <div class="left">
          <label>Name: </label>
        </div>
        <div class="right">
          <input [(ngModel)]="name" placeholder="Name"/>
        </div>
      </div>
      <div class="row">
        <div class="left">
          <label>Password: </label>
        </div>
        <div class="right">
          <input [(ngModel)]="password" placeholder="Password"/>
        </div>
      </div>
    </div>
    <p>
      <button id="login" (click)="login()" [disabled] = "mustDisable()" *ngIf="!authService.isLoggedIn()">Login</button>
      <button id="logout" (click)="logout()" *ngIf="authService.isLoggedIn()">Logout</button>
    </p>`,
  styleUrls: ['login.component.css']
})
export class LoginComponent {
  message: string;
  name: string = "";
  password: string = "";
  inProcess: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.clearForm();
  }

  private clearForm(): void {
    this.setMessage("Please login");
    this.name = "";
    this.password = "";
  }

  private setMessage(msg: string) {
    this.message = msg + (this.authService.isLoggedIn() ? (" (Logged in as " + this.authService.getUserName() + ")") : "");
  }

  private mustDisable(): boolean {
    return this.inProcess;
  }

  /*
    This "logout" button acts as a fallback against 
    failure to directly call AuthService.logout() method.
  */
  public logout() {
    this.setMessage("Logging out");
    this.authService.logout();
    this.clearForm();
  }

  public login() {
    this.setMessage("Logging in");

    if(!this.name || !this.password) {
      this.loginCallback("Blank Name or Password");
      return;
    }

    this.inProcess = true;
    this.authService.setLoginCallback(this.loginCallback.bind(this));
    this.authService.login(new Credential(this.name, this.password));
  }

  /*
    The authService was configured to call this method after its login() completes.

    A blank message means all succeeded.
  */
  private loginCallback(msg: string) {
    this.inProcess = false;
    
    // Both msg and isLoggedIn() is belt and suspenders.
    if(msg || !this.authService.isLoggedIn()) {
      this.setMessage("Login failed due to: " + msg);
      return;
    }

    /*
      If redirectUrl is set then this login intercepted a call from a non-logged user.
      Routing to that URL can continue.  If redirectUrl is not set then go to the
      default path for the user role.
    */
    this.clearForm();
    let redirect = this.authService.getEffectiveRedirectUrl();

    let navigationExtras: NavigationExtras = {
      preserveQueryParams: true,
      preserveFragment: true
    };

    this.router.navigate([redirect], navigationExtras);
  }

}
