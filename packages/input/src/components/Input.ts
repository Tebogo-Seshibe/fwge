import { FixedLengthArray } from '@fwge/common';
import { Component, Game } from '@fwge/core';
import { ControllerState, KeyboardState, MouseState } from '..';

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
    
    constructor(game: Game, args: InputArgs)
    {
        super(game, Input);

        this.OnInput = args.onInput
    }
}
