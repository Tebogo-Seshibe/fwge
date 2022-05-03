import { Vector2 } from "@fwge/common"
import { ButtonState, WheelState } from "../InputState"
import { MouseState } from "./MouseState"

export class MouseInputHandler
{
    static readonly MouseDeltaX: number = 0
    static readonly MouseDeltaY: number = 1
    static readonly MouseRawX: number = 2
    static readonly MouseRawY: number = 3
    static readonly Wheel: number = 4
    static readonly Buttons: number = 5
    
    private _canvas: HTMLCanvasElement
    private _values: number[] = []
    private _delta: number = 0
    private _isMoving?: any
    
    get State(): MouseState
    {
        const { top, left, width, height } = this._canvas.getBoundingClientRect()

        return new MouseState(
            new Vector2(
                this._values[MouseInputHandler.MouseDeltaX],
                this._values[MouseInputHandler.MouseDeltaY]
            ),
            new Vector2(
                this._values[MouseInputHandler.MouseRawX],
                this._values[MouseInputHandler.MouseRawY]
            ),
            new Vector2(
                this._values[MouseInputHandler.MouseRawX] - left - (width / 2),
                -this._values[MouseInputHandler.MouseRawY] + top + (height / 2)
            ),
            this._values[MouseInputHandler.Wheel],
            this._values.slice(MouseInputHandler.Buttons)
        ) 
    }

    constructor(canvas: HTMLCanvasElement)
    {
        this._values[MouseInputHandler.MouseDeltaX] = 0
        this._values[MouseInputHandler.MouseDeltaY] = 0
        this._values[MouseInputHandler.MouseRawX] = 0
        this._values[MouseInputHandler.MouseRawY] = 0
        this._canvas = canvas
    }

    Start(): void
    {
        this._canvas.addEventListener('click', this._click.bind(this))
        this._canvas.addEventListener('dblclick', this._dblclick.bind(this))
        this._canvas.addEventListener('mousedown', this._mousedown.bind(this))
        this._canvas.addEventListener('mouseup', this._mouseup.bind(this))
        this._canvas.addEventListener('mousemove', this._mousemove.bind(this))
        this._canvas.addEventListener('contextmenu', this._contextmenu.bind(this))
        this._canvas.addEventListener('wheel', this._wheel.bind(this))
    }

    Update(delta: number): void
    {
        this._delta = delta
    }

    Stop(): void
    {
        this._canvas.removeEventListener('click', this._click.bind(this))
        this._canvas.removeEventListener('dblclick', this._dblclick.bind(this))
        this._canvas.removeEventListener('mousedown', this._mousedown.bind(this))
        this._canvas.removeEventListener('mouseup', this._mouseup.bind(this))
        this._canvas.removeEventListener('mousemove', this._mousemove.bind(this))
        this._canvas.removeEventListener('contextmenu', this._contextmenu.bind(this))
        this._canvas.removeEventListener('wheel', this._wheel.bind(this))

        this._values[MouseInputHandler.Wheel] = WheelState.CENTERED
    }

    private _click(e: MouseEvent): void
    {
        e.preventDefault()
    }
    
    private _dblclick(e: MouseEvent): void
    {
        e.preventDefault()
    }
    
    private _mousedown(e: MouseEvent): void
    {
        e.preventDefault()

        this._values[e.button + MouseInputHandler.Buttons] = ButtonState.PRESSED
    }
    
    private _mouseup(e: MouseEvent): void
    {
        e.preventDefault()

        this._values[e.button + MouseInputHandler.Buttons] = ButtonState.RAISED
    }
    
    private _mousemove(e: MouseEvent): void
    {
        e.preventDefault()

        if (this._isMoving)
        {
            clearTimeout(this._isMoving)
        }
        this._isMoving = setTimeout(() => this._reset(), this._delta)
        
        this._values[MouseInputHandler.MouseDeltaX] = e.movementX
        this._values[MouseInputHandler.MouseDeltaY] = e.movementY
        this._values[MouseInputHandler.MouseRawX] = e.clientX
        this._values[MouseInputHandler.MouseRawY] = e.clientY
    }
    
    private _contextmenu(e: MouseEvent): void
    {
        e.preventDefault()
    }
    
    private _wheel(e: WheelEvent): void
    {
        e.preventDefault()

        if (this._isMoving)
        {
            clearTimeout(this._isMoving)
        }
        this._isMoving = setTimeout(() => this._reset(), this._delta)

        this._values[MouseInputHandler.Wheel] = e.deltaY > 0
            ? WheelState.DOWN
            : e.deltaY < 0 
                ? WheelState.UP
                : WheelState.CENTERED
    }

    
    private _reset(): void
    {
        this._values[MouseInputHandler.Wheel] = WheelState.CENTERED
        this._values[MouseInputHandler.MouseDeltaX] = 0
        this._values[MouseInputHandler.MouseDeltaY] = 0
    }
}
