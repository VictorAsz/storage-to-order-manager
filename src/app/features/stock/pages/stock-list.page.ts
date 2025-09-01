import { Component, signal, effect, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonFab, IonFabButton, IonIcon, IonNote, IonBadge, IonButtons, IonMenuButton, IonSearchbar, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

addIcons({ addOutline });

@Component({
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonFab,
    IonFabButton,
    IonIcon,
    IonNote,
    IonButtons,
    IonMenuButton,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonButton
  ],
  templateUrl: './stock-list.page.html',
  styleUrl: './stock-list.page.css'
})
export class StockListPage {

  products = signal<Product[]>([]);
  searchQuery = signal('');
  stockFilter = signal<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  // showActiveOnly = signal(false);

  currentPage = signal(1);
  pageSize = 10;

  private service = inject(ProductService);
  private router = inject(Router);

  ionViewWillEnter() {
    this.load();
  }

  async load() {
    const list = await this.service.getStock();
    this.products.set(list);
  }

  filterProducts(event: any) {
    this.searchQuery.set(event.target.value.toLowerCase());
    this.currentPage.set(1);
  }

  filterByStock(event: any) {
    this.stockFilter.set(event.detail.value);
    this.currentPage.set(1);
  }

  toggleActive() {
   // this.showActiveOnly.update(v => !v);
    this.currentPage.set(1);
  }

  filteredProducts = computed(() => {
    let list = this.products();

    const query = this.searchQuery();
    if (query) {
      list = list.filter(p => p.name.toLowerCase().includes(query));
    }
    // Futuramente implementar lógica de produtos ativos e inativos
    // if (this.showActiveOnly()) {
    //   list = list.filter(p => p.isActive);
    // }

    switch (this.stockFilter()) {
      case 'in-stock':
        list = list.filter(p => p.quantity > 10);
        break;
      case 'low-stock':
        list = list.filter(p => p.quantity > 0 && p.quantity <= 10);
        break;
      case 'out-of-stock':
        list = list.filter(p => p.quantity === 0);
        break;
    }

    return list;
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredProducts().length / this.pageSize) || 1
  );

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
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
  goNew() {
    this.router.navigate(['estoque/novo']);
  }
  open(p: Product) {
    this.router.navigate(['/tabs/estoque', p.id]);
  }
}
