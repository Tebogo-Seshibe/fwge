import { System } from "@fwge/core"

export class FrameCounter extends System
{
    Init(): void {
        
    }
    Start(): void {
        
    }
    Stop(): void {
        
    }
    constructor(private _el: HTMLElement)
    {
        super({ requiredComponents: [] })
    }

    override Update(delta: number): void
    {
        this._el.innerHTML = Math.round(1 / delta) + 'fps'
    }
}
