import { ButtonState, WheelState } from ".."
import { Vector2 } from "@fwge/common"

export class Mouseasa
{
    //#region Private Fields
    private readonly TOTAL_BUTTONS: number = 20
    public buttons: ButtonState[] = []
    public position: Vector2 = new Vector2()
    public delta: Vector2 = new Vector2()
    public offset: Vector2 = new Vector2()
    public wheel: WheelState = WheelState.CENTERED
    public isMoving?: any
    //#endregion
    
    //#region Buttons
    public get Left(): ButtonState
    {
        return this.buttons[0]
    }
    
    public get Middle(): ButtonState
    {
        return this.buttons[1]
    }
    
    public get Right(): ButtonState
    {
        return this.buttons[2]
    }

    public get Buttons(): ButtonState[]
    {
        return this.buttons.slice(3)
    }
    //#endregion

    //#region Axes
    public get Delta(): Vector2
    {
        return this.delta.Clone()
    }
    
    public get Position(): Vector2
    {
        return this.position.Clone().Diff(this.offset).Mult(1, -1)
    }

    public get RawPosition(): Vector2
    {
        return this.position.Clone()
    }

    public get Wheel(): WheelState
    {
        return this.wheel
    }
    //#endregion

    constructor(element: HTMLCanvasElement, delta: number)
    {
        this.offset.Set(element.clientWidth, element.clientHeight).Scale(0.5)
        element.onresize = (_: UIEvent) => this.offset.Set(element.clientWidth, element.clientHeight).Scale(0.5)

        for (var i = 0; i < this.TOTAL_BUTTONS; ++i)
        {
            this.buttons.push(ButtonState.RAISED)
        }
        
        element.onclick = element.ondblclick
                        = element.oncontextmenu
                        = e => e.preventDefault()
                        
        element.onmouseup = (e: MouseEvent) =>
        {
            e.preventDefault()
            this.buttons[e.button] = ButtonState.RAISED

            e.cancelBubble = true
        }
        
        element.onmousedown = (e: MouseEvent) =>
        {
            e.preventDefault()
            this.buttons[e.button] = ButtonState.PRESSED

            e.cancelBubble = true
        }
        
        element.onmousemove = (e: MouseEvent) =>
        {
            e.preventDefault()
            if (this.isMoving)
            {
                clearTimeout(this.isMoving)
            }
            this.isMoving = setTimeout(() => this.Reset(), delta)
            
            this.delta.Set(e.movementX, e.movementY)
            this.position.Set(e.clientX, e.clientY)
            
            e.cancelBubble = true
        }

        element.onwheel = (e: WheelEvent) =>
        {
            e.preventDefault()
            if (this.isMoving)
            {
                clearTimeout(this.isMoving)
            }
            this.isMoving = setTimeout(() => this.Reset(), delta)

            this.wheel = e.deltaY > 0
                ? WheelState.DOWN
                : e.deltaY < 0 
                    ? WheelState.UP
                    : WheelState.CENTERED

            e.cancelBubble = true
        }
    }

    Update(): void
    {
        if (!this.isMoving)
        {
            this.Delta.Set(0, 0)
        }
    }

    Reset(): void
    {
        this.wheel = WheelState.CENTERED
        this.delta.Set(0, 0)
    }
}
