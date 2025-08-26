import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonLabel, IonList, IonButton, IonNote } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
    standalone: true,
    imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonLabel, IonList, IonButton],
    templateUrl: './stock-detail.page.html',
})
export class StockDetailPage{
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private service = inject(ProductService);

    product = signal<Product | null>(null);
    id!: string;

    async ngOnInit(){
        this.id = this.route.snapshot.paramMap.get('id')!;
        this.product.set(await this.service.getById(this.id));
    }

    edit(){
        this.router.navigate(['tabs/estoque', this.id, 'editar'])
    }
}