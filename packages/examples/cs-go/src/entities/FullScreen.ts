import { GL } from "@fwge/common"
import { ButtonState, IInputArgs, KeyState } from "@fwge/input"
import { DirectionalLight } from "@fwge/render"
import { Light } from "@fwge/render/lib/components/lights/Light"
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
        this.light = new DirectionalLight({
            colour: [1,1,1,1],
            direction: [1,0.75,1],
            intensity: 0.5
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

        if (Keyboard.KeyEsc === KeyState.DOWN)
        {
            if (document.fullscreenEnabled)
            {
                
                document.exitFullscreen()
                this.fullscreen = false
            }

            if (this.hideCursor)
            {
                document.exitPointerLock()
                this.hideCursor = false
            }
        }

        if (Keyboard.KeyF5 === KeyState.PRESSED)
        {
            window.location.reload()
        }
    }
    
}
