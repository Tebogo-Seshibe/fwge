import { RenderMaterial, IRenderMaterial } from "./RenderMaterial";
import { Shader, IShader } from "./Shader";
import { FWGE } from "../FWGE";
import { Mesh, IMesh } from "./Mesh";
import { GameEngine } from "../Game Engine/GameEngine";
import { Colour } from "./Colour";
import { Renderer } from "./Renderer";
import { OBJConverter } from "./Converter/OBJConverter";

/**
 * @name RenderEngine
 * @description This module contains all the visual related aspects of the 
 *              game engine.
 * @module      FWGE 
 */
export class RenderEngine
{
    private Renderer: Renderer;
    public OBJConverter: OBJConverter;

    /**
     * @property    Colour: {Colour}
     * @description This module creates colour arrays.
     * @see         FWGE.Render.Colour
     */
    public Colour(...args: any[]): Colour
    {
        return new Colour(args);
    }

    /**
     * @property    Mesh: {Function}
     * @description This is the constructor for a Mesh object.
     * @see         FWGE.Render.Mesh
     */
    public Mesh(request: IMesh): Mesh
    {
        return new Mesh(request);
    }

    /**
     * @property    RenderMaterial: {Function}
     * @description This is the constructor for a Render Material.
     * @see         FWGE.Render.RenderMaterial
     */
    public RenderMaterial(request: IRenderMaterial): RenderMaterial
    {
        return new RenderMaterial(request);
    }
    
    /**
     * @property    Shader: {Function}
     * @description This is a constructor for a Shader object.
     * @see         FWGE.Render.Shader
     */
    public Shader(request: IShader): Shader
    {
        return new Shader(request);
    }

    /**
     *  @function       Init: {undefined}
     *  @description    Initializes the rendering engine
     */
    public Init(): void
    {
        this.Renderer = new Renderer();
        this.OBJConverter = new OBJConverter();
        FWGE.GL.enable(FWGE.GL.DEPTH_TEST);
    }

    /**
     *  @function       RenderUpdate: {undefined}
     *  @description    Updates the rendering to the screen
     */
    Update(Game: GameEngine): void
    {
        this.Renderer.Render();
        this.Renderer.Projection.Update(Game.Camera.Mode, Game.Camera)
    }
}
