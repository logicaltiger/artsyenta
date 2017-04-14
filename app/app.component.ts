import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { GlobalsService } from './global/globals.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  template: `
    <h1 class="title">Arts Yenta</h1>
    <nav>
      <a routerLink="/service" *ngIf="authService.hasServiceRole()" routerLinkActive="active">Service</a>
      <a routerLink="/provider" *ngIf="authService.hasProviderRole()" routerLinkActive="active">Provider</a>
      <a routerLink="/admin" *ngIf="authService.hasAdminRole()" routerLinkActive="active">Admin</a>
      <a routerLink="/logout" *ngIf="authService.isLoggedIn()" (click)="logout()" routerLinkActive="active">Logout</a>
    </nav>
    <p>{{ showWelcome() }}</p>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private globalsService: GlobalsService, private router: Router) { }

  ngOnInit() {
    this.globalsService.getGlobals();
  }

  showWelcome(): string {
    let name = this.authService.getUserName();
    return name == '' ? '' : ('Welcome, ' + name);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

}
