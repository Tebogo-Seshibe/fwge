import { SharedComponent } from '@fwge/core';
import { ControllerState, KeyboardState, MouseState } from '..';
import { FixedLengthArray } from '@fwge/common';

export interface IInputArgs
{
    Keyboard: KeyboardState
    Mouse: MouseState
    Controllers: ControllerState[]
}
interface IInput
{
    onInput: (delta: number, keyboard: KeyboardState, mouse: MouseState, controllers: FixedLengthArray<ControllerState, 4>) => void
}

export class Input extends SharedComponent
{
    OnInput: (delta: number, keyboard: KeyboardState, mouse: MouseState, controllers: FixedLengthArray<ControllerState, 4>) => void
    
    constructor(args: IInput)
    {
        super()

        this.OnInput = args.onInput
    }
}
