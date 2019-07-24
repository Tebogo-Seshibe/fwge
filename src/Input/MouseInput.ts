import { InputState } from './InputState'
import Vector2 from '../Maths/Vector2'

export default class MouseInput
{
    public Buttons: InputState[] = new Array<InputState>(20)
    public Axes: Vector2 = new Vector2()
    public Delta: Vector2 = new Vector2()
    
    public SetElement(element: HTMLElement): void
    {
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