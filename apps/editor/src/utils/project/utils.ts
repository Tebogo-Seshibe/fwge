import { Game } from "@fwge/core";
import { dialog, fs, path } from "@tauri-apps/api";
import { currentGameStore } from "../../stores/project.store";
import { buildProject } from "./commands";

export async function rebuildProject(): Promise<void> {
    try {
        await buildProject();
    } catch (err) {
        dialog.message(err as string);
    }
    
    const filePath = await path.resolveResource('braids.js')
    const fileContents = await fs.readTextFile(filePath);

    eval(fileContents);
    
    currentGameStore.set((window as any).game as Game);
}
