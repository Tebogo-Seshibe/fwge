import { Class, Entity, EntityId, System, Type } from "@fwge/ecs";
import { Game } from "./Game";
import { RenderWindow } from "./render/RenderWindow";

export type SceneId = number;

export interface IScene
{
    windows: readonly [Type<RenderWindow>, ...Type<RenderWindow>[]];
    systems: readonly Type<System>[];
    entities: readonly Type<Entity>[];
    sharedEntities: readonly ({ type: Type<Entity>, name: string })[];
}

export abstract class Scene
{
    public static SceneId: SceneId = 0;

    readonly Id: SceneId = Scene.SceneId++;
    readonly Name: string;
    readonly Game: Game;
    readonly Entities: EntityId[] = [];
    readonly Systems: System[] = [];
    readonly Windows: RenderWindow[] = [];

    protected abstract UseWindows: Type<RenderWindow>[];
    protected abstract UseEntites: Type<Entity>[];
    protected abstract UseSystems: Type<System>[];

    private _initialized: boolean = false;

    constructor(game: Game)
    {
        this.Game = game;
        this.Name = new.target.name;
    }

    public Init(): void
    {
        if (this._initialized)
        {
            return;
        }

        for (let i = 0; i < this.UseWindows.length; ++i)
        {
            this.Windows.push(new this.UseWindows[i](this.Game));
        }
            
        for (let i = 0; i < this.UseEntites.length; ++i)
        {
            let entity: Entity;
            const preExisting = this.Game.GetEntities(this.UseEntites[i] as Class<Entity>);
            
            if (preExisting.length !== 0)
            {
                entity = preExisting[0];
            }
            else
            {
                entity = new this.UseEntites[i](this.Game);
            }
            
            entity.Init();
            this.Entities.push(entity.Id);
        }
        
        for (let i = 0; i < this.UseSystems.length; ++i)
        {
            this.Systems.push(new this.UseSystems[i](this.Game));
        }

        for (let i = 0; i < this.Entities.length; ++i)
        {
            this.Game.GetEntity(this.Entities[i])!.Init();
        }
        
        for (let i = 0; i < this.Systems.length; ++i)
        {
            this.Systems[i].Init();
        }

        this._initialized = true;
    }

    public Start(): void
    {
        for (let i = 0; i < this.Systems.length; ++i)
        {
            this.Systems[i].Start();
        }
    }

    public Update(delta: number): void
    {
        for (let i = 0; i < this.Systems.length; ++i)
        {
            this.Systems[i].Update(delta);
        }
    }

    public Stop(): void
    {
        for (let i = 0; i < this.Systems.length; ++i)
        {
            this.Systems[i].Stop();
        }
    }

    public Destroy(): void
    {
        this.Entities.empty();
        this.Systems.empty();
        this.Windows.empty();
        this._initialized = false;
    }
}
