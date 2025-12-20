import { type Asset, Game, type Scene } from "@fwge/core";
import type { Entity, System } from "@fwge/ecs";
import { writable } from "svelte/store";
import { Project } from "../engine/Project";

export const currentGameStore = writable<Game | undefined>(new Project());
export const currentSceneStore = writable<Scene | undefined>(undefined);
export const currentEntityStore = writable<Entity | undefined>(undefined);
export const currentSystemStore = writable<System | undefined>(undefined);
export const currentAssetStore = writable<Asset | undefined>(undefined);
