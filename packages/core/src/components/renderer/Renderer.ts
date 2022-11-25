import { SharedComponent } from "../../ecs"
import { Mesh } from "../mesh"
import { Transform } from "../Transform";

export interface IRenderer<T>
{
    asset: T
    renderMode?: RenderMode
    instances?: Transform[]
}

export enum RenderMode
{
    FACE,
    EDGE,
    POINT
}

export class Renderer<T extends Mesh> extends SharedComponent
{
    constructor(public Asset: T, public RenderMode: RenderMode, instances?: Transform[])
    {
        super(Renderer)
    }
}
