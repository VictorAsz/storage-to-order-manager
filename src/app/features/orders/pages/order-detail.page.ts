import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonLabel, IonList, IonButton, IonNote, IonIcon, IonFab, IonFabButton} from "@ionic/angular/standalone";
import { Order } from "src/app/core/models/order.model";
import { Product } from "src/app/core/models/product.model";
import { OrderService } from "src/app/core/services/order.service";
import { ProductService } from "src/app/core/services/product.service";
import { createOutline } from 'ionicons/icons';
import { AlertController } from "@ionic/angular";
@Component({
    standalone: true,
    imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonFab, IonFabButton],
    templateUrl: "./order-detail.page.html",
    styleUrl: './order-detail.page.css'
})

export class OrdersDetailPage{

    private orderService = inject(OrderService);
    private productService = inject(ProductService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private alertController = inject(AlertController);

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

    async delete(){
        await this.orderService.deleteOrder(this.id);
        this.router.navigate(['tabs/pedidos'])
    }

    async finishOrder(){
        await this.orderService.finishOrder(this.id);
        this.router.navigate(['tabs/pedidos'])
    }

    goToEdit(){
        this.router.navigate(['tabs/pedidos/' + this.id + '/editar'])
    }

    async deleteHandler() {
        const alert = await this.alertController.create({
        header: 'Confirmar exclusão',
        message: 'Você tem certeza que deseja cancelar este pedido?',
        buttons: [
        {
            text: 'Cancelar',
            role: 'cancel',
        },
        {
            text: 'Cancelar',
            handler: async () => {
            if (this.id) {
                await this.delete();
                this.router.navigate(['tabs/pedidos']);
            }
            }
        }
        ]
    });

    await alert.present();
    }
}