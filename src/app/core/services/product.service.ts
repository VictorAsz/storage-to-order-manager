import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { IRepository } from '../types/irepository';
import { GenericStorageRepository } from '../repositories/generic-storage.repository';
import { StorageService } from './storage.service';
import { StorageKeys } from '../types/storage-keys.enum';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private repo: IRepository<Product>;

  private products = signal<Product[]>([]);
  public readonly products$ = this.products.asReadonly();

  constructor(storage: StorageService) {
    this.repo = new GenericStorageRepository<Product>(storage, StorageKeys.PRODUCTS);
     this.loadInitialData();
  }

  private async loadInitialData() {
    const list = await this.repo.getAll();
    this.products.set(list);
  }
  getStock() { return this.repo.getAll(); }
  getById(id: string) { return this.repo.getById(id); }

  async addProduct(product: Product): Promise<void> {
    await this.repo.add(product);
    this.products.update(p => [...p, product]);
  }

  async updateProduct(product: Product): Promise<void> {
    await this.repo.update(product);

    this.products.update(p => {
      const index = p.findIndex(p => p.id === product.id);
      if (index !== -1) {
        const updatedProducts = [...p];
        updatedProducts[index] = product;
        return updatedProducts;
      }
      return p;
    });
  }

  async deleteProduct(id: string): Promise<void> {
    // TODO: Alterar regra para que o produto seja apenas inativado e não excluído pois precisam ser mostrados nos pedidos finalizados.
    await this.repo.delete(id);
    this.products.update(p => p.filter(p => p.id !== id));
  }
}
