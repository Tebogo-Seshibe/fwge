import { Vector2 } from "@fwge/common";
import { ButtonState, WheelState } from "../InputState";
import { MouseState } from "./MouseState";


export class MouseInputHandler
{
    public static readonly TOTAL_KEYS = 12;
    private readonly dimensions: Uint8ClampedArray = new Uint8ClampedArray(4);
    private readonly offset: Vector2 = new Vector2();
    
    public readonly State: MouseState
    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly mouseMovement: Float32Array, 
        private readonly mouseButtons: Uint8ClampedArray
    ) {
        this.State = new MouseState(mouseMovement, mouseButtons);
    }

    Start(): void
    {
        this.canvas.addEventListener('resize', this._resize.bind(this));
        this.canvas.addEventListener('click', this._click.bind(this));
        this.canvas.addEventListener('dblclick', this._dblclick.bind(this));
        this.canvas.addEventListener('mousedown', this._mousedown.bind(this));
        this.canvas.addEventListener('mouseup', this._mouseup.bind(this));
        this.canvas.addEventListener('mousemove', this._mousemove.bind(this));
        this.canvas.addEventListener('contextmenu', this._contextmenu.bind(this));
        this.canvas.addEventListener('wheel', this._wheel.bind(this));
        this._resize();
    }

    Update(_?: number): void { }

    Reset(): void
    {
        this.mouseMovement[0] = 0;
        this.mouseMovement[1] = 0;
        this.mouseButtons[0] = 0;
    }
    
    Stop(): void
    {
        this.canvas.removeEventListener('resize', this._resize.bind(this));
        this.canvas.removeEventListener('click', this._click.bind(this));
        this.canvas.removeEventListener('dblclick', this._dblclick.bind(this));
        this.canvas.removeEventListener('mousedown', this._mousedown.bind(this));
        this.canvas.removeEventListener('mouseup', this._mouseup.bind(this));
        this.canvas.removeEventListener('mousemove', this._mousemove.bind(this));
        this.canvas.removeEventListener('contextmenu', this._contextmenu.bind(this));
        this.canvas.removeEventListener('wheel', this._wheel.bind(this));
        
        this.Reset();
    }

    private _resize()
    {
        const { top, left, width, height } = this.canvas.getBoundingClientRect();
        this.dimensions[0] = top;
        this.dimensions[1] = left;
        this.dimensions[2] = width;
        this.dimensions[3] = height;
        this.offset.Set(left + (width / 2), top + (height / 2))
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

        this.mouseButtons[e.button + 1] = ButtonState.PRESSED
    }
    
    private _mouseup(e: MouseEvent): void
    {
        e.preventDefault()

        this.mouseButtons[e.button + 1] = ButtonState.RAISED
    }
    
    private _mousemove(e: MouseEvent): void
    {
        e.preventDefault()
        
        this.mouseMovement[0] = e.movementX
        this.mouseMovement[1] = e.movementY
        this.mouseMovement[2] = e.clientX
        this.mouseMovement[3] = e.clientY
        this.mouseMovement[4] = e.clientX - this.dimensions[1] - (this.dimensions[2] / 2)
        this.mouseMovement[5] = -e.clientY + this.dimensions[0] + (this.dimensions[3] / 2)
        // this.mouseMovement[4] = e.clientX - this.offset.X
        // this.mouseMovement[5] = -e.clientY + this.offset.Y
    }
    
    private _contextmenu(e: MouseEvent): void
    {
        e.preventDefault()
    }
    
    private _wheel(e: WheelEvent): void
    {
        e.preventDefault()

        this.mouseButtons[0] = e.deltaY > 0
            ? WheelState.DOWN
            : e.deltaY < 0 
                ? WheelState.UP
                : WheelState.CENTERED
    }
}
