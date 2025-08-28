import { CommonModule } from "@angular/common";
import { Component, inject, isStandalone, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonLabel, IonList, IonButton, IonNote } from "@ionic/angular/standalone";
import { Order } from "src/app/core/models/order.model";
import { Product } from "src/app/core/models/product.model";
import { OrderService } from "src/app/core/services/order.service";
import { ProductService } from "src/app/core/services/product.service";


@Component({
    standalone: true,
    imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonLabel, IonList, IonButton, IonNote],
    templateUrl: "./order-detail-page.html",
})

export class OrdersDetailPage{

    private orderService = inject(OrderService);
    private productService = inject(ProductService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    order = signal<Order | null>(null);
    productsMap = new Map<string, Product>();
    id!: string;

    async ngOnInit(){
        this.id = this.route.snapshot.paramMap.get('id')!;
        const o = await this.orderService.getById(this.id);
        this.order.set(o);

        const products = await this.productService.getStock();
        products.forEach(p => this.productsMap.set(p.id, p))
    }

    productName(id: string){
        return this.productsMap.get(id)?.name ?? '(removido)';
    }

    async remove(){
        await this.orderService.deleteOrder(this.id);
        this.router.navigate(['tabs/pedidos'])
    }
}