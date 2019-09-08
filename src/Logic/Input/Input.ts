import List from "../Utility/List";
import ControllerInput from "./ControllerInput";
import KeyboardInput from "./KeyboardInput";
import MouseInput from "./MouseInput";

export default class Input
{
    public static Keyboard: KeyboardInput
    public static Mouse: MouseInput
    public static Controllers: List<ControllerInput> = new List<ControllerInput>()

    public static Init(canvas: HTMLCanvasElement)
    {
        Input.Keyboard = new KeyboardInput()
        Input.Mouse = new MouseInput(canvas)
    }
}