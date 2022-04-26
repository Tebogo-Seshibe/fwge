import { KeyboardState } from "./KeyboardState"
import { KeyState } from "../InputState"

export class KeyboardInputHandler
{
    static readonly TOTAL_KEYS: number = 128

    private _keys: KeyState[] = []
    private _state: KeyboardState
    
    public get State(): KeyboardState
    {
        return this._state
    }


    constructor(private canvas: HTMLCanvasElement)
    {
        for (var i = 0; i < KeyboardInputHandler.TOTAL_KEYS; ++i)
        {
            this._keys.push(KeyState.UP)
        }

        this._state = new KeyboardState(this._keys)
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

        this._keys[e.which] = KeyState.DOWN
    }

    private _keypress(e: KeyboardEvent)
    {
        e.preventDefault()

        this._keys[e.which] = KeyState.PRESSED
    }

    private _keyup(e: KeyboardEvent)
    {
        e.preventDefault()

        this._keys[e.which] = KeyState.UP
    }
}
