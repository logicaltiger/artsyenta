import { Component } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  template: `
    <h2 class="title">Manage {{ authService.getUserOrgName() }}</h2>
    <nav>
      <p><a routerLink="edit-org" routerLinkActive="active">Edit the Organization Data</a></p>
      <p><a routerLink="edit-default-offer" routerLinkActive="active">Edit the Default Offer</a></p>
      <p><a routerLink="edit-favors" routerLinkActive="active">Edit the Subscribed Favors</a></p>
      <p><a routerLink="offer" routerLinkActive="active">Edit Offers</a></p>
    </nav>
  `
})
export class ProviderHomeComponent { 
  constructor(private authService: AuthService) { }
}
