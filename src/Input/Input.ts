import IEngine from "../Engine/IEngine";
import ControllerInput from "./ControllerInput";
import KeyboardInput from "./KeyboardInput";
import MouseInput from "./MouseInput";

export default class Input implements IEngine
{
    public Keyboard: KeyboardInput = new KeyboardInput()
    public Mouse: MouseInput = new MouseInput()
    public Controllers: Map<number, ControllerInput> = new Map()
    
    public Init(canvas: HTMLCanvasElement, delta: number)
    {
        this.Keyboard.Init(canvas)
        this.Mouse.Init(canvas, delta)
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
