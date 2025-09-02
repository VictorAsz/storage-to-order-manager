import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { 
  IonButton, 
  IonContent, 
  IonHeader, 
  IonInput, 
  IonItem, 
  IonList, 
  IonSelect, 
  IonSelectOption, 
} from '@ionic/angular/standalone';
import { Product } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-order-item-form-modal',
  templateUrl: './order-item-form.modal.html',
  styleUrl: './order-item-form.modal.css',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    IonHeader, 
    IonButton, 
    IonContent, 
    IonItem, 
    IonSelect, 
    IonSelectOption, 
    IonInput,
    IonList
  ]
})
export class OrderItemFormModal {
  itemForm: FormGroup;
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private productService: ProductService,
    private alertCtrl: AlertController
  ) {
    this.itemForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  async ngOnInit() {
    try {
      this.products = await this.productService.getStock();
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }

  onProductChange() {
    const productId = this.itemForm.get('productId')?.value;
    const product = this.products.find(p => p.id === productId);

    if (product && product.price) {
      this.itemForm.patchValue({ unitPrice: product.price });
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async addItem() {
    const productId = this.itemForm.get('productId')?.value;
    const quantity = this.itemForm.get('quantity')?.value;
    const product = this.products.find(p => p.id === productId);

    if (!product) return;

    if (product.quantity <= 0) {
      const alert = await this.alertCtrl.create({
        header: 'Estoque insuficiente',
        message: `O produto ${product.name} não possui estoque disponível.`,
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    if (quantity > product.quantity) {
      const alert = await this.alertCtrl.create({
        header: 'Quantidade inválida',
        message: `Você pediu ${quantity}, mas só há ${product.quantity} em estoque.`,
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (this.itemForm.valid) {
      const itemData = this.itemForm.getRawValue();
      this.modalCtrl.dismiss(itemData, 'confirm');
    }
  }
}