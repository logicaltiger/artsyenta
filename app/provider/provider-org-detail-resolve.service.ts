import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth.service';
import { Org } from '../org/org';
import { OrgService } from '../org/org.service';

import 'rxjs/add/operator/first';

@Injectable()
export class ProviderOrgDetailResolve implements Resolve<Org> {
  error: any = null;
  
  constructor(private authService: AuthService, private orgService: OrgService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Org> {
    let id = this.authService.getUserOrgId();

    return this.orgService
      .getOrg(id)
      .map(
        (org: Org) : Org => {

          if(org) {
            return org;
          } else { 
            // If  the Org isn't available then the edit page isn't appropriate.
            this.router.navigate(['/provider/home']);
            return null;
          }
       })
      .first();
  }

}
