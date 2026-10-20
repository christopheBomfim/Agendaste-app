
import { Component } from '@angular/core';

import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  homeOutline,
  peopleOutline,
  calendarOutline,
  personOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs-profissional',
  templateUrl: './tabs-profissional.page.html',
  styleUrls: ['./tabs-profissional.page.scss'],
  standalone: true,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
  ]
})
export class TabsProfissionalPage {

  constructor() {
    addIcons({
      homeOutline,
      peopleOutline,
      calendarOutline,
      personOutline
    });
  }
}
