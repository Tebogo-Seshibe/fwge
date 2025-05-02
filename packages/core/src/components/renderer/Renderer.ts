import { Component } from "@fwge/ecs";
import { Mesh } from "../mesh";
import { Transform } from "../Transform";

export interface IRenderer<T>
{
    asset: T
    renderMode?: RenderMode
    instances?: readonly Transform[]
}

export enum RenderMode
{
    FACE,
    EDGE,
    POINT
}

export class Renderer<T extends Mesh> extends Component
{
    constructor(public Asset: T, public RenderMode: RenderMode, instances?: readonly Transform[])
    {
        super(Renderer)
    }
}
