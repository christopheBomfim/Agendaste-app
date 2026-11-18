import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  ToastController
} from '@ionic/angular';

import { FirebaseError } from 'firebase/app';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  personOutline,
  briefcaseOutline,
  medicalOutline,
  timeOutline,
  callOutline,
  caretDownSharp
} from 'ionicons/icons';

import {
  ProfissionaisService,
  AtualizacaoPerfilProfissional
} from '../../services/profissionais.service';

@Component({
  selector: 'app-editar-perfil-profissional',
  templateUrl: './editar-perfil-profissional.page.html',
  styleUrls: ['./editar-perfil-profissional.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption
  ]
})
export class EditarPerfilProfissionalPage {

  perfil = {
    nome: '',
    profissao: '',
    especialidade: '',
    horarioInicio: '',
    horarioFim: '',
    telefone: '',
    tipoConselho: '',
    ufConselho: '',
    numeroRegistro: ''
  };

  carregando = false;
  salvando = false;

  constructor(
    private router: Router,
    private profissionaisService: ProfissionaisService,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      arrowBackOutline,
      personOutline,
      briefcaseOutline,
      medicalOutline,
      timeOutline,
      callOutline,
      caretDownSharp
    });
  }

  // Executado quando a página é aberta
  ionViewWillEnter(): void {
    void this.carregarPerfil();
  }

  // =====================================
  // CARREGAR DADOS DO FIREBASE
  // =====================================

  async carregarPerfil(): Promise<void> {

    this.carregando = true;
    this.cdr.markForCheck();

    try {

      const dados =
        await this.profissionaisService.obterPerfilAtual();

      this.perfil = {
        nome: dados.nome,
        profissao: dados.profissao,
        especialidade: dados.especialidade,
        telefone: dados.celular,
        horarioInicio: dados.horarioInicio,
        horarioFim: dados.horarioFim,
        tipoConselho: dados.tipoConselho,
        ufConselho: dados.ufConselho,
        numeroRegistro: dados.numeroRegistro
      };

      this.cdr.markForCheck();

    } catch (erro) {

      console.error(
        'Erro ao carregar perfil:',
        erro
      );

      await this.mostrarToast(
        'Não foi possível carregar seus dados.',
        'danger'
      );

    } finally {

      this.carregando = false;
      this.cdr.markForCheck();

    }
  }

  // =====================================
  // ALTERAR FOTO
  // =====================================

  async alterarFoto(): Promise<void> {

    // Upload será implementado posteriormente
    await this.mostrarToast(
      'A alteração da foto será implementada depois.',
      'medium'
    );

  }

  // =====================================
  // SALVAR ALTERAÇÕES
  // =====================================

  async salvarAlteracoes(): Promise<void> {

    if (this.salvando || this.carregando) {
      return;
    }

    const dados: AtualizacaoPerfilProfissional = {
      nome: this.perfil.nome.trim(),
      profissao: this.perfil.profissao.trim(),
      especialidade: this.perfil.especialidade.trim(),
      celular: this.perfil.telefone.trim(),
      horarioInicio: this.perfil.horarioInicio.trim(),
      horarioFim: this.perfil.horarioFim.trim(),
      tipoConselho: this.perfil.tipoConselho,
      ufConselho: this.perfil.ufConselho,
      numeroRegistro: this.perfil.numeroRegistro.trim()
    };

    // Validar campos obrigatórios
    if (
      !dados.nome ||
      !dados.profissao ||
      !dados.especialidade ||
      !dados.celular
    ) {

      await this.mostrarToast(
        'Preencha nome, profissão, especialidade e telefone.',
        'danger'
      );

      return;
    }

    // Validar telefone
    const numerosTelefone =
      dados.celular.replace(/\D/g, '');

    if (
      numerosTelefone.length !== 10 &&
      numerosTelefone.length !== 11
    ) {

      await this.mostrarToast(
        'Digite um telefone válido com DDD.',
        'danger'
      );

      return;
    }

    // Validar horários, caso sejam informados
    if (dados.horarioInicio || dados.horarioFim) {

      const formatoHora =
        /^([01]\d|2[0-3]):[0-5]\d$/;

      if (
        !formatoHora.test(dados.horarioInicio) ||
        !formatoHora.test(dados.horarioFim)
      ) {

        await this.mostrarToast(
          'Informe os dois horários no formato HH:MM.',
          'danger'
        );

        return;
      }

      if (dados.horarioInicio >= dados.horarioFim) {

        await this.mostrarToast(
          'O horário final deve ser maior que o inicial.',
          'danger'
        );

        return;
      }
    }

    // Validar registro profissional, se informado
    if (
      dados.tipoConselho ||
      dados.ufConselho ||
      dados.numeroRegistro
    ) {

      if (
        !dados.tipoConselho ||
        !dados.ufConselho ||
        !dados.numeroRegistro
      ) {

        await this.mostrarToast(
          'Preencha todos os campos do registro profissional.',
          'danger'
        );

        return;
      }
    }

    this.salvando = true;
    this.cdr.markForCheck();

    try {

      // Atualizar o documento no Firestore
      await this.profissionaisService.atualizarPerfilAtual(
        dados
      );

      // Confirmação exibida pelo Ionic
      await this.mostrarToast(
        'Perfil atualizado com sucesso!',
        'success'
      );

      // Voltar ao Perfil Profissional
      await this.router.navigateByUrl(
        '/profissional/perfil',
        { replaceUrl: true }
      );

    } catch (erro: unknown) {

      console.error(
        'Erro ao salvar alterações:',
        erro
      );

      if (
        erro instanceof FirebaseError &&
        erro.code === 'permission-denied'
      ) {

        await this.mostrarToast(
          'Sem permissão para editar. Verifique as regras do Firestore.',
          'danger'
        );

      } else {

        await this.mostrarToast(
          'Não foi possível salvar as alterações.',
          'danger'
        );

      }

    } finally {

      this.salvando = false;
      this.cdr.markForCheck();

    }
  }

  // =====================================
  // EXIBIR MENSAGENS
  // =====================================

  private async mostrarToast(
    mensagem: string,
    cor: 'success' | 'danger' | 'medium'
  ): Promise<void> {

    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2500,
      position: 'bottom',
      color: cor
    });

    await toast.present();
  }
}
