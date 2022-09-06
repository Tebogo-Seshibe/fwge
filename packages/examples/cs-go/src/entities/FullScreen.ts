import { GL } from "@fwge/common"
import { ButtonState, IInputArgs, KeyState } from "@fwge/input"
import { DirectionalLight, Light } from "@fwge/core"
import { GameObject } from "./GameObject"

export class FullScreen extends GameObject
{
    canvas!: HTMLCanvasElement
    fullscreen: boolean = false
    hideCursor: boolean = false
    light!: Light
 
    override OnCreate(): void
    {
        super.OnCreate()
        this.light = new DirectionalLight(
        {
            direction: [0, -1, 0],
            intensity: 2
        })

        this.canvas = GL.canvas
        this.AddComponent(this.light)
    }

    override OnUpdate(): void
    {
        this.canvas.height = this.canvas.clientHeight
        this.canvas.width = this.canvas.clientWidth
    }

    override OnInput({ Keyboard, Mouse }: IInputArgs): void
    {
        if (!this.fullscreen && Keyboard.KeyF === KeyState.PRESSED)
        {
            this.fullscreen = true                    
            this.canvas.requestFullscreen()
        }

        if (!this.hideCursor && Mouse.Left === ButtonState.PRESSED)
        {
            this.hideCursor = true                    
            this.canvas.requestPointerLock()
        }

        if (this.fullscreen && Keyboard.KeyT === KeyState.PRESSED)
        {
            this.fullscreen = false
            document.exitFullscreen()
        }

        if (this.hideCursor && Mouse.Right === ButtonState.PRESSED)
        {
            this.hideCursor = false
            document.exitPointerLock()
        }

        if (Keyboard.KeyF5 === KeyState.PRESSED)
        {
            window.location.reload()
        }

        for (let sceneId = 0; sceneId <= 9; ++sceneId)
        {
            const keyName = `Key${sceneId}`
            if ((Keyboard as any)[keyName] === KeyState.PRESSED)
            {
                console.log(`Changing to scene ${sceneId}`)
                // this.Scene.Game.SetScene(sceneId)
            }
        }
    }
    
}
