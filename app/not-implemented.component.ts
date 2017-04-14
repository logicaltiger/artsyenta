import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  template: `
    <h2>{{ router.url }} is not yet implemented</h2>
    <p>Click on OK to return to the menu</p>
    <p>
      <button id="ok" (click)="returnToParent()">OK</button>
    </p>`
})
export class NotImplementedComponent {
  constructor(private router: Router, private authService: AuthService) { }

  private returnToParent() {
    let parentUrl: string = '/';
    let url: string = this.router.url;

    if(url) {
      let idx: number = url.lastIndexOf('/');

      if(idx > -1) {
        parentUrl = url.substring(0, idx);
      }

    }

    this.router.navigate([parentUrl]);
  }

}
