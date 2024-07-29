import { type DecoratorManager, DefaultWindow, Game, Scene } from "@fwge/core";
import { dialog, fs, path } from "@tauri-apps/api";
import { currentGameStore } from "../../stores/project.store";
import { buildProject } from "./commands";
import { GL } from "@fwge/common";

export async function rebuildProject(): Promise<void> {
    try {
        await buildProject();
    } catch (err) {
        dialog.message(err as string);
    }
    

    const filePath = await path.resolveResource('braids.js')
    const fileContents = await fs.readTextFile(filePath);
    const script = document.body.getElementsByTagName('script').namedItem('game')!;
    script.innerHTML = fileContents;
    
    const decoratorManager = (window as any).DecoratorManager as typeof DecoratorManager;
    const projectConstructor = (window as any).ProjectConstructor as typeof Game;
    
    console.log({ decoratorManager })
    
    const game = new projectConstructor();
    currentGameStore.set(game);
}
