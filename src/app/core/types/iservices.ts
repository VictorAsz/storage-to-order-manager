import { Order } from "../models/order.model";
import { Product } from "../models/product.model";

export interface IProductService{
    addProduct(product: Product): Promise<void>;
    updateProduct(product: Product): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    getStock(): Promise<Product[]>;
    getById(id: string): Promise<Product | null>;
}

export interface IOrderService{
    createOrder(order: Order): Promise<void>;
    deleteOrder(id: string): Promise<void>;
    getOrders(): Promise<Order[]>;
    getById(id: string): Promise<Order | null>;
}