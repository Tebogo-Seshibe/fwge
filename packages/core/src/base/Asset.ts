import { Type } from "@fwge/ecs";
import { Game } from "./Game";

export abstract class Asset
{
    constructor(
        public readonly Type: Type<Asset> = new.target as any
    ) { }

    abstract Load(game: Game, protocol?: (...args: any[]) => Promise<Blob>): Promise<void>;
    abstract Unload(game: Game): Promise<void>;
    abstract Destroy(game: Game): Promise<void>;
}
