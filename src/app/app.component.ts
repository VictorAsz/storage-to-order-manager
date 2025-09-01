import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cubeOutline, receiptOutline } from 'ionicons/icons';
import { App as CapacitorApp } from '@capacitor/app';

addIcons({ cubeOutline, receiptOutline });

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, RouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, RouterLinkActive, RouterLink],
})
export class AppComponent {
   ngOnInit() {
    this.handleBackButton();
  }

  handleBackButton() {
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {

      if (!canGoBack || this.router.url === '/tabs/estoque') {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });
  }
}
