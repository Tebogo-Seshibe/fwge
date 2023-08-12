import { invoke } from "@tauri-apps/api";

export async function new_project(name: string): Promise<string | undefined>
{
    try 
    {
        let currDir = await invoke<string>('new_project', { name });
        return currDir;
    }
    finally
    {
        return undefined;
    }
}

export async function greet(name: string): Promise<string>
{
    return await invoke("greet", { name });
}
