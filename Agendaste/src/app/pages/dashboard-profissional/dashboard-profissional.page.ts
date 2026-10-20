import { Component } from '@angular/core';

import {
  IonContent,
  IonAvatar,
  IonCard,
  IonCardContent,
  IonBadge
} from '@ionic/angular';

interface Indicador {
  titulo: string;
  valor: number;
  destaque: boolean;
}

interface AgendamentoResumo {
  id: number;
  cliente: string;
  servico: string;
  horario: string;
  status: 'Confirmado' | 'Pendente';
}

@Component({
  selector: 'app-dashboard-profissional',
  templateUrl: './dashboard-profissional.page.html',
  styleUrls: ['./dashboard-profissional.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonAvatar,
    IonCard,
    IonCardContent,
    IonBadge
  ]
})
export class DashboardProfissionalPage {

  nomeProfissional: string = 'Dr. Marcos';

  dataAtual: string = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  // Indicadores demonstrativos
  indicadores: Indicador[] = [
    {
      titulo: 'Total Clientes',
      valor: 124,
      destaque: false
    },
    {
      titulo: 'Agendados Hoje',
      valor: 8,
      destaque: true
    },
    {
      titulo: 'Esta Semana',
      valor: 32,
      destaque: false
    }
  ];

  // Próximos agendamentos demonstrativos
  agendamentos: AgendamentoResumo[] = [
    {
      id: 1,
      cliente: 'Mariana Silva',
      servico: 'Consulta',
      horario: '10:00',
      status: 'Confirmado'
    },
    {
      id: 2,
      cliente: 'Roberto Souza',
      servico: 'Retorno',
      horario: '11:15',
      status: 'Pendente'
    },
    {
      id: 3,
      cliente: 'Ana Costa',
      servico: 'Exame',
      horario: '14:30',
      status: 'Confirmado'
    },
    {
      id: 4,
      cliente: 'Carlos Alves',
      servico: 'Procedimento',
      horario: '16:00',
      status: 'Pendente'
    }
  ];
}
