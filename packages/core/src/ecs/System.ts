import { Game } from "../base";

export abstract class System
{
    public readonly Name: string;
    public readonly Game: Game;

    constructor(game: Game)
    constructor(game: Game, name: string)
    constructor(game: Game, name: string = new.target.name)
    {
        this.Game = game;
        this.Name = name;
    }
    
    public abstract Init(): void;
    public abstract Start(): void;
    public abstract Update(delta: number): void;
    public abstract Stop(): void;
}
