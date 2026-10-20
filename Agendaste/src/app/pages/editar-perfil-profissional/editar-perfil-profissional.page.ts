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
  IonIcon,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  medicalOutline,
  timeOutline,
  callOutline,
  caretDownSharp
} from 'ionicons/icons';

@Component({
  selector: 'app-editar-perfil-profissional',
  templateUrl: './editar-perfil-profissional.page.html',
  styleUrls: ['./editar-perfil-profissional.page.scss'],
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
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule
  ]
})
export class EditarPerfilProfissionalPage implements OnInit {

  perfil = {
    especialidade: 'Cardiologia',
    horarioInicio: '08:00',
    horarioFim: '18:00',
    telefone: '(11) 98765-4321',
    tipoConselho: 'CRM',
    ufConselho: 'SP',
    numeroRegistro: '123456'
  };

  constructor() {
    addIcons({
      arrowBackOutline,
      medicalOutline,
      timeOutline,
      callOutline,
      caretDownSharp
    });
  }

  ngOnInit() {}

  alterarFoto() {
    console.log('Abrir galeria ou câmera para alterar foto');
  }

  salvarAlteracoes() {
    console.log('Salvar alterações do perfil:', this.perfil);
  }

}