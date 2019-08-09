import { InputState } from './InputState'
import Vector2 from '../Maths/Vector2'

export default class MouseInput
{
    //#region Private Fields
    private readonly TOTAL_BUTTONS: number = 20
    private buttons: InputState[] = new Array<InputState>()
    private position: Vector2 = new Vector2()
    private delta: Vector2 = new Vector2()
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

    public Buttons(): InputState[]
    {
        return [...this.buttons]
    }
    //#endregion

    //#region Axes
    public Delta(): Vector2
    {
        return this.delta.Clone()
    }
    
    public Position(): Vector2
    {
        return this.position.Clone()
    }
    //#endregion

    constructor(element: HTMLCanvasElement)
    {
        for (var i = 0; i < this.TOTAL_BUTTONS; ++i)
        {
            this.buttons.push(InputState.UP)
        }
        
        element.onclick = element.ondblclick
                        = element.oncontextmenu
                        = (e: MouseEvent): any => 

        element.onmouseup = (e: MouseEvent) =>
        {
            this.buttons[e.button] = InputState.UP
        }

        element.onmousedown = (e: MouseEvent) =>
        {
            this.buttons[e.button] = InputState.DOWN
        }

        element.onmousemove = (e: MouseEvent) =>
        {
            this.delta.Set(e.movementX, e.movementY)
            this.position.Set(e.clientX, e.clientY)
        }
    }
}