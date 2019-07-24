import KeyboardInput from "./KeyboardInput"
import MouseInput from "./MouseInput"
import ControllerInput from "./ControllerInput"
import List from "../Utility/List"

export default class Input
{
    public static Keyboard: KeyboardInput = new KeyboardInput
    public static Mouse: MouseInput = new MouseInput
    public static Controllers: List<ControllerInput> = new List<ControllerInput>()

    public static Update(): void
    {

    }
}