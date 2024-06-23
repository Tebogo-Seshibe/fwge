import type { DbSet } from "./dbSet";

const indexedDbInstance: IDBFactory = 
    window.indexedDB || 
    (window as any).mozIndexedDB ||
    (window as any).webkitIndexedDB ||
    (window as any).msIndexedDB ||
    (window as any).shimIndexedDB;

export class DbContext {
    private database: IDBDatabase | undefined;
    public readonly dbSets: DbSet<any>[] = [];

    public get Database(): Readonly<IDBDatabase> | undefined {
        return this.database;
    }

    public get IsValid(): boolean {
        return this.database !== undefined;
    }

    constructor(
        private readonly databaseName: string,
        private readonly databaseVersion: number,
    ) { }

    async connect(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const request: IDBOpenDBRequest = indexedDbInstance.open(this.databaseName, this.databaseVersion);
            
            request.addEventListener('error', () => {
                reject(request.error?.message);
            });

            request.addEventListener('upgradeneeded', () => { 
                this.database = request.result;
                
                for (const dbSet of this.dbSets) {
                    this.createDbSet(dbSet.config.name, dbSet.config.id as string, dbSet.config.indexes);
                }

                resolve();
            });

            request.addEventListener('success', () => { 
                if (this.database) {
                    return;
                }

                this.database = request.result;
                resolve();
            });
        });
    }
    
    async disconnect(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this.database) {
                return;
            }

            this.database.addEventListener('close', () => { 
                resolve();
            });

            this.database.close();
        });
    }

    private createDbSet(name: string, id: string, indexes: { field: string, unique: boolean }[]): void {
        const store = this.database?.createObjectStore(name, { 
            keyPath: id
        });
        
        for (const { field, unique } of indexes) {
            store?.createIndex(`${name}_${field}`, field, { unique });
        }
    }
}
