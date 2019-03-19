import { InputState } from './InputState'
import Vector2 from '../Maths/Vector2'

export default class MouseInput
{
    public static Buttons: Array<InputState> = new Array(20)
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
            if (MouseInput.Buttons[e.button] === InputState.CLICKED)
            {
                MouseInput.Buttons[e.button] = InputState.DOWN
            }
            else
            {
                MouseInput.Buttons[e.button] = InputState.CLICKED
            }
        }

        element.onmousemove = (e: MouseEvent) =>
        {
            MouseInput.Axes.Set(e.clientX, e.clientY)
            MouseInput.Delta.Set(e.movementX, e.movementY)
        }
    }
}