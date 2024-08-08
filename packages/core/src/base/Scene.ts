import { Entity, EntityId, System, Type } from "../ecs";
import { Game } from "./Game";
import { DefaultWindow } from "./render/DefaultWindow";
import { RenderWindow } from "./render/RenderWindow";

export type SceneId = number;

export interface IScene
{
    windows: readonly [Type<RenderWindow>, ...Type<RenderWindow>[]];
    systems: readonly Type<System>[];
    entities: readonly Type<Entity>[];
    sharedEntities: readonly ({ type: Type<Entity>, name: string })[];
}

export class Scene
{
    private static SceneId: SceneId = 0;

    readonly Id: SceneId = Scene.SceneId++;
    readonly Name: string;
    readonly Game: Game;
    readonly Entities: EntityId[] = [];
    readonly Systems: System[] = [];
    readonly Windows: RenderWindow[] = [];

    constructor(game: Game);
    constructor(game: Game, config: IScene);
    constructor(game: Game, config: IScene = { windows: [ DefaultWindow ], entities: [], systems: [], sharedEntities: [] })
    {
        this.Game = game;
        this.Name = new.target.name;

        for (const renderWindow of config.windows)
        {
            this.Windows.push(new renderWindow(game));
        }

        for (const system of config.systems)
        {
            this.Systems.push(new system(game));
        }

        for (const entity of config.entities)
        {
            this.Entities.push((new entity(game)).Id);
        }

        for (const entity of config.sharedEntities)
        {
            const potentials = game.GetEntities(entity.type);
            if (potentials.length === 0)
            {
                const yes = new entity.type(game);
                yes.Name = entity.name;
                this.Entities.push(yes.Id);
            }
            else
            {
                const yes = potentials.find(x => x.Name === entity.name)!;
                this.Entities.push(yes.Id);
            }
        }
    }

    public Init(): void
    {
        for (let i = 0; i < this.Entities.length; ++i)
        {
            this.Game.GetEntity(this.Entities[i])!.Init();
        }
        
        for (let i = 0; i < this.Systems.length; ++i)
        {
            this.Systems[i].Init();
        }
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
    }
}
