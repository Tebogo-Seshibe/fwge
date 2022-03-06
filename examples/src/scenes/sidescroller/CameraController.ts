import { Entity, Scene, Script } from "@fwge/core"
import { IInputArgs, Input, KeyState } from "@fwge/input"
import { Camera, ViewMode } from "@fwge/render"

export class CameraController extends Entity
{
    private camera: Camera

    constructor(scene: Scene)
    {
        super(scene)

        const _this: CameraController = this

        this.AddComponent(new Script(
        {
            start()
            {                
                Camera.Main = this.GetComponent(Camera)
            }
        }))
        this.camera = this.AddComponent(new Camera(
        {
            left: -(1920 / 2) / 100,
            right: (1920 / 2) / 100,
            top: (1080 / 2) / 100,
            bottom: -(1080 / 2) / 100,
        })).GetComponent(Camera)!

        this.AddComponent(new Input(
        {
            onInput({ Keyboard }: IInputArgs, delta: number)
            {
                _this.camera.HorizontalTilt += (Keyboard.KeyRight == KeyState.UP ? 0 : 0.01) * delta
                _this.camera.HorizontalTilt -= (Keyboard.KeyLeft == KeyState.UP ? 0 : 0.01) * delta
                _this.camera.VerticalTilt += (Keyboard.KeyUp == KeyState.UP ? 0 : 0.01) * delta
                _this.camera.VerticalTilt -= (Keyboard.KeyDown == KeyState.UP ? 0 : 0.01) * delta
            } 
        }))

        this.camera.Mode = ViewMode.ORTHOGRAPHIC
    }
}
