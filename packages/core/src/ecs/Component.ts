import { Game } from "../base";
import { type Class, type Type } from "./Class";

export type ComponentId = number;
export type TypeId = number;

export class Component
{
    public static readonly TypeId: TypeId;
    
    public readonly Id: ComponentId;
    public readonly TypeId: TypeId;
    public readonly Game: Game;
    private _initialized: boolean;

    constructor(game: Game);
    constructor(game: Game, componentType: Type<Component>);
    constructor(game: Game, componentType: Type<Component> = new.target as any)
    {
        const _class = componentType = componentType as Class<Component>;
        if (_class.TypeId === undefined)
        {
            game.RegisterComponentType(_class);
        }

        this.TypeId = _class.TypeId;
        this.Id = game.CreateComponent(_class.TypeId, this);
        this.Game = game;
        this._initialized = false;
    }

    public Init(): void
    {
        if (!this._initialized)
        {
            this._initialized = true;
        }
    }

    public Destroy(): void
    {
        this._initialized = false;
    }
}
