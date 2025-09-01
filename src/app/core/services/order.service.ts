import { Injectable } from "@angular/core";
import { Order, OrderItem } from '../models/order.model';
import { Product } from '../models/product.model';
import { IRepository } from '../types/irepository';
import { GenericStorageRepository } from '../repositories/generic-storage.repository';
import { StorageService } from './storage.service';
import { StorageKeys } from '../types/storage-keys.enum';
import { ProductService } from './product.service';

@Injectable({ providedIn: 'root'})
export class OrderService { 
    private repo: IRepository<Order>

    constructor(private storage: StorageService, private productsService: ProductService){
        this.repo = new GenericStorageRepository<Order>(storage, StorageKeys.ORDERS)
    }

    getOrders() { return this.repo.getAll() }
    getById(id: string) { return this.repo.getById(id)}

    async createOrder(order: Order): Promise<void>{
        const stock = await this.productsService.getStock();
        const getProduct = (id: string) => stock.find(p => p.id === id);
    
        for(const item of order.items){
            const product = getProduct(item.productId)
            if(!product) throw new Error('Produto não encontrado');
            if(item.quantity <= 0) throw new Error('Quantidade inválida');
            if(product.quantity < item.quantity) throw new Error(`Estoque insuficiente para ${product.name}`)
        }
        order.total = order.items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0)
        order.createdAt = new Date().toISOString();

        for(const item of order.items){
            const product = getProduct(item.productId)!;
            const updatedProduct: Product = {...product, quantity: product.quantity - item.quantity};
            await this.productsService.updateProduct(updatedProduct);
        }

        await this.repo.add(order);
    }


    async deleteOrder(id: string): Promise<void>{
        let orders = await this.getOrders();
        const order = orders.find(o => o.id === id);

        if(order){
            const products =  await this.productsService.getStock();
            order.items.forEach(itemOrder => {
                const pIndex = products.findIndex((p: Product) => p.id === itemOrder.productId)
                if(pIndex > -1){
                    products[pIndex].quantity += itemOrder.quantity;
                    this.productsService.updateProduct(products[pIndex])
                }
            });
        }
        await this.repo.delete(id);
    }

    async updateOrder(order: Order): Promise<void> {
        const stock = await this.productsService.getStock();
        const getProduct = (id: string) => stock.find(p => p.id === id);
    
        for(const item of order.items){
            const product = getProduct(item.productId)
            if(!product) throw new Error('Produto não encontrado');
            if(item.quantity <= 0) throw new Error('Quantidade inválida');
            if(product.quantity < item.quantity) throw new Error(`Estoque insuficiente para ${product.name}`)
        }
        order.total = order.items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0)
        order.createdAt = new Date().toISOString();

        for(const item of order.items){
            const product = getProduct(item.productId)!;
            const updatedProduct: Product = {...product, quantity: product.quantity - item.quantity};
            await this.productsService.updateProduct(updatedProduct);
        }
        
        await this.repo.update(order);
    }

    async getFinishedOrders(): Promise<Order[]>{
       const orders = await this.getOrders();
       return orders.filter((o) => o.isConcluded)
    }

async getPendingOrders(): Promise<Order[]>{
       const orders = await this.getOrders();
       return orders.filter((o) => !o.isConcluded)
    }

    async finishOrder(id: string): Promise<void>{
        const orders = await this.getOrders();
        let order = orders.find((o) => o.id === id )!
        order.isConcluded = true;
        order.finishedDate = Date();
        await this.repo.update(order);
    }
}