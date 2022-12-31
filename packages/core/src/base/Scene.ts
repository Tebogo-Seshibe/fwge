import { UUID } from "@fwge/common";
import { Entity } from "../ecs/Entity";
import { addScene, Class, Constructor, EntityId, RegistryItem, SceneId, SceneManager } from "../ecs/Registry";
import { System } from "../ecs/System";
import { Game } from "./Game";
import { Prefab } from "./Prefab";
import { DefaultWindow } from "./render/DefaultWindow";
import { RenderWindow } from "./render/RenderWindow";

export type SceneType<T extends Scene = Scene> = Class<T>;

export interface IScene
{
    windows: Class<RenderWindow>[];
    systems: Class<System>[];
    entities: (Class<Entity> | Prefab)[];
}


export class Scene extends RegistryItem
{
    readonly Game: Game;
    readonly Entities: Map<EntityId, Entity> = new Map();
    readonly Systems: System[] = [];
    readonly Windows: RenderWindow[] = [];

    private _running: boolean = false;

    constructor(game: Game);
    constructor(game: Game, config: IScene);
    constructor(game: Game, config?: IScene, uuid?: UUID)
    {
        super(SceneManager, uuid);

        this.Game = game;
        addScene(this);

        config = {
            windows: config?.windows ?? [DefaultWindow],
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
        for (const [, entity] of this.Entities)
        {
            for (const system of this.Systems)
            {
                system.OnUpdateEntity(entity);
            }
        }

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
                system.Reset();
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
        this.OnEntity(entity);

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
            this.OnEntity(entity);
            entity.OnDestroy();
        }
    }

    public OnEntity(entity: Entity): void
    {
        if (this._running)
        {
            for (const system of this.Systems)
            {
                system.OnUpdateEntity(entity);
            }
        }
    }
    //#endregion
}
