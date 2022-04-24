import { KeyboardState } from "./KeyboardState"
import { KeyState } from "../InputState"

export class KeyboardInputHandler
{
    static readonly TOTAL_KEYS: number = 128

    private _state: KeyState[] = []
    
    public get State(): KeyboardState
    {
        return new KeyboardState(this._state)
    }


    constructor(private canvas: HTMLCanvasElement)
    {
        for (var i = 0; i < KeyboardInputHandler.TOTAL_KEYS; ++i)
        {
            this._state.push(KeyState.UP)
        }
    }
    
    Start(): void        
    {
        this.canvas.ownerDocument.documentElement.onkeydown = this._keydown.bind(this)
        this.canvas.ownerDocument.documentElement.onkeypress = this._keypress.bind(this)
        this.canvas.ownerDocument.documentElement.onkeyup = this._keyup.bind(this)
    }

    Update(_: number): void
    {

    }

    Stop(): void
    {
        this.canvas.ownerDocument.documentElement.onkeydown = null
        this.canvas.ownerDocument.documentElement.onkeypress = null
        this.canvas.ownerDocument.documentElement.onkeyup = null
    }

    private _keydown(e: KeyboardEvent)
    {
        e.preventDefault()

        this._state[e.which] = KeyState.DOWN
    }

    private _keypress(e: KeyboardEvent)
    {
        e.preventDefault()

        this._state[e.which] = KeyState.PRESSED
    }

    private _keyup(e: KeyboardEvent)
    {
        e.preventDefault()

        this._state[e.which] = KeyState.UP
    }
}
