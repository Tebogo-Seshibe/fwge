import { UUID } from "@fwge/common";
import { Game } from "./Game";
import { Prefab } from "./Prefab";
import { DefaultWindow } from "./render/DefaultWindow";
import { RenderWindow } from "./render/RenderWindow";
import { Class, Constructor, Entity, EntityId, System } from "@fwge/ecs";

export type SceneType<T extends Scene = Scene> = Class<T>;
export type SceneId = number;
export interface IScene
{
    windows: RenderWindow[];
    systems: Class<System>[];
    entities: (Class<Entity> | Prefab)[];
}

export class Scene
{
    private static SceneId: SceneId = 0;

    readonly Id: SceneId = Scene.SceneId++;
    readonly Game: Game;
    readonly Entities: Map<EntityId, Entity> = new Map();
    readonly Systems: System[] = [];
    readonly Windows: RenderWindow[] = [];

    private _running: boolean = false;

    constructor(game: Game);
    constructor(game: Game, config: IScene);
    constructor(game: Game, config?: IScene, uuid?: UUID)
    {
        this.Game = game;

        config = {
            windows: config?.windows ?? [new DefaultWindow()],
            entities: config?.entities ?? [],
            systems: config?.systems ?? [],
            ...config,
        };

        for (const WindowConstructor of config.windows!)
        {
            this.Windows.push(new WindowConstructor(this));
        }

        for (const SystemConstructor of config.systems)
        {
            this.AddSystem(new SystemConstructor(this));
        }

        for (const EntityConstructor of config.entities)
        {
            if (typeof EntityConstructor === 'function')
            {
                this.CreateEntity(EntityConstructor);
            }
            else
            {
                EntityConstructor.Instance(this);
            }
        }
    }

    public Init(): void
    {
        for (const system of this.Systems)
        {
            system.Init();
        }
    }

    public Start(): void
    {
        if (!this._running)
        {
            this._running = true;
            for (const system of this.Systems)
            {
                system.onStart();
            }
        }
    }

    public Update(delta: number): void
    {
        for (const system of this.Systems)
        {
            system.Update(delta);
        }
    }

    public Stop(): void
    {
        if (this._running)
        {
            for (const system of this.Systems)
            {
                system.onStop();
            }
            this._running = false;
        }
    }

    public AddSystem(system: System)
    {
        this.Systems.push(system);
    }

    //#region Entity Logic
    public CreateEntity(): Entity;
    public CreateEntity<T extends Entity, U extends any[]>(constructor: Constructor<T, [Scene, ...U]>, ...args: U): T;
    public CreateEntity<T extends Entity, U extends any[]>(constructor?: Constructor<T, [Scene, ...U]>, ...args: U): T
    {
        const entity = constructor ? new constructor(this, ...args) : new Entity(this);
        this.Entities.set(entity.Id, entity);
        entity.OnCreate();

        return entity as T;
    }

    public GetEntity(entityId: EntityId): Entity | undefined
    {
        return this.Entities.get(entityId);
    }

    public RemoveEntity(entityId: EntityId): void;
    public RemoveEntity(entity: Entity): void;
    public RemoveEntity(arg: EntityId | Entity): void
    {
        const entity = typeof arg === 'number'
            ? this.GetEntity(arg)
            : arg;

        if (entity && this.Entities.has(entity.Id))
        {
            this.Entities.delete(entity.Id);
            entity.OnDestroy();
        }
    }
    //#endregion
}
