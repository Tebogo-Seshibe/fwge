import { GameEngine } from "./Game Engine/GameEngine";
import { PhysicsEngine } from "./Physics Engine/PhysicsEngine";
import { RenderEngine } from "./Render Engine/RenderEngine";

export interface IFWGE
{
    Canvas:     HTMLCanvasElement;
    Height?:    number;
    Width?:     number;
    Clear:      Array<number>;
}

/**
 * @name        FWGE
 * @module      {}
 * @description Some description.
 */
export class FWGE
{
    public static GL: WebGLRenderingContext;

    /**
     * @type        {GameEngine}
     * @description The main engine.
     * @see         FWGE.Game
     */
    public Game: GameEngine;

    /**
     * @type        {PhysicsEngine}
     * @description The physics engine.
     * @see         FWGE.Physics
     */
    public Physics: PhysicsEngine;

    /**
     * @type        {RenderEngine}
     * @description The rendering engine.
     * @see         Render
     */
    public Render: RenderEngine;

    constructor()
    {
        this.Game       = new GameEngine();
        this.Physics    = new PhysicsEngine();
        this.Render     = new RenderEngine();
    }

    /**
     * @description Initializes the webgl context and the seperate engines
     * @function    Init
     * @param       {IFWGE}             request
     * @param       {HTMLCanvasElement} request.canva
     * @param       {Number}            request.heigh
     * @param       {Number}            request.width
     * @param       {Float32Array}      request.clear
     * @return      {void}
     */
    Init(request: IFWGE): void
    {
        if (!request.Canvas)
            throw new Error("HTMLCanvasElement field (canvas) required");

        var _context = request.Canvas.getContext("webgl") || request.Canvas.getContext("experimental-webgl");

        if (!_context)
            throw new Error("Webgl context could not be initialized.");

        
        FWGE.GL = _context;
        FWGE.GL.clearColor(request.Clear[0], request.Clear[1], request.Clear[2], request.Clear[3]);

        this.Game.Init(request.Canvas);
        this.Physics.Init();
        this.Render.Init();
    }

    Start(): void
    {
        this.Game.Start(this.Game, this.Physics, this.Render);
    }

    Pause(): void
    {
        this.Game.Pause();
    }

    Stop(): void
    {
        this.Game.Stop();
    }
}
