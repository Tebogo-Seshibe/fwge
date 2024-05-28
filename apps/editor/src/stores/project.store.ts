import { writable } from "svelte/store";
import type { Project } from "../fwge-logic/Project";

export const projectStore = writable<Project>();