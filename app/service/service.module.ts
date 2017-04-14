import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared.module';

import { OrgDetailModule } from '../org/org-detail.module';
import { OrgService } from '../org/org.service';
import { ServiceComponent } from './service.component';
import { ServiceHomeComponent } from './service-home.component';
import { ServiceRoutingModule } from './service-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OrgDetailModule,
    ServiceRoutingModule,
    SharedModule
  ],
  declarations: [
    ServiceComponent,
    ServiceHomeComponent
  ],
  providers: [
    OrgService
  ]
})
export class ServiceModule { }
