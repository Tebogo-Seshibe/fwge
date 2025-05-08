import { Type } from "@fwge/ecs";

export abstract class Asset
{
    protected loaded: boolean = false;

    constructor(
        public readonly Type: Type<Asset> = new.target as any
    ) { }

    abstract Reset(): void;
    abstract Load(protocol?: (...args: any[]) => Promise<Blob>): void;
    abstract Unload(): void;
    abstract Destroy(): void;
}
