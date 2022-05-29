import { SharedComponent, Entity } from '@fwge/core'
import { ControllerState, KeyboardState, MouseState } from '..'

export interface IInputArgs
{
    Keyboard: KeyboardState
    Mouse: MouseState
    Controllers: ControllerState[]
}
interface IInput
{
    onInput: <T extends Entity>(this: T, input: IInputArgs, delta: number) => void
}

export class Input extends SharedComponent
{
    OnInput: <T extends Entity>(this: T, input: IInputArgs, delta: number) => void
    
    constructor(args: IInput)
    {
        super()

        this.OnInput = args.onInput
    }
}
