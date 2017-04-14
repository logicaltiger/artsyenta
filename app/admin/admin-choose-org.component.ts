import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { AuthService } from '../auth.service';
import { Org } from '../org/org';
import { OrgService } from '../org/org.service';

@Component({
  moduleId: module.id,
  selector: 'my-admin-choose-org',
  template: `
    <h2>Choose an Organization to Assist</h2>
    <div id='error'>{{ error ? error : "" }}</div>
    <div class="container">
      <div *ngFor="let o of orgs, let i = index" id="choose{{i}}" class="row" (click)="chooseOrg(i)">
        <div class="left choose">{{o.name}}</div>
        <div class="right choose">{{o.isProviderOrg ? 'Provider' : 'Service'}}</div>
      </div>
    </div>
    <div><button id="cancel" (click)="cancel()">Cancel</button></div>`,
  styleUrls: ['admin-choose-org.component.css']
})
export class AdminChooseOrgComponent {
  constructor(
    private orgService: OrgService,
    private authService: AuthService,
    private router: Router) { }

  public orgs: Org[] = new Array<Org>();
  public error: string = null;

  public ngOnInit(): void {
    this.getOrgs();
  }

  private getOrgs(): void {
    this.orgService
      .getOrgs()
      .subscribe(
        (orgs: Org[]) => {
          this.orgs = orgs;
          this.error = null;
        },
        error => this.error = <any>error
      );
  }

  private chooseOrg(idx: number) {
    this.authService.setHelpedOrg(this.orgs[idx]);
    this.returnToParent();
  }

  private cancel() { return this.returnToParent(); }

  private returnToParent() {
    this.router.navigate([AuthService.HOME_ADMIN]);
  }

}
