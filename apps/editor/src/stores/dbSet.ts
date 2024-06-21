import type { Type } from "@fwge/ecs";
import type { DbContext } from "./dbContext";

export interface IDbSet<T> {
    id: keyof T & string
    name?: string
    indexes?: {
        field: keyof T & string,
        unique: boolean
    }[]
}

export class DbSet<T> {
    public readonly config: Readonly<Required<IDbSet<T>>>;

    constructor(private readonly dbContext: DbContext, type: Type<T>, config: IDbSet<T>) {
        this.config = {
            id: config.id,
            name: config.name ?? (type.name[0].toLowerCase() + type.name.substring(1)),
            indexes: config.indexes ?? []
        };
        this.dbContext.dbSets.push(this);
    }
    
    create(element: Partial<T>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const transaction = this.dbContext.Database?.transaction(this.config.name, 'readwrite');
            const store = transaction?.objectStore(this.config.name);
            const request = store?.add(element);
    
            request?.addEventListener('error', () => {
                reject(request.error?.message);
            });
            request?.addEventListener('success', () => {
                resolve();
            });
        });
    }
    
    getById(id: number): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const transaction = this.dbContext.Database?.transaction(this.config.name, 'readwrite');
            const store = transaction?.objectStore(this.config.name);
            const request = store?.get(id);
    
            request?.addEventListener('error', () => {
                reject(request.error?.message);
            });
            request?.addEventListener('success', () => {
                resolve(request.result);
            });
        });
    }

    getAll(): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            const transaction = this.dbContext.Database?.transaction(this.config.name, 'readwrite');
            const store = transaction?.objectStore(this.config.name);
            const request = store?.getAll();
    
            request?.addEventListener('error', () => {
                reject(request.error?.message);
            });
            request?.addEventListener('success', () => {
                resolve(request.result);
            });
        });
    }
    
    update(entity: Partial<T>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const transaction = this.dbContext.Database?.transaction(this.config.name, 'readwrite');
            const store = transaction?.objectStore(this.config.name);
            const request = store?.put(entity);
    
            request?.addEventListener('error', () => {
                reject(request.error?.message);
            });
            request?.addEventListener('success', () => {
                resolve();
            });
        });
    }
    
    delete(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const transaction = this.dbContext.Database?.transaction(this.config.name, 'readwrite');
            const store = transaction?.objectStore(this.config.name);
            const request = store?.delete(id);
    
            request?.addEventListener('error', () => {
                reject(request.error?.message);
            });
            request?.addEventListener('success', () => {
                resolve();
            });
        });
    }
}
