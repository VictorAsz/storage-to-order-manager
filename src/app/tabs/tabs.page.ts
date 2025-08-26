import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cubeOutline, receiptOutline } from 'ionicons/icons';

addIcons({ cubeOutline, receiptOutline });

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, RouterOutlet, RouterLink, RouterLinkActive],
  standalone: true
})
export class TabsPage {}
