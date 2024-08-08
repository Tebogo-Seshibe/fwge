import { Component, Game } from "@fwge/core";
import { ControllerState, KeyboardState } from "@fwge/input";

type Action = { [actionName: string]: ActionMapping }

type ActionMapping = 
    StateActionMapping | 
    BooleanActionMapping | 
    ScalarActionMapping | 
    VectorActionMapping |
    Vector2DActionMapping

type StateActionMapping =
{
    type: 'state',
}

type BooleanActionMapping =
{
    type: 'boolean',
}

type ScalarActionMapping =
{
    type: 'scalar',
}

type VectorActionMapping =
{
    type: 'vector'

}

type Vector2DActionMapping =
{
    type: 'vector2d',
    up: 
        (keyof KeyboardState) | 
        (keyof Omit<ControllerState, 'LeftStick' | 'RightStick'>) |
        (keyof Pick<ControllerState, 'LeftStick' | 'RightStick'>['LeftStick']['X']) 

}


export class ActionInput<T extends Action> extends Component
{
    private Data = new Float32Array();

    readonly Config: T;

    constructor(game: Game, args: T)
    {
        super(game);
        this.Config = args;
    }

    
    GetInput(key: keyof typeof this['Config'])
    {
        const mapping = this.Config[key];

    }
}
