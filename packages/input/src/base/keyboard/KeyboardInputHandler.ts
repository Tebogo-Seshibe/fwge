import { KeyState } from "../InputState";
import { KeyboardState } from "./KeyboardState";

export const NUM_KEYBOARD_KEYS: number = 256;

export class KeyboardInputHandler
{
    private readonly keyTicks: Uint8Array = new Uint8Array(NUM_KEYBOARD_KEYS);
    public readonly State: KeyboardState;

    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly keyDelay: number = 0.0,
        private readonly keys: Uint8ClampedArray
    ) {
        this.State = new KeyboardState(keys);
    }
    
    Start(): void        
    {
        this.canvas.ownerDocument.documentElement.addEventListener('keydown', this.keydown.bind(this));
        this.canvas.ownerDocument.documentElement.addEventListener('keyup', this.keyup.bind(this));
    }

    Update(delta: number): void
    {
        for (let i = 0 ; i < this.keys.length; ++i)
        {
            if (this.keyTicks[i] === 0)
            {
                switch(this.keys[i])
                {
                    case KeyState.PRESSED:
                    case KeyState.DOUBLE_PRESSED:
                        this.keys[i] = KeyState.DOWN;
                        break

                    case KeyState.RELEASED:
                        this.keys[i] = KeyState.UP;
                        break
                }
            }
            else
            {
                this.keyTicks[i] = 0;
            }
        }
    }

    Stop(): void
    {
        this.canvas.ownerDocument.documentElement.removeEventListener('keydown', this.keydown.bind(this));
        this.canvas.ownerDocument.documentElement.removeEventListener('keyup', this.keyup.bind(this));
    }

    private keydown(e: KeyboardEvent)
    {
        e.preventDefault();

        if (this.keys[e.which] === KeyState.UP)
        {
            this.keys[e.which] = KeyState.PRESSED;
            this.keyTicks[e.which] = 1;
        }
        else if (this.keys[e.which] === KeyState.RELEASED)
        {
            this.keys[e.which] = KeyState.DOUBLE_PRESSED;
            this.keyTicks[e.which] = 1;
        }
    }

    private keyup(e: KeyboardEvent)
    {
        e.preventDefault();
        this.keys[e.which] = KeyState.RELEASED;
    }
}