import { Vector2 } from "@fwge/common"
import { ButtonState, WheelState } from "../InputState"
import { MouseState } from "./MouseState"

export class MouseInputHandler
{
    static readonly #MouseDeltaX: number = 0
    static readonly #MouseDeltaY: number = 1
    static readonly #MouseRawX: number = 2
    static readonly #MouseRawY: number = 3
    static readonly #Wheel: number = 4
    static readonly #Buttons: number = 5
    
    #canvas: HTMLCanvasElement
    #state: number[] = []
    #delta: number = 0
    #isMoving?: any
    
    get State(): MouseState
    {
        return new MouseState(
            new Vector2(
                this.#state[MouseInputHandler.#MouseDeltaX],
                this.#state[MouseInputHandler.#MouseDeltaY]
            ),
            new Vector2(
                this.#state[MouseInputHandler.#MouseRawX],
                this.#state[MouseInputHandler.#MouseRawY]
            ),
            this.#state[MouseInputHandler.#Wheel],
            this.#state.slice(MouseInputHandler.#Buttons)
        ) 
    }

    constructor(canvas: HTMLCanvasElement)
    {
        this.#state[MouseInputHandler.#MouseDeltaX] = 0
        this.#state[MouseInputHandler.#MouseDeltaY] = 0
        this.#state[MouseInputHandler.#MouseRawX] = 0
        this.#state[MouseInputHandler.#MouseRawY] = 0
        this.#canvas = canvas
    }

    Start(): void
    {
        this.#canvas.addEventListener('click', this.#click.bind(this))
        this.#canvas.addEventListener('dblclick', this.#dblclick.bind(this))
        this.#canvas.addEventListener('mousedown', this.#mousedown.bind(this))
        this.#canvas.addEventListener('mouseup', this.#mouseup.bind(this))
        this.#canvas.addEventListener('mousemove', this.#mousemove.bind(this))
        this.#canvas.addEventListener('contextmenu', this.#contextmenu.bind(this))
        this.#canvas.addEventListener('wheel', this.#wheel.bind(this))
    }

    Update(delta: number): void
    {
        this.#delta = delta
    }

    Stop(): void
    {
        this.#canvas.removeEventListener('click', this.#click.bind(this))
        this.#canvas.removeEventListener('dblclick', this.#dblclick.bind(this))
        this.#canvas.removeEventListener('mousedown', this.#mousedown.bind(this))
        this.#canvas.removeEventListener('mouseup', this.#mouseup.bind(this))
        this.#canvas.removeEventListener('mousemove', this.#mousemove.bind(this))
        this.#canvas.removeEventListener('contextmenu', this.#contextmenu.bind(this))
        this.#canvas.removeEventListener('wheel', this.#wheel.bind(this))

        this.#state[MouseInputHandler.#Wheel] = WheelState.CENTERED
    }

    #click(e: MouseEvent): void
    {
        e.preventDefault()
    }
    
    #dblclick(e: MouseEvent): void
    {
        e.preventDefault()
    }
    
    #mousedown(e: MouseEvent): void
    {
        e.preventDefault()

        this.#state[e.button + MouseInputHandler.#Buttons] = ButtonState.PRESSED
    }
    
    #mouseup(e: MouseEvent): void
    {
        e.preventDefault()

        this.#state[e.button + MouseInputHandler.#Buttons] = ButtonState.RAISED
    }
    
    #mousemove(e: MouseEvent): void
    {
        e.preventDefault()

        if (this.#isMoving)
        {
            clearTimeout(this.#isMoving)
        }
        this.#isMoving = setTimeout(() => this.#reset(), this.#delta)
        
        this.#state[MouseInputHandler.#MouseDeltaX] = e.movementX
        this.#state[MouseInputHandler.#MouseDeltaY] = e.movementY
        this.#state[MouseInputHandler.#MouseRawX] = e.clientX
        this.#state[MouseInputHandler.#MouseRawY] = e.clientY
    }
    
    #contextmenu(e: MouseEvent): void
    {
        e.preventDefault()
    }
    
    #wheel(e: WheelEvent): void
    {
        e.preventDefault()

        if (this.#isMoving)
        {
            clearTimeout(this.#isMoving)
        }
        this.#isMoving = setTimeout(() => this.#reset(), this.#delta)

        this.#state[MouseInputHandler.#Wheel] = e.deltaY > 0
            ? WheelState.DOWN
            : e.deltaY < 0 
                ? WheelState.UP
                : WheelState.CENTERED
    }

    
    #reset(): void
    {
        this.#state[MouseInputHandler.#Wheel] = WheelState.CENTERED
        this.#state[MouseInputHandler.#MouseDeltaX] = 0
        this.#state[MouseInputHandler.#MouseDeltaY] = 0
    }
}
