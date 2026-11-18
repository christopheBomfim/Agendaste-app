import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonToolbar,
  IonContent,
  IonSearchbar,
  IonItem,
  IonAvatar,
  IonLabel,
  IonFooter,
  IonButton,
  IonIcon,
  IonToast
} from '@ionic/angular';

import { FirebaseError } from 'firebase/app';
import { addIcons } from 'ionicons';

import {
  addCircleOutline,
  searchOutline
} from 'ionicons/icons';

import {
  ClientesService
} from '../../services/clientes.service';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  ultimaVisita: string;
  iniciais: string;
  cor: 'azul' | 'rosa' | 'verde' | 'amarelo';
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonToolbar,
    IonContent,
    IonSearchbar,
    IonItem,
    IonAvatar,
    IonLabel,
    IonFooter,
    IonButton,
    IonIcon,
    IonToast
  ]
})
export class ClientesPage {

  termoBusca = '';

  mensagem = '';
  toastAberto = false;

  carregando = false;

  constructor(
    private router: Router,
    private clientesService: ClientesService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      addCircleOutline,
      searchOutline
    });
  }

  // =====================================
  // CARREGAR CLIENTES AO ABRIR A PÁGINA
  // =====================================

  ionViewWillEnter(): void {
    void this.carregarClientes();
  }

  async carregarClientes(): Promise<void> {

    this.carregando = true;
    this.cdr.markForCheck();

    try {

      await this.clientesService.carregar();

    } catch (erro) {

      console.error(
        'Erro ao carregar clientes:',
        erro
      );

      if (
        erro instanceof FirebaseError &&
        erro.code === 'permission-denied'
      ) {

        this.exibirMensagem(
          'Sem permissão para consultar os clientes.'
        );

      } else {

        this.exibirMensagem(
          'Não foi possível carregar os clientes.'
        );

      }

    } finally {

      this.carregando = false;
      this.cdr.markForCheck();

    }
  }

  // =====================================
  // CLIENTES DO FIRESTORE + PESQUISA
  // =====================================

  get clientesFiltrados(): Cliente[] {

    const cores: Cliente['cor'][] = [
      'azul',
      'rosa',
      'verde',
      'amarelo'
    ];

    const todos: Cliente[] = this.clientesService
      .listar()
      .map((cliente, indice) => ({

        id: cliente.id,

        nome: cliente.nome,

        telefone: cliente.telefone,

        ultimaVisita: 'Sem visitas',

        iniciais: this.obterIniciais(
          cliente.nome
        ),

        cor: cores[indice % cores.length]

      }));

    const busca = this.normalizar(
      this.termoBusca || ''
    );

    if (!busca) {
      return todos;
    }

    return todos.filter(cliente => {

      const nome = this.normalizar(
        cliente.nome
      );

      const telefone = this.normalizar(
        cliente.telefone
      );

      return (
        nome.includes(busca) ||
        telefone.includes(busca)
      );
    });
  }

  // =====================================
  // GERAR INICIAIS PARA O AVATAR
  // =====================================

  private obterIniciais(nome: string): string {

    return nome
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(parte =>
        parte.charAt(0).toUpperCase()
      )
      .join('');
  }

  // =====================================
  // NORMALIZAR TEXTO DA PESQUISA
  // =====================================

  private normalizar(texto: string): string {

    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  // =====================================
  // DETALHES DO CLIENTE
  // =====================================

  consultarCliente(cliente: Cliente): void {

    this.exibirMensagem(
      `Detalhes de ${cliente.nome} serão implementados depois.`
    );
  }

  // =====================================
  // ABRIR FORMULÁRIO NOVO CLIENTE
  // =====================================

  novoCliente(): void {

    this.router.navigateByUrl(
      '/novo-cliente'
    );
  }

  // =====================================
  // EXIBIR MENSAGENS
  // =====================================

  private exibirMensagem(texto: string): void {

    this.mensagem = texto;
    this.toastAberto = true;

    this.cdr.markForCheck();
  }
}
