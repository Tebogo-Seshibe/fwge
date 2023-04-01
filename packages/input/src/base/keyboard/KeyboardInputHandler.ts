import { KeyState } from "../InputState";

export const NUM_KEYBOARD_KEYS: number = 256;

export class KeyboardInputHandler
{
    private readonly keyDelays: Float32Array = new Float32Array(NUM_KEYBOARD_KEYS);

    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly keyDelay: number = 0.2,
        private readonly buffer: Uint8ClampedArray = new Uint8ClampedArray(NUM_KEYBOARD_KEYS)
    ) { }
    
    Start(): void        
    {
        this.canvas.ownerDocument.documentElement.addEventListener('keydown', this.keydown.bind(this));
        this.canvas.ownerDocument.documentElement.addEventListener('keyup', this.keyup.bind(this));
    }

    Update(delta: number): void
    {
        for (let i = 0 ; i < this.buffer.length; ++i)
        {
            if (this.keyDelays[i] <= 0)
            {
                switch(this.buffer[i])
                {
                    case KeyState.PRESSED:
                    case KeyState.DOUBLE_PRESSED:
                        this.buffer[i] = KeyState.DOWN;
                        break

                    case KeyState.RELEASED:
                        this.buffer[i] = KeyState.UP;
                        break
                }
            }
            else
            {
                this.keyDelays[i] -= delta;
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

        if (this.buffer[e.which] === KeyState.UP)
        {
            this.buffer[e.which] = KeyState.PRESSED;
            this.keyDelays[e.which] = this.keyDelay;
        }
        else if (this.buffer[e.which] === KeyState.RELEASED)
        {
            this.buffer[e.which] = KeyState.DOUBLE_PRESSED;
            this.keyDelays[e.which] = this.keyDelay;
        }
    }

    private keyup(e: KeyboardEvent)
    {
        e.preventDefault();
        this.buffer[e.which] = KeyState.RELEASED;
    }
}