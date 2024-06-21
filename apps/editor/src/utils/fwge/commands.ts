import { invoke } from "@tauri-apps/api";
import type { FWGEProject, FWGEProjectInfo } from "./models";

export async function createNewProject(projectName: string, projectPath: string): Promise<void> {
    await invoke<void>('create', { projectName, projectPath });
}

export async function openProject(filePath: string): Promise<FWGEProjectInfo> {
    return await invoke<FWGEProjectInfo>('open', { filePath });
}

export async function getProject(): Promise<FWGEProject> {
    return await invoke<FWGEProject>('get');
}
