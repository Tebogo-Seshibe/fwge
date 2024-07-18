import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { rebuildProject } from "../project/utils";
import { EDITOR__OPEN } from "./ids";
import type { EditorOpenPayload } from "./model";

export async function registerEditorListeners() : Promise<UnlistenFn[]> {
    const unlistenOpen = await listen<EditorOpenPayload>(EDITOR__OPEN, async event => {
        rebuildProject();
    });

    return [
        unlistenOpen
    ];
}
