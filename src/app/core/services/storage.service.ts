import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage-angular';

@Injectable({providedIn: 'root'})
export class StorageService {
    private readyPromise: Promise<void>;

    constructor(private storage: Storage){
        this.readyPromise = this.init();
    }
    
    private async init(): Promise<void> { 
        await this.storage.create();
    }

    async ready(){
        return this.readyPromise;
    }

    async get<T>(key: string): Promise<T | null> {
        await this.ready();
        return (await this.storage.get(key)) ?? null;
    }

    async set<T>(key: string, value: T): Promise<void>{
        await this.ready();
        await this.storage.set(key,value);
    }
}