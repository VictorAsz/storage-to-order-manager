import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonFab, IonFabButton, IonIcon, IonNote, ToastController, AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

addIcons({ addOutline });

@Component({
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonNote],
  templateUrl: './orders-list.page.html'
})
export class OrdersListPage {
  private router = inject(Router);
  private service = inject(OrderService);
  private orderService = inject(OrderService)
  private toastCtrl = inject(ToastController)
  private alertCtrl = inject(AlertController)

  orders = signal<Order[]>([]);

  ionViewWillEnter(){
    this.load();
  }

  async load() {
    const all = await this.service.getOrders();
    this.orders.set(all.sort((a,b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')));
  }

  goNew() {
    this.showToast('Criação de pedido ainda em construção', 'secondary');
    //this.router.navigate(['tabs/pedidos/novo']);
  }

  open(o: Order) {
    //this.router.navigate(['tabs/pedidos', o.id]);
  }

   async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1000,
      color,
      position: 'top'
    });
    toast.present();
  }
}
