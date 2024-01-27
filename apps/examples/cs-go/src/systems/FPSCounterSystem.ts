import { System } from "@fwge/ecs";

export class FPSCounterSystem extends System
{
    fpsCounter!: HTMLDivElement
    
    Start(): void {}
    Stop(): void {}

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
