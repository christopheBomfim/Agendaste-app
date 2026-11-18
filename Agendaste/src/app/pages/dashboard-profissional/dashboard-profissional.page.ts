import {
  Component,
  signal,
  ChangeDetectorRef
} from '@angular/core';

import { Router } from '@angular/router';

import {
  IonContent,
  IonAvatar,
  IonCard,
  IonCardContent,
  IonBadge
} from '@ionic/angular';

import {
  ProfissionaisService
} from '../../services/profissionais.service';

import {
  ClientesService
} from '../../services/clientes.service';

import {
  AgendamentosService,
  Agendamento
} from '../../services/agendamentos.service';

interface Indicador {
  titulo: string;
  valor: number;
  destaque: boolean;
}

interface AgendamentoResumo {
  id: string;
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

  erroAgendamentos = signal('');

  // =====================================
  // DADOS DO PROFISSIONAL
  // =====================================

  nomeProfissional = signal('Profissional');
  iniciaisProfissional = signal('P');

  erroPerfil = signal('');
  erroResumo = signal('');

  // =====================================
  // DATA ATUAL
  // =====================================

  dataAtual = this.formatarDataAtual();

  // =====================================
  // INDICADORES
  // =====================================

  indicadores: Indicador[] = [
    {
      titulo: 'Total Clientes',
      valor: 0,
      destaque: false
    },
    {
      titulo: 'Agendados Hoje',
      valor: 0,
      destaque: true
    },
    {
      titulo: 'Esta Semana',
      valor: 0,
      destaque: false
    }
  ];

  // =====================================
  // PRÓXIMOS AGENDAMENTOS
  // =====================================

  agendamentos: AgendamentoResumo[] = [];

