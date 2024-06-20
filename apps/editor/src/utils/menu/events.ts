import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { BUILD, CONFIG, OPEN, OPEN_RECENT, SAVE, SAVE_AS, SETTINGS } from "./ids";
import type { OpenPayload, OpenRecentPayload, SavePayload, SaveAsPayload, BuildPayload, ConfigPayload, SettingsPayload } from "./models";

export async function registerListeners() : Promise<UnlistenFn[]> {
    const unlistenOpen = await listen<OpenPayload>(OPEN, payload => {
        alert(OPEN);
    });

    const unlistenOpenRecent = await listen<OpenRecentPayload>(OPEN_RECENT, payload => {
        alert(OPEN_RECENT);
    });

    const unlistenSave = await listen<SavePayload>(SAVE, payload => {
        alert(SAVE);
    });

    const unlistenSaveAs = await listen<SaveAsPayload>(SAVE_AS, payload => {
        alert(SAVE_AS);
    });

    const unlistenBuild = await listen<BuildPayload>(BUILD, payload => {
        alert(BUILD);
    });

    const unlistenConfig = await listen<ConfigPayload>(CONFIG, payload => {
        alert(CONFIG);
    });

    const unlistenSettings = await listen<SettingsPayload>(SETTINGS, payload => {
        alert(SETTINGS);
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
