import { Mesh } from "../mesh";
import { IRenderer, Renderer, RenderMode } from "./Renderer"

export class MeshRenderer extends Renderer<Mesh>
{
    constructor(renderer: IRenderer<Mesh>)
    {
        super(renderer.asset, renderer.renderMode ?? RenderMode.FACE)
    }
}
