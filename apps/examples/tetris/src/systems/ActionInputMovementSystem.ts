import { Transform } from "@fwge/core";
import { Registry, System } from "@fwge/ecs";
import { ActionInput } from "../components/ActionInput";

export class ActionInputMovementSystem extends System
{
    view = Registry.RegisterView([Transform, ActionInput]);

    Init(): void
    {
        console.log('init')
    }
    Start(): void
    {
        console.log('start')
        console.log({ Registry })
    }
    Update(): void
    {
        // console.log(Registry.GetView(this.view).length)
        
    }
    Stop(): void
    {
        console.log('stop')
    }

}