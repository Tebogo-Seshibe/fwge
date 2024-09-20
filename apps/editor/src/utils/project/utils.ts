import { type Constructor, Game } from "@fwge/core";
import { dialog, fs, path } from "@tauri-apps/api";
import { currentGameStore } from "../../stores/project.store";
import { buildProject } from "./commands";

export async function rebuildProject(): Promise<void> {
    try {
        await buildProject();

        const filePath = await path.resolveResource('braids.js')
        const fileContents = await fs.readTextFile(filePath);

        const script = document.body.getElementsByTagName('script').namedItem('game')!;
        script.innerHTML = fileContents;
        
        const projectConstructor = (window as any).ProjectConstructor as Constructor<Game>;
        const game = new projectConstructor(); 
        game.Protocol(async (uri: string) => {
            const fullUri = await path.resolveResource(uri);
            const bytes = await fs.readBinaryFile(fullUri);
            return new Blob([bytes]);
        })
        await game.Init();
        currentGameStore.set(game);
    } catch (err) {
        dialog.message(err as string);
    }
}
