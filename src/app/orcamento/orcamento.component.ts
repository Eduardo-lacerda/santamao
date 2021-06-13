import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { OrcamentoService } from '../shared/services/orcamento.service';


@Component({
  selector: 'app-orcamento',
  templateUrl: './orcamento.component.html',
  styleUrls: ['./orcamento.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrcamentoComponent implements OnInit {

  mainForm: FormGroup;
  modalRef: BsModalRef;
  mascaraTelefone: any;
  listaBairros: Array<any> = [];
  @ViewChild('modalTemplate') modalTemplate: ModalDirective;
  @ViewChild('messageModal') messageModal: ModalDirective;
  config: any;
  precoFinal: number = 0;
  locale = 'pt';
  tempoEstimado: number = 4;
  abrirHorarios: boolean = false;
  horario: any;
  listaHorarios: Array<any>;
  tempoEstimadoDisplay = '4';
  mostrarPreco: boolean = false;
  submetido: boolean = false;
  emailInvalido: boolean = true;
  telefoneInvalido: boolean = true;
  erroBairro: boolean = false;
  erroNome: boolean = false;
  erroTelefone: boolean = false;
  erroEmail: boolean = false;

  constructor(
      private formBuilder: FormBuilder,
      private modalService: BsModalService,
      private localeService: BsLocaleService,
      private mainService: OrcamentoService
    ) {
  }

  ngOnInit(): void {
    this.listaHorarios = [
      {'id': 8, 'display': '08:00'},
      {'id': 9, 'display': '09:00'},
      {'id': 10, 'display': '10:00'},
      {'id': 11, 'display': '11:00'},
      {'id': 12, 'display': '12:00'},
      {'id': 13, 'display': '13:00'},
      {'id': 14, 'display': '14:00'},
      {'id': 15, 'display': '15:00'},
      {'id': 16, 'display': '16:00'},
      {'id': 17, 'display': '17:00'},
      {'id': 18, 'display': '18:00'},
    ]
    this.localeService.use(this.locale);
    this.listaBairros = [
      {
        'nome': 'Santa Mônica',
        'id': 1,
      },
      {
        'nome': 'Teste 2',
        'id': 2
      }
    ];
    this.config = {
      displayKey:"nome", //if objects array passed which key to be displayed defaults to description
      search:true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder:'Selecione um Bairro', // text to be displayed when no item is selected defaults to Select,
      customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: 0, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
      moreText: 'Mais', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'Nenhum resultado encontrado', // text to be displayed when no items are found while searching
      searchPlaceholder:'Pesquisar', // label thats displayed in search input,
      clearOnSelection: false, // clears search criteria when an option is selected if set to true, default is false
      inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
    }
    this.mascaraTelefone = ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    this.mainForm = this.formBuilder.group({
      limpeza: ['Expressa'],
      imovel: ['casa'],
      quartos: [2],
      banheiros: [1],
      salas: [1],
      andares: [1],
      cozinhas: [1],
      areaExterna: [false],
      bairro: ['', Validators.required],
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      extra: [''],
      data: [new Date(), Validators.required],
      horario: ['', Validators.required],
      extraBanheiro: [false],
      extraQuarto: [false],
      extraCozinhaChao: [false],
      extraCozinhaInterna: [false],
      extraCozinhaParedes: [false],
      extraChurrasqueira: [false],
    });
    this.calcularPreco();
    var that = this;
    $(document).on('click', function(event) {
      var $target = $(event.target);
      if(!$target.closest('#time-picker-wrapper').length && that.abrirHorarios == true) {
        if(!$target.closest('#horario').length)
          that.abrirHorarios = false;
      }
    });
  }

  mostrarHorarios() {
    var that = this;
    this.abrirHorarios = true;
  }

  salvarHorario() {
    this.mainForm.get('horario').setValue(this.horario);
    this.abrirHorarios = false;
  }

  abrirModal(template: TemplateRef<any>) {
    this.modalTemplate.show();
  }

  mudarLimpeza(tipo: any) {
    this.mainForm.get('limpeza').setValue(tipo);
    if(tipo == 'Expressa') {
      $('#expressa-wrapper').addClass('chosen');
      $('#pesada-wrapper').removeClass('chosen');
    }
    else {
      $('#pesada-wrapper').addClass('chosen');
      $('#expressa-wrapper').removeClass('chosen');
    }
    this.calcularPreco();
  }

  mudarImovel(tipo: any) {
    this.mainForm.get('imovel').setValue(tipo);
    if(tipo == 'casa') {
      $('#casa').addClass('chosen');
      $('#apartamento').removeClass('chosen');
    }
    else {
      $('#apartamento').addClass('chosen');
      $('#casa').removeClass('chosen');
    }
    this.calcularPreco();
  }

  aumentarNumero(campo: any) {
    var valorAtual = this.mainForm.get(campo).value;
    this.mainForm.get(campo).setValue(valorAtual+1);
    this.calcularPreco();
  }

  diminuirNumero(campo: any) {
    var valorAtual = this.mainForm.get(campo).value;
    if(valorAtual != 0)
      this.mainForm.get(campo).setValue(valorAtual-1);
    this.calcularPreco();
  }

  mudarBairro(event) {

  }

  handleExtra(event) {
    var id = event.target.id;
    var checked = event.target.checked;
    this.mainForm.get(id).setValue(checked);
    this.calcularPreco();
  }

  calcularPreco(_areaExterna?) {
    var imovel = this.mainForm.get('imovel').value;
    var quartos = this.mainForm.get('quartos').value;
    var banheiros = this.mainForm.get('banheiros').value;
    var salas = this.mainForm.get('salas').value;
    var andares = this.mainForm.get('andares').value;
    var areaExterna = _areaExterna != undefined? _areaExterna : this.mainForm.get('areaExterna').value;
    var resultado, multiplicador, beta, mQuartos, mBanheiros, mSalas, mCozinhas;
    var mAreaExterna = 10;
    var cozinhas = this.mainForm.get('cozinhas').value;
    var mAndares = 35;

    if(imovel == 'apartamento') {
      mSalas = 6;
      multiplicador = 1.11;
      if(quartos < 4) {
        beta = 60;
        mQuartos = 8.5;
        mBanheiros = 7;
      }
      else {
        beta = 70;
        mQuartos = 10;
        mBanheiros = 9;
      }
      resultado = (beta + (quartos*mQuartos) + (salas*mSalas) + (banheiros*mBanheiros)) * multiplicador;
      if(areaExterna == true) {
        resultado = resultado + mAreaExterna;
      }
    }
    else {
      beta = 65;
      mCozinhas = 7;
      mSalas = 6.7;

      if(quartos < 3) {
        mQuartos = 9;
        mBanheiros = 8;
        multiplicador = 1.02;
      }
      else {
        mQuartos = 10;
        mBanheiros = 9;
        multiplicador = 1.011;
      }
      resultado = beta + (quartos*mQuartos) + (salas*mSalas) + (banheiros*mBanheiros) + (cozinhas*mCozinhas) + (andares*mAndares);
      if(areaExterna == true) {
        resultado = resultado + mAreaExterna;
      }
      resultado = resultado * multiplicador;
    }

    if(this.mainForm.get('limpeza').value == 'Pesada') {
      resultado = resultado * 1.8;
    }


    else {
      var extraBanheiro = this.mainForm.get('extraBanheiro').value;
      var extraQuarto = this.mainForm.get('extraQuarto').value;
      var extraCozinhaChao = this.mainForm.get('extraCozinhaChao').value;
      var extraCozinhaInterna = this.mainForm.get('extraCozinhaInterna').value;
      var extraCozinhaParedes = this.mainForm.get('extraCozinhaParedes').value;
      console.log(extraQuarto)
      console.log(resultado)
      if(extraBanheiro)
        resultado = resultado + 12;

      if(extraQuarto)
        resultado = resultado + 25;
      console.log(resultado)
      if(extraCozinhaChao)
        resultado = resultado + 10;

      if(extraCozinhaInterna)
        resultado = resultado + 30;

      if(extraCozinhaParedes)
        resultado = resultado + 12;
    }

    var extraChurrasqueira = this.mainForm.get('extraChurrasqueira').value;
    if(extraChurrasqueira)
      resultado = resultado + 30;

    resultado = resultado.toFixed(2);
    this.precoFinal = resultado;

    if(resultado >= 89 && resultado <= 99.99) {
      this.tempoEstimado = 4;
      this.tempoEstimadoDisplay = 'Entre 3 e 4';
    }
    else if(resultado >= 100 && resultado <= 109.99) {
      this.tempoEstimado = 4;
      this.tempoEstimadoDisplay = 'Cerca de 4';
    }
    else if(resultado >= 110 && resultado <= 125.99) {
      this.tempoEstimado = 6;
      this.tempoEstimadoDisplay = 'Entre 5 e 6';
    }
    else if(resultado >= 126 && resultado <= 149.99) {
      this.tempoEstimado = 6;
      this.tempoEstimadoDisplay = 'Cerca de 6';
    }
    else if(resultado >= 150 && resultado <= 169.99) {
      this.tempoEstimado = 7;
      this.tempoEstimadoDisplay = 'Entre 6 e 7';
    }
    else if(resultado >= 170) {
      this.tempoEstimado = 8;
      this.tempoEstimadoDisplay = 'Cerca de 8';
    }
  }

  handleRadio(event) {
    var limpeza = event.target.id == 'true';
    this.calcularPreco(limpeza);
  }

  selecionarTempo(inicio) {
    var final = inicio + this.tempoEstimado;
    if(final <= 18) {
      for(var j = 8; j <= 18; j++) {
        $('#'+j).removeClass('chosen-time');
      }

      for(var i = inicio; i <= final; i++) {
        $('#'+i).addClass('chosen-time');
      }

      var horarioInicio = this.listaHorarios.find(horario => {
        return horario.id == inicio;
      }).display;
      var horarioFim = this.listaHorarios.find(horario => {
        return horario.id == final;
      }).display;
      this.horario = horarioInicio + ' - ' + horarioFim;
    }
  }

  handleTelefoneInput() {
    var telefone = this.mainForm.get('telefone').value;
    telefone = telefone.replace(/[{()}]/g, '');
    telefone = telefone.replace(/_/g, '');
    telefone = telefone.replace(/-/g, '');
    telefone = telefone.replace(' ', '');

    if(telefone.length >= 11) {
      this.telefoneInvalido = false;
      if(!this.emailInvalido)
        this.mostrarPreco = true;
    }
    else {
      this.telefoneInvalido = true;
      this.mostrarPreco = false;
    }
  }

  handleEmailInput() {
    var email = this.mainForm.get('email');
    if(email.valid) {
      this.emailInvalido = false;
      if(!this.telefoneInvalido)
        this.mostrarPreco = true;
    }
    else {
      this.mostrarPreco = false;
      this.emailInvalido = true;
    }
  }

  agendarLimpeza() {
    this.submetido = true;
    if(this.mainForm.get('telefone').invalid) {
      this.erroTelefone = true;
    }
    var telefone = this.mainForm.get('telefone').value;
    telefone = telefone.replace(/[{()}]/g, '');
    telefone = telefone.replace(/_/g, '');
    telefone = telefone.replace(/-/g, '');
    telefone = telefone.replace(' ', '');

    if(telefone.length >= 11) {
      this.erroTelefone = true;
    }
    else
      this.erroTelefone = false;
    if(this.mainForm.get('email').invalid) {
      this.erroEmail = true;
    }
    else
      this.erroEmail = false;
    if(this.mainForm.get('bairro').invalid) {
      this.erroBairro = true;
    }
    else
      this.erroBairro = false;
    if(this.mainForm.get('nome').invalid) {
      this.erroNome = true;
    }
    else
      this.erroNome = false;

    if(this.mainForm.valid) {
      var wppApi = "https://api.whatsapp.com/send?phone=553591843377&text=";
      var pipe = new DatePipe('pt-BR');
      var data = pipe.transform(this.mainForm.get('data').value, 'dd/MM/yyyy');
      var horario = this.mainForm.get('horario').value
      var wppMessage = "Olá, eu gostaria de agendar uma limpeza na data " + data
      + ', no seguinte horário: '+horario;

      var body = {};
      body["nome"] = this.mainForm.get('nome').value;
      body["email"] = this.mainForm.get('email').value;
      body["bairro"] = this.mainForm.get('bairro').value;
      body["endereco"] = "";
      body["telefone"] = this.mainForm.get('telefone').value;
      body["comentario"] = this.mainForm.get('extra').value;
      body["limpeza"] = this.mainForm.get('limpeza').value;
      body["quartos"] = this.mainForm.get('quartos').value;
      body["banheiros"] = this.mainForm.get('banheiros').value;
      body["salas"] = this.mainForm.get('salas').value;
      body["andares"] = this.mainForm.get('andares').value;
      body["areaExterna"] = this.mainForm.get('areaExterna').value;
      body["extraBanheiro"] = this.mainForm.get('extraBanheiro').value;
      body["extraQuarto"] = this.mainForm.get('extraQuarto').value;
      body["extraCozinhaChao"] = this.mainForm.get('extraCozinhaChao').value;
      body["extraCozinhaInterna"] = this.mainForm.get('extraCozinhaInterna').value;
      body["extraCozinhaParedess"] = this.mainForm.get('extraCozinhaParedes').value;
      body["extraChurrasqueira"] = this.mainForm.get('extraChurrasqueira').value;
      body["preco"] = this.precoFinal;

      console.log(body);
      this.mainService.salvarOrcamento(body).subscribe(res => {
        console.log(res);
      })
      var wppUrl = wppApi + encodeURI(wppMessage);
      window.open(wppUrl, "_blank");
      this.messageModal.show();
    }
  }
}
