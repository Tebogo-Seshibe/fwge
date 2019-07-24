import KeyboardInput from "./KeyboardInput"
import MouseInput from "./MouseInput"
import ControllerInput from "./ControllerInput"
import List from "../Utility/List"

export default class Input
{
    public static Keyboard: KeyboardInput
    public static Mouse: MouseInput
    public static Controllers: List<ControllerInput> = new List<ControllerInput>()

    public static Init(canvas: HTMLCanvasElement)
    {
        Input.Keyboard = new KeyboardInput(canvas)
        Input.Mouse = new MouseInput(canvas)
    }

    public static Update(): void
    {
        
    }
}