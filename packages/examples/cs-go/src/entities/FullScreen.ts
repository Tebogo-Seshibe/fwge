import { ButtonState, Input, KeyState } from "@fwge/input"
import { GameObject } from "./GameObject"

export class FullScreen extends GameObject
{
    canvas!: HTMLCanvasElement
    fullscreen: boolean = false
    hideCursor: boolean = false
 
    OnCreate(): void
    {
        this.canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
        this.AddComponent(new Input(
        {
            onInput: ({ Keyboard, Mouse }) =>
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
        }))
    }

    Update(_: number): void {
        this.canvas.height = this.canvas.clientHeight
        this.canvas.width = this.canvas.clientWidth
    }
}