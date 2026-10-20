import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonSelect,
  IonSelectOption,
  IonToast
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-cadastro-profissional',
  templateUrl: './cadastro-profissional.page.html',
  styleUrls: ['./cadastro-profissional.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButton,
    IonIcon,
    IonContent,
    IonInput,
    IonInputPasswordToggle,
    IonSelect,
    IonSelectOption,
    IonToast
  ]
})
export class CadastroProfissionalPage {

  nome: string = '';
  email: string = '';
  celular: string = '';
  profissao: string = '';
  especialidade: string = '';
  senha: string = '';

  mensagem: string = '';
  toastAberto: boolean = false;

  constructor(private router: Router) {
    addIcons({ arrowBackOutline });
  }

  criarConta() {

    // Verificar campos vazios
    if (
      !this.nome.trim() ||
      !this.email.trim() ||
      !this.celular.trim() ||
      !this.profissao ||
      !this.especialidade.trim() ||
      !this.senha.trim()
    ) {
      this.exibirMensagem('Preencha todos os campos.');
      return;
    }

    // Validar e-mail
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(this.email)) {
      this.exibirMensagem('Digite um e-mail válido.');
      return;
    }

    // Validar celular
    const numerosCelular = this.celular.replace(/\D/g, '');

    if (numerosCelular.length < 10 ||
      numerosCelular.length > 11) {
      this.exibirMensagem('Digite um celular válido.');
      return;
    }

    // Validar senha
    if (this.senha.length < 8) {
      this.exibirMensagem(
        'A senha deve ter no mínimo 8 caracteres.'
      );
      return;
    }

    // Cadastro demonstrativo
    this.exibirMensagem(
      'Dados validados! O salvamento será implementado depois.'
    );
  }

  voltar() {
    this.router.navigateByUrl('/login');
  }

  private exibirMensagem(texto: string) {
    this.mensagem = texto;
    this.toastAberto = true;
  }
}
