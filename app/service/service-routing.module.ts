import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanDeactivateGuard } from '../can-deactivate-guard.service';
import { NotImplementedComponent } from '../not-implemented.component';
import { OrgDetailComponent } from '../org/org-detail.component';
import { ServiceComponent } from './service.component';
import { ServiceHomeComponent } from './service-home.component';
import { ServiceOrgDetailResolve } from './service-org-detail-resolve.service';

const serviceRoutes: Routes = [
  {
    path: '',
    component: ServiceComponent,
    children: [
      {
        path: 'edit-org',
        component: OrgDetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: {
          org: ServiceOrgDetailResolve
        }
      },
      {
        path: 'offer-list',
        component: NotImplementedComponent
      },
      {
        path: 'provider-favors',
        component: NotImplementedComponent
      },
      {
        path: '',
        component: ServiceHomeComponent,
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(serviceRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    ServiceOrgDetailResolve
  ]
})
export class ServiceRoutingModule { }
