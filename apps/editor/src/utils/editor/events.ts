import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { currentProjectStore } from "../../stores/project.store";
import { getDefinitions, getProject } from "../fwge/commands";
import { EDITOR__OPEN } from "./ids";
import type { EditorOpenPayload } from "./model";
import type { Game } from "@fwge/core";

export async function registerEditorListeners() : Promise<UnlistenFn[]> {
    const unlistenOpen = await listen<EditorOpenPayload>(EDITOR__OPEN, async event => {
        currentProjectStore.set(await getProject());
        const definitions = await getDefinitions();
        const script = document.createElement('script');
        script.type = 'module'
        script.innerHTML = definitions
        document.body.appendChild(script)

        console.log((document as any).Project as Game)
    });

    return [
        unlistenOpen
    ];
}