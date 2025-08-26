import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonFab, IonFabButton, IonIcon, IonNote, IonBadge } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

addIcons({ addOutline });

@Component({
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonNote, IonBadge],
  templateUrl: './stock-list.page.html'
})
export class StockListPage {
  products = signal<Product[]>([]);

  constructor(private service: ProductService, private router: Router) {
    this.load();
  }
  
  ionViewWillEnter(){
    this.load();
  }

  async load() {
    this.products.set(await this.service.getStock());
  }

  goNew() {
    this.router.navigate(['/tabs/estoque/novo']);
  }

  open(p: Product) {
    this.router.navigate(['/tabs/estoque', p.id]);
  }
}
