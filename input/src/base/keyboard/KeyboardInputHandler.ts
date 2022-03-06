import { KeyboardState } from "./KeyboardState"
import { KeyState } from "../InputState"

export class KeyboardInputHandler
{
    static readonly TOTAL_KEYS: number = 128

    #state: KeyState[] = []
    
    public get State(): KeyboardState
    {
        return new KeyboardState(this.#state)
    }


    constructor(private canvas: HTMLCanvasElement)
    {
        for (var i = 0; i < KeyboardInputHandler.TOTAL_KEYS; ++i)
        {
            this.#state.push(KeyState.UP)
        }
    }
    
    Start(): void        
    {
        this.canvas.ownerDocument.documentElement.addEventListener('keydown', this.#keydown.bind(this))
        this.canvas.ownerDocument.documentElement.addEventListener('keypress', this.#keypress.bind(this))
        this.canvas.ownerDocument.documentElement.addEventListener('keyup', this.#keyup.bind(this))
    }

    Update(_: number): void
    {

    }

    Stop(): void        
    {
        this.canvas.ownerDocument.documentElement.removeEventListener('keydown', this.#keydown.bind(this))
        this.canvas.ownerDocument.documentElement.removeEventListener('keypress', this.#keypress.bind(this))
        this.canvas.ownerDocument.documentElement.removeEventListener('keyup', this.#keyup.bind(this))
    }

    #keydown(e: KeyboardEvent)
    {
        e.preventDefault()

        this.#state[e.which] = KeyState.DOWN
    }

    #keypress(e: KeyboardEvent)
    {
        e.preventDefault()

        this.#state[e.which] = KeyState.PRESSED
    }

    #keyup(e: KeyboardEvent)
    {
        e.preventDefault()

        this.#state[e.which] = KeyState.UP
    }
}