  constructor(
    private profissionaisService: ProfissionaisService,
    private clientesService: ClientesService,
    private agendamentosService: AgendamentosService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  // =====================================
  // AO ENTRAR NO DASHBOARD
  // =====================================


  ionViewWillEnter(): void {

    this.dataAtual = this.formatarDataAtual();

    // Limpar os agendamentos exibidos anteriormente
    this.agendamentos = [];

    this.indicadores = this.indicadores.map(
      indicador =>
        indicador.titulo === 'Agendados Hoje' ||
          indicador.titulo === 'Esta Semana'
          ? { ...indicador, valor: 0 }
          : indicador
    );

    this.cdr.markForCheck();

    void this.carregarProfissional();
    void this.carregarClientes();
    void this.carregarAgendamentos();
  }

  // Buscar agendamentos no Firestore
  async carregarAgendamentos(): Promise<void> {

    this.erroAgendamentos.set('');

    try {

      await this.agendamentosService.carregar();

      // Recalcular os indicadores e a lista
      this.atualizarAgendamentos();

    } catch (erro) {

      console.error(
        'Erro ao carregar agendamentos:',
        erro
      );

      this.agendamentos = [];

      this.erroAgendamentos.set(
        'Não foi possível carregar os agendamentos.'
      );

      this.cdr.markForCheck();
    }
  }


  // =====================================
  // DATA FORMATADA
  // =====================================

  private formatarDataAtual(): string {

    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(new Date());
  }

  // =====================================
  // GERAR DATA LOCAL NO FORMATO ISO
  // =====================================

  private formatarDataISO(data: Date): string {

    const ano = data.getFullYear();

    const mes = String(
      data.getMonth() + 1
    ).padStart(2, '0');

    const dia = String(
      data.getDate()
    ).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }

  // =====================================
  // CARREGAR PROFISSIONAL DO FIREBASE
  // =====================================

  async carregarProfissional(): Promise<void> {

    this.erroPerfil.set('');

    // Evitar mostrar dados da conta anterior
    this.nomeProfissional.set('Profissional');
    this.iniciaisProfissional.set('P');

    try {

      const perfil =
        await this.profissionaisService.obterPerfilAtual();

      const partes = perfil.nome
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      // Primeiro nome
      const primeiroNome =
        partes[0] || 'Profissional';

      this.nomeProfissional.set(primeiroNome);

      // Iniciais do avatar
      const primeiraInicial =
        partes[0]?.charAt(0) ?? '';

      const ultimaInicial =
        partes.length > 1
          ? partes[partes.length - 1].charAt(0)
          : '';

      const iniciais = (
        primeiraInicial + ultimaInicial
      ).toUpperCase();

      this.iniciaisProfissional.set(
        iniciais || 'P'
      );

    } catch (erro) {

      console.error(
        'Erro ao carregar profissional:',
        erro
      );

      this.erroPerfil.set(
        'Não foi possível carregar seus dados.'
      );
    }
  }

  // =====================================
  // CARREGAR TOTAL DE CLIENTES
  // =====================================

  async carregarClientes(): Promise<void> {

    this.erroResumo.set('');

    // Não exibir o total anterior enquanto carrega
    this.indicadores = this.indicadores.map(
      indicador =>
        indicador.titulo === 'Total Clientes'
          ? { ...indicador, valor: 0 }
          : indicador
    );

    this.cdr.markForCheck();

    try {

      // Buscar clientes cadastrados no Firestore
      await this.clientesService.carregar();

      const totalClientes =
        this.clientesService.listar().length;

      this.indicadores = this.indicadores.map(
        indicador => {

          if (indicador.titulo === 'Total Clientes') {

            return {
              ...indicador,
              valor: totalClientes
            };
          }

          return indicador;
        }
      );

    } catch (erro) {

      console.error(
        'Erro ao carregar clientes:',
        erro
      );

      this.erroResumo.set(
        'Não foi possível atualizar o total de clientes.'
      );

    } finally {

      this.cdr.markForCheck();
    }
  }

  // =====================================
  // ATUALIZAR AGENDAMENTOS E INDICADORES
  // =====================================

  atualizarAgendamentos(): void {

    const agora = new Date();

    const hoje = this.formatarDataISO(agora);

    // Início da semana: segunda-feira
    const inicioSemana = new Date(agora);
    inicioSemana.setHours(0, 0, 0, 0);

    const diasDesdeSegunda =
      (inicioSemana.getDay() + 6) % 7;

    inicioSemana.setDate(
      inicioSemana.getDate() - diasDesdeSegunda
    );

    // Final da semana: domingo
    const fimSemana = new Date(inicioSemana);

    fimSemana.setDate(
      inicioSemana.getDate() + 6
    );

    const inicioISO =
      this.formatarDataISO(inicioSemana);

    const fimISO =
      this.formatarDataISO(fimSemana);

    // Buscar agendamentos do serviço atual
    const todos =
      this.agendamentosService.listar();

    // Agendamentos que ainda estão ativos
    const ativos = todos.filter(
      agendamento =>
        agendamento.status === 'Pendente' ||
        agendamento.status === 'Confirmado'
    );

    // Total de agendamentos de hoje
    const agendadosHoje = ativos.filter(
      agendamento =>
        agendamento.data === hoje
    ).length;

    // Total de agendamentos da semana atual
    const agendadosSemana = ativos.filter(
      agendamento =>
        agendamento.data >= inicioISO &&
        agendamento.data <= fimISO
    ).length;

    // Atualizar indicadores
    this.indicadores = this.indicadores.map(
      indicador => {

        if (indicador.titulo === 'Agendados Hoje') {
          return {
            ...indicador,
            valor: agendadosHoje
          };
        }

        if (indicador.titulo === 'Esta Semana') {
          return {
            ...indicador,
            valor: agendadosSemana
          };
        }

        return indicador;
      }
    );

    // =====================================
    // PRÓXIMOS AGENDAMENTOS FUTUROS
    // =====================================

    const proximos = ativos
      .filter(agendamento => {

        const dataHora = new Date(
          `${agendamento.data}T${agendamento.horario}:00`
        );

        return dataHora.getTime() > agora.getTime();
      })
      .sort((a, b) => {

        const dataA =
          `${a.data}T${a.horario}`;

        const dataB =
          `${b.data}T${b.horario}`;

        return dataA.localeCompare(dataB);
      })
      .slice(0, 4);

    // Adaptar ao HTML já existente
    this.agendamentos = proximos.map(
      (agendamento: Agendamento) => {

        const [ano, mes, dia] =
          agendamento.data.split('-');

        return {
          id: agendamento.id,

          cliente: agendamento.clienteNome,

          servico: agendamento.tipoServico,

          horario:
            `${dia}/${mes}/${ano} às ${agendamento.horario}`,

          status:
            agendamento.status === 'Confirmado'
              ? 'Confirmado'
              : 'Pendente'
        };
      }
    );

    this.cdr.markForCheck();
  }

  // =====================================
  // ABRIR PERFIL
  // =====================================

  irParaPerfil(): void {

    this.router.navigate([
      '/profissional/perfil'
    ]);
  }

  // =====================================
  // CLICAR NOS INDICADORES
  // =====================================

  clicarIndicador(titulo: string): void {

    if (titulo === 'Total Clientes') {

      this.router.navigate([
        '/profissional/clientes'
      ]);

    }
  }
}
