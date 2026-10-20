
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonToast
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  chevronBackOutline,
  chevronForwardOutline
} from 'ionicons/icons';

import {
  ClientesService
} from '../../services/clientes.service';

import {
  AgendamentosService,
  TipoServico
} from '../../services/agendamentos.service';

interface ClienteSelecao {
  id: number;
  nome: string;
}

interface DiaAgenda {
  iso: string;
  numero: number;
  semana: string;
}

@Component({
  selector: 'app-agendar',
  templateUrl: './agendar.page.html',
  styleUrls: ['./agendar.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonToast
  ]
})
export class AgendarPage {

  // Cliente selecionado
  clienteSelecionado: number | null = null;

  // Tipos de serviço
  tiposServico: TipoServico[] = [
    'Consulta',
    'Retorno',
    'Exame'
  ];

  tipoSelecionado: TipoServico = 'Consulta';

  // Horários demonstrativos
  horarios: string[] = [
    '08:30',
    '09:15',
    '10:00',
    '11:30',
    '14:00',
    '15:30'
  ];

  horarioSelecionado = '';

  // Calendário
  dias: DiaAgenda[] = this.gerarDiasUteis(60);

  grupoDias = 0;

  dataSelecionada: string = this.dias[0].iso;

  // Mensagens
  mensagem = '';
  toastAberto = false;

  // Clientes demonstrativos do PDF
  private clientesDemo: ClienteSelecao[] = [
    { id: 1, nome: 'Ana Costa' },
    { id: 2, nome: 'Carlos Alves' },
    { id: 3, nome: 'Mariana Silva' },
    { id: 4, nome: 'Roberto Souza' }
  ];

  constructor(
    private router: Router,
    private clientesService: ClientesService,
    private agendamentosService: AgendamentosService
  ) {
    addIcons({
      arrowBackOutline,
      chevronBackOutline,
      chevronForwardOutline
    });
  }

  // Clientes disponíveis
  get clientes(): ClienteSelecao[] {

    const novosClientes = this.clientesService
      .listar()
      .map(cliente => ({
        id: cliente.id,
        nome: cliente.nome
      }));

    return [
      ...this.clientesDemo,
      ...novosClientes
    ];
  }

  // Gerar próximos dias úteis
  private gerarDiasUteis(quantidade: number): DiaAgenda[] {

    const resultado: DiaAgenda[] = [];

    const data = new Date();
    data.setHours(0, 0, 0, 0);

    const nomesSemana = [
      'Dom',
      'Seg',
      'Ter',
      'Qua',
      'Qui',
      'Sex',
      'Sáb'
    ];

    while (resultado.length < quantidade) {

      const diaSemana = data.getDay();

      // Segunda a sexta
      if (diaSemana !== 0 && diaSemana !== 6) {

        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');

        resultado.push({
          iso: `${ano}-${mes}-${dia}`,
          numero: data.getDate(),
          semana: nomesSemana[diaSemana]
        });
      }

      data.setDate(data.getDate() + 1);
    }

    return resultado;
  }

  // Grupo de cinco dias exibidos
  get diasExibidos(): DiaAgenda[] {

    const inicio = this.grupoDias * 5;

    return this.dias.slice(inicio, inicio + 5);
  }

  // Verificar se existem mais dias
  get possuiProximoGrupo(): boolean {
    return (this.grupoDias + 1) * 5 < this.dias.length;
  }

  // Mês exibido no calendário
  get periodoExibido(): string {

    const primeiroDia = this.diasExibidos[0];

    if (!primeiroDia) {
      return '';
    }

    const [ano, mes, dia] = primeiroDia.iso
      .split('-')
      .map(Number);

    const data = new Date(ano, mes - 1, dia);

    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric'
    }).format(data);
  }

  // Voltar cinco dias úteis
  semanaAnterior(): void {

    if (this.grupoDias > 0) {
      this.grupoDias--;
      this.selecionarDia(this.diasExibidos[0].iso);
    }
  }

  // Avançar cinco dias úteis
  proximaSemana(): void {

    if (this.possuiProximoGrupo) {
      this.grupoDias++;
      this.selecionarDia(this.diasExibidos[0].iso);
    }
  }

  // Selecionar tipo de serviço
  selecionarTipo(tipo: TipoServico): void {
    this.tipoSelecionado = tipo;
  }

  // Selecionar dia
  selecionarDia(data: string): void {
    this.dataSelecionada = data;
    this.horarioSelecionado = '';
  }

  // Verificar horários indisponíveis
  horarioIndisponivel(horario: string): boolean {

    const dataHora = new Date(
      `${this.dataSelecionada}T${horario}:00`
    );

    // Não permitir horários passados
    if (dataHora.getTime() <= Date.now()) {
      return true;
    }

    // Verificar horário já reservado
    return this.agendamentosService.horarioOcupado(
      this.dataSelecionada,
      horario
    );
  }

  // Selecionar horário
  selecionarHorario(horario: string): void {

    if (!this.horarioIndisponivel(horario)) {
      this.horarioSelecionado = horario;
    }
  }

  // Confirmar agendamento
  confirmarAgendamento(): void {

    if (this.clienteSelecionado === null) {
      this.exibirMensagem('Selecione um cliente.');
      return;
    }

    if (!this.horarioSelecionado) {
      this.exibirMensagem('Selecione um horário disponível.');
      return;
    }

    if (this.horarioIndisponivel(this.horarioSelecionado)) {
      this.exibirMensagem('Este horário não está disponível.');
      return;
    }

    const cliente = this.clientes.find(
      cliente => cliente.id === this.clienteSelecionado
    );

    if (!cliente) {
      this.exibirMensagem('Cliente não encontrado.');
      return;
    }

    const criado = this.agendamentosService.criar({
      clienteId: cliente.id,
      clienteNome: cliente.nome,
      tipoServico: this.tipoSelecionado,
      data: this.dataSelecionada,
      horario: this.horarioSelecionado
    });

    if (!criado) {
      this.exibirMensagem('Este horário já está reservado.');
      return;
    }

    this.exibirMensagem(
      'Agendamento criado com sucesso! Status: Pendente.'
    );

    // Limpar seleção para novo agendamento
    this.clienteSelecionado = null;
    this.tipoSelecionado = 'Consulta';
    this.horarioSelecionado = '';
  }

  // Voltar ao Dashboard
  voltar(): void {
    this.router.navigateByUrl('/profissional/inicio');
  }

  private exibirMensagem(texto: string): void {
    this.mensagem = texto;
    this.toastAberto = true;
  }
}
