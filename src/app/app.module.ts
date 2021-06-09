import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { registerLocaleData, DatePipe } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';

import * as $ from 'jquery';

registerLocaleData(localePt);
defineLocale('pt-br', ptBrLocale);
defineLocale('pt', ptBrLocale);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BsDatepickerModule,
    TranslateModule.forRoot()
  ],
  providers: [
    BsLocaleService,
    { provide: LOCALE_ID, useValue: 'pt' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
