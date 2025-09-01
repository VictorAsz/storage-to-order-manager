import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IonApp, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar, MenuController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cubeOutline, receiptOutline } from 'ionicons/icons';
import { App as CapacitorApp } from '@capacitor/app';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

addIcons({ cubeOutline, receiptOutline });

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, RouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, RouterLinkActive, RouterLink, IonMenu, IonHeader, IonToolbar, IonContent, IonList, IonItem, IonTitle, IonButtons, IonMenuButton, IonButton, IonFooter],
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private route: Router,
    private router: Router,
    private menu: MenuController,
    private storage: Storage,
    private alertController: AlertController,
    private menuController: MenuController
  ) {}
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

  closeMenu() {
    this.menuController.close(); 
  }

  async clearData(){
    await this.storage.clear();
  
  }

  async clearDataHandler(){
     const alert = await this.alertController.create({
        header: 'Confirmar exclusão',
        message: 'Você tem certeza que deseja apagar todos os dados salvos permanentemente?',
        buttons: [
        {
            text: 'Cancelar',
            role: 'cancel',
        },
        {
            text: 'Apagar',
            handler: async () => {
                await this.clearData();
                this.closeMenu();
                window.location.reload();
                this.router.navigate(['tabs/estoque']);    
            }
        }
        ]
    });

    await alert.present();
  }
}
