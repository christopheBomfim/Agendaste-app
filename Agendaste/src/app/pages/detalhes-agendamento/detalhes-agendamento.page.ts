import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

interface DetalhesAgendamento {
  profissional: string;
  especialidade: string;
  status: string;
  statusClass: string;
  dataHora: string;
  local: string;
  observacoes: string;
}

@Component({
  selector: 'app-detalhes-agendamento',
  templateUrl: './detalhes-agendamento.page.html',
  styleUrls: ['./detalhes-agendamento.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule
  ]
})
export class DetalhesAgendamentoPage implements OnInit {

  agendamento: DetalhesAgendamento = {
    profissional: 'Dr. Marcos Silva',
    especialidade: 'Cardiologia e Medicina Interna',
    status: 'Confirmado',
    statusClass: 'status-confirmado',
    dataHora: 'Terça-feira, 14 de Março de 2024 às 09:15',
    local: 'Av. Paulista, 1000 - Conj. 121, Bela Vista, São Paulo - SP',
    observacoes: 'Trazer exames de sangue recentes e receitas anteriores se disponíveis.'
  };

  constructor() {
    addIcons({
      arrowBackOutline
    });
  }

  ngOnInit() {}

  remarcar() {
    console.log('Navegar para fluxo de remarcação');
  }

  cancelarAgendamento() {
    console.log('Solicitar cancelamento do agendamento');
  }

}