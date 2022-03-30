import { Scene, System } from "@fwge/core"

export class FrameCounter extends System
{
    constructor(scene: Scene, private _el: HTMLElement)
    {
        super(scene)
    }

    override Update(delta: number): void
    {
        this._el.innerHTML = Math.round(1 / delta) + 'fps'
    }
}
