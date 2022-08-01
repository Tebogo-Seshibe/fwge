import { SharedComponent } from "../../ecs"
import { Mesh } from "../mesh"

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

export class Renderer<T extends Mesh> extends SharedComponent
{
    constructor(public Asset: T, public RenderMode: RenderMode)
    {
        super(Renderer)
    }
}
