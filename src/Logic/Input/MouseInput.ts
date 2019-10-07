import Vector2 from '../Maths/Vector2';
import { ButtonState, WheelState } from './InputState';

export default class MouseInput
{
    //#region Private Fields
    private readonly TOTAL_BUTTONS: number = 20
    private buttons: ButtonState[] = []
    private position: Vector2 = new Vector2()
    private delta: Vector2 = new Vector2()
    private offset: Vector2 = new Vector2()
    private wheel: WheelState = WheelState.CENTERED
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

    public get Thumb1(): ButtonState
    {
        return this.buttons[3]
    }
    
    public get Thumb2(): ButtonState
    {
        return this.buttons[4]
    }

    public get Buttons(): ButtonState[]
    {
        return [...this.buttons]
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

    constructor(element: HTMLCanvasElement)
    {
        this.offset.Set(element.clientWidth, element.clientHeight).Scale(0.5)

        for (var i = 0; i < this.TOTAL_BUTTONS; ++i)
        {
            this.buttons.push(ButtonState.RAISED)
        }
        
        element.onclick = element.ondblclick
                        = element.oncontextmenu
                        = undefined

        element.onmouseup = (e: MouseEvent) =>
        {
            this.buttons[e.button] = ButtonState.RAISED

            e.cancelBubble = true
        }
        
        element.onmousedown = (e: MouseEvent) =>
        {
            this.buttons[e.button] = ButtonState.PRESSED

            e.cancelBubble = true
        }
        
        element.onmousemove = (e: MouseEvent) =>
        {
            this.delta.Set(e.movementX, e.movementY)
            this.position.Set(e.clientX, e.clientY)
            
            e.cancelBubble = true
        }

        element.onwheel = (e: WheelEvent) =>
        {
            this.wheel = e.deltaY > 0
                ? WheelState.DOWN
                : e.deltaY < 0 
                    ? WheelState.UP
                    : WheelState.CENTERED

            e.cancelBubble = true
        }
    }

    Reset(): void
    {
        this.wheel = WheelState.CENTERED   
    }
}