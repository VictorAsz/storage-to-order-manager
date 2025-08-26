import { IRepository } from '../types/irepository';
import { StorageService } from '../services/storage.service';

export class GenericStorageRepository<T extends {id: string}> implements IRepository<T>{
    constructor(private storage: StorageService, private key: string){}

    private async load(): Promise<T[]> {
        return (await this.storage.get<T[]>(this.key)) ?? []
    }

    private async save(all: T[]): Promise<void>{
        await this.storage.set<T[]>(this.key, all)
    }

    async getAll(): Promise<T[]>{
        return await this.load();
    }
    async getById(id: string): Promise<T | null> {
        return (await this.load()).find((i) => i.id === id) ?? null;
    }
    async add(entity: T): Promise<void>{
        const all = await this.load();
        all.push(entity);
        return await this.save(all);
    }

    async update(entity: T): Promise<void> {
        const all = await this.load();
        const idx = all.findIndex(i => i.id === entity.id);
        if(idx >= 0){
            all[idx] = entity;
            await this.save(all);        
        }else{
            throw new Error('Entity not found');
        }
    }

    async delete(id: string): Promise<void> {
        const all = await this.load();
        return this.save(all.filter(i => i.id !== id))
    }
}




