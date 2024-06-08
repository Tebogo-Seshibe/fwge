import { invoke } from "@tauri-apps/api";

export async function createNewOpen(projectName: string, projectPath: string): Promise<void>
{
    try
    {
        console.log(await invoke('create', { projectName, projectPath }));
    }
    catch(e: any)
    {
        console.log(e);
    }
}

export async function openProject(projectPath: string): Promise<void>
{
    try
    {
        await invoke('open', { projectPath });
    }
    catch(e: any)
    {
        console.log(e);
    }
}
