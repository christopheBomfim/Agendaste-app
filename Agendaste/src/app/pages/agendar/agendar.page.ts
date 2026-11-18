import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

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
  id: string;
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


  carregandoAgendamentos = false;
  agendamentosCarregados = false;
  salvando = false;


  // =====================================
  // SELEÇÃO DO CLIENTE
  // =====================================

  clienteSelecionado: string | null = null;

  carregandoClientes = false;
  clientesCarregados = false;

  // =====================================
  // TIPOS DE SERVIÇO
  // =====================================

  tiposServico: TipoServico[] = [
    'Consulta',
    'Retorno',
    'Exame'
  ];

  tipoSelecionado: TipoServico = 'Consulta';

  // =====================================
  // HORÁRIOS DEMONSTRATIVOS
  // =====================================

  horarios: string[] = [
    '08:30',
    '09:15',
    '10:00',
    '11:30',
    '14:00',
    '15:30'
  ];

  horarioSelecionado = '';

  // =====================================
  // CALENDÁRIO
  // =====================================

  dias: DiaAgenda[] = this.gerarDiasUteis(60);

  grupoDias = 0;

  dataSelecionada: string = this.dias[0].iso;

  // =====================================
  // MENSAGENS
  // =====================================

  mensagem = '';
  toastAberto = false;

  constructor(
    private router: Router,
    private clientesService: ClientesService,
    private agendamentosService: AgendamentosService,
    private cdr: ChangeDetectorRef
  ) {

    addIcons({
      arrowBackOutline,
      chevronBackOutline,
      chevronForwardOutline
    });
  }

  // =====================================
  // CARREGAR CLIENTES AO ABRIR A PÁGINA
  // =====================================

  ionViewWillEnter(): void {
    void this.carregarClientes();
    void this.carregarAgendamentos();
  }

  async carregarClientes(): Promise<void> {

    this.carregandoClientes = true;
    this.clientesCarregados = false;

    this.cdr.markForCheck();

    try {

      // Buscar clientes do profissional no Firestore
      await this.clientesService.carregar();

      this.clientesCarregados = true;

      // Verificar se o cliente selecionado ainda existe
      if (
        this.clienteSelecionado !== null &&
        !this.clientes.some(
          cliente => cliente.id === this.clienteSelecionado
        )
      ) {
        this.clienteSelecionado = null;
      }

    } catch (erro) {

      console.error(
        'Erro ao carregar clientes:',
        erro
      );

      this.exibirMensagem(
        'Não foi possível carregar os clientes do Firebase.'
      );

    } finally {

      this.carregandoClientes = false;

      this.cdr.markForCheck();
    }
  }

  // =====================================
  // CARREGAR AGENDAMENTOS AO ABRIR A PÁGINA
  // =====================================

  async carregarAgendamentos(): Promise<void> {

    this.carregandoAgendamentos = true;
    this.agendamentosCarregados = false;

    this.cdr.markForCheck();

    try {

      await this.agendamentosService.carregar();

      this.agendamentosCarregados = true;

    } catch (erro) {

      console.error(
        'Erro ao carregar agendamentos:',
        erro
      );

      this.exibirMensagem(
        'Não foi possível consultar os horários reservados.'
      );

    } finally {

      this.carregandoAgendamentos = false;
      this.cdr.markForCheck();

    }
  }


  // =====================================
  // CLIENTES DISPONÍVEIS NO FIRESTORE
  // =====================================

  get clientes(): ClienteSelecao[] {

    // Não exibir dados antigos se a consulta falhar
    if (!this.clientesCarregados) {
      return [];
    }

    return this.clientesService
      .listar()
      .map(cliente => ({
        id: cliente.id,
        nome: cliente.nome
      }));
  }

  // =====================================
  // GERAR PRÓXIMOS DIAS ÚTEIS
  // =====================================

  private gerarDiasUteis(
    quantidade: number
  ): DiaAgenda[] {

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

      // Segunda a sexta-feira
      if (
        diaSemana !== 0 &&
        diaSemana !== 6
      ) {

        const ano = data.getFullYear();

        const mes = String(
          data.getMonth() + 1
        ).padStart(2, '0');

        const dia = String(
          data.getDate()
        ).padStart(2, '0');

        resultado.push({

          iso: `${ano}-${mes}-${dia}`,

          numero: data.getDate(),

          semana: nomesSemana[diaSemana]

        });
      }

      // Avançar um dia
      data.setDate(data.getDate() + 1);
    }

    return resultado;
  }

  // =====================================
  // CINCO DIAS POR GRUPO
  // =====================================

  get diasExibidos(): DiaAgenda[] {

    const inicio = this.grupoDias * 5;

    return this.dias.slice(
      inicio,
      inicio + 5
    );
  }

  // =====================================
  // VERIFICAR PRÓXIMO GRUPO
  // =====================================

  get possuiProximoGrupo(): boolean {

    return (
      (this.grupoDias + 1) * 5 <
      this.dias.length
    );
  }

  // =====================================
  // MÊS EXIBIDO
  // =====================================

  get periodoExibido(): string {

    const primeiroDia = this.diasExibidos[0];

    if (!primeiroDia) {
      return '';
    }

    const [ano, mes, dia] = primeiroDia.iso
      .split('-')
      .map(Number);

    const data = new Date(
      ano,
      mes - 1,
      dia
    );

    return new Intl.DateTimeFormat(
      'pt-BR',
      {
        month: 'long',
        year: 'numeric'
      }
    ).format(data);
  }

  // =====================================
  // SEMANA ANTERIOR
  // =====================================

  semanaAnterior(): void {

    if (this.grupoDias > 0) {

      this.grupoDias--;

      this.selecionarDia(
        this.diasExibidos[0].iso
      );
    }
  }

  // =====================================
  // PRÓXIMA SEMANA
  // =====================================

  proximaSemana(): void {

    if (this.possuiProximoGrupo) {

      this.grupoDias++;

      this.selecionarDia(
        this.diasExibidos[0].iso
      );
    }
  }

  // =====================================
  // SELECIONAR TIPO DE SERVIÇO
  // =====================================

  selecionarTipo(
    tipo: TipoServico
  ): void {

    this.tipoSelecionado = tipo;
  }

  // =====================================
  // SELECIONAR DIA
  // =====================================

  selecionarDia(data: string): void {

    this.dataSelecionada = data;

    // Limpar horário ao trocar a data
    this.horarioSelecionado = '';
  }

  // =====================================
  // VERIFICAR HORÁRIOS INDISPONÍVEIS
  // =====================================


  horarioIndisponivel(
    horario: string
  ): boolean {

    // Enquanto a agenda não foi carregada,
    // não podemos confirmar disponibilidade.
    if (!this.agendamentosCarregados) {
      return true;
    }

    const dataHora = new Date(
      `${this.dataSelecionada}T${horario}:00`
    );

    if (dataHora.getTime() <= Date.now()) {
      return true;
    }

    return this.agendamentosService.horarioOcupado(
      this.dataSelecionada,
      horario
    );
  }


  // =====================================
  // SELECIONAR HORÁRIO
  // =====================================

  selecionarHorario(
    horario: string
  ): void {

    if (
      !this.horarioIndisponivel(horario)
    ) {

      this.horarioSelecionado = horario;
    }
  }

  // =====================================
  // CONFIRMAR AGENDAMENTO
  // =====================================


  async confirmarAgendamento(): Promise<void> {

    if (this.salvando) {
      return;
    }

    if (
      !this.clientesCarregados ||
      !this.agendamentosCarregados
    ) {
      this.exibirMensagem(
        'Aguarde o carregamento dos dados.'
      );
      return;
    }

    if (!this.clienteSelecionado) {
      this.exibirMensagem('Selecione um cliente.');
      return;
    }

    if (!this.horarioSelecionado) {
      this.exibirMensagem(
        'Selecione um horário disponível.'
      );
      return;
    }

    if (
      this.horarioIndisponivel(
        this.horarioSelecionado
      )
    ) {
      this.exibirMensagem(
        'Este horário não está disponível.'
      );
      return;
    }

    const cliente = this.clientes.find(
      cliente => cliente.id === this.clienteSelecionado
    );

    if (!cliente) {
      this.exibirMensagem('Cliente não encontrado.');
      return;
    }

    this.salvando = true;
    this.cdr.markForCheck();

    try {

      const criado =
        await this.agendamentosService.criar({
          clienteId: cliente.id,
          clienteNome: cliente.nome,
          tipoServico: this.tipoSelecionado,
          data: this.dataSelecionada,
          horario: this.horarioSelecionado
        });

      if (!criado) {

        this.exibirMensagem(
          'Este horário já está reservado.'
        );

        // Recarregar os horários
        await this.carregarAgendamentos();

        return;
      }

      this.exibirMensagem(
        'Agendamento salvo no Firebase! Status: Pendente.'
      );

      this.clienteSelecionado = null;
      this.tipoSelecionado = 'Consulta';
      this.horarioSelecionado = '';

    } catch (erro) {

      console.error(
        'Erro ao criar agendamento:',
        erro
      );

      this.exibirMensagem(
        'Não foi possível salvar o agendamento.'
      );

    } finally {

      this.salvando = false;
      this.cdr.markForCheck();

    }
  }


  // =====================================
  // VOLTAR AO DASHBOARD
  // =====================================

  voltar(): void {

    this.router.navigateByUrl(
      '/profissional/inicio'
    );
  }

  // =====================================
  // EXIBIR MENSAGENS
  // =====================================

  private exibirMensagem(
    texto: string
  ): void {

    this.mensagem = texto;

    this.toastAberto = true;

    this.cdr.markForCheck();
  }
}
