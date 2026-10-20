import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonAvatar,
  IonIcon,
  IonFooter,
  IonTabBar,
  IonTabButton,
  IonLabel
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  calendarOutline,
  calendarNumberOutline,
  timeOutline,
  gitNetworkOutline,
  personOutline,
  closeCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-dashboard-cliente',
  templateUrl: './dashboard-cliente.page.html',
  styleUrls: ['./dashboard-cliente.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonAvatar,
    IonIcon,
    IonFooter,
    IonTabBar,
    IonTabButton,
    IonLabel,
    CommonModule,
    FormsModule
  ]
})
export class DashboardClientePage implements OnInit {

  constructor() {
    addIcons({
      homeOutline,
      calendarOutline,
      calendarNumberOutline,
      timeOutline,
      gitNetworkOutline,
      personOutline,
      closeCircleOutline
    });
  }

  ngOnInit() {}

  selecionarEspecialidade(nome: string) {
    console.log('Especialidade selecionada:', nome);
  }

}