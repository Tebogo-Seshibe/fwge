import { Scene, System } from "@fwge/core"

export class FPSCounterSystem extends System
{
    fpsCounter!: HTMLDivElement

    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [] })
    }

    Init(): void
    {
        this.fpsCounter = document.querySelector<HTMLDivElement>('#fpsCounter')!
    }

    Update(delta: number): void
    {        
        const fps = Math.round(delta === 0 ? 0 : 1 / delta)
        this.fpsCounter.textContent = fps.toString()
    }
}
