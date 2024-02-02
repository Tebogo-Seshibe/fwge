import { Transform } from "@fwge/core";
import { Registry, System } from "@fwge/ecs";
import { ActionInput } from "../components/ActionInput";

const NoOp = (..._args: any[]) => void  0;

export class ActionInputMovementSystem extends System
{
    private view!: number;
    private iterations: number = 100;

    Init(): void
    {
        this.view = Registry.RegisterView([Transform, ActionInput]);
    }

    Start = NoOp;

    Update(delta: number): void
    {
        
    }

    Stop = NoOp;
}
