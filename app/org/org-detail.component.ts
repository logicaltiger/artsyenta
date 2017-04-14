import { Component, HostBinding, OnInit,  
          trigger, transition,
          animate, style, state } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DialogService } from '../dialog.service';
import { GlobalsService } from '../global/globals.service';
import { Option } from '../global/option';
import { Org } from './org';
import { OrgService } from './org.service';

@Component({
  moduleId: module.id,
  selector: 'my-org-detail',
  templateUrl: 'org-detail.component.html',
  styleUrls: ['org-detail.component.css']
})

/*
  This program began with Angular core 2.2.4 and associated libraries.
  In the process I updated to 2.4.0 and animations broke.  I commented
  out the animations until I can update to a later consistent library state.

  When ready put this back into the @Component section, after styleUrls.

  animations: [
    trigger('routeAnimation', [
      state('*', style({ opacity: 1, transform: 'translateX(0)' })),
      transition(':enter', [ style({ opacity: 0, transform: 'translateX(-100%)' }), animate('0.2s ease-in') ]),
      transition(':leave', [ animate('0.5s ease-out', style({ opacity: 0, transform: 'translateY(100%)'})) ])
    ])
  ]
*/
export class OrgDetailComponent implements OnInit {
  /*
    See above about animations and packages with Angular 2.4.0.
  @HostBinding('@routeAnimation') get routeAnimation() { return true; }
  */
  @HostBinding('style.display') get display() { return 'block'; }
  @HostBinding('style.position') get position() { return 'absolute'; }

  error: any = null;
  stateOptions: Option[];
  org: Org = null;
  savedOrg: Org = null;

  constructor(
    private dialogService: DialogService,
    private globalsService: GlobalsService,
    private orgService: OrgService,
    private route: ActivatedRoute,
    private router: Router) { }

  public ngOnInit(): void {
    this.error = null;
    this.stateOptions = this.globalsService.getStateOptions();
    let that = this;

    this.route.data
      .subscribe((data: { org: Org }) => {
        that.org = data.org;
        that.savedOrg = new Org(that.org);
      });
  }

  public canDeactivate(): Promise<boolean> | boolean {
    
    // Allow synchronous navigation (true) if no org or the org is unchanged
    if(!this.org || this.org.equals(this.savedOrg)) {
      return true;
    }
    
    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return this.dialogService.confirm('Discard changes?');
  }

  private gotoParent(): void {

    // In the future I might want to pass back the orgId to highlight an Org on the parent page.
    // let orgId = this.org ? this.org.id : -1;
    // this.router.navigate(['../', { id: orgId }], { relativeTo: this.route });
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  public save(): void {
    this.error = null;
    let that = this;

    this.orgService
        .save(that.org)
        .subscribe(
            (org: Org): void => {
              that.org = org; 
              that.savedOrg = new Org(that.org);
              that.gotoParent();
          },
          (error: any) => {
            /*
              Adaption for testing with in-memory data:
              The data doesn't really save anyway. 
              Remind the user that this is normal.
            */
            this.error = error;

            if(this.error == OrgService.ORG_IS_NULL) {
              this.error += ' -- this is normal when saving using the in-memory database';
            }
          
          }
        );

  }

  public cancel(): void {
    this.gotoParent();
  }

}
