import { writable } from "svelte/store";
import type { Project } from "../fwge-logic/Project";
import type { SceneId } from "@fwge/core";
import type { Entity } from "@fwge/ecs";

export const projectStore = writable<Project>();
export const currentSceneStore = writable<SceneId>(1);
export const currentEntityStore = writable<Entity | undefined>(undefined);
