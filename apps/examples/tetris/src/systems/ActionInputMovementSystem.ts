import { Transform } from "@fwge/core";
import { Registry, System } from "@fwge/ecs";
import { ActionInput } from "../components/ActionInput";

export class ActionInputMovementSystem extends System
{
    private view!: number;
    private iterations: number = 100;

    Init(): void
    {
        this.view = Registry.RegisterView([Transform, ActionInput]);
    }

    Start(): void { }

    Update(delta: number): void
    {
        
    }

    Stop(): void { }
}
