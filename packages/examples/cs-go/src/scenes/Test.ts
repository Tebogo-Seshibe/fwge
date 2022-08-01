import { Game, RenderSystem, Scene, ScriptSystem } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { Cube } from "../entities/Cube"
import { Eye } from "../entities/Eye"
import { FullScreen } from "../entities/FullScreen"
import { Platform } from "../entities/Platform"
import { ColliderRenderSystem } from "../systems/ColliderRenderSystem"

export class Test extends Scene
{
    constructor(game: Game)
    {
        super(game, {
            entities: [
                FullScreen,
                Eye,
                Cube,
                Platform
            ],            
            systems: [
                InputSystem,
                ScriptSystem,
                RenderSystem,
                ColliderRenderSystem,
            ]
        })
    }

    fpsCounter!: HTMLDivElement
    Init(): void
    {
        super.Init()
        this.fpsCounter = document.querySelector<HTMLDivElement>('#fpsCounter')!
    }

    Update(delta: number): void
    {
        super.Update(delta)
        
        const fps = Math.round(delta === 0 ? 0 : 1 / delta)
        this.fpsCounter.textContent = (fps < 10 ? '  ' + fps : fps < 100 ? ' ' + fps : fps) + 'fps'
    }
}
