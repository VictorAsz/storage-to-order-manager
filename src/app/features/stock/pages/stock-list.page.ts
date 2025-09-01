import { Component, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonFab, IonFabButton, IonIcon, IonNote, IonBadge, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

addIcons({ addOutline });

@Component({
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonNote, IonBadge, IonButtons, IonMenuButton],
  templateUrl: './stock-list.page.html',
  styleUrl: './stock-list.page.css'
})
export class StockListPage {
  products = signal<Product[]>([]);
  private service = inject(ProductService);
  private router = inject(Router);

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
