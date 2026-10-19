import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonButton,
  IonInput,
  IonInputPasswordToggle,
  IonIcon,
  IonToast
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { calendarNumberOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonButton,
    IonInput,
    IonInputPasswordToggle,
    IonIcon,
    IonToast
  ]
})
export class LoginPage {

  email: string = '';
  senha: string = '';

  mensagem: string = '';
  toastAberto: boolean = false;

  constructor(private router: Router) {
    addIcons({ calendarNumberOutline });
  }

  entrar() {
    if (!this.email.trim() || !this.senha.trim()) {
      this.exibirMensagem('Preencha todos os campos.');
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(this.email)) {
      this.exibirMensagem('Digite um e-mail válido.');
      return;
    }

    this.exibirMensagem(
      'Formulário validado! Autenticação será adicionada depois.'
    );
  }

  recuperarSenha() {
    this.exibirMensagem(
      'A recuperação de senha será criada na próxima etapa.'
    );
  }

  consultarAgendamentos() {
    this.exibirMensagem(
      'Em breve: consulta por CPF ou e-mail.'
    );
  }

  cadastrarProfissional() {
     this.router.navigateByUrl('/cadastro-profissional');
  }

  private exibirMensagem(texto: string) {
    this.mensagem = texto;
    this.toastAberto = true;
  }
}
