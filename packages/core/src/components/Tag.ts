import { Game } from "../base";
import { Component } from "../ecs";

export class Tag extends Component
{
    constructor(
        game: Game,
        public readonly Name: string = 'Default'
    ) { super(game, Tag); }

    Init(): void { }
    Destroy(): void { }
}
