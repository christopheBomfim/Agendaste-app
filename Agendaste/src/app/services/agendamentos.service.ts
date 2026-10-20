
import { Injectable, signal } from '@angular/core';

export type StatusAgendamento =
    | 'Pendente'
    | 'Confirmado'
    | 'Concluído'
    | 'Cancelado';

export type TipoServico =
    | 'Consulta'
    | 'Retorno'
    | 'Exame';

export interface Agendamento {
    id: number;
    clienteId: number;
    clienteNome: string;
    tipoServico: TipoServico;
    data: string;
    horario: string;
    status: StatusAgendamento;
}

@Injectable({
    providedIn: 'root'
})
export class AgendamentosService {

    private agendamentos = signal<Agendamento[]>([]);

    private proximoId = 1;

    // Retornar agendamentos
    listar(): Agendamento[] {
        return this.agendamentos();
    }

    // Verificar se o horário já está ocupado
    horarioOcupado(
        data: string,
        horario: string
    ): boolean {

        return this.agendamentos().some(agendamento =>
            agendamento.data === data &&
            agendamento.horario === horario &&
            agendamento.status !== 'Cancelado'
        );
    }

    // Criar agendamento
    criar(
        dados: Omit<Agendamento, 'id' | 'status'>
    ): boolean {

        if (this.horarioOcupado(dados.data, dados.horario)) {
            return false;
        }

        const novoAgendamento: Agendamento = {
            ...dados,
            id: this.proximoId++,
            status: 'Pendente'
        };

        this.agendamentos.update(agendamentos => [
            ...agendamentos,
            novoAgendamento
        ]);

        return true;
    }
}
