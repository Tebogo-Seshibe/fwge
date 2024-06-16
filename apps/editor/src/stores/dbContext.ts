import type { DbSet } from "./dbSet";

const indexedDbInstance: IDBFactory = 
    window.indexedDB || 
    (window as any).mozIndexedDB ||
    (window as any).webkitIndexedDB ||
    (window as any).msIndexedDB ||
    (window as any).shimIndexedDB;

export class DbContext
{
    private database: IDBDatabase | undefined;
    public readonly dbSets: DbSet<any>[] = [];

    public get Database()
    {
        return this.database;
    }

    constructor(
        private readonly databaseName: string,
        private readonly databaseVersion: number,
    ) { }

    async connect(): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            let upgraded = false;
            let request: IDBOpenDBRequest = indexedDbInstance.open(this.databaseName, this.databaseVersion);
            
            request.addEventListener('error', () => {
                reject(request.error!.message);
            });

            request.addEventListener('upgradeneeded', () => { 
                this.database = request.result;
                
                for (const dbSet of this.dbSets)
                {
                    this.createDbSet(dbSet.config.name, dbSet.config.id, dbSet.config.indexes);
                }

                resolve();
            });

            request.addEventListener('success', () => { 
                if (upgraded) {
                    return;
                }

                this.database = request.result;
                resolve();
            });
        });
    }

    private createDbSet(name: string, id: string, indexes: {field: string, unique: boolean}[]): void
    {
        const store = this.database?.createObjectStore(name, { keyPath: id, autoIncrement: true });
        
        for (const { field, unique } of indexes)
        {
            store?.createIndex(`${name}_${field}`, field, { unique });
        }
    }
}
