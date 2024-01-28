import { Component } from "@fwge/ecs";
import { ControllerState, KeyboardState, MouseState } from "@fwge/input";

export type ActionInputArgs = {
    [name: string]: {
        keyboard?: (keyof Omit<KeyboardState, 'Keys'>)[],
        mouse?: (keyof Omit<MouseState, ''>)[],
        controller?: (keyof Omit<ControllerState, 'Active'>)[]
    }
}[];

export class ActionInput extends Component
{
    readonly Config: ActionInputArgs;

    constructor(args: ActionInputArgs)
    {
        super();
        this.Config = args;
    }
}
