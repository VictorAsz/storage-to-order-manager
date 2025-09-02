import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonFab, IonFabButton, IonIcon, IonNote, ToastController, AlertController, IonButtons, IonMenuButton, IonSearchbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

addIcons({ addOutline });

@Component({
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonNote, IonButtons, IonMenuButton, IonSearchbar, IonButton],
  templateUrl: './orders-list.page.html',
  styleUrl: './orders-list.page.css'
})
export class OrdersListPage {
  private router = inject(Router);
  private service = inject(OrderService);
  private orderService = inject(OrderService)
  private toastCtrl = inject(ToastController)
  private alertCtrl = inject(AlertController)

  public readonly orders = this.service.orders$;

  searchQuery = signal('');
  currentPage = signal(1);
  pageSize = 10;

  goNew() {
    this.router.navigate(['pedidos/novo']);
  }

  open(o: Order) {
    this.router.navigate(['tabs/pedidos', o.id]);
  }

  filter(event: any){
    this.searchQuery.set(event.target.value.toLowerCase());
    this.currentPage.set(1);
  }
   
  filteredList = computed(() => {
    let list = this.orders();

    const query = this.searchQuery();
    if (query) {
      list = list.filter(p => p.customerName.toLowerCase().includes(query));
    }

    return list;
  });

   totalPages = computed(() =>
    Math.ceil(this.filteredList().length / this.pageSize) || 1
  );

  paginatedList = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredList().slice(start, start + this.pageSize);
  });

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }
  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
}
