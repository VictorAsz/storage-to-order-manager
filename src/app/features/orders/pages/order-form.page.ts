import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonInput, IonList, IonButton, IonSelect, IonSelectOption, IonLabel, IonFab, IonFabButton, ModalController } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { Product } from '../../../core/models/product.model';
import { Order, OrderItem } from '../../../core/models/order.model';
import { IonIcon } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { OrderItemFormModal } from './order-item-form.modal';



@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule,
        IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonInput, IonButton, IonSelect, IonSelectOption, IonLabel, IonFab, IonFabButton, OrderItemFormModal
    ],
    templateUrl: './order-form.page.html',
    styleUrl: './order-form.page.css'
})
export class OrdersFormPage {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private productService = inject(ProductService);
    private orderService = inject(OrderService);
    private alertController = inject(AlertController);
    private modalController = inject(ModalController)

    isEdit = signal(false);
    id?: string;

    products = signal<Product[]>([]);
    total = signal<number>(0);

    form = this.fb.group({
        customerName: ['', Validators.required],
        deadlineDate: [new Date().toISOString(), Validators.required],
        items: this.fb.array<FormGroup>([])
    });

    get itemsFA() {
        return this.form.get('items') as FormArray<FormGroup>;
    }

    constructor() {
        this.form.get('items')!.valueChanges.subscribe(() => {
            this.updateTotal();
        });
    }

    async ngOnInit() {
        this.products.set(await this.productService.getStock());

        this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
        if (this.id) {
            const record = await this.orderService.getById(this.id);
            if (record) {
                this.isEdit.set(true);
                this.form.patchValue({
                    customerName: record.customerName,
                    deadlineDate: record.deadlineDate
                });
                this.itemsFA.clear();
                record.items.forEach(it => {
                    this.itemsFA.push(this.fb.group({
                        productId: [it.productId, Validators.required],
                        quantity: [it.quantity, [Validators.required, Validators.min(1)]],
                        unitPrice: [it.unitPrice, [Validators.required, Validators.min(0)]],
                    }));
                });
                this.updateTotal();
            }
        } 
    }

    removeItem(i: number) {
        this.itemsFA.removeAt(i);
        this.updateTotal();
    }

    onProductChange(i: number) {
        const productId = this.itemsFA.at(i).get('productId')!.value as string;
        const p = this.products().find(x => x.id === productId);
        if (p) {
            this.itemsFA.at(i).patchValue({ unitPrice: p.price ?? 0 });
        }
    }

    async openAddItemModal() {
    const modal = await this.modalController.create({
        component: OrderItemFormModal,
        cssClass: 'sheet-modal', 
        animated: true,
        backdropDismiss: true,
        initialBreakpoint: 0.8,
        breakpoints: [0, 0.4, 0.6, 0.8, 1], 
        handleBehavior: 'cycle' 
    });

    modal.onDidDismiss().then((data) => {
        if (data.data && data.role === 'confirm') {
        this.addItem(data.data);
        }
    });
    
    return await modal.present();
    }

    addItem(item: any) {
        const itemGroup = this.fb.group({
        productId: [item.productId, Validators.required],
        quantity: [item.quantity, [Validators.required, Validators.min(1)]],
        unitPrice: [item.unitPrice, [Validators.required, Validators.min(0)]],
        });

        this.itemsFA.push(itemGroup);
        this.updateTotal();
    }

    getProductName(productId: string): string {
        if (!productId) return 'Produto não selecionado';
        
        const product = this.products().find(p => p.id === productId);
        return product ? product.name : 'Produto não encontrado';
    }

    getItemSubtotal(quantity: number, unitPrice: number): number {
        return (quantity || 0) * (unitPrice || 0);
    }

    updateTotal() {
        const totalValue = this.itemsFA.controls.reduce((acc, g) => {
            const q = Number(g.get('quantity')!.value ?? 0);
            const up = Number(g.get('unitPrice')!.value ?? 0);
            return acc + q * up;
        }, 0);
        this.total.set(totalValue);
    }

    async save() {
        const v = this.form.getRawValue();
        const items: OrderItem[] = this.itemsFA.controls.map(g => ({
            id: crypto.randomUUID(),
            productId: g.get('productId')!.value,
            quantity: Number(g.get('quantity')!.value),
            unitPrice: Number(g.get('unitPrice')!.value),
            isConcluded: false
        }));

        const order: Order = {
            id: this.id ?? crypto.randomUUID(),
            customerName: v.customerName!,
            createdAt: this.isEdit() ? (await this.orderService.getById(this.id!))?.createdAt ?? new Date().toISOString() : new Date().toISOString(),
            deadlineDate: v.deadlineDate!,
            total: 0, // calculado no service
            items,
            isConcluded: false
        };

        if (this.isEdit()) await this.orderService.updateOrder(order);
        else await this.orderService.createOrder(order);

        this.router.navigate(['tabs/pedidos']);
    }

    async deleteOrder() {
        if (this.id) {
            await this.orderService.deleteOrder(this.id);

        }
    }

    async confirmDelete() {
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
                await this.orderService.deleteOrder(this.id);
                this.router.navigate(['tabs/pedidos']);
            }
            }
        }
        ]
    });

    await alert.present();
    }

}
