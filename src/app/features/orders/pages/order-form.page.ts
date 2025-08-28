import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonInput, IonList, IonButton, IonSelect, IonSelectOption, IonLabel } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { Product } from '../../../core/models/product.model';
import { Order, OrderItem } from '../../../core/models/order.model';


@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonInput, IonList, IonButton, IonSelect, IonSelectOption, IonLabel],
    templateUrl: './order-form.page.html'
})
export class OrdersFormPage{
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private productService = inject(ProductService);
    private orderService = inject(OrderService);


    products = signal<Product[]>([]);
    total = signal<number>(0);

    form = this.fb.group({
        customerName: ['', Validators.required],
        deadlineDate: [new Date().toISOString()],
        items: this.fb.array<FormGroup>([])
    })

    get itemsFA(){
      return this.form.get('items') as FormArray<FormGroup>;
    }

    async ngOnInit(){
      this.products.set(await this.productService.getStock());
      this.addItem();
    
      effect(() => {
        const t = this.itemsFA.controls.reduce((acc, g) =>
        {
        const quantity = Number(g.get('quantity')!.value ?? 0);
        const unitPrice = Number(g.get('unitPrice')!.value ?? 0);
        return acc + quantity * unitPrice;
        }, 0);
        this.total.set(t)
      })
    }

    
    addItem(){
      const g = this.fb.group({
        productId: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        unitPrice: [0, [Validators.required, Validators.min(0)]],
      });
      this.itemsFA.push(g);
    }

    removeItem(i: number){
      this.itemsFA.removeAt(i);
    }

    onProductChange(i: number){
      const productId = this.itemsFA.at(i).get('productId')!.value as string;
      const p = this.products().find(x => x.id === productId);
      if (p) {
        this.itemsFA.at(i).patchValue({ unitPrice: p.price ?? 0});
      }
    }

    async save(){
      const v = this.form.getRawValue();
      const items: OrderItem[] = this.itemsFA.controls.map(g => ({
        id: crypto.randomUUID(),
        productId: g.get('productId')!.value,
        quantity: Number(g.get('quantity')!.value),
        unitPrice: Number(g.get('unitPrice')!.value),
      }));

      const order: Order = {
        id: crypto.randomUUID(),
        customerName: v.customerName!,
        createdAt: new Date().toISOString(),
        deadlineDate: v.deadlineDate!,
        total: 0, //calcula no service
        items
      };

      await this.orderService.createOrder(order);
      this.router.navigate(['tabs/pedidos']);
  }


  onDateChange(event: any) {
    const dateValue = event.detail.value;
    if (dateValue) {
      this.form.patchValue({
        deadlineDate: new Date(dateValue).toISOString()
      });
    } else {
      this.form.patchValue({ deadlineDate: null }); // Ou 'undefined'
    }
  }
}
