import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotImplementedComponent } from '../not-implemented.component';
import { AdminComponent } from './admin.component';
import { AdminHomeComponent } from './admin-home.component';
import { AdminChooseOrgComponent } from './admin-choose-org.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'choose-org',
        component: AdminChooseOrgComponent
      },
      {
        path: 'edit-orgs',
        component: NotImplementedComponent
      },
      {
        path: 'edit-users',
        component: NotImplementedComponent
      },
      {
        path: 'edit-traits',
        component: NotImplementedComponent
      },
      {
        path: 'edit-favors',
        component: NotImplementedComponent
      },
      {
        path: '',
        component: AdminHomeComponent,
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ],
})
export class AdminRoutingModule { }
