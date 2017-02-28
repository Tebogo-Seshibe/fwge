/**
 * @name        GameEngine
 * @description Something...
 * @module      FWGE
 */
function GameEngine()
{
    var _Running = false;
    var _AnimationFrame = undefined;
    var _Camera;

    Object.defineProperties(this,
    {
        
        /**
         * @property    Input: {Input}
         * @description The module that handles user inputs.
         * @see         FWGE.Game.Input
         */
        Input:          { value: new Input() },
        
        /**
         * @property    Light: {Light}
         * @description The Light module.
         * @see         FWGE.Game.Light
         */
        Light:          { value: new Light() },
        
        /**
         * @property    Maths: {Maths}
         * @description The Maths module.
         * @see         FWGE.Game.Maths
         */
        Maths:          { value: new Maths() },
        
        /**
         * @property    Time: {Time}
         * @description The running clock.
         * @see         FWGE.Game.Time
         */
        Time:           { value: new Time() },
        
        /**
         * @property    Camera: {Camera}
         * @description The viewer.
         * @see         FWGE.Game.Camera
         */
        Camera:         { get: function getCamera() { return _Camera; } },
        
        /**
         * @function    Animation: {Function}
         * @description The Animation constructor.
         * @see         FWGE.Game.Animation
         */
        Animation:      { value: function CreateAnimation() { return new Animation(arguments); } },
        
        /**
         * @function    GameObject: {Function}
         * @description The GameObject constructor.
         * @see         FWGE.Game.GameObject
         * @param       request:        {Object}
         *              > Material:     {Material}      [nullable]
         *              > Mesh:         {Mesh}          [nullable]
         *              > Transform:    {Transform}     [nullable]
         *              > Physics:      {Physics}       [nullable]
         *              > Animation:    {Animation}     [nullable]
         *              > LightItem:    {LightObject}   [nullable]
         *              > Begin:        {Function}      [nullable]
         *              > Update:       {Function}      [nullable]
         *              > End:          {Function}      [nullable]
         */
        GameObject:     { value: function CreateGameObject() { return new GameObject(arguments); } },
        
        /**
         * @function    ParticleSystem: {Function}
         * @description The ParticleSystem constructor.
         * @see         FWGE.Game.ParticleSystem
         */
        ParticleSystem: { value: function CreateParticleSystem() { return new ParticleSystem(arguments); } },
        
        /**
         * @function    Transform: {Transform}
         * @description The Transform constructor.
         * @see         FWGE.Game.Transform
         */
        Transform:      { value: function CreateTransform() { return new Transform(arguments); } },

        /**
         * @function    Init: {undefined}
         * @description Initializes the game engine
         */
        Init:
        {
            value: function Init()
            {
                _Camera = new Camera();
            }
        },

        /**
         * @function    Run: {undefined}
         * @description Runs the main game loop
         */
        Run: 
        { 
            value: function Run()
            {
                _AnimationFrame = window.requestAnimationFrame(FWGE.Game.Run);

                if (_Running)
                {   
                    FWGE.Game.GameUpdate();
                    FWGE.Physics.PhysicsUpdate();
                    FWGE.Render.RenderUpdate();
                }
            }
        },

        /**
         * @function    GameUpdate: {undefined}
         * @description Updates the scene
         */
        GameUpdate:
        {
            value: function GameUpdate()
            {
                FWGE.Game.Time.TimeUpdate();
                FWGE.Game.Camera.CameraUpdate();

                var i = __OBJECT__.length;
                while (--i >= 0)
                    __OBJECT__[i].ObjectUpdate();

                FWGE.Game.Input.InputUpdate();
            }
        },

        /**
         * @function    Start: {undefined}
         * @description Initiates/resumes the main game loop
         */
        Start:
        {
            value: function Start()
            {
                if(!_Running)
                    _Running = true;

                if (!_AnimationFrame)
                    this.Run();
            }
        },

        /**
         * @function    Stop: {undefined}
         * @description Suspends the main game loop
         */
        Stop:
        {
            value: function Stop()
            {
                if (_Running)
                    _Running = false;

                if (!!_AnimationFrame)
                {
                    window.cancelAnimationFrame(_AnimationFrame);
                    _AnimationFrame = undefined;
                }
            }
        }
    });
};

