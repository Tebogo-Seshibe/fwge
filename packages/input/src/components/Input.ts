import { FixedLengthArray } from '@fwge/common';
import { ControllerState, KeyboardState, MouseState } from '..';
import { Component } from '@fwge/ecs';

export interface IInputArgs
{
    Keyboard: KeyboardState
    Mouse: MouseState
    Controllers: ControllerState[]
}

interface InputArgs
{
    onInput: (delta: number, keyboard: KeyboardState, mouse: MouseState, controllers: Readonly<FixedLengthArray<ControllerState, 4>>) => void
}

export class Input extends Component
{
    OnInput: (delta: number, keyboard: KeyboardState, mouse: MouseState, controllers: Readonly<FixedLengthArray<ControllerState, 4>>) => void
    
    constructor(args: InputArgs)
    {
        super(Input);

        this.OnInput = args.onInput
    }
}
