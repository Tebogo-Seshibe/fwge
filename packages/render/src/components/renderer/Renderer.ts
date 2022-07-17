import { SharedComponent } from "@fwge/core"

export interface IRenderer<T>
{
    asset: T
    renderMode?: RenderMode
}
export enum RenderMode
{
    FACE,
    EDGE,
    POINT
}

export class Renderer<T> extends SharedComponent
{
    constructor(public Asset: T, public RenderMode: RenderMode)
    {
        super(Renderer)
    }
}
