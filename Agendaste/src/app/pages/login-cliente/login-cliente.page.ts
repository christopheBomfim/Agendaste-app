import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  calendarNumberOutline,
  mailOutline,
  lockClosedOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-login-cliente',
  templateUrl: './login-cliente.page.html',
  styleUrls: ['./login-cliente.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonLabel,
    IonInput,
    IonButton,
    CommonModule,
    FormsModule
  ]
})
export class LoginClientePage implements OnInit {

  email: string = '';
  cpf: string = '';

  constructor() {
    addIcons({
      calendarNumberOutline,
      mailOutline,
      lockClosedOutline
    });
  }

  ngOnInit() {}

  entrar() {
    console.log('Tentativa de login:', { email: this.email, cpf: this.cpf });
  }

}