
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  IonContent,
  IonAvatar,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonToast
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  mailOutline,
  callOutline,
  locationOutline,
  createOutline,
  notificationsOutline,
  keyOutline,
  logOutOutline
} from 'ionicons/icons';

interface Profissional {
  nome: string;
  especialidade: string;
  email: string;
  telefone: string;
  endereco: string;
  totalClientes: number;
  totalAgendamentos: number;
  avaliacao: string;
}

@Component({
  selector: 'app-perfil-profissional',
  templateUrl: './perfil-profissional.page.html',
  styleUrls: ['./perfil-profissional.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonAvatar,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonToast
  ]
})
export class PerfilProfissionalPage {

  // Dados demonstrativos do profissional
  profissional: Profissional = {
    nome: 'Dr. Marcos Silva',
    especialidade: 'Cardiologia · Medicina Interna',
    email: 'dr.marcos@email.com',
    telefone: '(11) 98765-4321',
    endereco: 'Av. Paulista, 1000 - São Paulo, SP',
    totalClientes: 124,
    totalAgendamentos: 32,
    avaliacao: '4.8'
  };

  // Mensagens
  mensagem = '';
  toastAberto = false;

  constructor(private router: Router) {
    addIcons({
      mailOutline,
      callOutline,
      locationOutline,
      createOutline,
      notificationsOutline,
      keyOutline,
      logOutOutline
    });
  }

  // Editar informações do profissional
  editarPerfil(): void {
    this.exibirMensagem(
      'A página Editar Perfil será criada em breve.'
    );
  }

  // Abrir notificações
  abrirNotificacoes(): void {
    this.exibirMensagem(
      'As notificações serão implementadas depois.'
    );
  }

  // Alterar senha
  alterarSenha(): void {
    this.exibirMensagem(
      'A alteração de senha será implementada depois.'
    );
  }

  // Voltar ao login
  sair(): void {
    this.router.navigateByUrl('/login');
  }

  // Exibir mensagens
  private exibirMensagem(texto: string): void {
    this.mensagem = texto;
    this.toastAberto = true;
  }
}
