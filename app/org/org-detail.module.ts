import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { OrgDetailComponent } from './org-detail.component';

@NgModule({
  imports: [ CommonModule, FormsModule ],
  declarations: [
    OrgDetailComponent
  ]
})
export class OrgDetailModule {
}
