import type { Type } from "@fwge/ecs";
import type { DbContext } from "./dbContext";

export interface IDbSet<T>
{
    name: string
    id: keyof T & string
    indexes: {
        field: keyof T & string,
        unique: boolean
    }[]
}

export class DbSet<T>
{
    public readonly config: Readonly<IDbSet<T>>;

    constructor(private readonly dbContext: DbContext, type: Type<T>, config?: Partial<IDbSet<T>>)
    {
        this.config = {
            name: config?.name ?? type.name,
            id: (config?.id ?? 'id') as any,
            indexes: config?.indexes ?? []
        };
        this.dbContext.dbSets.push(this);
    }
    
    create(element: Partial<T>): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            const transaction = this.dbContext.Database!.transaction(this.config.name, 'readwrite');
            const store = transaction.objectStore(this.config.name);
    
            var request = store.add(element);
            request.addEventListener('error', () => {
                reject(request.error!.message);
            });
            request.addEventListener('success', () => {
                resolve();
            });
        });
    }
    
    getById(id: number): Promise<T>
    {
        return new Promise<T>((resolve, reject) =>
        {
            const transaction = this.dbContext.Database!.transaction(this.config.name, 'readwrite');
            const store = transaction.objectStore(this.config.name);
    
            var request = store.get(id);
            request.addEventListener('error', () => {
                reject(request.error!.message);
            });
            request.addEventListener('success', () => {
                resolve(request.result);
            });
        });
    }

    getAll(): Promise<T[]>
    {
        return new Promise<T[]>((resolve, reject) =>
        {
            const transaction = this.dbContext.Database!.transaction(this.config.name, 'readwrite');
            const store = transaction.objectStore(this.config.name);
    
            var request = store.getAll();
            request.addEventListener('error', () => {
                reject(request.error!.message);
            });
            request.addEventListener('success', () => {
                resolve(request.result);
            });
        });
    }
    
    update(id: number): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            const transaction = this.dbContext.Database!.transaction(this.config.name, 'readwrite');
            const store = transaction.objectStore(this.config.name);
    
            var request = store.put(id);
            request.addEventListener('error', () => {
                reject(request.error!.message);
            });
            request.addEventListener('success', () => {
                resolve();
            });
        });
    }
    
    delete(id: number): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            const transaction = this.dbContext.Database!.transaction(this.config.name, 'readwrite');
            const store = transaction.objectStore(this.config.name);
    
            var request = store.delete(id);
            request.addEventListener('error', () => {
                reject(request.error!.message);
            });
            request.addEventListener('success', () => {
                resolve();
            });
        });
    }
}
