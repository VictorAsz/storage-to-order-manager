import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon, IonNote, IonButtons, IonMenuButton, IonSearchbar, IonButton } from "@ionic/angular/standalone";
import { Order } from "src/app/core/models/order.model";
import { OrderService } from "src/app/core/services/order.service";

@Component({
    standalone: true,
    imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon, IonNote, IonButtons, IonMenuButton, IonSearchbar, IonButton],
    templateUrl: './finished-orders-list.page.html',
    styleUrl: './finished-orders-list.page.css'
})
export class FinishedOrdersPage{
    private orderService = inject(OrderService)
    private route = inject(ActivatedRoute)
    private router = inject(Router)

    public readonly orders = computed(() => {
        return this.orderService.orders$().filter((o) => o.isConcluded);
    });

    searchQuery = signal('');
    currentPage = signal(1);
    pageSize = 10;

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

    open(o: Order) {
        this.router.navigate(['tabs/finalizados', o.id]);
    } 
}