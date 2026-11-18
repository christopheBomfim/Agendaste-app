import { Component, ChangeDetectorRef } from '@angular/core';
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

import { FirebaseError } from 'firebase/app';

import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

import {
  ProfissionaisService
} from '../../services/profissionais.service';

@Component({
  selector: 'app-cadastro-profissional',
  templateUrl: './cadastro-profissional.page.html',
  styleUrls: ['./cadastro-profissional.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
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
  ]
})
export class CadastroProfissionalPage {

  nome = '';
  email = '';
  celular = '';
  profissao = '';
  especialidade = '';
  senha = '';

  mensagem = '';
  toastAberto = false;
  salvando = false;

  constructor(
    private router: Router,
    private profissionaisService: ProfissionaisService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ arrowBackOutline });
  }

  async criarConta(): Promise<void> {

    if (this.salvando) {
      return;
    }

    // Validar campos obrigatórios
    if (
      !this.nome.trim() ||
      !this.email.trim() ||
      !this.celular.trim() ||
      !this.profissao ||
      !this.especialidade.trim() ||
      !this.senha
    ) {
      this.exibirMensagem('Preencha todos os campos.');
      return;
    }

    // Validar e-mail
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(this.email.trim())) {
      this.exibirMensagem('Digite um e-mail válido.');
      return;
    }

    // Validar celular
    const numerosCelular = this.celular.replace(/\D/g, '');

    if (
      numerosCelular.length !== 10 &&
      numerosCelular.length !== 11
    ) {
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

    this.salvando = true;
    this.cdr.markForCheck();

    try {

      console.log('Iniciando cadastro no Firebase...');

      // Cadastrar no Firebase
      await this.profissionaisService.cadastrar({
        nome: this.nome.trim(),
        email: this.email.trim().toLowerCase(),
        celular: this.celular.trim(),
        profissao: this.profissao,
        especialidade: this.especialidade.trim(),
        senha: this.senha
      });

      console.log('Cadastro concluído com sucesso!');

      this.senha = '';
      this.nome = '';
      this.email = '';
      this.celular = '';
      this.profissao = '';
      this.especialidade = '';

      this.exibirMensagem(
        'Conta criada com sucesso! Agora você pode fazer login.'
      );

    } catch (erro: unknown) {

      if (erro instanceof FirebaseError) {

        switch (erro.code) {

          case 'auth/email-already-in-use':
            this.exibirMensagem(
              'Este e-mail já está cadastrado.'
            );
            break;

          case 'auth/invalid-email':
            this.exibirMensagem(
              'O e-mail informado é inválido.'
            );
            break;

          case 'auth/weak-password':
            this.exibirMensagem(
              'Escolha uma senha mais forte.'
            );
            break;

          case 'auth/operation-not-allowed':
            this.exibirMensagem(
              'Ative o login por e-mail e senha no Firebase.'
            );
            break;

          case 'permission-denied':
            this.exibirMensagem(
              'Cadastro não autorizado pelo Firestore. Verifique as regras.'
            );
            break;

          default:
            console.error('Erro no cadastro:', erro);

            this.exibirMensagem(
              'Não foi possível concluir o cadastro. Verifique o console.'
            );
        }

      } else {
        console.error('Erro inesperado:', erro);

        this.exibirMensagem(
          'Ocorreu um erro inesperado.'
        );
      }

    } finally {
      this.salvando = false;

      // Atualizar a interface do Angular
      this.cdr.markForCheck();
    }
  }

  voltar(): void {
    this.router.navigateByUrl('/login');
  }


  private exibirMensagem(texto: string): void {

    this.mensagem = texto;

    this.toastAberto = true;

    // Atualizar a interface para mostrar o Toast
    this.cdr.markForCheck();

  }

}
