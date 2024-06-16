import { DbContext } from "./dbContext";
import { DbSet } from "./dbSet";
import { Project } from "./project.model";

export class FwgeDbContext extends DbContext
{
    projects = new DbSet(
        this, 
        Project,
        { 
            name: 'projects', 
            id: 'projectId',
            indexes: [
                { field: 'lastModfied', unique: false }
            ]
        });

    constructor()
    {
        super('fwge', 1.0)
    }
}