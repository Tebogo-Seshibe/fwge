import { SharedComponent } from '@fwge/core';
import { ControllerState, KeyboardState, MouseState } from '..';

export interface IInputArgs
{
    Keyboard: KeyboardState
    Mouse: MouseState
    Controllers: ControllerState[]
}
interface IInput
{
    onInput: (input: IInputArgs, delta: number) => void
}

export class Input extends SharedComponent
{
    OnInput: (input: IInputArgs, delta: number) => void
    
    constructor(args: IInput)
    {
        super()

        this.OnInput = args.onInput
    }
}
