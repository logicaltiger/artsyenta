import { Component } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  template: `
    <h2 class="title">Administrator Menu</h2>
    <nav>
      <p><a routerLink="choose-org" routerLinkActive="active">Choose an Organization to help</a></p>
      <p><a routerLink="edit-orgs" routerLinkActive="active">Create, edit, activate or inactivate an Organization</a></p>
      <p><a routerLink="edit-users" routerLinkActive="active">Create or edit Users</a></p>
      <p><a routerLink="edit-traits" routerLinkActive="active">Create or edit Traits</a></p>
      <p><a routerLink="edit-favors" routerLinkActive="active">Create or edit Favors</a></p>
    </nav>
  `
})
export class AdminHomeComponent { 
  constructor(private authService: AuthService) { }
}
