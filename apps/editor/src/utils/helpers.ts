import type { Game } from "@fwge/core";
import { FwgeDbContext } from "../stores/fwgeDbContext";
import { currentAssetStore, currentEntityStore, currentGameStore, currentSceneStore, currentSystemStore } from "../stores/project.store";
import { getProject } from "./project/commands";
import type { ProjectHistory } from "../stores/project.model";

export function resetStore(): void {
    currentAssetStore.set(undefined);
    currentEntityStore.set(undefined);
    currentSystemStore.set(undefined);
    currentSceneStore.set(undefined);
    currentGameStore.set(undefined);
}

export async function updateProjectHistory(): Promise<void> {
    let db: FwgeDbContext | undefined;

    try {
        db = new FwgeDbContext();
        await db.connect();
        
        const currentProject = await getProject();
			
        await db.projects.update({
            uuid: currentProject.info.general.uuid,
            config: currentProject
        });
        
        await db.projectHistory.update({
            uuid: currentProject.info.general.uuid,
            name: currentProject.info.general.name,
            filePath: currentProject.info.general.base_path,
            lastModfied: new Date()
        });
    } catch (e) {
        if (db) {
            db.disconnect();
        }

        throw e;
    }
}

export async function getProjectHistory(): Promise<ProjectHistory[]> {
    let db: FwgeDbContext | undefined;

    try {
        db = new FwgeDbContext();
        await db.connect();
        
        const history = await db.projectHistory.getAll();
        return history.sort((a, b) => a.lastModfied.getTime() > b.lastModfied.getTime() ? 1 : -1);
    } catch (e) {
        if (db) {
            db.disconnect();
        }

        throw e;
    }
}
