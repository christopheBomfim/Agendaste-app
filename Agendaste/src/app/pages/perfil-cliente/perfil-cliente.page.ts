import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonFooter,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonButton
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  callOutline,
  locationOutline,
  pencilOutline,
  notificationsOutline,
  chevronForwardOutline,
  homeOutline,
  calendarNumberOutline,
  gitNetworkOutline,
  personOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.page.html',
  styleUrls: ['./perfil-cliente.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonFooter,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonButton,
    CommonModule,
    FormsModule
  ]
})
export class PerfilClientePage implements OnInit {

  constructor(private router: Router) {
    addIcons({
      mailOutline,
      callOutline,
      locationOutline,
      pencilOutline,
      notificationsOutline,
      chevronForwardOutline,
      homeOutline,
      calendarNumberOutline,
      gitNetworkOutline,
      personOutline
    });
  }

  ngOnInit() {}

  editarInformacoes() {
    console.log('Navegar para editar informações');
  }

  abrirNotificacoes() {
    console.log('Navegar para notificações');
  }

  sair() {
    this.router.navigate(['/login']);
  }

  navegar(rota: string) {
    this.router.navigate([rota]);
  }

}