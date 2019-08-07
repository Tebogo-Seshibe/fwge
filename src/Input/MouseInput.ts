import { InputState } from './InputState'
import Vector2 from '../Maths/Vector2'

export default class MouseInput
{
    private readonly TOTAL_BUTTONS: number = 20
    public Buttons: InputState[] = new Array<InputState>()
    public Axes: Vector2 = new Vector2()
    public Delta: Vector2 = new Vector2()
    
    //#region Primary Buttons
    public get Left(): InputState
    {
        return this.Buttons[0]
    }
    
    public get Middle(): InputState
    {
        return this.Buttons[1]
    }
    
    public get Right(): InputState
    {
        return this.Buttons[2]
    }
    //#endregion

    //#region Thumb Buttons
    public get Thumb1(): InputState
    {
        return this.Buttons[3]
    }
    
    public get Thumb2(): InputState
    {
        return this.Buttons[4]
    }
    //#endregion

    constructor(element: HTMLCanvasElement)
    {
        for (var i = 0; i < this.TOTAL_BUTTONS; ++i)
        {
            this.Buttons.push(InputState.UP)
        }
        
        element.onclick = element.ondblclick
                        = element.oncontextmenu
                        = (e: MouseEvent): any => 

        element.onmouseup = (e: MouseEvent) =>
        {
            this.Buttons[e.button] = InputState.UP
        }

        element.onmousedown = (e: MouseEvent) =>
        {
            this.Buttons[e.button] = InputState.DOWN
        }

        element.onmousemove = (e: MouseEvent) =>
        {
            this.Delta.Set(e.clientX - this.Axes.X, e.clientY - this.Axes.Y)
            this.Axes.Set(e.clientX, e.clientY)
        }
    }
}