import { SharedComponent } from "@fwge/core"
import { Mesh } from "../mesh"

export interface IRenderer
{
    asset: Mesh
    renderMode?: RenderMode
}
export enum RenderMode
{
    FACE,
    EDGE,
    POINT
}

export class Renderer extends SharedComponent
{
    constructor(public Asset: Mesh, public RenderMode: RenderMode)
    {
        super(Renderer)
    }
}
