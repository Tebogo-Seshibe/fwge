import { AnimationSystem } from "@fwge/animation"
import { FWGEScene, Scene, ScriptSystem } from "@fwge/core"
import { InputSystem } from "@fwge/input"
import { PhysicsSystem } from "@fwge/physics"
import { MeshRenderSystem } from "@fwge/render"
import { FPSController } from "../entities"
import { Cube } from "../entities/Cube"
import { FullScreen } from "../entities/FullScreen"

@FWGEScene(
{
    entities:[
        FullScreen,
        FPSController,
        Cube
    ],
    systems: [
        InputSystem,
        ScriptSystem,
        PhysicsSystem,
        MeshRenderSystem,
        AnimationSystem,
    ]
})
export class Round extends Scene
{
    fpsCounter!: HTMLDivElement
    Init(): void
    {
        super.Init()
        console.log(this)
        this.fpsCounter = document.querySelector<HTMLDivElement>('#fpsCounter')!
    }

    Update(delta: number): void
    {
        super.Update(delta)
        
        const fps = Math.round(delta === 0 ? 0 : 1 / delta)
        this.fpsCounter.innerHTML = (fps < 10 ? '  ' + fps : fps < 100 ? ' ' + fps : fps ) + 'fps'
    }
}
