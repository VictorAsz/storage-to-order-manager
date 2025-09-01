import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonInput, IonList, IonButton, IonTextarea, IonFab, IonFabButton, AlertController } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule,
        IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonInput, IonList, IonButton, IonFab, IonFabButton
    ],
    templateUrl: './stock-form.page.html',
    styleUrl: './stock-form.page.css'
})
export class StockFormPage{
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private service = inject(ProductService);
    private alertController = inject(AlertController)

    isEdit = signal(false);
    id?: string;

    form = this.fb.group({
        name: ['', Validators.required],
        sku: [''],
        quantity: [0, [Validators.required, Validators.min(0)]],
        price: [null as number | null],
        description: ['']
    })

    async ngOnInit(){
        this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
        if(this.id){
            const record = await this.service.getById(this.id);
            if(record){
                this.isEdit.set(true);
                this.form.patchValue(record)
            }
        }
    }

    async save(){
        const fv = this.form.getRawValue();
        const entity: Product = {
            id: this.id ?? crypto.randomUUID(),
            name: fv.name!,
            sku: fv.sku ?? undefined,
            quantity: Number(fv.quantity ?? 0),
            price: (fv.price ?? undefined) as number | undefined,
            description: fv.description ?? undefined
        };
         if(this.isEdit()) await this.service.updateProduct(entity);
         else await this.service.addProduct(entity);
         this.router.navigate(['tabs/estoque']);
    }
    async deleteProduct(){
        await this.service.deleteProduct(this.id!);
    }

    async deleteHandler() {
        const alert = await this.alertController.create({
        header: 'Confirmar exclusão',
        message: 'Você tem certeza que deseja deletar este pedido?',
        buttons: [
        {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
            console.log('Cancelou a exclusão, ufa~');
            }
        },
        {
            text: 'Deletar',
            handler: async () => {
            if (this.id) {
                await this.deleteProduct();
                this.router.navigate(['tabs/pedidos']);
            }
            }
        }
        ]
    });

    await alert.present();
    }
    
}