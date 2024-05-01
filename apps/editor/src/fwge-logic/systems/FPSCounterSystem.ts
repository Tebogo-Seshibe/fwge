import type { System } from "@fwge/ecs";

export class FPSCounterSystem implements System
{
    Start(): void { }
    Stop(): void { }

    fpsCounter!: HTMLDivElement

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
