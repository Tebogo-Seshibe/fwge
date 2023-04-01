import { ButtonState, WheelState } from "../InputState";

export class MouseInputHandler
{
    public static readonly TOTAL_KEYS = 12;
    private readonly dimensions: Uint8ClampedArray = new Uint8ClampedArray(4);
    

    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly mouse_movement: Float32Array = new Float32Array(MouseInputHandler.TOTAL_KEYS), 
        private readonly mouse_buttons: Uint8ClampedArray = new Uint8ClampedArray(MouseInputHandler.TOTAL_KEYS)
    ) { }

    Start(): void
    {
        this._resize();
        this.canvas.addEventListener('resize', this._resize.bind(this))
        this.canvas.addEventListener('click', this._click.bind(this))
        this.canvas.addEventListener('dblclick', this._dblclick.bind(this))
        this.canvas.addEventListener('mousedown', this._mousedown.bind(this))
        this.canvas.addEventListener('mouseup', this._mouseup.bind(this))
        this.canvas.addEventListener('mousemove', this._mousemove.bind(this))
        this.canvas.addEventListener('contextmenu', this._contextmenu.bind(this))
        this.canvas.addEventListener('wheel', this._wheel.bind(this))
    }

    Update(_: number): void { }

    Reset(): void
    {
        this.mouse_movement[0] = 0;
        this.mouse_movement[1] = 0;
        this.mouse_buttons[0] = 0;
    }
    
    Stop(): void
    {
        this.canvas.removeEventListener('resize', this._resize.bind(this))
        this.canvas.removeEventListener('click', this._click.bind(this))
        this.canvas.removeEventListener('dblclick', this._dblclick.bind(this))
        this.canvas.removeEventListener('mousedown', this._mousedown.bind(this))
        this.canvas.removeEventListener('mouseup', this._mouseup.bind(this))
        this.canvas.removeEventListener('mousemove', this._mousemove.bind(this))
        this.canvas.removeEventListener('contextmenu', this._contextmenu.bind(this))
        this.canvas.removeEventListener('wheel', this._wheel.bind(this))
        
        this.Reset();
    }

    private _resize()
    {
        const { top, left, width, height } = this.canvas.getBoundingClientRect();
        this.dimensions[0] = top;
        this.dimensions[1] = left;
        this.dimensions[2] = width;
        this.dimensions[3] = height;
    }

    private _click(e: MouseEvent): void
    {
        e.preventDefault()
        e.cancelBubble = true
    }
    
    private _dblclick(e: MouseEvent): void
    {
        e.preventDefault()
        e.cancelBubble = true
    }
    
    private _mousedown(e: MouseEvent): void
    {
        e.preventDefault()
        e.cancelBubble = true

        this.mouse_buttons[e.button + 1] = ButtonState.PRESSED
    }
    
    private _mouseup(e: MouseEvent): void
    {
        e.preventDefault()
        e.cancelBubble = true

        this.mouse_buttons[e.button + 1] = ButtonState.RAISED
    }
    
    private _mousemove(e: MouseEvent): void
    {
        e.preventDefault()
        e.cancelBubble = true
        

        
        this.mouse_movement[0] = e.movementX
        this.mouse_movement[1] = e.movementY
        this.mouse_movement[2] = e.clientX
        this.mouse_movement[3] = e.clientY
        this.mouse_movement[4] = e.clientX - this.dimensions[1] - (this.dimensions[2] / 2)
        this.mouse_movement[5] = -e.clientY + this.dimensions[0] + (this.dimensions[3] / 2)
        // console.log(this.mouse_movement)
    }
    
    private _contextmenu(e: MouseEvent): void
    {
        e.preventDefault()
        e.cancelBubble = true
    }
    
    private _wheel(e: WheelEvent): void
    {
        e.preventDefault()
        e.cancelBubble = true

        this.mouse_buttons[0] = e.deltaY > 0
            ? WheelState.DOWN
            : e.deltaY < 0 
                ? WheelState.UP
                : WheelState.CENTERED
    }
}
