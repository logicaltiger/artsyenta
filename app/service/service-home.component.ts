import { Component } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  template: `
    <h2 class="title">Manage {{ authService.getUserOrgName() }}</h2>
    <nav>
      <p><a routerLink="edit-org" routerLinkActive="active">Edit the Organization Data</a></p>
      <p><a routerLink="offer-list" routerLinkActive="active">Search for Offers</a></p>
      <p><a routerLink="provider-favors" routerLinkActive="active">Search Providers and their Favors</a></p>
    </nav>
  `
})
export class ServiceHomeComponent { 
  constructor(private authService: AuthService) { }
}
