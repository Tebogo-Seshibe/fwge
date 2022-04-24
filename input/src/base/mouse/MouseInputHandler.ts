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
    private _state: number[] = []
    private _delta: number = 0
    private _isMoving?: any
    
    get State(): MouseState
    {
        const { top, left, width, height } = this._canvas.getBoundingClientRect()

        return new MouseState(
            new Vector2(
                this._state[MouseInputHandler.MouseDeltaX],
                this._state[MouseInputHandler.MouseDeltaY]
            ),
            new Vector2(
                this._state[MouseInputHandler.MouseRawX],
                this._state[MouseInputHandler.MouseRawY]
            ),
            new Vector2(
                this._state[MouseInputHandler.MouseRawX] - left - (width / 2),
                -this._state[MouseInputHandler.MouseRawY] + top + (height / 2)
            ),
            this._state[MouseInputHandler.Wheel],
            this._state.slice(MouseInputHandler.Buttons)
        ) 
    }

    constructor(canvas: HTMLCanvasElement)
    {
        this._state[MouseInputHandler.MouseDeltaX] = 0
        this._state[MouseInputHandler.MouseDeltaY] = 0
        this._state[MouseInputHandler.MouseRawX] = 0
        this._state[MouseInputHandler.MouseRawY] = 0
        this._canvas = canvas
    }

    Start(): void
    {
        this._canvas.onclick = this._click.bind(this)
        this._canvas.ondblclick = this._dblclick.bind(this)
        this._canvas.onmousedown = this._mousedown.bind(this)
        this._canvas.onmouseup = this._mouseup.bind(this)
        this._canvas.onmousemove = this._mousemove.bind(this)
        this._canvas.oncontextmenu = this._contextmenu.bind(this)
        this._canvas.onwheel = this._wheel.bind(this)
    }

    Update(delta: number): void
    {
        this._delta = delta
    }

    Stop(): void
    {
        this._canvas.onclick = null
        this._canvas.ondblclick = null
        this._canvas.onmousedown = null
        this._canvas.onmouseup = null
        this._canvas.onmousemove = null
        this._canvas.oncontextmenu = null
        this._canvas.onwheel = null

        this._state[MouseInputHandler.Wheel] = WheelState.CENTERED
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

        this._state[e.button + MouseInputHandler.Buttons] = ButtonState.PRESSED
    }
    
    private _mouseup(e: MouseEvent): void
    {
        e.preventDefault()

        this._state[e.button + MouseInputHandler.Buttons] = ButtonState.RAISED
    }
    
    private _mousemove(e: MouseEvent): void
    {
        e.preventDefault()

        if (this._isMoving)
        {
            clearTimeout(this._isMoving)
        }
        this._isMoving = setTimeout(() => this._reset(), this._delta)
        
        this._state[MouseInputHandler.MouseDeltaX] = e.movementX
        this._state[MouseInputHandler.MouseDeltaY] = e.movementY
        this._state[MouseInputHandler.MouseRawX] = e.clientX
        this._state[MouseInputHandler.MouseRawY] = e.clientY
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

        this._state[MouseInputHandler.Wheel] = e.deltaY > 0
            ? WheelState.DOWN
            : e.deltaY < 0 
                ? WheelState.UP
                : WheelState.CENTERED
    }

    
    private _reset(): void
    {
        this._state[MouseInputHandler.Wheel] = WheelState.CENTERED
        this._state[MouseInputHandler.MouseDeltaX] = 0
        this._state[MouseInputHandler.MouseDeltaY] = 0
    }
}
