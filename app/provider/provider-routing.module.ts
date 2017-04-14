import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanDeactivateGuard } from '../can-deactivate-guard.service';
import { NotImplementedComponent } from '../not-implemented.component';
import { OrgDetailComponent } from '../org/org-detail.component';
import { ProviderComponent } from './provider.component';
import { ProviderHomeComponent } from './provider-home.component';
import { ProviderOrgDetailResolve } from './provider-org-detail-resolve.service';

const providerRoutes: Routes = [
  {
    path: '',
    component: ProviderComponent,
    children: [
      {
        path: 'edit-org',
        component: OrgDetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: {
          org: ProviderOrgDetailResolve
        }
      },
      {
        path: 'edit-default-offer',
        component: NotImplementedComponent
      },
      {
        path: 'edit-favors',
        component: NotImplementedComponent
      },
      {
        path: 'offer',
        component: NotImplementedComponent
      },
/*
Figure out nested routing when implementing offers.
As it is, frequently get /provider/offer/offer
when a "../" route is followed.
      {
        path: 'offer',
        children: [
          {
            path: ':id',
            component: NotImplementedComponent
          },
          {
            path: '',
            component: ProviderHomeComponent,
            pathMatch: 'full'
          }
        ]
      },
*/
      {
        path: '',
        component: ProviderHomeComponent,
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(providerRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    ProviderOrgDetailResolve
  ]
})
export class ProviderRoutingModule { }
