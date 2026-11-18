import { Injectable, signal } from '@angular/core';

import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    serverTimestamp
} from 'firebase/firestore';

import { auth, db } from '../firebase';

// Estrutura de um cliente cadastrado
export interface ClienteCadastrado {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    observacoes: string;
}

// Dados recebidos do formulário
export type NovoCliente = Omit<ClienteCadastrado, 'id'>;

@Injectable({
    providedIn: 'root'
})
export class ClientesService {

    // Clientes carregados do Firestore
    private clientes = signal<ClienteCadastrado[]>([]);

    // Identifica a conta à qual os dados pertencem
    private usuarioDoCache: string | null = null;

    // =====================================
    // VERIFICAR PROFISSIONAL AUTENTICADO
    // =====================================

    private async obterUid(): Promise<string> {

        await auth.authStateReady();

        const uid = auth.currentUser?.uid;

        if (!uid) {
            this.usuarioDoCache = null;
            this.clientes.set([]);

            throw new Error(
                'Profissional não autenticado.'
            );
        }

        // Evitar misturar clientes de contas diferentes
        if (this.usuarioDoCache !== uid) {
            this.usuarioDoCache = uid;
            this.clientes.set([]);
        }

        return uid;
    }

    // =====================================
    // LISTAR CLIENTES EM MEMÓRIA
    // =====================================

    listar(): ClienteCadastrado[] {

        // Não apresentar dados de outra sessão
        if (
            !auth.currentUser ||
            auth.currentUser.uid !== this.usuarioDoCache
        ) {
            return [];
        }

        return this.clientes();
    }

    // =====================================
    // CARREGAR CLIENTES DO FIRESTORE
    // =====================================

    async carregar(): Promise<void> {

        const uid = await this.obterUid();

        const referencia = collection(
            db,
            'profissionais',
            uid,
            'clientes'
        );

        const consulta = query(
            referencia,
            orderBy('nome')
        );

        const resultado = await getDocs(consulta);

        const clientesCarregados: ClienteCadastrado[] =
            resultado.docs.map(documento => {

                const dados = documento.data();

                return {
                    id: documento.id,
                    nome: dados['nome'] ?? '',
                    email: dados['email'] ?? '',
                    telefone: dados['telefone'] ?? '',
                    dataNascimento: dados['dataNascimento'] ?? '',
                    observacoes: dados['observacoes'] ?? ''
                };
            });

        // Evitar atualizar a lista com dados de
        // uma conta que já saiu do aplicativo
        if (auth.currentUser?.uid !== uid) {
            return;
        }

        this.clientes.set(clientesCarregados);
    }

    // =====================================
    // ADICIONAR CLIENTE NO FIRESTORE
    // =====================================

    async adicionar(
        cliente: NovoCliente
    ): Promise<void> {

        const uid = await this.obterUid();

        const referencia = collection(
            db,
            'profissionais',
            uid,
            'clientes'
        );

        // Salvar no Firebase
        const documento = await addDoc(referencia, {
            nome: cliente.nome,
            email: cliente.email,
            telefone: cliente.telefone,
            dataNascimento: cliente.dataNascimento,
            observacoes: cliente.observacoes,
            criadoEm: serverTimestamp()
        });

        // Atualizar também a lista em memória
        if (auth.currentUser?.uid === uid) {

            const novoCliente: ClienteCadastrado = {
                id: documento.id,
                ...cliente
            };

            this.clientes.update(clientes =>
                [...clientes, novoCliente].sort(
                    (a, b) => a.nome.localeCompare(
                        b.nome,
                        'pt-BR'
                    )
                )
            );
        }
    }
}
