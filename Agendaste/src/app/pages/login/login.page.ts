import { Component, ChangeDetectorRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonInput,
  IonInputPasswordToggle,
  IonIcon,
  IonToast} from '@ionic/angular';
import { FirebaseError } from 'firebase/app';
import { addIcons } from 'ionicons';
import { calendarNumberOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

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

  email = '';
  senha = '';

  mensagem = '';
  toastAberto = false;
  carregando = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ calendarNumberOutline });
  }

  // Login com Firebase
  async entrar(): Promise<void> {

    if (this.carregando) {
      return;
    }

    if (!this.email.trim() || !this.senha) {
      this.exibirMensagem('Preencha todos os campos.');
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(this.email.trim())) {
      this.exibirMensagem('Digite um e-mail válido.');
      return;
    }

    this.carregando = true;
    this.cdr.markForCheck();

    try {

      // Autenticar profissional
      await this.authService.entrar(
        this.email,
        this.senha
      );

      this.senha = '';

      // Abrir Dashboard
      await this.router.navigateByUrl(
        '/profissional/inicio',
        { replaceUrl: true }
      );

    } catch (erro: unknown) {

      if (erro instanceof FirebaseError) {

        switch (erro.code) {

          case 'auth/invalid-credential':
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            this.exibirMensagem(
              'E-mail ou senha incorretos.'
            );
            break;

          case 'auth/too-many-requests':
            this.exibirMensagem(
              'Muitas tentativas. Tente novamente mais tarde.'
            );
            break;

          case 'auth/network-request-failed':
            this.exibirMensagem(
              'Verifique sua conexão com a internet.'
            );
            break;

          case 'permission-denied':
            this.exibirMensagem(
              'Sem permissão para consultar o perfil.'
            );
            break;

          default:
            console.error('Erro no login:', erro);
            this.exibirMensagem(
              'Não foi possível realizar o login.'
            );
        }

      } else if (
        erro instanceof Error &&
        erro.message === 'perfil-profissional-ausente'
      ) {

        this.exibirMensagem(
          'Perfil profissional não encontrado.'
        );

      } else {

        console.error('Erro inesperado:', erro);

        this.exibirMensagem(
          'Não foi possível validar sua conta.'
        );
      }

    } finally {

      this.carregando = false;
      this.cdr.markForCheck();

    }
  }

  recuperarSenha(): void {
    this.exibirMensagem(
      'A recuperação de senha será implementada depois.'
    );
  }

  consultarAgendamentos(): void {
    this.router.navigateByUrl('/login-cliente');
  }

  cadastrarProfissional(): void {
    this.router.navigateByUrl('/cadastro-profissional');
  }

  private exibirMensagem(texto: string): void {
    this.mensagem = texto;
    this.toastAberto = true;
    this.cdr.markForCheck();
  }
}
