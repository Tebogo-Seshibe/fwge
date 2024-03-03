import { Registry, System } from "@fwge/ecs";
import { Player } from "../components/Player";
import { Renderer } from "@fwge/core";

export class GridSystem extends System
{
    playerTetromino!: number;
    

    Init(): void
    {
        this.playerTetromino = Registry.RegisterView([Player, Renderer])
    }

    Start(): void { }
    
    Update(delta: number): void
    {
        const playerTetrominos = Registry.GetView(this.playerTetromino);
        if (playerTetrominos.length !== 1)
        {
            return;
        }
    }

    Stop(): void { }
}