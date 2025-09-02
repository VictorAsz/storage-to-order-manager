import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, AlertController } from "@ionic/angular/standalone";
import { Order } from "src/app/core/models/order.model";
import { Product } from "src/app/core/models/product.model";
import { OrderService } from "src/app/core/services/order.service";
import { ProductService } from "src/app/core/services/product.service";

@Component({
    standalone: true,
    imports: [CommonModule,  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton],
    templateUrl: './finished-orders-detail.page.html',
    styleUrl: './finished-orders-detail.page.css'
})
export class FinisheOrderDetailPage{

    private orderService = inject(OrderService);
    private productService = inject(ProductService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private alertController = inject(AlertController)
    

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
        await this.orderService.deleteWithoutReversal(this.id!);
    }

    async reversalOrder(){
        await this.orderService.deleteOrder(this.id!);
    }

    async deleteHandler(){
        const alert = await this.alertController.create({
        header: 'Confirmar exclusão',
        message: 'Você tem certeza que deseja deletar permanentemente este pedido?',
        buttons: [
        {
            text: 'Cancelar',
            role: 'cancel',
        },
        {
            text: 'Deletar',
            handler: async () => {
            if (this.id) {
                await this.delete();
                this.router.navigate(['tabs/finalizados']);
            }
            }
        }
        ]
    });

    await alert.present();
    }

    async reversalHandler(){
        const alert = await this.alertController.create({
        header: 'Confirmar devolução',
        message: 'Você tem certeza que deseja devolver este pedido?',
        buttons: [
        {
            text: 'Cancelar',
            role: 'cancel',
        },
        {
            text: 'Estornar',
            handler: async () => {
            if (this.id) {
                await this.delete();
                this.router.navigate(['tabs/finalizados']);
            }
            }
        }
        ]
    });

    await alert.present();
    }
}