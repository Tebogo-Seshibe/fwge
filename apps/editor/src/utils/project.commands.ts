import { invoke } from "@tauri-apps/api";
import type { FWGEProject } from "./fwge.model";

export async function createNewOpen(projectName: string, projectPath: string): Promise<void>
{
    try
    {
        console.log(await invoke('create', { projectName, projectPath }));
    }
    catch(e: any)
    {
        console.error(e);
    }
}

export async function openProject(filePath: string): Promise<FWGEProject | string>
{
    return await invoke<FWGEProject | string>('open', { filePath });
}
