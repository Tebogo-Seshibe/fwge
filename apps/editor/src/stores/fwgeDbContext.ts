import { DbContext } from "./dbContext";
import { DbSet } from "./dbSet";
import { ProjectHistory } from "./project.model";

export class FwgeDbContext extends DbContext {
    readonly projectHistory = new DbSet(this,
        ProjectHistory, {
            id: 'projectId',
            indexes: [
                { field: 'lastModfied', unique: false }
            ]
        });
        
    readonly assets = new DbSet(this,
        class ProjectAsset{ assetId!: number; data!: Uint8Array; }, {
            id: "assetId",
        }
    );

    constructor() {
        super('fwge', 2);
    }
}
