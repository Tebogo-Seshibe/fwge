import { FixedLengthArray, GL } from "@fwge/common";
import { ButtonState, ControllerState, KeyState, KeyboardState, MouseState } from "@fwge/input";
import { GameObject } from "./GameObject";

export class FullScreen extends GameObject
{
    canvas!: HTMLCanvasElement
    fullscreen: boolean = false
    hideCursor: boolean = false
 
    override OnCreate(): void
    {
        super.OnCreate()

        this.canvas = GL.canvas as HTMLCanvasElement;

        document.onfullscreenchange = e =>
        {
            e.preventDefault()
            this.fullscreen = !this.fullscreen
        }

        document.onpointerlockchange = e =>
        {
            e.preventDefault()
            this.hideCursor = !this.hideCursor
        }
    }

    override OnUpdate(): void
    {
        if (this.canvas.height !== this.canvas.clientHeight)
        {
            this.canvas.height = this.canvas.clientHeight;
        }

        if (this.canvas.width !== this.canvas.clientWidth)
        {
            this.canvas.width = this.canvas.clientWidth;
        }
    }

    OnInput(_delta: number, Keyboard: Readonly<KeyboardState>, Mouse: Readonly<MouseState>, _Controllers: Readonly<FixedLengthArray<ControllerState, 4>>)
    {
        if (!this.fullscreen && Keyboard.KeyF11 === KeyState.PRESSED)
        {
            this.canvas.requestFullscreen()
        }

        if (!this.hideCursor && Mouse.Left === ButtonState.PRESSED)
        {
            this.canvas.requestPointerLock()
        }

        if (this.fullscreen && Keyboard.KeyT === KeyState.PRESSED)
        {
            document.exitFullscreen()
        }

        if (this.hideCursor && Mouse.Right === ButtonState.PRESSED)
        {
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
