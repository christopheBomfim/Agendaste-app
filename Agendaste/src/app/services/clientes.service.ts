
import { Injectable, signal } from '@angular/core';

export interface ClienteCadastrado {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    observacoes: string;
}

@Injectable({
    providedIn: 'root'
})
export class ClientesService {

    private clientes = signal<ClienteCadastrado[]>([]);
    private proximoId = 1000;

    constructor() { }

    // Listar clientes cadastrados
    listar(): ClienteCadastrado[] {
        return this.clientes();
    }

    // Adicionar novo cliente
    adicionar(cliente: Omit<ClienteCadastrado, 'id'>): void {

        const novoCliente: ClienteCadastrado = {
            id: this.proximoId++,
            ...cliente
        };

        this.clientes.update(clientes => [
            ...clientes,
            novoCliente
        ]);
    }
}
