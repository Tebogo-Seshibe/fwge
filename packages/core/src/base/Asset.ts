import { Type } from "@fwge/ecs";

export abstract class Asset
{
    public get Loaded()
    {
        return this.loaded;
    }
    protected loaded: boolean = false;

    constructor(
        public readonly Type: Type<Asset> = new.target as any
    ) { }

    abstract Reset(): void;
    abstract Load(protocol?: (...args: any[]) => Promise<Blob>): Promise<any>;
    abstract Unload(): void;
    abstract Destroy(): void;
}
