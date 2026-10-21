import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonFooter,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  calendarNumberOutline,
  gitNetworkOutline,
  personOutline
} from 'ionicons/icons';

interface Agendamento {
  profissional: string;
  especialidade: string;
  status: string;
  statusClass: string;
  servico: string;
  dataHora: string;
}

@Component({
  selector: 'app-agendamentos-cliente',
  templateUrl: './agendamentos-cliente.page.html',
  styleUrls: ['./agendamentos-cliente.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonFooter,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    CommonModule,
    FormsModule
  ]
})
export class AgendamentosClientePage implements OnInit {

  abaSelecionada: 'proximos' | 'historico' = 'proximos';

  agendamentosProximos: Agendamento[] = [
    {
      profissional: 'Dr. Marcos Silva',
      especialidade: 'Cardiologista',
      status: 'Confirmado',
      statusClass: 'status-confirmado',
      servico: 'Consulta',
      dataHora: '14 Março 2024 - 09:15'
    },
    {
      profissional: 'Dra. Patricia Lima',
      especialidade: 'Dermatologista',
      status: 'Pendente',
      statusClass: 'status-pendente',
      servico: 'Exame',
      dataHora: '18 Março 2024 - 14:00'
    },
    {
      profissional: 'Dr. Marcos Silva',
      especialidade: 'Cardiologista',
      status: 'Pendente',
      statusClass: 'status-pendente',
      servico: 'Retorno',
      dataHora: '05 Maio 2024 - 10:30'
    }
  ];

  agendamentosHistorico: Agendamento[] = [];

  constructor(private router: Router) {
    addIcons({
      homeOutline,
      calendarNumberOutline,
      gitNetworkOutline,
      personOutline
    });
  }

  ngOnInit() {}

  navegar(rota: string) {
    this.router.navigate([rota]);
  }

  verDetalhes(item?: Agendamento) {
    this.router.navigate(['/detalhes-agendamento']);
  }

}