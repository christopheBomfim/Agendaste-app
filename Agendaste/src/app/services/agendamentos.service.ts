
import { Injectable, signal } from '@angular/core';

import {
    collection,
    doc,
    getDocs,
    runTransaction,
    serverTimestamp
} from 'firebase/firestore';

import { auth, db } from '../firebase';

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
    id: string;
    clienteId: string;
    clienteNome: string;
    tipoServico: TipoServico;
    data: string;
    horario: string;
    status: StatusAgendamento;
}

type NovoAgendamento = Omit<Agendamento, 'id' | 'status'>;

@Injectable({
    providedIn: 'root'
})
export class AgendamentosService {

    private agendamentos = signal<Agendamento[]>([]);

    private usuarioAtual: string | null = null;

    // Identificar o profissional atual
    private verificarUsuario(): string | null {

        const uid = auth.currentUser?.uid ?? null;

        if (this.usuarioAtual !== uid) {
            this.usuarioAtual = uid;
            this.agendamentos.set([]);
        }

        return uid;
    }

    private async obterUid(): Promise<string> {

        await auth.authStateReady();

        const uid = this.verificarUsuario();

        if (!uid) {
            throw new Error('Profissional não autenticado.');
        }

        return uid;
    }

    // Listar os agendamentos carregados
    listar(): Agendamento[] {

        if (!this.verificarUsuario()) {
            return [];
        }

        return this.agendamentos();
    }

    // Carregar os agendamentos do Firestore
    async carregar(): Promise<void> {

        const uid = await this.obterUid();

        const referencia = collection(
            db,
            'profissionais',
            uid,
            'agendamentos'
        );

        const resultado = await getDocs(referencia);

        const agendamentos: Agendamento[] =
            resultado.docs.map(documento => {

                const dados = documento.data();

                return {
                    id: documento.id,
                    clienteId: dados['clienteId'] ?? '',
                    clienteNome: dados['clienteNome'] ?? '',
                    tipoServico: dados['tipoServico'] as TipoServico,
                    data: dados['data'] ?? '',
                    horario: dados['horario'] ?? '',
                    status: dados['status'] as StatusAgendamento
                };
            });

        agendamentos.sort((a, b) =>
            `${a.data}T${a.horario}`.localeCompare(
                `${b.data}T${b.horario}`
            )
        );

        // Não mostrar dados se o usuário mudou
        if (auth.currentUser?.uid !== uid) {
            return;
        }

        this.agendamentos.set(agendamentos);
    }

    // Verificar horários ocupados
    horarioOcupado(
        data: string,
        horario: string
    ): boolean {

        if (!this.verificarUsuario()) {
            return false;
        }

        return this.agendamentos().some(
            agendamento =>
                agendamento.data === data &&
                agendamento.horario === horario &&
                agendamento.status !== 'Cancelado'
        );
    }

    // Criar agendamento no Firestore
    async criar(
        dados: NovoAgendamento
    ): Promise<boolean> {

        const uid = await this.obterUid();

        // Um documento por data e horário
        const idAgendamento =
            `${dados.data}_${dados.horario}`;

        const referencia = doc(
            db,
            'profissionais',
            uid,
            'agendamentos',
            idAgendamento
        );

        // Verificar e reservar de forma transacional
        const criado = await runTransaction(
            db,
            async transacao => {

                const existente =
                    await transacao.get(referencia);

                // Horário já reservado
                if (existente.exists()) {
                    return false;
                }

                transacao.set(referencia, {
                    clienteId: dados.clienteId,
                    clienteNome: dados.clienteNome,
                    tipoServico: dados.tipoServico,
                    data: dados.data,
                    horario: dados.horario,
                    status: 'Pendente',
                    criadoEm: serverTimestamp()
                });

                return true;
            }
        );

        // Atualizar memória se a gravação funcionou
        if (
            criado &&
            auth.currentUser?.uid === uid
        ) {

            this.agendamentos.update(atuais => [
                ...atuais,
                {
                    id: idAgendamento,
                    ...dados,
                    status: 'Pendente'
                }
            ]);
        }

        return criado;
    }
}
