import { Component, computed, signal } from '@angular/core';
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
  briefcaseOutline,
  createOutline,
  notificationsOutline,
  keyOutline,
  logOutOutline
} from 'ionicons/icons';

import { AuthService } from '../../services/auth.service';

import {
  ProfissionaisService
} from '../../services/profissionais.service';

interface Profissional {
  nome: string;
  especialidade: string;
  profissao: string;
  email: string;
  telefone: string;
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

  // Dados do profissional
  profissional = signal<Profissional>({
    nome: '',
    especialidade: '',
    profissao: '',
    email: '',
    telefone: '',

    // Indicadores demonstrativos por enquanto
    totalClientes: 124,
    totalAgendamentos: 32,
    avaliacao: '4.8'
  });

  // Estado do carregamento
  carregandoPerfil = signal(false);
  erroPerfil = signal('');

  // Mensagens
  mensagem = signal('');
  toastAberto = signal(false);

  // Gerar iniciais automaticamente
  iniciaisProfissional = computed(() => {

    const nome = this.profissional().nome.trim();

    if (!nome) {
      return 'P';
    }

    const partes = nome
      .split(/\s+/)
      .filter(Boolean);

    const primeiraInicial =
      partes[0]?.charAt(0) ?? '';

    const ultimaInicial =
      partes.length > 1
        ? partes[partes.length - 1].charAt(0)
        : '';

    return (
      primeiraInicial + ultimaInicial
    ).toUpperCase() || 'P';

  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private profissionaisService: ProfissionaisService
  ) {

    addIcons({
      mailOutline,
      callOutline,
      briefcaseOutline,
      createOutline,
      notificationsOutline,
      keyOutline,
      logOutOutline
    });

  }

  // Executado sempre que a página é aberta no Ionic
  ionViewWillEnter(): void {
    void this.carregarProfissional();
  }

  // Buscar dados reais no Firebase
  async carregarProfissional(): Promise<void> {

    this.carregandoPerfil.set(true);
    this.erroPerfil.set('');

    // Limpar dados anteriores
    this.profissional.update(atual => ({
      ...atual,
      nome: '',
      especialidade: '',
      profissao: '',
      email: '',
      telefone: ''
    }));

    try {

      const perfil =
        await this.profissionaisService.obterPerfilAtual();

      // Atualizar informações vindas do Firestore
      this.profissional.update(atual => ({
        ...atual,

        nome: perfil.nome || 'Não informado',

        especialidade:
          perfil.especialidade || 'Não informada',

        profissao:
          perfil.profissao || 'Não informada',

        email: perfil.email || 'Não informado',

        // No Firestore o campo se chama celular
        telefone: perfil.celular || 'Não informado'

      }));

    } catch (erro) {

      console.error(
        'Erro ao carregar perfil profissional:',
        erro
      );

      this.erroPerfil.set(
        'Não foi possível carregar os dados do perfil.'
      );

    } finally {

      this.carregandoPerfil.set(false);

    }
  }

  // Editar informações do profissional
  editarPerfil(): void {
    this.router.navigate([
      '/editar-perfil-profissional'
    ]);
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

  // Encerrar sessão no Firebase
  async sair(): Promise<void> {

    try {

      await this.authService.sair();

      await this.router.navigateByUrl(
        '/login',
        { replaceUrl: true }
      );

    } catch (erro) {

      console.error('Erro ao sair:', erro);

      this.exibirMensagem(
        'Não foi possível sair da conta.'
      );

    }
  }

  // Exibir mensagens
  private exibirMensagem(texto: string): void {

    this.mensagem.set(texto);

    this.toastAberto.set(true);

  }
}
