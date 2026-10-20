import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonButton,
  IonInput,
  IonTextarea,
  IonIcon,
  IonToast
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-novo-cliente',
  templateUrl: './novo-cliente.page.html',
  styleUrls: ['./novo-cliente.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonButton,
    IonInput,
    IonTextarea,
    IonIcon,
    IonToast
  ]
})
export class NovoClientePage {

  nome = '';
  email = '';
  telefone = '';
  dataNascimento = '';
  observacoes = '';

  mensagem = '';
  toastAberto = false;

  constructor(
    private router: Router,
    private clientesService: ClientesService
  ) {
    addIcons({ arrowBackOutline });
  }

  // Formatação automática: DD/MM/AAAA
  formatarDataNascimento(evento: Event): void {

    const eventoInput = evento as CustomEvent<{
      value?: string | null;
    }>;

    const numeros = (eventoInput.detail.value ?? '')
      .replace(/\D/g, '')
      .slice(0, 8);

    let data = numeros.slice(0, 2);

    if (numeros.length > 2) {
      data += '/' + numeros.slice(2, 4);
    }

    if (numeros.length > 4) {
      data += '/' + numeros.slice(4, 8);
    }

    this.dataNascimento = data;
  }

  // Validação da data de nascimento
  private dataValida(data: string): boolean {

    const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data);

    if (!partes) {
      return false;
    }

    const dia = Number(partes[1]);
    const mes = Number(partes[2]);
    const ano = Number(partes[3]);

    const nascimento = new Date(ano, mes - 1, dia);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return (
      nascimento.getFullYear() === ano &&
      nascimento.getMonth() === mes - 1 &&
      nascimento.getDate() === dia &&
      nascimento <= hoje
    );
  }

  // Salvar cliente
  salvarCliente(): void {

    // Campos obrigatórios
    if (
      !this.nome.trim() ||
      !this.email.trim() ||
      !this.telefone.trim()
    ) {
      this.exibirMensagem(
        'Preencha nome, e-mail e telefone.'
      );
      return;
    }

    // Validar nome
    if (this.nome.trim().length < 3) {
      this.exibirMensagem('Digite um nome válido.');
      return;
    }

    // Validar e-mail
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(this.email.trim())) {
      this.exibirMensagem('Digite um e-mail válido.');
      return;
    }

    // Validar telefone
    const numerosTelefone = this.telefone.replace(/\D/g, '');

    if (
      numerosTelefone.length !== 10 &&
      numerosTelefone.length !== 11
    ) {
      this.exibirMensagem('Digite um telefone válido.');
      return;
    }

    // Validar data, quando informada
    if (
      this.dataNascimento &&
      !this.dataValida(this.dataNascimento)
    ) {
      this.exibirMensagem(
        'Informe uma data de nascimento válida.'
      );
      return;
    }

    // Cadastro demonstrativo
    this.clientesService.adicionar({
      nome: this.nome.trim(),
      email: this.email.trim().toLowerCase(),
      telefone: this.telefone.trim(),
      dataNascimento: this.dataNascimento,
      observacoes: this.observacoes.trim()
    });

    // Retornar para a lista
    this.router.navigateByUrl('/profissional/clientes');
  }

  voltar(): void {
    this.router.navigateByUrl('/profissional/clientes');
  }

  private exibirMensagem(texto: string): void {
    this.mensagem = texto;
    this.toastAberto = true;
  }
}
