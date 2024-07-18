import { invoke } from "@tauri-apps/api";
import type { Project } from "./models";

export async function createProject(projectName: string, projectPath: string, createFolder: boolean = false): Promise<void> {
    return await invoke<void>('create_project', { projectName, projectPath, createFolder });
}

export async function openProject(filePath: string): Promise<Project> {
    return await invoke<Project>('open_project', { filePath });
}

export async function getProject(): Promise<Project> {
    return await invoke<Project>('get_project');
}

export async function buildProject(): Promise<string> {
    return await invoke<string>('build_project');
}
