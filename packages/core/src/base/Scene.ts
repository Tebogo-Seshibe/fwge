import { Registry, Type, type Entity, type EntityId, type System } from "@fwge/ecs";
import { Game } from "./Game";
import { DefaultWindow } from "./render/DefaultWindow";
import { RenderWindow } from "./render/RenderWindow";

export type SceneId = number;

export interface IScene
{
    windows: readonly [Type<RenderWindow>, ...Type<RenderWindow>[]];
    systems: readonly Type<System>[];
    entities: readonly Type<Entity>[];
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
    constructor(game: Game, config: IScene = { windows: [ DefaultWindow ], entities: [], systems: [] })
    {
        this.Game = game;
        this.Name = new.target.name;

        for (const renderWindow of config.windows)
        {
            this.Windows.push(new renderWindow);
        }

        for (const system of config.systems)
        {
            this.Systems.push(new system);
        }

        for (const entity of config.entities)
        {
            this.Entities.push((new entity).Id);
        }
    }

    public Init(): void
    {
        for (let i = 0; i < this.Entities.length; ++i)
        {
            Registry.GetEntity(this.Entities[i])!.Init();
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
}
