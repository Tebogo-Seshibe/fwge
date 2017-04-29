import { Input }            from './Input';
import { Camera }           from './Camera/Camera';
import { Light }            from './Light/Light';
import { Maths }            from './Maths/Maths';
import { Time }             from './Time';
import { Transform }        from "./Transform";
import { Animation }        from "./Animation/Animation";
import { GameObject }       from "./GameObject";
import { ParticleSystem }   from "./Particle System/ParticleSystem";
import { PhysicsEngine }    from "../Physics Engine/PhysicsEngine";
import { RenderEngine }     from "../Render Engine/RenderEngine";

/**
 * @name        GameEngine
 * @description Something...
 * @module      FWGE
 */
export class GameEngine
{
    private Running:        boolean = false;
    private AnimationFrame: number = -1;
    
    /**
     * @property    Input: {Input}
     * @description The module that handles user inputs.
     * @see         FWGE.Game.Input
     */
    public readonly Input:  Input;

    /**
     * @property    Light: {Light}
     * @description The Light module.
     * @see         FWGE.Game.Light
     */
    public readonly Light:  Light;

    /**
     * @property    Maths: {Maths}
     * @description The Maths module.
     * @see         FWGE.Game.Maths
     */
    public readonly Maths:  Maths;

    /**
     * @property    Time: {Time}
     * @description The running clock.
     * @see         FWGE.Game.Time
     */
    public readonly Time:   Time;

    /**
     * @property    Camera: {Camera}
     * @description The viewer.
     * @see         FWGE.Game.Camera
     */
    public readonly Camera: Camera;
    
    constructor()
    {
        this.Camera = new Camera();
        this.Input  = new Input();
        this.Light  = new Light();
        this.Maths  = new Maths();
        this.Time   = new Time();
    }        
    
    /**
     * @function    Animation: {Function}
     * @description The Animation constructor.
     * @see         FWGE.Game.Animation
     */
    Animation(request: IAnimation): Animation
    {
        return new Animation(request);
    }
    
    /**
     * @function    GameObject: {Function}
     * @description The GameObject constructor.
     * @see         FWGE.Game.GameObject
     * @param       request:        {Object}
     *              > Material:     {Material}      [null]
     *              > Mesh:         {Mesh}          [null]
     *              > Transform:    {Transform}     [null]
     *              > Physics:      {Physics}       [null]
     *              > Animation:    {Animation}     [null]
     *              > LightItem:    {LightObject}   [null]
     *              > Begin:        {Function}      [null]
     *              > Update:       {Function}      [null]
     *              > End:          {Function}      [null]
     */
    GameObject(request: IGameObject): GameObject
    {
        return new GameObject(request);
    }
    
    /**
     * @function    ParticleSystem: {Function}
     * @description The ParticleSystem constructor.
     * @see         FWGE.Game.ParticleSystem
     */
    ParticleSystem(request: IParticleSystem): ParticleSystem
    {
        return new ParticleSystem(request);
    }
    
    /**
     * @function    Transform: {Transform}
     * @description The Transform constructor.
     * @see         FWGE.Game.Transform
     */
    Transform(request: ITransform): Transform
    {
        return new Transform(request);
    }

    /**
     * @function    Init: {undefined}
     * @description Initializes the game engine
     */
    Init(): void { }

    /**
     * @function    Run: {undefined}
     * @description Runs the main game loop
     */
    private Run(Game: GameEngine, Physics: PhysicsEngine, Render: RenderEngine): FrameRequestCallback
    {
        let self = this;

        this.AnimationFrame = window.requestAnimationFrame(function(){self.Run(Game, Physics, Render);});

        Game.Update(Game, Physics);
        if (this.Running)
        {
            Physics.Update();
            Render.Update(Game);
        }
    }
    

    /**
     * @function    GameUpdate: {undefined}
     * @description Updates the scene
     */
    Update(Game: GameEngine, Physics: PhysicsEngine): void
    {
        this.Time.Update();
        this.Camera.Update();

        var i = GameObject.Objects.length;
        while (--i >= 0)
            GameObject.Objects[i].ObjectUpdate(Game, Physics);

        this.Input.InputUpdate();
    }

    /**
     * @function    Start: {undefined}
     * @description Initiates/resumes the main game loop
     */
    Start(Game: GameEngine, Physics: PhysicsEngine, Render: RenderEngine): void
    {
        if(!this.Running)
            this.Running = true;

        if (this.AnimationFrame === -1)
            this.Run(Game, Physics, Render);
    }

    Pause(): void
    {
        if (!this.Running)
            this.Running = false;
    }

    /**
     * @function    Stop: {undefined}
     * @description Suspends the main game loop
     */
    Stop(): void
    {
        if (this.Running)
            this.Running = false;

        if (this.AnimationFrame !== -1)
        {
            window.cancelAnimationFrame(this.AnimationFrame);
            this.AnimationFrame = -1;
        }

        this.Time.Reset();
    }
}
