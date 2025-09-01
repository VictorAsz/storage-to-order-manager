import { CommonModule, NgIf } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonNote, IonButtons, IonMenuButton } from "@ionic/angular/standalone";
import { Order } from "src/app/core/models/order.model";
import { OrderService } from "src/app/core/services/order.service";

@Component({
    standalone: true,
    imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonNote, IonButtons, IonMenuButton],
    templateUrl: './finished-orders-list.page.html',
    styleUrl: './finished-orders-list.page.css'
})
export class FinishedOrdersPage{
    private orderService = inject(OrderService)
    private route = inject(ActivatedRoute)
    private router = inject(Router)


    orders = signal<Order[]>([])

    ionViewWillEnter(){
        this.load();
    }

    async load(){
        const all = await this.orderService.getFinishedOrders();
        this.orders.set(all.sort((a,b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')));
    }

    open(o: Order) {
        this.router.navigate(['tabs/finalizados', o.id]);
    } 
}