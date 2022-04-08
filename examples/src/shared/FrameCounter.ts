import { Scene, System } from "@fwge/core"

export class FrameCounter extends System
{
    Init(): void {
        
    }
    Start(): void {
        
    }
    Stop(): void {
        
    }
    constructor(scene: Scene, private _el: HTMLElement)
    {
        super(scene, { requiredComponents: [] })
    }

    override Update(delta: number): void
    {
        this._el.innerHTML = Math.round(1 / delta) + 'fps'
    }
}
