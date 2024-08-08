import { Game } from "../../base";
import { Mesh } from "../mesh";
import { IRenderer, Renderer, RenderMode } from "./Renderer"

export class MeshRenderer extends Renderer<Mesh>
{
    constructor(game: Game, renderer: IRenderer<Mesh>)
    {
        super(game, renderer.asset, renderer.renderMode ?? RenderMode.FACE, renderer.instances)
    }
}
