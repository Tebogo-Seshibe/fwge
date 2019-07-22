import { InputState } from './InputState'
import Vector2 from '../Maths/Vector2'

export default class MouseInput
{
    public static Buttons: InputState[] = new Array(20)
    public static Axes: Vector2 = new Vector2()
    public static Delta: Vector2 = new Vector2()
    
    public static SetElement(element: HTMLElement): void
    {
        element.onmouseup = (e: MouseEvent) =>
        {
            MouseInput.Buttons[e.button] = InputState.UP
        }

        element.onmousedown = (e: MouseEvent) =>
        {
            MouseInput.Buttons[e.button] = InputState.DOWN
        }

        element.onmousemove = (e: MouseEvent) =>
        {
            MouseInput.Delta.Set(e.clientX - MouseInput.Axes.X, e.clientY - MouseInput.Axes.Y)
            MouseInput.Axes.Set(e.clientX, e.clientY)
        }
    }
}