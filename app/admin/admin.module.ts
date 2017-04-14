import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared.module';
import { OrgService } from '../org/org.service';

import { AdminComponent } from './admin.component';
import { AdminChooseOrgComponent } from './admin-choose-org.component';
import { AdminHomeComponent } from './admin-home.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    SharedModule
  ],
  declarations: [
    AdminComponent,
    AdminChooseOrgComponent,
    AdminHomeComponent
  ],
  providers: [
    OrgService
  ]
})
export class AdminModule { }
