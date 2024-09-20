import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { MENU__BUILD, MENU__CONFIG, MENU__OPEN, MENU__OPEN_RECENT, MENU__SAVE, MENU__SAVE_AS, MENU__SETTINGS } from "./ids";
import type { MenuBuildPayload, MenuConfigPayload, MenuOpenPayload, MenuOpenRecentPayload, MenuSaveAsPayload, MenuSavePayload, MenuSettingsPayload } from "./models";
import { dialog } from "@tauri-apps/api";
import { openProject } from "../project/commands";
import { rebuildProject } from "../project/utils";

export async function registerMenuListeners() : Promise<UnlistenFn[]> {
    const unlistenOpen = await listen<MenuOpenPayload>(MENU__OPEN, async payload => {
        const file = await dialog.open({
			directory: false,
			multiple: false,
			recursive: false,
			title: 'Open Project',
			filters: [{
                extensions: ['yml', 'yaml'],
                name: 'FWGE Project YAML File'
            }]
		});

		if (!file) {
			return;
		}

        await openProject(file as string);
        await rebuildProject();

        // projectPath = project.info.general.base_path;
        // projectName = project.info.general.name;
        // projectUUID = project.info.general.uuid;
        // projectThumbnailPath = project.info.meta.thumbnail;
        	
        // await db.projects.update({
        //     uuid: currentProject.info.general.uuid,
        //     config: currentProject
        // });
        
        // await db.projectHistory.update({
        //     uuid: projectUUID,
        //     name: projectName,
        //     filePath: projectPath,
        //     lastModfied: new Date()
        // });
    });

    const unlistenOpenRecent = await listen<MenuOpenRecentPayload>(MENU__OPEN_RECENT, payload => {
        alert(MENU__OPEN_RECENT);
    });

    const unlistenSave = await listen<MenuSavePayload>(MENU__SAVE, payload => {
        alert(MENU__SAVE);
    });

    const unlistenSaveAs = await listen<MenuSaveAsPayload>(MENU__SAVE_AS, payload => {
        alert(MENU__SAVE_AS);
    });

    const unlistenBuild = await listen<MenuBuildPayload>(MENU__BUILD, payload => {
        alert(MENU__BUILD);
    });

    const unlistenConfig = await listen<MenuConfigPayload>(MENU__CONFIG, payload => {
        alert(MENU__CONFIG);
    });

    const unlistenSettings = await listen<MenuSettingsPayload>(MENU__SETTINGS, payload => {
        alert(MENU__SETTINGS);
    });

    return [
        unlistenOpen,
        unlistenOpenRecent,
        unlistenSave,
        unlistenSaveAs,
        unlistenBuild,
        unlistenConfig,
        unlistenSettings
    ];
}
