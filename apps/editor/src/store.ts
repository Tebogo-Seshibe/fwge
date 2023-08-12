import { writable } from "svelte/store";
import type { EditorProject } from "./config/EditorProject";

export const Project = writable<EditorProject>();
