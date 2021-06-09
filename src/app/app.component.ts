import { Component, OnInit } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'santamao';
  private dfltLang = 'pt';

  constructor(
    private bsLocaleService: BsLocaleService,
    private translateService: TranslateService
  ) {

  }

  ngOnInit() {
    // Seta a linguagem geral da aplicação: do armazenamento local do usuário, do browser ou a padrão
    this.translateService.addLangs(['pt', 'en']);
    this.translateService.setDefaultLang(this.dfltLang);
    const browserLang = this.translateService.getBrowserLang();
    const useLang = (localStorage.getItem('language') || (browserLang.match(/en|pt/) ? browserLang : this.dfltLang));
    this.translateService.use(useLang);
    // Define localização/linguagem atual para DatePicker e afins
    this.bsLocaleService.use(useLang === 'pt' ? 'pt-br' : useLang);
  }
}
