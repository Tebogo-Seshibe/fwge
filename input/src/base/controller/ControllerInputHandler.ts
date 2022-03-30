import { Vector2 } from "@fwge/common"
import { ButtonState } from "../InputState"
import { ControllerState } from "./ControllerState"

export class ControllerInputHandler
{
    static readonly LeftStickX: number = 0
    static readonly LeftStickY: number = 1
    static readonly LeftStickPress: number = 2

    static readonly RightStickX: number = 3
    static readonly RightStickY: number = 4
    static readonly RightStickPress: number = 5

    static readonly DPAD: number = 6
    static readonly ABXY: number = 10
    static readonly LeftBumper: number = 15
    static readonly LeftTrigger: number = 16
    static readonly RightBumper: number = 17
    static readonly RightTrigger: number = 18
    static readonly Buttons: number = 19

    private _state: Array<Gamepad | null> = []

    get State()
    {
        const state: ControllerState[] = []

        for (let i = 0; i < this._state.length; ++i)
        {
            const gamepad = this._state[i]
            if (gamepad)
            {
                state.push(new ControllerState(
                    [
                        new Vector2(gamepad.axes[0], -gamepad.axes[1]),
                        gamepad.buttons[10].pressed 
                        ? ButtonState.PRESSED
                        : ButtonState.RAISED,
                    ],
                    [
                        new Vector2(gamepad.axes[2], -gamepad.axes[3]),
                        gamepad.buttons[11].pressed 
                        ? ButtonState.PRESSED
                        : ButtonState.RAISED
                    ],
                    [
                        gamepad.buttons[12].pressed 
                        ? ButtonState.PRESSED
                        : ButtonState.RAISED,
                        gamepad.buttons[13].pressed 
                        ? ButtonState.PRESSED
                        : ButtonState.RAISED,
                        gamepad.buttons[14].pressed 
                        ? ButtonState.PRESSED
                        : ButtonState.RAISED,
                        gamepad.buttons[15].pressed 
                        ? ButtonState.PRESSED
                        : ButtonState.RAISED
                    ],
                    [
                        gamepad.buttons[0].pressed 
                        ? ButtonState.PRESSED
                        : ButtonState.RAISED,
                        gamepad.buttons[1].pressed 
                        ? ButtonState.PRESSED
                        : ButtonState.RAISED,
                        gamepad.buttons[2].pressed 
                        ? ButtonState.PRESSED
                        : ButtonState.RAISED,
                        gamepad.buttons[3].pressed 
                        ? ButtonState.PRESSED
                        : ButtonState.RAISED
                    ],
                    [
                        gamepad.buttons[4].pressed 
                        ? ButtonState.PRESSED
                        : ButtonState.RAISED,
                        gamepad.buttons[5].pressed 
                        ? ButtonState.PRESSED
                        : ButtonState.RAISED,
                        gamepad.buttons[6].pressed 
                        ? ButtonState.PRESSED
                        : ButtonState.RAISED,
                        gamepad.buttons[7].pressed 
                        ? ButtonState.PRESSED
                        : ButtonState.RAISED
                    ],
                    gamepad.buttons.slice(16).map(x =>x.pressed ? ButtonState.PRESSED : ButtonState.RAISED)
                ))
            }
        }

        return state
    }
    
    constructor(canvas: HTMLCanvasElement)
    {
        canvas.ownerDocument.documentElement.addEventListener('gamepadconnected', this._addController.bind(this))
        
    }

    _addController(e: any)
    {
        console.log(e)
    }
    _removeController(e: any)
    {
        console.log(e)
    }

    Start(): void        
    {
        
    }

    Update(_: number): void
    {
        this._state = navigator.getGamepads()
    }

    Stop(): void        
    {
        
    }
}
