import { invoke } from "@tauri-apps/api";
import type { FWGEProject } from "./fwge.model";

export async function createNewProject(projectName: string, projectPath: string): Promise<void>
{
    try
    {
        await invoke<void>('create', { projectName, projectPath });
    }
    catch(e: any)
    {
        console.error(e);
    }
}

export async function openProject(filePath: string): Promise<FWGEProject | string>
{
    try
    {
        const project = await invoke<FWGEProject | string>('open', { filePath });
        console.log(project)
        return project
    }
    catch (e)
    {
        console.error(e)
        return e as string
    }
}

export async function getProject(): Promise<FWGEProject | string>
{
    try
    {        
        const project = await invoke<FWGEProject | string>('get');
        console.log(project)
        return project
    }
    catch (e)
    {
        console.error(e)
        return e as string
    }
}
