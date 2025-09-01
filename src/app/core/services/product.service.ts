import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { IRepository } from '../types/irepository';
import { GenericStorageRepository } from '../repositories/generic-storage.repository';
import { StorageService } from './storage.service';
import { StorageKeys } from '../types/storage-keys.enum';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private repo: IRepository<Product>;

  constructor(storage: StorageService) {
    this.repo = new GenericStorageRepository<Product>(storage, StorageKeys.PRODUCTS);
  }

  getStock() { return this.repo.getAll(); }
  getById(id: string) { return this.repo.getById(id); }

  async addProduct(product: Product): Promise<void> {
    await this.repo.add(product);
  }

  async updateProduct(product: Product): Promise<void> {
    await this.repo.update(product);
  }

  async deleteProduct(id: string): Promise<void> {
    // TODO: Alterar regra para que o produto seja apenas inativado e não excluído pois precisam ser mostrados nos pedidos finalizados.
    await this.repo.delete(id);
  }
}
