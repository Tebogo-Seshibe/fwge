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
        this.canvas.ownerDocument.documentElement.addEventListener('keydown', this._keydown.bind(this))
        this.canvas.ownerDocument.documentElement.addEventListener('keyup', this._keyup.bind(this))
    }

    Update(_: number): void
    {
        for (let i = 0 ; i < this._keys.length; ++i)
        {
            if (this._keys[i] === KeyState.PRESSED)
            {
                this._keys[i] = KeyState.DOWN
            }
        }
    }

    Stop(): void
    {
        this.canvas.ownerDocument.documentElement.removeEventListener('keydown', this._keydown.bind(this))
        this.canvas.ownerDocument.documentElement.removeEventListener('keyup', this._keyup.bind(this))
    }

    private _keydown(e: KeyboardEvent)
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
