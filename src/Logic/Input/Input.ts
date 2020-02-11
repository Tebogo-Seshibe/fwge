import IEngine from "../../IEngine";
import ControllerInput from "./ControllerInput";
import KeyboardInput from "./KeyboardInput";
import MouseInput from "./MouseInput";

export default class Input implements IEngine
{
    public Keyboard: KeyboardInput
    public Mouse: MouseInput
    public Controllers: Map<number, ControllerInput>
    
    public Init(canvas: HTMLCanvasElement)
    {
        this.Keyboard = new KeyboardInput()
        this.Mouse = new MouseInput(canvas)
        this.Controllers = new Map<number, ControllerInput>()

        // window.gamepadconnected", (event: GamepadEvent) =>
        // {
        //     this.Controllers.set(event., new ControllerInput(canvas))

        //     return
        // }
    }

    public Update():void
    {
        // UPDATE
    }

    public Reset(): void
    {
        this.Mouse.Reset()
    }
}
