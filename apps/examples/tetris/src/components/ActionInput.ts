import { Scalar, Vector2 } from "@fwge/common";
import { Component, Entity } from "@fwge/ecs";
import { ButtonState, ControllerState, KeyState, KeyboardState, MouseState, WheelState } from "@fwge/input";

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

    constructor(args: T)
    {
        super();
        this.Config = args;
    }

    
    GetInput(key: keyof typeof this['Config'])
    {
        const mapping = this.Config[key];

    }
}

const a = new ActionInput({
    movement: {
        type: 'boolean',
    }
})

a.GetInput('movement')