import { SharedComponent } from "@fwge/core"

export enum RenderMode
{
    FACE,
    EDGE,
    POINT
}

export class Renderer<T = {}> extends SharedComponent
{
    public Asset: T | undefined
    public RenderMode: RenderMode = RenderMode.FACE

    constructor()
    {
        super(Renderer)
    }
}
