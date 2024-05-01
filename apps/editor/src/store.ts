import { writable } from "svelte/store";
import type { EditorProject } from "./config/EditorProject";
import type { WindowName } from "./utils/windows.types";

export const Project = writable<EditorProject>();
export const CurrentWindow = writable<WindowName>("launcher");
