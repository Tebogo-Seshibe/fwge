import { InputState } from './InputState'
import Vector2 from '../Maths/Vector2'

export default class MouseInput
{
    //#region Private Fields
    private readonly TOTAL_BUTTONS: number = 20
    private buttons: InputState[] = new Array<InputState>()
    private position: Vector2 = new Vector2()
    private delta: Vector2 = new Vector2()
    private offset: Vector2 = new Vector2()
    private wheel: number = 0
    //#endregion
    
    //#region Buttons
    public get Left(): InputState
    {
        return this.buttons[0]
    }
    
    public get Middle(): InputState
    {
        return this.buttons[1]
    }
    
    public get Right(): InputState
    {
        return this.buttons[2]
    }

    public get Thumb1(): InputState
    {
        return this.buttons[3]
    }
    
    public get Thumb2(): InputState
    {
        return this.buttons[4]
    }

    public get Buttons(): InputState[]
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
    //#endregion

    constructor(element: HTMLCanvasElement)
    {
        this.offset.Set(element.clientWidth, element.clientHeight).Scale(0.5)

        for (var i = 0; i < this.TOTAL_BUTTONS; ++i)
        {
            this.buttons.push(InputState.UP)
        }
        
        element.onclick = element.ondblclick
                        = element.oncontextmenu
                        = (e: MouseEvent): any => e

        element.onmouseup = (e: MouseEvent) =>
        {
            this.buttons[e.button] = InputState.UP
            e.cancelBubble = true
        }
        
        element.onmousedown = (e: MouseEvent) =>
        {
            this.buttons[e.button] = InputState.DOWN
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
            this.wheel = e.detail > 0
                ? 1
                : e.detail < 0 
                    ? -1
                    : 0

            e.cancelBubble = true
        }
    }
}