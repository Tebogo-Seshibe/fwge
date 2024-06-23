import { DbContext } from "./dbContext";
import { DbSet } from "./dbSet";
import { CurrentProject, ProjectHistory } from "./project.model";

export class FwgeDbContext extends DbContext {
    readonly projectHistory = new DbSet(this, ProjectHistory, { id: 'uuid', });
    readonly projects = new DbSet(this, CurrentProject, { id: 'uuid'});
        
    readonly assets = new DbSet(this,
        class ProjectAsset{ assetId!: number; data!: Uint8Array; }, {
            id: "assetId",
        }
    );

    constructor() {
        super('fwge', 1);
    }
}
