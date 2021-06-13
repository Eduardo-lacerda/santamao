import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrcamentoRoutes } from './orcamento.routing';
import { OrcamentoComponent } from './orcamento.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TextMaskModule } from 'angular2-text-mask';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { OrcamentoService } from '../shared/services/orcamento.service';
@NgModule({
  declarations: [
    OrcamentoComponent,
  ],
  imports: [
    RouterModule.forChild(OrcamentoRoutes),
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    CommonModule,
    TextMaskModule,
    SelectDropDownModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    HttpClientModule
  ],
  providers: [OrcamentoService],
})
export class OrcamentoModule { }
