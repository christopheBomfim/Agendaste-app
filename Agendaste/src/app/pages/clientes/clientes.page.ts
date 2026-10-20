import { Component } from '@angular/core';
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

import { addIcons } from 'ionicons';

import {
  addCircleOutline,
  searchOutline
} from 'ionicons/icons';

import { ClientesService } from '../../services/clientes.service';

interface Cliente {
  id: number;
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

  // Clientes demonstrativos
  clientes: Cliente[] = [
    {
      id: 1,
      nome: 'Ana Costa',
      telefone: '(11) 98765-4321',
      ultimaVisita: '10/03/2024',
      iniciais: 'AC',
      cor: 'azul'
    },
    {
      id: 2,
      nome: 'Carlos Alves',
      telefone: '(11) 97654-3210',
      ultimaVisita: '14/03/2024',
      iniciais: 'CA',
      cor: 'rosa'
    },
    {
      id: 3,
      nome: 'Mariana Silva',
      telefone: '(11) 96543-2109',
      ultimaVisita: '12/03/2024',
      iniciais: 'MS',
      cor: 'verde'
    },
    {
      id: 4,
      nome: 'Roberto Souza',
      telefone: '(11) 95432-1098',
      ultimaVisita: '08/03/2024',
      iniciais: 'RS',
      cor: 'amarelo'
    }
  ];

  constructor(
    private router: Router,
    private clientesService: ClientesService
  ) {
    addIcons({
      addCircleOutline,
      searchOutline
    });
  }

  // Clientes demonstrativos + novos cadastros
  get clientesFiltrados(): Cliente[] {

    const novos: Cliente[] = this.clientesService
      .listar()
      .map(cliente => ({
        id: cliente.id,
        nome: cliente.nome,
        telefone: cliente.telefone,
        ultimaVisita: 'Sem visitas',
        iniciais: this.obterIniciais(cliente.nome),
        cor: 'azul'
      }));

    const todos = [...this.clientes, ...novos];

    const busca = this.normalizar(this.termoBusca || '');

    if (!busca) {
      return todos;
    }

    return todos.filter(cliente => {
      const nome = this.normalizar(cliente.nome);
      const telefone = this.normalizar(cliente.telefone);

      return (
        nome.includes(busca) ||
        telefone.includes(busca)
      );
    });
  }

  // Gerar iniciais para o avatar
  private obterIniciais(nome: string): string {

    return nome
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(parte => parte.charAt(0).toUpperCase())
      .join('');
  }

  // Normalizar texto da pesquisa
  private normalizar(texto: string): string {

    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  // Detalhes do cliente (próxima etapa)
  consultarCliente(cliente: Cliente): void {
    this.exibirMensagem(
      `Detalhes de ${cliente.nome} serão implementados depois.`
    );
  }

  // Abrir formulário Novo Cliente
  novoCliente(): void {
    this.router.navigateByUrl('/novo-cliente');
  }

  private exibirMensagem(texto: string): void {
    this.mensagem = texto;
    this.toastAberto = true;
  }
}
