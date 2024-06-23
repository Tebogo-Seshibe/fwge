import type { Asset, Game, Scene, SceneId } from "@fwge/core";
import type { Entity, System } from "@fwge/ecs";
import { writable } from "svelte/store";
import type { FWGEProject } from "../utils/fwge/models";

export const currentSceneIdStore = writable<SceneId>(1);

export const currentProjectStore = writable<FWGEProject>();
export const currentProjectUUIDStore = writable<string>();
export const currentGameStore = writable<Game>();
export const currentSceneStore = writable<Scene | undefined>(undefined);
export const currentEntityStore = writable<Entity | undefined>(undefined);
export const currentSystemStore = writable<System | undefined>(undefined);
export const currentAssetStore = writable<Asset | undefined>(undefined);
