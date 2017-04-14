import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared.module';

import { OrgDetailModule } from '../org/org-detail.module';
import { OrgService } from '../org/org.service';
import { ProviderComponent } from './provider.component';
import { ProviderHomeComponent } from './provider-home.component';
import { ProviderRoutingModule } from './provider-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OrgDetailModule,
    ProviderRoutingModule,
    SharedModule
  ],
  declarations: [
    ProviderComponent,
    ProviderHomeComponent
  ],
  providers: [
    OrgService
  ]
})
export class ProviderModule { }
