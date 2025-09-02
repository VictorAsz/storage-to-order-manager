import { Component } from '@angular/core';
import { Router, RouterLink} from '@angular/router';
import { IonApp, IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonRouterOutlet, IonTitle, IonToolbar, MenuController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cubeOutline, receiptOutline } from 'ionicons/icons';
import { App as CapacitorApp } from '@capacitor/app';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

addIcons({ cubeOutline, receiptOutline });

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonIcon, IonLabel, RouterLink, IonMenu, IonHeader, IonToolbar, IonContent, IonList, IonItem, IonTitle, IonButton],
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
