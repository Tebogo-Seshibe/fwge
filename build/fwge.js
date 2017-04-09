(function()
{
"use strict";
    
var GL = undefined;

Object.defineProperties(Math,
{
    cot:    { value: function cot(radian)             { return 1 / Math.tan(radian);                } },
    radian: { value: function radian(degree)          { return Math.PI / 180 * degree;              } },
    clamp:  { value: function clamp(value, min, max)  { return Math.max(Math.min(value, max), min); } }
});

var IDCounter = new function IDCounter(){ var id = 0; this.next = function next(){ return id++ }; };


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
        Animation:      { value: function CreateAnimation() { return new Animation(arguments[0]); } },
        
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
        GameObject:     { value: function CreateGameObject() { return new GameObject(arguments[0]); } },
        
        /**
         * @function    ParticleSystem: {Function}
         * @description The ParticleSystem constructor.
         * @see         FWGE.Game.ParticleSystem
         */
        ParticleSystem: { value: function CreateParticleSystem() { return new ParticleSystem(arguments[0]); } },
        
        /**
         * @function    Transform: {Transform}
         * @description The Transform constructor.
         * @see         FWGE.Game.Transform
         */
        Transform:      { value: function CreateTransform() { return new Transform(arguments[0]); } },

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


/**
 * @name        Item
 * @module      FWGE.Game
 * @description The base object for every item
 *              used within the game engine.
 */
function Item(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = (request.type + "ITEM").trim().split(/\s+/);

    var _Name = request.name || "Item";

    Object.defineProperties(this,
    {
        /**
         * @property    Type: {String} [read]
         * @description A string descriptor for the type of item.
         */
        Type: { value: request.type },

        /**
         * @property    Name: {String} [read|write]
         * @description A simple string naming the item
         */
        Name:
        {
            get: function getName() { return _Name; },
            set: function setName()
            {
                if (typeof arguments[0] === 'string')
                    _Name = arguments[0];
            }
        }
    });
}


/**
 * @name        GameItem
 * @description The base container for objects used within the scene.
 * @module      FWGE.Game
 */
function GameItem(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "GAMEITEM ";
    
    Item.call(this, request);

    var _GameObject = request.gameobject;
    
    Object.defineProperties(this,
    {
        /**
         * @property    GameObject: {GameObject} [read|write]
         * @description The GameObject this item is attached to.
         */
        GameObject:
        {
            get: function getGameObject() { return _GameObject; },
            set: function setGameObject()
            {
                if (arguments[0] instanceof GameObject || arguments[0] === undefined)
                    _GameObject = arguments[0];
            }
        }
    });
}


var __OBJECT__ = [];

/**
 * @name GameObject
 * @description The main object container for object types.   
 * @module      FWGE.Game
 */
function GameObject(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "GAMEOBJECT ";
    
    GameItem.call(this, request);

    var _Children       = [];
    var _RenderMaterial;
    var _Mesh;
    var _PhysicsItem;
    var _Animation;
    var _LightItem;
    var _ParticleSystem;    
    var _Begin;
    var _Update;
    var _End;
    
    Object.defineProperties(this,
    {

        /**
         * @property    Children:   {Array} [read]
         * @description An array of gameobjects. All children transformation will be relative to 
         *              the parent gameobject.
         */
        Children: { value: [] },
        /**
         * @property    ID: {String} [read]
         * @description Unique identifier for the gameobject
         */
        ID: { value: "[go-" + IDCounter.next() + "]" },

        /**
         * @property    Transform:  {Transform} [read]
         * @description The transform object attached to the current gameobject
         */
        Transform: { value: request.transform instanceof Transform ? request.transform : new Transform() },

        /**
         * @property    RenderMaterial: {RenderMaterial} [read|write]
         * @description The render material attached to this gameobject.
         */
        RenderMaterial:
        {
            get: function getRenderMaterial() { return _RenderMaterial; },
            set: function setRenderMaterial()
            {
                if (arguments[0] instanceof RenderMaterial || arguments[0] === undefined)
                    _RenderMaterial = arguments[0];
            }
        },

        /**
         * @property    Mesh: {Mesh} [read|write]
         * @description The mesh attached to this gameobject.
         */
        Mesh:
        {
            get: function getMesh() { return _Mesh; },
            set: function setMesh()
            {
                if (arguments[0] instanceof Mesh || arguments[0] === undefined)
                    _Mesh = arguments[0];
            }
        },

        /**
         * @property    LightItem: {LightItem} [read|write]
         * @description The light item attached to this gameobject.
         */
        LightItem:
        {
            get: function getLightItem() { return _LightItem; },
            set: function setLightItem()
            {
                if (!!arguments[0] && arguments[0].Type[1] === "LIGHTITEM")
                {
                    _LightItem = arguments[0];
                    _LightItem.GameObject = this;
                }

                else if (arguments[0] === undefined)
                {
                    if (!!_LightItem)
                        _LightItem.GameObject = undefined;
                    _LightItem = undefined;
                }
            }
        },

        /**
         * @property    PhysicsItem: {PhysicsItem} [read|write]
         * @description The physics item attached to this gameobject.
         */
        PhysicsItem:
        {
            get: function getPhysicsItem() { return _PhysicsItem; },
            set: function setPhysicsItem()
            {
                if (!!arguments[0] && arguments[0].Type[0] === "PHYSICSITEM")
                {
                    _PhysicsItem = arguments[0];
                    _PhysicsItem.GameObject = this;
                }

                else if (arguments[0] === undefined)
                {
                    if (!!_PhysicsItem)
                        _PhysicsItem.GameObject = undefined;
                    _PhysicsItem = undefined;
                }
            }
        },

        /**
         * @property    Animation: {Animation} [read|write]
         * @description The animation attached to this gameobject.
         */
        Animation:
        {
            get: function getAnimation() { return _Animation; },
            set: function setAnimation()
            {
                if (!!arguments[0] && arguments[0].Type[0] === "ANIMATION")
                {
                    _Animation = arguments[0];
                    _Animation.GameObject = this;
                }

                else if (arguments[0] === undefined)
                {
                    if (!!_Animation)
                        _Animation.GameObject = undefined;
                    _Animation = undefined;
                }
            }
        },

        /**
         * @property    particlesystem: {ParticleSystem} [read|write]
         * @description The particle system attached to this gameobject.
         */
        ParticleSystem:
        {
            get: function getParticleSystem() { return _ParticleSystem; },
            set: function setParticleSystem()
            {
                if (!!arguments[0] && arguments[0].Type[0] === "PARTICLESYSTEM")
                {
                    _ParticleSystem = arguments[0];
                    _ParticleSystem.GameObject = this;
                }

                else if (arguments[0] === undefined)
                {
                    if (!!_ParticleSystem)
                        _ParticleSystem.GameObject = undefined;
                    _ParticleSystem = undefined;
                }
            }
        },

        /**
         * @property    Begin:{Function} [read|write]
         * @description This method is called upon object creation.
         */
        Begin:
        {
            get: function getBegin() { return _Begin; },
            set: function setBegin()
            {
                if (typeof arguments[0] === 'function')
                    _Begin = arguments[0];
            }
        },

        /**
         * @property    Update: {Function} [read|write]
         * @description This method is called after each render frame
         */
        Update:
        {
            get: function getUpdate() { return _Update; },
            set: function setUpdate()
            {
                if (typeof arguments[0] === 'function')
                    _Update = arguments[0];
            }
        },

        /**
         * @property    End: {Function} [read|write]
         * @description This method is called once the gameobject if destroyed.
         */
        End:
        {
            get: function getEnd() { return _End; },
            set: function setEnd()
            {
                if (typeof arguments[0] === 'function')
                    _End = arguments[0];
            }
        },

        /**
         * @function    AddChild:   {GameObject}
         * @description Pushes a gameobect to the current object's childrens array, and
         *              move it down the rendering tree.
         * @param       gameobject: {GameObject}
         */
        AddChild:
        {
            value: function AddChild(gameobject)
            {
                if (gameobject instanceof GameObject)
                {
                    this.Children.push(gameobject);
                    var index = __OBJECT__.indexOf(gameobject);

                    if (index !== -1)
                        __OBJECT__.slice(index, 1);
                }

                return gameobject;
            }
        },

        /**
         * @function    RemoveChild: {GameObject}
         * @description Removes a gameobject from the current object's childrens array, and
         *              moves it up the rendering tree.
         * @param       gameobject:  {GameObject}
         */
        RemoveChild: 
        {
            value: function RemoveChild(gameobject)
            {
                if (gameobject instanceof GameObject)
                {
                    var index = this.Children.indexOf(gameobject);

                    if (index !== -1)
                    {
                        this.Children.slice(index, 1);
                        __OBJECT__.push(gameobject);
                    }
                }

                return gameobject;
            }
        }
    });

    this.RenderMaterial = request.rendermaterial instanceof RenderMaterial  ? request.rendermaterial : undefined;
    this.Mesh           = request.mesh           instanceof Mesh            ? request.mesh           : undefined;
    this.PhysicsItem    = request.physicsitem    instanceof PhysicsItem     ? request.physicsitem    : undefined;
    this.Animation      = request.animation      instanceof Animation       ? request.animation      : undefined;
    this.LightItem      = request.lightitem      instanceof LightItem       ? request.lightitem      : undefined;
    this.ParticleSystem = request.particlesystem instanceof ParticleSystem  ? request.particlesystem : undefined;
    
    this.Begin  = typeof request.begin  === 'function' ? request.begin  : function Begin(){};
    this.Update = typeof request.update === 'function' ? request.update : function Update(){};
    this.End    = typeof request.end    === 'function' ? request.end    : function End(){};
    this.Begin();

    __OBJECT__.push(this);
}
Object.defineProperties(GameObject.prototype,
{
    constructor: { value: GameObject },
    
    /**
     * @function    Clone: {GameObject}
     * @description Creates a clone of a gameobject. If no gameobject is provided,
     *              it creates a clone of the calling gameobject.
     * @param       gameobject:  {GameObject} [nullable]
     */
    Clone:
    {
        value: function Clone(gameobject)
        {       
            var $ = (gameobject instanceof GameObject) ? gameobject : this;

            var clone = new GameObject
            ({
                name:           $.Name,
                material:       $.Material,
                mesh:           $.Mesh,
                transform:      new Transform
                ({
                    position:   $.Transform.Position,
                    rotation:   $.Transform.Rotation,
                    scale:      $.Transform.Scale,
                    shear:      $.Transform.Shear
                }),
                physics:        $.Physics,
                animation:      $.Animation
            });
            
            for (var i = 0; i < $.Children.length; ++i)
                clone.Children.push($.Children[i].Clone());
            
            return clone;
        }
    },

    /**
     * @function    Destroy: {undefined}
     * @description Destroys the object after a given amount of time
     * @param       timeout: {Number}
     */
    Destroy:
    {
        value: function Destroy(timeout)
        {
            var self = this;

            if (typeof timeout !== 'number')
                timeout = 0;

            setTimeout(function()
            {
                var i = __OBJECT__.length;
                while (--i >= 0)
                {
                    if (__OBJECT__[i] === self)
                    {
                        __OBJECT__.splice(i, 1);
                        break;
                    }
                }
                self.End();
            }, 1000 * timeout);
        }
    },

    /**
     * @function        ObjectUpdate: {undefined}
     * @description     Updates the object
     */
    ObjectUpdate:
    {
        value: function ObjectUpdate()
        {
            this.Update();
            this.Transform.TransformUpdate();
            if (!!this.PhysicsItem)     this.PhysicsItem.PhysicsUpdate();
            if (!!this.Animation)       this.Animation.AnimationUpdate();
            if (!!this.ParticleSystem)  this.ParticleSystem.ParticleSystemUpdate();
        }
    }
});


/**
 * @name        Camera
 * @description Something...
 * @module      FWGE.Game
 */
function Camera()
{
    var _Mode   = 0;
    var _FOV    = 35;
    var _Aspect = 16/9;
    var _Near   = 0.1;
    var _Far    = 900;
    var _Left   = -10;
    var _Right  = 10;
    var _Top    = 10;
    var _Bottom = 10;
    var _Theta  = 90;
    var _Phi    = 90;

    Object.defineProperties(this,
    {
        /**
         * @constant    PERSPECTIVE: {Number} [read]
         * @description Represents a perspective rendering mode
         */
        PERSPECTIVE:  { value: 0 },
        
        /**
         * @constant    ORTHOGRAPHIC: {Number} [read]
         * @description Represents an orthographic rendering mode
         */
        ORTHOGRAPHIC: { value: 1 },

        /**
         * @property    Transform:  {Transform} [read]
         * @description The transform object attached to the current gameobject
         */
        Transform: { value: new Transform() },

        /**
         * @property    Mode: {Number} [read|write]
         * @description Represent the current rendering mode the camera is using
         */
        Mode:
        { 
            get: function getMode() { return _Mode; },
            set: function setMode()
            { 
                if (arguments[0] === this.PERSPECTIVE || arguments[0] === this.ORTHOGRAPHIC)
                {
                    _Mode = arguments[0];
                    __PROJECTION__.ProjectionUpdate();
                }
            }
        },
        
        /**
         * @property    FOV: {Number} [read|write]
         * @description Represent the current field of view of the camera
         */
        FOV:
        { 
            get: function getFOV() { return _FOV; },
            set: function setFOV()
            { 
                if (typeof arguments[0] === 'number')
                {
                    _FOV = arguments[0];
                    __PROJECTION__.ProjectionUpdate();
                }
            }
        },
        
        /**
         * @property    Aspect: {Number} [read|write]
         * @description Represent the aspect ratio of the camera
         */
        Aspect:
        { 
            get: function getAspect() { return _Aspect; },
            set: function setAspect()
            { 
                if (typeof arguments[0] === 'number')
                {
                    _Aspect = arguments[0];
                    __PROJECTION__.ProjectionUpdate();
                }
            }
        },
        
        /**
         * @property    Near: {Number} [read|write]
         * @description Represent the near clipping plane
         */
        Near:
        { 
            get: function getNear() { return _Near; },
            set: function setNear()
            { 
                if (typeof arguments[0] === 'number')
                {
                    _Near = arguments[0];
                    __PROJECTION__.ProjectionUpdate();
                }
            }
        },
        
        /**
         * @property    Far: {Number} [read|write]
         * @description Represent the far clipping plane
         */
        Far:
        { 
            get: function getFar() { return _Far; },
            set: function setFar()
            { 
                if (typeof arguments[0] === 'number')
                {
                    _Far = arguments[0];
                    __PROJECTION__.ProjectionUpdate();
                }
            }
        },
        
        /**
         * @property    Left: {Number} [read|write]
         * @description Represent the left clipping plane
         */
        Left:
        { 
            get: function getLeft() { return _Left; },
            set: function setLeft()
            { 
                if (typeof arguments[0] === 'number')
                {
                    _Left = arguments[0];
                    __PROJECTION__.ProjectionUpdate();
                }
            }
        },
        
        /**
         * @property    Right: {Number} [read|write]
         * @description Represent the right clipping plane
         */
        Right:
        { 
            get: function getRight() { return _Right; },
            set: function setRight()
            { 
                if (typeof arguments[0] === 'number')
                {
                    _Right = arguments[0];
                    __PROJECTION__.ProjectionUpdate();
                }
            }
        },
        
        /**
         * @property    Top: {Number} [read|write]
         * @description Represent the top clipping plane
         */
        Top:
        { 
            get: function getTop() { return _Top; },
            set: function setTop()
            { 
                if (typeof arguments[0] === 'number')
                {
                    _Top = arguments[0];
                    __PROJECTION__.ProjectionUpdate();
                }
            }
        },
        
        /**
         * @property    Bottom: {Number} [read|write]
         * @description Represent the bottom clipping plane
         */
        Bottom:
        { 
            get: function getBottom() { return _Bottom; },
            set: function setBottom()
            { 
                if (typeof arguments[0] === 'number')
                {
                    _Bottom = arguments[0];
                    __PROJECTION__.ProjectionUpdate();
                }
            }
        },
        
        /**
         * @property    Theta: {Number} [read|write]
         * @description Represent camera's yaw around the scene
         */
        Theta:
        { 
            get: function getTheta() { return _Theta; },
            set: function setTheta()
            { 
                if (typeof arguments[0] === 'number')
                {
                    _Theta = arguments[0];
                    __PROJECTION__.ProjectionUpdate();
                }
            }
        },
        
        /**
         * @property    Phi: {Number} [read|write]
         * @description Represent the camera's pitch around the scene
         */
        Phi:
        { 
            get: function getPhi() { return _Phi; },
            set: function setPhi()
            { 
                if (typeof arguments[0] === 'number')
                {
                    _Phi = arguments[0];
                    __PROJECTION__.ProjectionUpdate();
                }
            }
        },
        
        /**
         * @property    CameraUpdate: void
         * @description Updates the camera
         */
        CameraUpdate:
        {
            value: function CameraUpdate()
            {
                GL.canvas.height = window.innerHeight;
                GL.canvas.width = window.innerWidth;
                //_Aspect = GL.drawingBufferWidth/GL.drawingBufferHeight;
            }
        }
    });
}


/**
 * @name        Particle
 * @description Definition of an animator
 * @module      FWGE.Game
 */
function Animation(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "ANIMATION ";
    
    GameItem.call(this, request);    
}


/**
 * @name        Time
 * @description This is the running clock that keeps track of elapsed time
 *              between render frames.
 * @module      FWGE.Game
 */
function Time()
{
    var _Now  = undefined,
        _Then = undefined;
    
    Object.defineProperties(this,
    {
        /**
         * @property    Delta: {Number} [read]
         * @description Some description
         */
        Delta:      { get: function(){ return (_Now - _Then) / 60; } },

        /**
         * @property    DeltaTime: {Number} [read]
         * @description Some description
         */
        DeltaTime:  { get: function(){ return _Now - _Then; } },

        /**
         * @property    Now: {Number} [read]
         * @description Some description
         */
        Now:        { get: function(){ return new Date(Date.now()); } },

        /**
         * @property    TimeUpdate: {undefined}
         * @description Some description
         */
        TimeUpdate:        
        {
            value: function TimeUpdate()
            {
                if (_Now === undefined && _Then === undefined)
                    _Now = _Then = Date.now();
                else
                {
                    _Then = _Now;
                    _Now = Date.now();
                }
            }
        }
    });
}


/**
 * @name        Transform
 * @module      FWGE.Game
 * @description This object contains all the transformations that 
 *              are to be applied to the parent gameobject.
 */
function Transform(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type ="TRANSFORM ";
    
    GameItem.call(this, request);
    
    function setup(item, one)
    {
        if (!item || !(item instanceof Array))
            item = !!one ? [1,1,1] : [0,0,0];

        switch (item.length)
        {
            case 0: item[0] = 0;
            case 1: item[1] = 0;
            case 2: item[2] = 0;
        }

        return FWGE.Game.Maths.Vector3.Create(item);
    }
    
    var _Position   = setup(request.position);
    var _Rotation   = setup(request.rotation);
    var _Scale      = setup(request.scale, true);
    var _Shear      = setup(request.shear);
    
    var _Up         = FWGE.Game.Maths.Vector3.Create(0, 1, 0);
    var _Forward    = FWGE.Game.Maths.Vector3.Create(0, 0, 1);
    var _Right      = FWGE.Game.Maths.Vector3.Create(1, 0, 0);
    
    Object.defineProperties(this,
    {
        /**
         * @property    Position: {Float32Array} [read|write]
         * @description The current position of the parent of gameobject
         */
        Position:
        {
            get: function getPosition() { return _Position; },
            set: function setPosition()
            {
                if (arguments[0].Type[0] === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Position, arguments[0]);
            }
        },

        /**
         * @property    Rotation: {Float32Array} [read|write]
         * @description The current rotation of the parent of gameobject
         */           
        Rotation:
        {
            get: function getRotation() { return _Rotation; },
            set: function setRotation()
            {
                if (arguments[0].Type[0] === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Rotation, arguments[0]);
            }
        },

        /**
         * @property    Scale: {Float32Array} [read|write]
         * @description The current scaling of the parent of gameobject
         */
        Scale:
        {
            get: function getScale() { return _Scale; },
            set: function setScale()
            {
                if (arguments[0].Type[0] === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Scale, arguments[0]);
            }
        },

        /**
         * @property    Shear: {Float32Array} [read|write]
         * @description The current shearing of the parent of gameobject
         */
        Shear:
        {
            get: function getShear() { return _Shear; },
            set: function setShear()
            {
                if (arguments[0].Type[0] === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Shear, arguments[0]);
            }
        },

        /**
         * @property    Up: {Float32Array} [read]
         * @description The parent gameobject's up vector
         */
        Up:         { get: function() { return _Up; } },
        
        /**
         * @property    Forward: {Float32Array} [read]
         * @description The parent gameobject's forward vector
         */
        Forward:    { get: function() { return _Forward; } },
        
        /**
         * @property    Right: {Float32Array} [read]
         * @description The parent gameobject's right vector
         */
        Right:      { get: function() { return _Right; } },
    });
    
    this.TransformUpdate();
}
Object.defineProperties(Transform.prototype,
{
    constructor: {value: Transform},

    /**
     * @property    TransformUpdate: {undefined}
     * @description Updates the transformations
     */
    TransformUpdate:
    {
        value: function TransformUpdate()
        {
            // TODO
            // UPDATE: UP, FORWARD, AND RIGHT
        }
    }
});


/**
 * @name        Input
 * @description This module handles all user key and mouse inputs.
 * @module      FWGE.Game
 */
function Input()
{
    var _UP      = 0;
    var _PRESS   = 128;
    var _DOWN    = 256;
    var _END     = 384;

    var _Keys   = new Array(_END);
    var _Mouse  = new Array(8);
    var _Axis   = new Array(16);

    for (var i = 0; i < _PRESS; ++i)
        _Keys[i] = true;

    for (var i = _PRESS; i < _END; ++i)
        _Keys[i] = false;

    function handle_event(e)
    {
        var key = e.which || e.keyCode || 0;
        
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;

        return key;
    }

    window.onkeyup = function onkeyup(e)
    {
        var key = handle_event(e);

        _Keys[key + _UP   ]    = true;
        _Keys[key + _PRESS]    = false;
        _Keys[key + _DOWN ]    = false;
    };
    window.onkeydown = function onkeydown(e)
    {
        var key = handle_event(e);

        _Keys[key + _UP   ]    = false;
        _Keys[key + _PRESS]    = true;
        _Keys[key + _DOWN ]    = true;
    };

    document.body.oncontextmenu = function oncontextmenu(e) { handle_event(e); return false; };
    window.onmouseenter = function onmouseenter(e)
    {
        var key = handle_event(e);

        //TODO
    };
    window.onmousemove = function onmousemove(e) 
    {
        var key = handle_event(e);

        //TODO
    };
    window.onmouseleave = function onmouseleave(e)
    {
        var key = handle_event(e);

        //TODO
    };
    window.onmousedown = function onmousedown(e) 
    {
        var key = handle_event(e);

        //TODO
    };
    window.onmouseup = function onmouseup(e)   
    {
        var key = handle_event(e);

        //TODO
    };
    
    Object.defineProperties(this, 
    {
        
        /**
         * @property    KEY_F1_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_F1_UP:      { get: function getF1KeyUp()     { return _Keys[112 + _UP   ]; } },
        
        /**
         * @property    KEY_F1_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_F1_PRESS:   { get: function getF1KeyPress()  { return _Keys[112 + _PRESS]; } },
        
        /**
         * @property    KEY_F1_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_F1_DOWN:    { get: function getF1KeyDown()   { return _Keys[112 + _DOWN ]; } },

        
        /**
         * @property    KEY_F2_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_F2_UP:      { get: function getF2KeyUp()     { return _Keys[113 + _UP   ]; } },
        
        /**
         * @property    KEY_F2_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_F2_PRESS:   { get: function getF2KeyPress()  { return _Keys[113 + _PRESS]; } },
        
        /**
         * @property    KEY_F2_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_F2_DOWN:    { get: function getF2KeyDown()   { return _Keys[113 + _DOWN ]; } },

        
        /**
         * @property    KEY_F3_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_F3_UP:      { get: function getF3KeyUp()     { return _Keys[114 + _UP   ]; } },
        
        /**
         * @property    KEY_F3_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_F3_PRESS:   { get: function getF3KeyPress()  { return _Keys[114 + _PRESS]; } },
        
        /**
         * @property    KEY_F3_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_F3_DOWN:    { get: function getF3KeyDown()   { return _Keys[114 + _DOWN ]; } },

        
        /**
         * @property    KEY_F4_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_F4_UP:      { get: function getF4KeyUp()     { return _Keys[115 + _UP   ]; } },
        
        /**
         * @property    KEY_F4_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_F4_PRESS:   { get: function getF4KeyPress()  { return _Keys[115 + _PRESS]; } },
        
        /**
         * @property    KEY_F4_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_F4_DOWN:    { get: function getF4KeyDown()   { return _Keys[115 + _DOWN ]; } },

        
        /**
         * @property    KEY_F5_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_F5_UP:      { get: function getF5KeyUp()     { return _Keys[116 + _UP   ]; } },
        
        /**
         * @property    KEY_F5_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_F5_PRESS:   { get: function getF5KeyPress()  { return _Keys[116 + _PRESS]; } },
        
        /**
         * @property    KEY_F5_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_F5_DOWN:    { get: function getF5KeyDown()   { return _Keys[116 + _DOWN ]; } },

        
        /**
         * @property    KEY_F6_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_F6_UP:      { get: function getF6KeyUp()     { return _Keys[117 + _UP   ]; } },
        
        /**
         * @property    KEY_F6_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_F6_PRESS:   { get: function getF6KeyPress()  { return _Keys[117 + _PRESS]; } },
        
        /**
         * @property    KEY_F6_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_F6_DOWN:    { get: function getF6KeyDown()   { return _Keys[117 + _DOWN ]; } },

        
        /**
         * @property    KEY_F7_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_F7_UP:      { get: function getF7KeyUp()     { return _Keys[118 + _UP   ]; } },
        
        /**
         * @property    KEY_F7_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_F7_PRESS:   { get: function getF7KeyPress()  { return _Keys[118 + _PRESS]; } },
        
        /**
         * @property    KEY_F7_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_F7_DOWN:    { get: function getF7KeyDown()   { return _Keys[118 + _DOWN ]; } },

        
        /**
         * @property    KEY_F8_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_F8_UP:      { get: function getF8KeyUp()     { return _Keys[119 + _UP   ]; } },
        
        /**
         * @property    KEY_F8_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_F8_PRESS:   { get: function getF8KeyPress()  { return _Keys[119 + _PRESS]; } },
        
        /**
         * @property    KEY_F8_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_F8_DOWN:    { get: function getF8KeyDown()   { return _Keys[119 + _DOWN ]; } },

        
        /**
         * @property    KEY_F9_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_F9_UP:      { get: function getF9KeyUp()     { return _Keys[120 + _UP   ]; } },
        
        /**
         * @property    KEY_F9_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_F9_PRESS:   { get: function getF9KeyPress()  { return _Keys[120 + _PRESS]; } },
        
        /**
         * @property    KEY_F9_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_F9_DOWN:    { get: function getF9KeyDown()   { return _Keys[120 + _DOWN ]; } },

        
        /**
         * @property    KEY_F10_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_F10_UP:     { get: function getF10KeyUp()    { return _Keys[121 + _UP   ]; } },
        
        /**
         * @property    KEY_F10_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_F10_PRESS:  { get: function getF10KeyPress() { return _Keys[121 + _PRESS]; } },
        
        /**
         * @property    KEY_F10_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_F10_DOWN:   { get: function getF10KeyDown()  { return _Keys[121 + _DOWN ]; } },

        
        /**
         * @property    KEY_F11_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_F11_UP:     { get: function getF11KeyUp()    { return _Keys[122 + _UP   ]; } },
        
        /**
         * @property    KEY_F11_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_F11_PRESS:  { get: function getF11KeyPress() { return _Keys[122 + _PRESS]; } },
        
        /**
         * @property    KEY_F11_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_F11_DOWN:   { get: function getF11KeyDown()  { return _Keys[122 + _DOWN ]; } },

        
        /**
         * @property    KEY_F12_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_F12_UP:     { get: function getF12KeyUp()    { return _Keys[123 + _UP   ]; } },
        
        /**
         * @property    KEY_F12_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_F12_PRESS:  { get: function getF12KeyPress() { return _Keys[123 + _PRESS]; } },
        
        /**
         * @property    KEY_F12_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_F12_DOWN:   { get: function getF12KeyDown()  { return _Keys[123 + _DOWN ]; } },


        
        /**
         * @property    KEY_0_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_0_UP:       { get: function get0KeyUp()    { return _Keys[48 + _UP   ]; } },
        
        /**
         * @property    KEY_0_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_0_PRESS:    { get: function get0KeyPress() { return _Keys[48 + _PRESS]; } },
        
        /**
         * @property    KEY_0_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_0_DOWN:     { get: function get0KeyDown()  { return _Keys[48 + _DOWN ]; } },

        
        /**
         * @property    KEY_1_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_1_UP:       { get: function get1KeyUp()    { return _Keys[49 + _UP   ]; } },
        
        /**
         * @property    KEY_1_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_1_PRESS:    { get: function get1KeyPress() { return _Keys[49 + _PRESS]; } },
        
        /**
         * @property    KEY_1_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_1_DOWN:     { get: function get1KeyDown()  { return _Keys[49 + _DOWN ]; } },

        
        /**
         * @property    KEY_2_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_2_UP:       { get: function get2KeyUp()    { return _Keys[50 + _UP   ]; } },
        
        /**
         * @property    KEY_2_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_2_PRESS:    { get: function get2KeyPress() { return _Keys[50 + _PRESS]; } },
        
        /**
         * @property    KEY_2_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_2_DOWN:     { get: function get2KeyDown()  { return _Keys[50 + _DOWN ]; } },

        
        /**
         * @property    KEY_3_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_3_UP:       { get: function get3KeyUp()    { return _Keys[51 + _UP   ]; } },
        
        /**
         * @property    KEY_3_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_3_PRESS:    { get: function get3KeyPress() { return _Keys[51 + _PRESS]; } },
        
        /**
         * @property    KEY_3_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_3_DOWN:     { get: function get3KeyDown()  { return _Keys[51 + _DOWN ]; } },

        
        /**
         * @property    KEY_4_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_4_UP:       { get: function get4KeyUp()    { return _Keys[52 + _UP   ]; } },
        
        /**
         * @property    KEY_4_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_4_PRESS:    { get: function get4KeyPress() { return _Keys[52 + _PRESS]; } },
        
        /**
         * @property    KEY_4_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_4_DOWN:     { get: function get4KeyDown()  { return _Keys[52 + _DOWN ]; } },

        
        /**
         * @property    KEY_5_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_5_UP:       { get: function get5KeyUp()    { return _Keys[53 + _UP   ]; } },
        
        /**
         * @property    KEY_5_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_5_PRESS:    { get: function get5KeyPress() { return _Keys[53 + _PRESS]; } },
        
        /**
         * @property    KEY_5_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_5_DOWN:     { get: function get5KeyDown()  { return _Keys[53 + _DOWN ]; } },

        
        /**
         * @property    KEY_6_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_6_UP:       { get: function get6KeyUp()    { return _Keys[54 + _UP   ]; } },
        
        /**
         * @property    KEY_6_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_6_PRESS:    { get: function get6KeyPress() { return _Keys[54 + _PRESS]; } },
        
        /**
         * @property    KEY_6_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_6_DOWN:     { get: function get6KeyDown()  { return _Keys[54 + _DOWN ]; } },

        
        /**
         * @property    KEY_7_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_7_UP:       { get: function get7KeyUp()    { return _Keys[55 + _UP   ]; } },
        
        /**
         * @property    KEY_7_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_7_PRESS:    { get: function get7KeyPress() { return _Keys[55 + _PRESS]; } },
        
        /**
         * @property    KEY_7_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_7_DOWN:     { get: function get7KeyDown()  { return _Keys[55 + _DOWN ]; } },

        
        /**
         * @property    KEY_8_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_8_UP:       { get: function get8KeyUp()    { return _Keys[56 + _UP   ]; } },
        
        /**
         * @property    KEY_8_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_8_PRESS:    { get: function get8KeyPress() { return _Keys[56 + _PRESS]; } },
        
        /**
         * @property    KEY_8_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_8_DOWN:     { get: function get8KeyDown()  { return _Keys[56 + _DOWN ]; } },

        
        /**
         * @property    KEY_9_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_9_UP:       { get: function get9KeyUp()    { return _Keys[57 + _UP   ]; } },
        
        /**
         * @property    KEY_9_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_9_PRESS:    { get: function get9KeyPress() { return _Keys[57 + _PRESS]; } },
        
        /**
         * @property    KEY_9_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_9_DOWN:     { get: function get9KeyDown()  { return _Keys[57 + _DOWN ]; } },


        
        /**
         * @property    NUMPAD_0_UP: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_0_UP:       { get: function getNumpad0KeyUp()    { return _Keys[96 + _UP   ]; } },
        
        /**
         * @property    NUMPAD_0_PRESS: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_0_PRESS:    { get: function getNumpad0KeyPress() { return _Keys[96 + _PRESS]; } },
        
        /**
         * @property    NUMPAD_0_DOWN: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_0_DOWN:     { get: function getNumpad0KeyDown()  { return _Keys[96 + _DOWN ]; } },

        
        /**
         * @property    NUMPAD_1_UP: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_1_UP:       { get: function getNumpad1KeyUp()    { return _Keys[97 + _UP   ]; } },
        
        /**
         * @property    NUMPAD_1_PRESS: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_1_PRESS:    { get: function getNumpad1KeyPress() { return _Keys[97 + _PRESS]; } },
        
        /**
         * @property    NUMPAD_1_DOWN: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_1_DOWN:     { get: function getNumpad1KeyDown()  { return _Keys[97 + _DOWN ]; } },

        
        /**
         * @property    NUMPAD_2_UP: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_2_UP:       { get: function getNumpad2KeyUp()    { return _Keys[98 + _UP   ]; } },
        
        /**
         * @property    NUMPAD_2_PRESS: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_2_PRESS:    { get: function getNumpad2KeyPress() { return _Keys[98 + _PRESS]; } },
        
        /**
         * @property    NUMPAD_2_DOWN: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_2_DOWN:     { get: function getNumpad2KeyDown()  { return _Keys[98 + _DOWN ]; } },

        
        /**
         * @property    NUMPAD_3_UP: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_3_UP:       { get: function getNumpad3KeyUp()    { return _Keys[99 + _UP   ]; } },
        
        /**
         * @property    NUMPAD_3_PRESS: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_3_PRESS:    { get: function getNumpad3KeyPress() { return _Keys[99 + _PRESS]; } },
        
        /**
         * @property    NUMPAD_3_DOWN: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_3_DOWN:     { get: function getNumpad3KeyDown()  { return _Keys[99 + _DOWN ]; } },

        
        /**
         * @property    NUMPAD_4_UP: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_4_UP:       { get: function getNumpad4KeyUp()    { return _Keys[100 + _UP   ]; } },
        
        /**
         * @property    NUMPAD_4_PRESS: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_4_PRESS:    { get: function getNumpad4KeyPress() { return _Keys[100 + _PRESS]; } },
        
        /**
         * @property    NUMPAD_4_DOWN: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_4_DOWN:     { get: function getNumpad4KeyDown()  { return _Keys[100 + _DOWN ]; } },

        
        /**
         * @property    NUMPAD_5_UP: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_5_UP:       { get: function getNumpad5KeyUp()    { return _Keys[101 + _UP   ]; } },
        
        /**
         * @property    NUMPAD_5_PRESS: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_5_PRESS:    { get: function getNumpad5KeyPress() { return _Keys[101 + _PRESS]; } },
        
        /**
         * @property    NUMPAD_5_DOWN: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_5_DOWN:     { get: function getNumpad5KeyDown()  { return _Keys[101 + _DOWN ]; } },

        
        /**
         * @property    NUMPAD_6_UP: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_6_UP:       { get: function getNumpad6KeyUp()    { return _Keys[102 + _UP   ]; } },
        
        /**
         * @property    NUMPAD_6_PRESS: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_6_PRESS:    { get: function getNumpad6KeyPress() { return _Keys[102 + _PRESS]; } },
        
        /**
         * @property    NUMPAD_6_DOWN: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_6_DOWN:     { get: function getNumpad6KeyDown()  { return _Keys[102 + _DOWN ]; } },

        
        /**
         * @property    NUMPAD_7_UP: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_7_UP:       { get: function getNumpad7KeyUp()    { return _Keys[103 + _UP   ]; } },
        
        /**
         * @property    NUMPAD_7_PRESS: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_7_PRESS:    { get: function getNumpad7KeyPress() { return _Keys[103 + _PRESS]; } },
        
        /**
         * @property    NUMPAD_7_DOWN: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_7_DOWN:     { get: function getNumpad7KeyDown()  { return _Keys[103 + _DOWN ]; } },

        
        /**
         * @property    NUMPAD_8_UP: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_8_UP:       { get: function getNumpad8KeyUp()    { return _Keys[104 + _UP   ]; } },
        
        /**
         * @property    NUMPAD_8_PRESS: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_8_PRESS:    { get: function getNumpad8KeyPress() { return _Keys[104 + _PRESS]; } },
        
        /**
         * @property    NUMPAD_8_DOWN: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_8_DOWN:     { get: function getNumpad8KeyDown()  { return _Keys[104 + _DOWN ]; } },

        
        /**
         * @property    NUMPAD_9_UP: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_9_UP:       { get: function getNumpad9KeyUp()    { return _Keys[105 + _UP   ]; } },
        
        /**
         * @property    NUMPAD_9_PRESS: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_9_PRESS:    { get: function getNumpad9KeyPress() { return _Keys[105 + _PRESS]; } },
        
        /**
         * @property    NUMPAD_9_DOWN: {Boolean} [read]
         * @description Some description
         */
        NUMPAD_9_DOWN:     { get: function getNumpad9KeyDown()  { return _Keys[105 + _DOWN ]; } },


        
        /**
         * @property    KEY_DIVIDE_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_DIVIDE_UP:        { get: function getDivideKeyUp()      { return _Keys[111 + _UP   ]; } },
        
        /**
         * @property    KEY_DIVIDE_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_DIVIDE_PRESS:     { get: function getDivideKeyPress()   { return _Keys[111 + _PRESS]; } },
        
        /**
         * @property    KEY_DIVIDE_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_DIVIDE_DOWN:      { get: function getDivideKeyDown()    { return _Keys[111 + _DOWN ]; } },

        
        /**
         * @property    KEY_MULTIPLY_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_MULTIPLY_UP:      { get: function getMultiplyKeyUp()    { return _Keys[106 + _UP   ]; } },
        
        /**
         * @property    KEY_MULTIPLY_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_MULTIPLY_PRESS:   { get: function getMultiplyKeyPress() { return _Keys[106 + _PRESS]; } },
        
        /**
         * @property    KEY_MULTIPLY_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_MULTIPLY_DOWN:    { get: function getMultiplyKeyDown()  { return _Keys[106 + _DOWN ]; } },

        
        /**
         * @property    KEY_SUBTRACT_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_SUBTRACT_UP:      { get: function getSubtractKeyUp()    { return _Keys[109 + _UP   ]; } },
        
        /**
         * @property    KEY_SUBTRACT_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_SUBTRACT_PRESS:   { get: function getSubtractKeyPress() { return _Keys[109 + _PRESS]; } },
        
        /**
         * @property    KEY_SUBTRACT_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_SUBTRACT_DOWN:    { get: function getSubtractKeyDown()  { return _Keys[109 + _DOWN ]; } },

        
        /**
         * @property    KEY_ADD_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_ADD_UP:           { get: function getAddKeyUp()         { return _Keys[107 + _UP   ]; } },
        
        /**
         * @property    KEY_ADD_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_ADD_PRESS:        { get: function getAddKeyPress()      { return _Keys[107 + _PRESS]; } },
        
        /**
         * @property    KEY_ADD_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_ADD_DOWN:         { get: function getAddKeyDown()       { return _Keys[107 + _DOWN ]; } },


        
        /**
         * @property    KEY_TAB_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_TAB_UP:          { get: function getTABKeyUp()          { return _Keys[9 + _UP   ]; } },
        
        /**
         * @property    KEY_TAB_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_TAB_PRESS:       { get: function getTABKeyPress()       { return _Keys[9 + _PRESS]; } },
        
        /**
         * @property    KEY_TAB_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_TAB_DOWN:        { get: function getTABKeyDown()        { return _Keys[9 + _DOWN ]; } },

        
        /**
         * @property    KEY_CAPS_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_CAPS_UP:         { get: function getCAPSKeyUp()         { return _Keys[20 + _UP   ]; } },
        
        /**
         * @property    KEY_CAPS_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_CAPS_PRESS:      { get: function getCAPSKeyPress()      { return _Keys[20 + _PRESS]; } },
        
        /**
         * @property    KEY_CAPS_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_CAPS_DOWN:       { get: function getCAPSKeyDown()       { return _Keys[20 + _DOWN ]; } },

        
        /**
         * @property    KEY_SHIFT_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_SHIFT_UP:        { get: function getSHIFTKeyUp()        { return _Keys[16 + _UP   ]; } },
        
        /**
         * @property    KEY_SHIFT_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_SHIFT_PRESS:     { get: function getSHIFTKeyPress()     { return _Keys[16 + _PRESS]; } },
        
        /**
         * @property    KEY_SHIFT_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_SHIFT_DOWN:      { get: function getSHIFTKeyDown()      { return _Keys[16 + _DOWN ]; } },

        
        /**
         * @property    KEY_CTRL_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_CTRL_UP:         { get: function getCTRLKeyUp()         { return _Keys[17 + _UP   ]; } },
        
        /**
         * @property    KEY_CTRL_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_CTRL_PRESS:      { get: function getCTRLKeyPress()      { return _Keys[17 + _PRESS]; } },
        
        /**
         * @property    KEY_CTRL_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_CTRL_DOWN:       { get: function getCTRLKeyDown()       { return _Keys[17 + _DOWN ]; } },

        
        /**
         * @property    KEY_ALT_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_ALT_UP:          { get: function getALTKeyUp()          { return _Keys[18 + _UP   ]; } },
        
        /**
         * @property    KEY_ALT_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_ALT_PRESS:       { get: function getALTKeyPress()       { return _Keys[18 + _PRESS]; } },
        
        /**
         * @property    KEY_ALT_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_ALT_DOWN:        { get: function getALTKeyDown()        { return _Keys[18 + _DOWN ]; } },

        
        /**
         * @property    KEY_BACKSPACE_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_BACKSPACE_UP:    { get: function getBACKSPACEKeyUp()    { return _Keys[8 + _UP   ]; } },
        
        /**
         * @property    KEY_BACKSPACE_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_BACKSPACE_PRESS: { get: function getBACKSPACEKeyPress() { return _Keys[8 + _PRESS]; } },
        
        /**
         * @property    KEY_BACKSPACE_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_BACKSPACE_DOWN:  { get: function getBACKSPACEKeyDown()  { return _Keys[8 + _DOWN ]; } },

        
        /**
         * @property    KEY_ENTER_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_ENTER_UP:        { get: function getENTERKeyUp()        { return _Keys[13 + _UP   ]; } },
        
        /**
         * @property    KEY_ENTER_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_ENTER_PRESS:     { get: function getENTERKeyPress()     { return _Keys[13 + _PRESS]; } },
        
        /**
         * @property    KEY_ENTER_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_ENTER_DOWN:      { get: function getENTERKeyDown()      { return _Keys[13 + _DOWN ]; } },


        
        /**
         * @property    KEY_UP_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_UP_UP:       { get: function getUPKeyUp()       { return _Keys[38 + _UP   ]; } },
        
        /**
         * @property    KEY_UP_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_UP_PRESS:    { get: function getUPKeyPress()    { return _Keys[38 + _PRESS]; } },
        
        /**
         * @property    KEY_UP_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_UP_DOWN:     { get: function getUPKeyDown()     { return _Keys[38 + _DOWN ]; } },

        
        /**
         * @property    KEY_LEFT_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_LEFT_UP:     { get: function getLEFTKeyUp()     { return _Keys[37 + _UP   ]; } },
        
        /**
         * @property    KEY_LEFT_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_LEFT_PRESS:  { get: function getLEFTKeyPress()  { return _Keys[37 + _PRESS]; } },
        
        /**
         * @property    KEY_LEFT_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_LEFT_DOWN:   { get: function getLEFTKeyDown()   { return _Keys[37 + _DOWN ]; } },

        
        /**
         * @property    KEY_RIGHT_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_RIGHT_UP:    { get: function getRIGHTKeyUp()    { return _Keys[40 + _UP   ]; } },
        
        /**
         * @property    KEY_RIGHT_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_RIGHT_PRESS: { get: function getRIGHTKeyPress() { return _Keys[40 + _PRESS]; } },
        
        /**
         * @property    KEY_RIGHT_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_RIGHT_DOWN:  { get: function getRIGHTKeyDown()  { return _Keys[40 + _DOWN ]; } },

        
        /**
         * @property    KEY_DOWN_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_DOWN_UP:     { get: function getDOWNKeyUp()     { return _Keys[39 + _UP   ]; } },
        
        /**
         * @property    KEY_DOWN_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_DOWN_PRESS:  { get: function getDOWNKeyPress()  { return _Keys[39 + _PRESS]; } },
        
        /**
         * @property    KEY_DOWN_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_DOWN_DOWN:   { get: function getDOWNKeyDown()   { return _Keys[39 + _DOWN ]; } },


        
        /**
         * @property    KEY_BRACKET_L_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_BRACKET_L_UP:     { get: function getTABKeyUp()    { return _Keys[219 + _UP   ]; } },
        
        /**
         * @property    KEY_BRACKET_L_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_BRACKET_L_PRESS:  { get: function getTABKeyPress() { return _Keys[219 + _PRESS]; } },
        
        /**
         * @property    KEY_BRACKET_L_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_BRACKET_L_DOWN:   { get: function getTABKeyDown()  { return _Keys[219 + _DOWN ]; } },

        
        /**
         * @property    KEY_BRACKET_R_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_BRACKET_R_UP:     { get: function getTABKeyUp()    { return _Keys[221 + _UP   ]; } },
        
        /**
         * @property    KEY_BRACKET_R_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_BRACKET_R_PRESS:  { get: function getTABKeyPress() { return _Keys[221 + _PRESS]; } },
        
        /**
         * @property    KEY_BRACKET_R_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_BRACKET_R_DOWN:   { get: function getTABKeyDown()  { return _Keys[221 + _DOWN ]; } },

        
        /**
         * @property    KEY_COLON_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_COLON_UP:         { get: function getTABKeyUp()    { return _Keys[186 + _UP   ]; } },
        
        /**
         * @property    KEY_COLON_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_COLON_PRESS:      { get: function getTABKeyPress() { return _Keys[186 + _PRESS]; } },
        
        /**
         * @property    KEY_COLON_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_COLON_DOWN:       { get: function getTABKeyDown()  { return _Keys[186 + _DOWN ]; } },

        
        /**
         * @property    KEY_QUOTE_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_QUOTE_UP:         { get: function getTABKeyUp()    { return _Keys[222 + _UP   ]; } },
        
        /**
         * @property    KEY_QUOTE_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_QUOTE_PRESS:      { get: function getTABKeyPress() { return _Keys[222 + _PRESS]; } },
        
        /**
         * @property    KEY_QUOTE_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_QUOTE_DOWN:       { get: function getTABKeyDown()  { return _Keys[222 + _DOWN ]; } },

        
        /**
         * @property    KEY_COMMA_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_COMMA_UP:         { get: function getTABKeyUp()    { return _Keys[188 + _UP   ]; } },
        
        /**
         * @property    KEY_COMMA_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_COMMA_PRESS:      { get: function getTABKeyPress() { return _Keys[188 + _PRESS]; } },
        
        /**
         * @property    KEY_COMMA_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_COMMA_DOWN:       { get: function getTABKeyDown()  { return _Keys[188 + _DOWN ]; } },

        
        /**
         * @property    KEY_PERIOD_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_PERIOD_UP:        { get: function getTABKeyUp()    { return _Keys[190 + _UP   ]; } },
        
        /**
         * @property    KEY_PERIOD_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_PERIOD_PRESS:     { get: function getTABKeyPress() { return _Keys[190 + _PRESS]; } },
        
        /**
         * @property    KEY_PERIOD_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_PERIOD_DOWN:      { get: function getTABKeyDown()  { return _Keys[190 + _DOWN ]; } },

        
        /**
         * @property    KEY_SLASH_F_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_SLASH_F_UP:       { get: function getTABKeyUp()    { return _Keys[191 + _UP   ]; } },
        
        /**
         * @property    KEY_SLASH_F_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_SLASH_F_PRESS:    { get: function getTABKeyPress() { return _Keys[191 + _PRESS]; } },
        
        /**
         * @property    KEY_SLASH_F_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_SLASH_F_DOWN:     { get: function getTABKeyDown()  { return _Keys[191 + _DOWN ]; } },

        
        /**
         * @property    KEY_SLASH_B_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_SLASH_B_UP:       { get: function getTABKeyUp()    { return _Keys[220 + _UP   ]; } },
        
        /**
         * @property    KEY_SLASH_B_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_SLASH_B_PRESS:    { get: function getTABKeyPress() { return _Keys[220 + _PRESS]; } },
        
        /**
         * @property    KEY_SLASH_B_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_SLASH_B_DOWN:     { get: function getTABKeyDown()  { return _Keys[220 + _DOWN ]; } },


        
        /**
         * @property    KEY_A_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_A_UP:       { get: function getAKeyUp()     { return _Keys[65 + _UP   ]; } },
        
        /**
         * @property    KEY_A_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_A_PRESS:    { get: function getAKeyPress()  { return _Keys[65 + _PRESS]; } },
        
        /**
         * @property    KEY_A_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_A_DOWN:     { get: function getAKeyDown()   { return _Keys[65 + _DOWN ]; } },

        
        /**
         * @property    KEY_B_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_B_UP:       { get: function getBKeyUp()     { return _Keys[66 + _UP   ]; } },
        
        /**
         * @property    KEY_B_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_B_PRESS:    { get: function getBKeyPress()  { return _Keys[66 + _PRESS]; } },
        
        /**
         * @property    KEY_B_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_B_DOWN:     { get: function getBKeyDown()   { return _Keys[66 + _DOWN ]; } },

        
        /**
         * @property    KEY_C_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_C_UP:       { get: function getCKeyUp()     { return _Keys[67 + _UP   ]; } },
        
        /**
         * @property    KEY_C_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_C_PRESS:    { get: function getCKeyPress()  { return _Keys[67 + _PRESS]; } },
        
        /**
         * @property    KEY_C_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_C_DOWN:     { get: function getCKeyDown()   { return _Keys[67 + _DOWN ]; } },

        
        /**
         * @property    KEY_D_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_D_UP:       { get: function getDKeyUp()     { return _Keys[68 + _UP   ]; } },
        
        /**
         * @property    KEY_D_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_D_PRESS:    { get: function getDKeyPress()  { return _Keys[68 + _PRESS]; } },
        
        /**
         * @property    KEY_D_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_D_DOWN:     { get: function getDKeyDown()   { return _Keys[68 + _DOWN ]; } },

        
        /**
         * @property    KEY_E_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_E_UP:       { get: function getEKeyUp()     { return _Keys[69 + _UP   ]; } },
        
        /**
         * @property    KEY_E_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_E_PRESS:    { get: function getEKeyPress()  { return _Keys[69 + _PRESS]; } },
        
        /**
         * @property    KEY_E_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_E_DOWN:     { get: function getEKeyDown()   { return _Keys[69 + _DOWN ]; } },

        
        /**
         * @property    KEY_F_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_F_UP:       { get: function getFKeyUp()     { return _Keys[70 + _UP   ]; } },
        
        /**
         * @property    KEY_F_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_F_PRESS:    { get: function getFKeyPress()  { return _Keys[70 + _PRESS]; } },
        
        /**
         * @property    KEY_F_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_F_DOWN:     { get: function getFKeyDown()   { return _Keys[70 + _DOWN ]; } },

        
        /**
         * @property    KEY_G_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_G_UP:       { get: function getGKeyUp()     { return _Keys[71 + _UP   ]; } },
        
        /**
         * @property    KEY_G_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_G_PRESS:    { get: function getGKeyPress()  { return _Keys[71 + _PRESS]; } },
        
        /**
         * @property    KEY_G_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_G_DOWN:     { get: function getGKeyDown()   { return _Keys[71 + _DOWN ]; } },

        
        /**
         * @property    KEY_H_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_H_UP:       { get: function getHKeyUp()     { return _Keys[72 + _UP   ]; } },
        
        /**
         * @property    KEY_H_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_H_PRESS:    { get: function getHKeyPress()  { return _Keys[72 + _PRESS]; } },
        
        /**
         * @property    KEY_H_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_H_DOWN:     { get: function getHKeyDown()   { return _Keys[72 + _DOWN ]; } },

        
        /**
         * @property    KEY_I_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_I_UP:       { get: function getIKeyUp()     { return _Keys[73 + _UP   ]; } },
        
        /**
         * @property    KEY_I_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_I_PRESS:    { get: function getIKeyPress()  { return _Keys[73 + _PRESS]; } },
        
        /**
         * @property    KEY_I_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_I_DOWN:     { get: function getIKeyDown()   { return _Keys[73 + _DOWN ]; } },

        
        /**
         * @property    KEY_J_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_J_UP:       { get: function getJKeyUp()     { return _Keys[74 + _UP   ]; } },
        
        /**
         * @property    KEY_J_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_J_PRESS:    { get: function getJKeyPress()  { return _Keys[74 + _PRESS]; } },
        
        /**
         * @property    KEY_J_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_J_DOWN:     { get: function getJKeyDown()   { return _Keys[74 + _DOWN ]; } },

        
        /**
         * @property    KEY_K_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_K_UP:       { get: function getKKeyUp()     { return _Keys[75 + _UP   ]; } },
        
        /**
         * @property    KEY_K_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_K_PRESS:    { get: function getKKeyPress()  { return _Keys[75 + _PRESS]; } },
        
        /**
         * @property    KEY_K_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_K_DOWN:     { get: function getKKeyDown()   { return _Keys[75 + _DOWN ]; } },

        
        /**
         * @property    KEY_L_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_L_UP:       { get: function getLKeyUp()     { return _Keys[76 + _UP   ]; } },
        
        /**
         * @property    KEY_L_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_L_PRESS:    { get: function getLKeyPress()  { return _Keys[76 + _PRESS]; } },
        
        /**
         * @property    KEY_L_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_L_DOWN:     { get: function getLKeyDown()   { return _Keys[76 + _DOWN ]; } },

        
        /**
         * @property    KEY_M_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_M_UP:       { get: function getMKeyUp()     { return _Keys[77 + _UP   ]; } },
        
        /**
         * @property    KEY_M_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_M_PRESS:    { get: function getMKeyPress()  { return _Keys[77 + _PRESS]; } },
        
        /**
         * @property    KEY_M_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_M_DOWN:     { get: function getMKeyDown()   { return _Keys[77 + _DOWN ]; } },

        
        /**
         * @property    KEY_N_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_N_UP:       { get: function getNKeyUp()     { return _Keys[78 + _UP   ]; } },
        
        /**
         * @property    KEY_N_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_N_PRESS:    { get: function getNKeyPress()  { return _Keys[78 + _PRESS]; } },
        
        /**
         * @property    KEY_N_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_N_DOWN:     { get: function getNKeyDown()   { return _Keys[78 + _DOWN ]; } },

        
        /**
         * @property    KEY_O_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_O_UP:       { get: function getOKeyUp()     { return _Keys[79 + _UP   ]; } },
        
        /**
         * @property    KEY_O_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_O_PRESS:    { get: function getOKeyPress()  { return _Keys[79 + _PRESS]; } },
        
        /**
         * @property    KEY_O_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_O_DOWN:     { get: function getOKeyDown()   { return _Keys[79 + _DOWN ]; } },

        
        /**
         * @property    KEY_P_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_P_UP:       { get: function getPKeyUp()     { return _Keys[80 + _UP   ]; } },
        
        /**
         * @property    KEY_P_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_P_PRESS:    { get: function getPKeyPress()  { return _Keys[80 + _PRESS]; } },
        
        /**
         * @property    KEY_P_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_P_DOWN:     { get: function getPKeyDown()   { return _Keys[80 + _DOWN ]; } },

        
        /**
         * @property    KEY_Q_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_Q_UP:       { get: function getQKeyUp()     { return _Keys[81 + _UP   ]; } },
        
        /**
         * @property    KEY_Q_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_Q_PRESS:    { get: function getQKeyPress()  { return _Keys[81 + _PRESS]; } },
        
        /**
         * @property    KEY_Q_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_Q_DOWN:     { get: function getQKeyDown()   { return _Keys[81 + _DOWN ]; } },

        
        /**
         * @property    KEY_R_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_R_UP:       { get: function getRKeyUp()     { return _Keys[82 + _UP   ]; } },
        
        /**
         * @property    KEY_R_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_R_PRESS:    { get: function getRKeyPress()  { return _Keys[82 + _PRESS]; } },
        
        /**
         * @property    KEY_R_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_R_DOWN:     { get: function getRKeyDown()   { return _Keys[82 + _DOWN ]; } },

        
        /**
         * @property    KEY_S_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_S_UP:       { get: function getSKeyUp()     { return _Keys[83 + _UP   ]; } },
        
        /**
         * @property    KEY_S_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_S_PRESS:    { get: function getSKeyPress()  { return _Keys[83 + _PRESS]; } },
        
        /**
         * @property    KEY_S_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_S_DOWN:     { get: function getSKeyDown()   { return _Keys[83 + _DOWN ]; } },

        
        /**
         * @property    KEY_T_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_T_UP:       { get: function getTKeyUp()     { return _Keys[84 + _UP   ]; } },
        
        /**
         * @property    KEY_T_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_T_PRESS:    { get: function getTKeyPress()  { return _Keys[84 + _PRESS]; } },
        
        /**
         * @property    KEY_T_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_T_DOWN:     { get: function getTKeyDown()   { return _Keys[84 + _DOWN ]; } },

        
        /**
         * @property    KEY_U_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_U_UP:       { get: function getUKeyUp()     { return _Keys[85 + _UP   ]; } },
        
        /**
         * @property    KEY_U_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_U_PRESS:    { get: function getUKeyPress()  { return _Keys[85 + _PRESS]; } },
        
        /**
         * @property    KEY_U_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_U_DOWN:     { get: function getUKeyDown()   { return _Keys[85 + _DOWN ]; } },

        
        /**
         * @property    KEY_V_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_V_UP:       { get: function getVKeyUp()     { return _Keys[86 + _UP   ]; } },
        
        /**
         * @property    KEY_V_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_V_PRESS:    { get: function getVKeyPress()  { return _Keys[86 + _PRESS]; } },
        
        /**
         * @property    KEY_V_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_V_DOWN:     { get: function getVKeyDown()   { return _Keys[86 + _DOWN ]; } },

        
        /**
         * @property    KEY_W_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_W_UP:       { get: function getWKeyUp()     { return _Keys[87 + _UP   ]; } },
        
        /**
         * @property    KEY_W_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_W_PRESS:    { get: function getWKeyPress()  { return _Keys[87 + _PRESS]; } },
        
        /**
         * @property    KEY_W_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_W_DOWN:     { get: function getWKeyDown()   { return _Keys[87 + _DOWN ]; } },

        
        /**
         * @property    KEY_X_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_X_UP:       { get: function getXKeyUp()     { return _Keys[88 + _UP   ]; } },
        
        /**
         * @property    KEY_X_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_X_PRESS:    { get: function getXKeyPress()  { return _Keys[88 + _PRESS]; } },
        
        /**
         * @property    KEY_X_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_X_DOWN:     { get: function getXKeyDown()   { return _Keys[88 + _DOWN ]; } },

        
        /**
         * @property    KEY_Y_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_Y_UP:       { get: function getYKeyUp()     { return _Keys[89 + _UP   ]; } },
        
        /**
         * @property    KEY_Y_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_Y_PRESS:    { get: function getYKeyPress()  { return _Keys[89 + _PRESS]; } },
        
        /**
         * @property    KEY_Y_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_Y_DOWN:     { get: function getYKeyDown()   { return _Keys[89 + _DOWN ]; } },

        
        /**
         * @property    KEY_Z_UP: {Boolean} [read]
         * @description Some description
         */
        KEY_Z_UP:       { get: function getZKeyUp()     { return _Keys[90 + _UP   ]; } },
        
        /**
         * @property    KEY_Z_PRESS: {Boolean} [read]
         * @description Some description
         */
        KEY_Z_PRESS:    { get: function getZKeyPress()  { return _Keys[90 + _PRESS]; } },
        
        /**
         * @property    KEY_Z_DOWN: {Boolean} [read]
         * @description Some description
         */
        KEY_Z_DOWN:     { get: function getZKeyDown()   { return _Keys[90 + _DOWN ]; } },

        InputUpdate:
        {
            value: function InputUpdate()
            {
                for (var i = _PRESS; i < _DOWN; ++i)
                    if (_Keys[i])
                        _Keys[i] = false;
            }
        }
    });
}


var __LIGHT__ = new Array(12);

/**
 * @name        Light
 * @module      FWGE.Game
 * @description This module is used to create the lights in the scene.
 */
function Light()
{
    var _AmbientCount     = 0;
    var _DirectionalCount = 0;
    var _PointCount       = 0;
    
    var _MAX_AMBIENT      = 1;
    var _MAX_DIRECTIONAL  = 3;
    var _MAX_POINT        = 8;

    Object.defineProperties(this,
    {
        /**
         * @function    Ambient: {AmbientLight}
         * @description Returns a new ambient light object. There is only one ambient
         *              light object in a scene.
         * @see         FWGE.Game.Light.AmbientLight
         * @param       request:        {Object}
         *              > parent:       {GameObject}    [null]
         *              > colour:       {Float32Array}  [null]
         *              > intensity:    {Number}        [null]
         */
        Ambient:
        {
            value: function Ambient(request)
            {
                if (_AmbientCount < _MAX_AMBIENT)
                {
                    __LIGHT__[0] = new AmbientLight(request);
                    __LIGHT__[0].GameObject = request.parent instanceof GameObject ? request.parent : FWGE.Game.GameObject();
                    __LIGHT__[0].GameObject.LightItem = __LIGHT__[0];
                    
                    _AmbientCount++;
                    return __LIGHT__[0];
                }

                return undefined;
            }
        },

        /**
         * @function    Directional: {DirectionalLight}
         * @description Returns a new directional light object. There can up to three
         *              directional light objects in a scene.
         * @see         FWGE.Game.Light.DirectionalLight
         * @param       request:         {Object}
         *              > parent:        {GameObject}    [null]
         *              > colour:        {Float32Array}  [null]
         *              > intensity:     {Number}        [null]
         *              > direction:     {Float32Array}  [null]
         */
        Directional:
        {
            value: function Directional(request)
            {
                if (_DirectionalCount < _MAX_DIRECTIONAL)
                {
                    for (var i = 1; i < 4; ++i)
                    {
                        if (__LIGHT__[i] === undefined)
                        {
                            __LIGHT__[i] = new DirectionalLight(request);
                            __LIGHT__[i].GameObject = request.parent instanceof GameObject ? request.parent : FWGE.Game.GameObject();
                            __LIGHT__[i].GameObject.LightItem = __LIGHT__[i];

                            _DirectionalCount++;
                            return __LIGHT__[i];        
                        }
                    }
                }

                return undefined;
            }
        },

        /**
         * @function    Point: {PointLight}
         * @description Returns a new point light object. There can up to eight
         *              point light objects in a scene.
         * @see         FWGE.Game.Light.PointLight
         * @param       request:        {Object}
         *              > parent:       {GameObject}    [null]
         *              > colour:       {Float32Array}  [null]
         *              > intensity:    {Number}        [null]
         *              > radius:       {Number}        [null]
         *              > angle:        {Number}        [null]
         */
        Point:
        {
            value: function Point(request)
            {
                if (_PointCount < _MAX_DIRECTIONAL)
                {
                    for (var i = 4; i < 12; ++i)
                    {
                        if (__LIGHT__[i] === undefined)
                        {
                            __LIGHT__[i] = new PointLight(request);
                            __LIGHT__[i].GameObject = request.parent instanceof GameObject ? request.parent : FWGE.Game.GameObject();
                            __LIGHT__[i].GameObject.LightItem = __LIGHT__[i];

                            _PointCount++;
                            return __LIGHT__[i];        
                        }
                    }
                }

                return undefined;
            }
        },

        /**
         * @function    Remove: void
         * @description Removes a given light object from the scene.
         * @param       light: {LightItem}
         */
        Remove:
        {
            value: function Remove(light)
            {
                if (!!light)
                {
                    switch (light.Type[0])
                    {
                        case "AMBIENTLIGHT":
                            __LIGHT__[0] = undefined;
                            --_AmbientCount;
                        break;

                        case "DIRECTIONALLIGHT":
                            for (var i = 1; i < 4; ++i)
                            {
                                if (__LIGHT__[i] === light)
                                {
                                    __LIGHT__[i] = undefined;
                                    --_DirectionalCount;
                                    break;
                                }
                            }
                        break;

                        case "POINTLIGHT":
                            for (var i = 4; i < 12; ++i)
                            {
                                if (__LIGHT__[i] === light)
                                {
                                    __LIGHT__[i] = undefined;
                                    --_PointCount;
                                    break;
                                }
                            }
                        break;
                    }
                }
            }
        }
    });
}


/**
 * @name        LightItem
 * @description Base definition of an object that illuminates the scene.
 */
function LightItem(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "LIGHTITEM ";
    
    GameItem.call(this, request);

    var _Colour = FWGE.Render.Colour.Create(request.colour instanceof Float32Array ? request.colour : new Float32Array(3));
    var _Intensity = typeof request.intensity === 'number' ? request.intensity : 1.0;

    Object.defineProperties(this,
    {
        /**
         * @property    Colour: {Float32Array} [read|write]
         * @description Descrbies the colour that the light object emits.
         */
        Colour:
        {
            get: function getColour() { return _Colour; },
            set: function setColour()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Game.Maths.Vector3.Set(_Colour, arguments[0]);
            }
        },

        /**
         * @property    Intensity:  {Number} [read|write]s
         * @description Descrbies the intensity at which the light object emits.
         *              This ranges between: [0, 1].
         */
        Intensity:
        {
            get: function getIntensity() { return _Intensity; },
            set: function setIntensity()
            {
                if (typeof arguments[0] === 'number')
                    _Intensity = Math.clamp(arguments[0], 0, 1);
            }
        }
    });
}


/**
 * @name        AmbientLight
 * @module      FWGE.Game.Light
 * @description This type of light is used to light the scene evenely
 *				in one colour.
 */
function AmbientLight(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "AMBIENTLIGHT ";

    LightItem.call(this, request);
}


/**
 * @name        DirectionalLight
 * @module      FWGE.Game.Light
 * @description Definition of a light that shines in a given direction.
 */
function DirectionalLight(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "DIRECTIONALLIGHT ";
    
    LightItem.call(this, request);

    var _Direction = (request.direction instanceof Float32Array && request.direction.length === 3) ? request.direction : new Float32Array(3);

    Object.defineProperties(this,
    {
        /**
         * @property    Direction: {Float32Array} [read|write]
         * @description Returns the direction the light is pointing in.
         */
        Direction:
        {
            get: function getDirection() { return _Direction; },
            set: function setDirection()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Game.Maths.Vector3.Set(_Direction, arguments[0]);
            }
        }
    });
}


/**
 * @name        PointLight
 * @description Defines a light Object that emits from a given point within a radius.
 * @module      FWGE.Game.Light
 */
function PointLight(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "POINTLIGHT ";
    
    LightItem.call(this, request);
    
    var _Radius = typeof request.radius === 'number' ? request.radius : 5;
    var _Angle = typeof request.angle  === 'number' ? request.angle : 180;
    
    Object.defineProperties(this, 
    {
        /**
         * @property    Radius: {Number} [read|write]
         * @description The range the light will illuminate 
         */
        Radius:
        {
            get: function getRadius() { return _Radius; },
            set: function setRadius()
            {
                if (typeof arguments[0] === 'number')
                    _Radius = arguments[0];
            }
        },
        
        /**
         * @property    Angle: {Number} [read|write]
         * @description The angle the light will illuminate.
         *              35 would be a spotlight while 180 would be a globe.
         */
        Angle:
        {
            get: function getAngle() { return _Angle; },
            set: function setAngle()
            {
                if (typeof arguments[0] === 'number')
                    _Angle = Math.clamp(arguments[0], 0, 180);
            }
        }
    });
}


/**
 * @name Maths
 * @description This module contains the methods required for matrix and vector
 *              operations.
 * @module      FWGE.Game
 */
function Maths()
{
    Object.defineProperties(this,
    {
        /**
         * @property    Matrix2: {Matrix2} [read]
         * @description Operations for 2x2 matrices.
         * @see         FWGE.Maths.Matrix2
         */
        Matrix2:      { value: new Matrix2() },
        
        /**
         * @property    Matrix3: {Matrix3} [read]
         * @description Operations for 3x3 matrices.
         * @see         FWGE.Maths.Matrix3
         */
        Matrix3:      { value: new Matrix3() },
        
        /**
         * @property    Matrix4: {Matrix4} [read]
         * @description Operations for 4x4 matrices.
         * @see         FWGE.Maths.Matrix4
         */
        Matrix4:      { value: new Matrix4() },
        
        /**
         * @property    Vector2: {Vector2} [read]
         * @description Operations for 2 component veectors.
         * @see         FWGE.Maths.Vector2
         */
        Vector2:      { value: new Vector2() },
        
        /**
         * @property    Vector3: {Vector3} [read]
         * @description Operations for 3 component veectors.
         * @see         FWGE.Maths.Vector3
         */
        Vector3:      { value: new Vector3() },
        
        /**
         * @property    Vector4: {Vector4} [read]
         * @description Operations for 4 component veectors.
         * @see         FWGE.Maths.Vector4
         */
        Vector4:      { value: new Vector4() },
        
        /**
         * @property    Quaternion: {Quaternion} [read]
         * @description Operations for 4 component quaternions.
         * @see         FWGE.Maths.Quaternion
         */
        Quaternion:   { value: new Quaternion() }
    });
};


/**
 * @name        Matrix2
 * @description This library contains the methods for 2x2 matrix operations.
 *              2x2 matrices are represented as a Float32Array of length 4.
 * @module      FWGE.Game.Maths 
 */
function Matrix2()
{    
    Object.defineProperties(this,
    {
        /**
         * @function    Create: {Float32Array}
         * @param       array:  {Float32Array}  [null, override: 1]
         * @param       m11:    {Number}        [null, override: 2]
         * @param       m12:    {Number}        [null, override: 2]
         * @param       m21:    {Number}        [null, override: 2]
         * @param       m22:    {Number}        [null, override: 2]
         * @description Creates an new Float32Array with the Type set to "MATRIX2".
         *              It also has the appropriate value indexers:
         *              M11, M12,
         *              M21, M22
         */
        Create:
        {
            value: function Create()
            {                    
                var $ = new Float32Array(4);
                
                $[0] = typeof arguments[0] === 'number' ? arguments[0] : arguments[0] instanceof Array && typeof arguments[0][0] === 'number' ? arguments[0][0] : 0;
                $[1] = typeof arguments[1] === 'number' ? arguments[1] : arguments[0] instanceof Array && typeof arguments[0][1] === 'number' ? arguments[0][1] : 0;
                $[2] = typeof arguments[2] === 'number' ? arguments[2] : arguments[0] instanceof Array && typeof arguments[0][2] === 'number' ? arguments[0][2] : 0;
                $[3] = typeof arguments[3] === 'number' ? arguments[3] : arguments[0] instanceof Array && typeof arguments[0][3] === 'number' ? arguments[0][3] : 0;
                
                Object.defineProperties($,
                {
                    Type: { value: "MATRIX2" },
                    M11:
                    {
                        get: function getM11(){ return $[0]; },
                        set: function setM11(){ if (typeof arguments[0] === 'number') $[0] = arguments[0]; }
                    },
                    M12: 
                    {
                        get: function getM12(){ return $[1]; },
                        set: function setM12(){ if (typeof arguments[0] === 'number') $[1] = arguments[0]; }
                    },
                    M21:
                    {
                        get: function getM21(){ return $[2]; },
                        set: function setM21(){ if (typeof arguments[0] === 'number') $[2] = arguments[0]; }
                    },
                    M22: 
                    {
                        get: function getM22(){ return $[3]; },
                        set: function setM22(){ if (typeof arguments[0] === 'number') $[3] = arguments[0]; }
                    }
                });
                
                return $;
            }
        },
        
        /**
         * @function    Set:    {Float32Array}
         * @param       array1: {Float32Array}  [override: 1]
         * @param       array2: {Float32Array}  [override: 1]
         * @param       array:  {Float32Array}  [override: 2]
         * @param       m11:    {Number}        [override: 2]
         * @param       m12:    {Number}        [override: 2]
         * @param       m21:    {Number}        [override: 2]
         * @param       m22:    {Number}        [override: 2]
         * @description Assigns new to the a given Float32Array.
         */
        Set:
        {
            value: function Set()
            {         
                var $, a, b, c, d;

                $ = arguments[0];
                if (arguments[1] instanceof Float32Array && arguments[0].length === 4)
                {
                    a = arguments[1][0]; b = arguments[1][1];
                    c = arguments[1][2]; d = arguments[1][3];
                }
                else
                {
                    a = arguments[1]; b = arguments[2];
                    c = arguments[3]; d = arguments[4];
                }
                
                if ($ instanceof Float32Array && arguments[0].length === 4 && typeof a === 'number' && typeof b === 'number' && typeof c === 'number' && typeof d === 'number')
                {
                    $[0] = a; $[1] = b;
                    $[2] = c; $[3] = d;

                    return $;
                }
            }
        },
        
        /**
         * @function    Transpose:  {Float32Array}
         * @param       array:      {Float32Array}
         * @description Transposes a matrix.
         */
        Transpose:
        {
            value: function Transpose()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4)
                    return this.Set(arguments[0],
                                    arguments[0][0], arguments[0][2],
                                    arguments[0][1], arguments[0][3]);
            }
        },
        
        /**
         * @function    Identity:   {Float32Array}
         * @param       array:      {Float32Array}
         * @description If given a Float32Array, it resets it to an identity matrix.
         *              If not, it simply returns a new identity matrix.
         */
        Identity:
        {
            value: function Identiy()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4)
                    return this.Set(arguments[0],
                                    1, 0,
                                    0, 1);
                else
                    return this.Create(1, 0,
                                       0, 1);
            }
        },
        
        /**
         * @function    Determinant:    {Number}
         * @param       array:          {Float32Array}
         * @description Calculates the determinant of a given Float32Array.
         */
        Determinant:
        {
            value: function Determinant()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4)
                    return arguments[0][0] * arguments[0][3] - arguments[0][2] * arguments[0][1];
            }
        },
        
        /**
         * @function    Inverse:    {Float32Array}
         * @param       array:      {Float32Array}
         * @description Inverts a given Float32Array when possible i.e. the determinant
         *              is not 0.
         */
        Inverse:
        {
            value: function Inverse()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4)
                {
                    var det = this.Determinant(arguments[0]);
                    if (det !== 0)
                        return this.Set( arguments[0],
                                         arguments[0][3] / det, -arguments[0][1] / det,
                                        -arguments[0][2] / det,  arguments[0][0] / det);
                    else
                        return arguments[0];
                }
            }
        },
        
        /**
         * @function    Sum:        {Float32Array}
         * @param       array1:     {Float32Array}
         * @param       array2:     {Float32Array}
         * @description Adds two Float32Array component-wise.
         */
        Sum:
        {
            value: function Sum()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4 && arguments[1] instanceof Float32Array && arguments[1].length === 4)
                    return this.Set(arguments[0],
                                    arguments[0][0] + arguments[1][0], arguments[0][1] + arguments[1][1],
                                    arguments[0][2] + arguments[1][2], arguments[0][3] + arguments[1][3]);
            }
        },
        
        /**
         * @function    Mult:       {Float32Array}
         * @param       array1:     {Float32Array}  [override 1]
         * @param       array2:     {Float32Array}  [override 1]
         * @param       array:      {Float32Array}  [override 2]
         * @param       constant:   {Number}        [override 2]
         * @description Performs a matrix multiplication on two Float32Array or
         *              multiply a Float32Array with a scalar value.
         */
        Mult:
        {
            value: function Mult()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4)
                {
                    if (arguments[1] instanceof Float32Array && arguments[1].length === 4)
                    {
                        return this.Set
                        (
                            arguments[0],
                            arguments[0][0] * arguments[1][0] + arguments[0][1] * arguments[1][2],
                            arguments[0][0] * arguments[1][1] + arguments[0][1] * arguments[1][3],
                            
                            arguments[0][2] * arguments[1][0] + arguments[0][3] * arguments[1][2],
                            arguments[0][2] * arguments[1][1] + arguments[0][3] * arguments[1][3]
                        ); 
                    }
                    else if (typeof arguments[1] === 'number')
                    {
                        return this.Set(arguments[0],
                                        arguments[0][0] * arguments[1], arguments[0][1] * arguments[1],
                                        arguments[0][2] * arguments[1], arguments[0][3] * arguments[1]);
                    }
                }
            }
        },
        
        /**
         * @function    RevMult:    {Float32Array}
         * @param       array1:     {Float32Array}
         * @param       array2:     {Float32Array}
         * @description Performs a matrix multiplication on two Float32Array but
         *              assigns the result to the second Float32Array.
         */
        RevMult:
        {
            value: function RevMult()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4 && arguments[1] instanceof Float32Array && arguments[1].length === 4)
                {
                    return this.Set
                    (
                        arguments[0],
                        arguments[1][0] * arguments[0][0] + arguments[1][1] * arguments[0][2],
                        arguments[1][0] * arguments[0][1] + arguments[1][1] * arguments[0][3],
                        
                        arguments[1][2] * arguments[0][0] + arguments[1][3] * arguments[0][2],
                        arguments[1][2] * arguments[0][1] + arguments[1][3] * arguments[0][3]
                    ); 
                }                
            }
        } 
    });
}


/**
 * @name Matrix3
 * @description This library contains the methods for 3x3 matrix operations.
 *              3x3 matrices are represented as a Float32Array of length 9.
 * @module      FWGE.Game.Maths 
 */
function Matrix3()
{    
    Object.defineProperties(this,
    {
        /**
         * @function    Create: {Float32Array}
         * @param       array:  {Float32Array}  [null, override: 1]
         * @param       m11:    {Number}        [null, override: 2]
         * @param       m12:    {Number}        [null, override: 2]
         * @param       m13:    {Number}        [null, override: 2]
         * @param       m21:    {Number}        [null, override: 2]
         * @param       m22:    {Number}        [null, override: 2]
         * @param       m23:    {Number}        [null, override: 2]
         * @param       m31:    {Number}        [null, override: 2]
         * @param       m32:    {Number}        [null, override: 2]
         * @param       m33:    {Number}        [null, override: 2]
         * @description Creates an new Float32Array with the Type set to "MATRIX3".
         *              It also has the appropriate value indexers:
         *              M11, M12, M13
         *              M21, M22, M23,
         *              M31, M32, M33
         */
        Create:
        {
            value: function Create()
            {                    
                var $ = new Float32Array(9);
                
                $[0] = typeof arguments[0] === 'number' ? arguments[0] : arguments[0] instanceof Array && typeof arguments[0][0] === 'number' ? arguments[0][0] : 0;
                $[1] = typeof arguments[1] === 'number' ? arguments[1] : arguments[0] instanceof Array && typeof arguments[0][1] === 'number' ? arguments[0][1] : 0;
                $[2] = typeof arguments[2] === 'number' ? arguments[2] : arguments[0] instanceof Array && typeof arguments[0][2] === 'number' ? arguments[0][2] : 0;
                $[3] = typeof arguments[3] === 'number' ? arguments[3] : arguments[0] instanceof Array && typeof arguments[0][3] === 'number' ? arguments[0][3] : 0;
                $[4] = typeof arguments[4] === 'number' ? arguments[4] : arguments[0] instanceof Array && typeof arguments[0][4] === 'number' ? arguments[0][4] : 0;
                $[5] = typeof arguments[5] === 'number' ? arguments[5] : arguments[0] instanceof Array && typeof arguments[0][5] === 'number' ? arguments[0][5] : 0;
                $[6] = typeof arguments[6] === 'number' ? arguments[6] : arguments[0] instanceof Array && typeof arguments[0][6] === 'number' ? arguments[0][6] : 0;
                $[7] = typeof arguments[7] === 'number' ? arguments[7] : arguments[0] instanceof Array && typeof arguments[0][7] === 'number' ? arguments[0][7] : 0;
                $[8] = typeof arguments[8] === 'number' ? arguments[8] : arguments[0] instanceof Array && typeof arguments[0][8] === 'number' ? arguments[0][8] : 0;
                
                Object.defineProperties($,
                {
                    Type: { value: "MATRIX3" },
                    M11:
                    {
                        get: function getM11(){ return $[0]; },
                        set: function setM11(){ if (typeof arguments[0] === 'number') $[0] = arguments[0]; }
                    },
                    M12: 
                    {
                        get: function getM12(){ return $[1]; },
                        set: function setM12(){ if (typeof arguments[0] === 'number') $[1] = arguments[0]; }
                    },
                    M13:
                    {
                        get: function getM13(){ return $[2]; },
                        set: function setM13(){ if (typeof arguments[0] === 'number') $[2] = arguments[0]; }
                    },
                    M21: 
                    {
                        get: function getM21(){ return $[3]; },
                        set: function setM21(){ if (typeof arguments[0] === 'number') $[3] = arguments[0]; }
                    },
                    M22:
                    {
                        get: function getM22(){ return $[4]; },
                        set: function setM22(){ if (typeof arguments[0] === 'number') $[4] = arguments[0]; }
                    },
                    M23: 
                    {
                        get: function getM23(){ return $[5]; },
                        set: function setM23(){ if (typeof arguments[0] === 'number') $[5] = arguments[0]; }
                    },
                    M31:
                    {
                        get: function getM31(){ return $[6]; },
                        set: function setM31(){ if (typeof arguments[0] === 'number') $[6] = arguments[0]; }
                    },
                    M32: 
                    {
                        get: function getM32(){ return $[7]; },
                        set: function setM32(){ if (typeof arguments[0] === 'number') $[7] = arguments[0]; }
                    },
                    M33: 
                    {
                        get: function getM33(){ return $[8]; },
                        set: function setM33(){ if (typeof arguments[0] === 'number') $[8] = arguments[0]; }
                    }
                });
                
                return $;
            }
        },
        
        /**
         * @function    Set:    {Float32Array}
         * @param       array1: {Float32Array}  [override: 1]
         * @param       array2: {Float32Array}  [override: 1]
         * @param       array:  {Float32Array}  [override: 2]
         * @param       m11:    {Number}        [override: 2]
         * @param       m12:    {Number}        [override: 2]
         * @param       m13:    {Number}        [override: 2]
         * @param       m21:    {Number}        [override: 2]
         * @param       m22:    {Number}        [override: 2]
         * @param       m23:    {Number}        [override: 2]
         * @param       m31:    {Number}        [override: 2]
         * @param       m32:    {Number}        [override: 2]
         * @param       m33:    {Number}        [override: 2]
         * @description Assigns new to the a given Float32Array.
         */
        Set:
        {
            value: function Set()
            {         
                var $, a, b, c, d, e, f, g, h, i;

                $ = arguments[0];
                if (arguments[1] instanceof Float32Array && arguments[0].length === 9)
                {
                    a = arguments[1][0]; b = arguments[1][1]; c = arguments[1][2];
                    d = arguments[1][3]; e = arguments[1][4]; f = arguments[1][5];
                    g = arguments[1][6]; h = arguments[1][7]; i = arguments[1][8];
                }
                else
                {
                    a = arguments[1]; b = arguments[2]; c = arguments[3];
                    d = arguments[4]; e = arguments[5]; f = arguments[6];
                    g = arguments[7]; h = arguments[8]; i = arguments[9];
                }
                
                if ($ instanceof Float32Array && arguments[0].length === 9 && typeof a === 'number' && typeof b === 'number' && typeof c === 'number' && typeof d === 'number' && typeof e === 'number' && typeof f === 'number' && typeof g === 'number' && typeof h === 'number' && typeof i === 'number')
                {
                    $[0] = a; $[1] = b; $[2] = c;                        
                    $[3] = d; $[4] = e; $[5] = f;                        
                    $[6] = g; $[7] = h; $[8] = i;

                    return $;
                }                  
            }
        },
        
        /**
         * @function    Transpose:  {Float32Array}
         * @param       array:      {Float32Array}
         * @description Transposes a matrix.
         */
        Transpose:
        {
            value: function Transpose()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9)
                    return this.Set(arguments[0],
                                    arguments[0][0], arguments[0][3], arguments[0][6],
                                    arguments[0][1], arguments[0][4], arguments[0][7],
                                    arguments[0][2], arguments[0][5], arguments[0][8]);
            }
        },
        
        /**
         * @function    Identity:   {Float32Array}
         * @param       array:      {Float32Array}
         * @description If given a Float32Array, it resets it to an identity matrix.
         *              If not, it simply returns a new identity matrix.
         */
        Identity:
        {
            value: function Identiy()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9)
                    return this.Set(arguments[0],
                                    1, 0, 0,
                                    0, 1, 0,
                                    0, 0, 1);
                else
                    return this.Create(1, 0, 0,
                                       0, 1, 0,
                                       0, 0, 1);
            }
        },
        
        /**
         * @function    Determinant:    {Number}
         * @param       array:          {Float32Array}
         * @description Calculates the determinant of a given Float32Array.
         */
        Determinant:
        {
            value: function Determinant()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9)
                    return arguments[0][0] * (arguments[0][4] * arguments[0][8] - arguments[0][5] * arguments[0][7]) -
                            arguments[0][1] * (arguments[0][3] * arguments[0][8] - arguments[0][5] * arguments[0][6]) + 
                            arguments[0][2] * (arguments[0][3] * arguments[0][7] - arguments[0][4] * arguments[0][6]);
            }
        },
        
        /**
         * @function    Inverse:    {Float32Array}
         * @param       array:      {Float32Array}
         * @description Inverts a given Float32Array when possible i.e. the determinant
         *              is not 0.
         */
        Inverse:
        {
            value: function Inverse()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9)
                {
                    var det = this.Determinant(arguments[0]);
                    if (det !== 0)
                        return this.Set(arguments[0],
                                         (arguments[0][4] * arguments[0][8] - arguments[0][7] * arguments[0][5]) / det,
                                        -(arguments[0][1] * arguments[0][8] - arguments[0][7] * arguments[0][2]) / det,
                                         (arguments[0][1] * arguments[0][5] - arguments[0][4] * arguments[0][2]) / det,
                                        
                                        -(arguments[0][3] * arguments[0][8] - arguments[0][6] * arguments[0][5]) / det,
                                         (arguments[0][0] * arguments[0][8] - arguments[0][6] * arguments[0][2]) / det,
                                        -(arguments[0][0] * arguments[0][5] - arguments[0][3] * arguments[0][2]) / det,
                                        
                                         (arguments[0][3] * arguments[0][7] - arguments[0][6] * arguments[0][4]) / det,
                                        -(arguments[0][0] * arguments[0][7] - arguments[0][6] * arguments[0][1]) / det,
                                         (arguments[0][0] * arguments[0][4] - arguments[0][3] * arguments[0][1]) / det);
                    else
                        return arguments[0];
                }
            }
        },
        
        /**
         * @function    Sum:        {Float32Array}
         * @param       array1:     {Float32Array}
         * @param       array2:     {Float32Array}
         * @description Adds two Float32Array component-wise.
         */
        Sum:
        {
            value: function Sum()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9 && arguments[1] instanceof Float32Array && arguments[1].length === 9)
                    return this.Set(arguments[0],
                                    arguments[0][0] + arguments[1][0], arguments[0][1] + arguments[1][1], arguments[0][2] + arguments[1][2],
                                    arguments[0][3] + arguments[1][3], arguments[0][4] + arguments[1][4], arguments[0][5] + arguments[1][5],
                                    arguments[0][6] + arguments[1][6], arguments[0][7] + arguments[1][7], arguments[0][8] + arguments[1][8]);
            }
        },
        
        /**
         * @function    Mult:       {Float32Array}
         * @param       array1:     {Float32Array}  [override 1]
         * @param       array2:     {Float32Array}  [override 1]
         * @param       array:      {Float32Array}  [override 2]
         * @param       constant:   {Number}        [override 2]
         * @description Performs a matrix multiplication on two Float32Array or
         *              multiply a Float32Array with a scalar value.
         */
        Mult:
        {
            value: function Mult()
            {
                
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9)
                {
                    if (arguments[1] instanceof Float32Array && arguments[1].length === 9)
                    {
                        return this.Set
                        (
                            arguments[0],
                            arguments[0][0] * arguments[1][0] + arguments[0][1] * arguments[1][3] + arguments[0][2] * arguments[1][6],
                            arguments[0][0] * arguments[1][1] + arguments[0][1] * arguments[1][4] + arguments[0][2] * arguments[1][7],
                            arguments[0][0] * arguments[1][2] + arguments[0][1] * arguments[1][5] + arguments[0][2] * arguments[1][8],
                            
                            arguments[0][3] * arguments[1][0] + arguments[0][4] * arguments[1][3] + arguments[0][5] * arguments[1][6],
                            arguments[0][3] * arguments[1][1] + arguments[0][4] * arguments[1][4] + arguments[0][5] * arguments[1][7],
                            arguments[0][3] * arguments[1][2] + arguments[0][4] * arguments[1][5] + arguments[0][5] * arguments[1][8],
                            
                            arguments[0][6] * arguments[1][0] + arguments[0][7] * arguments[1][3] + arguments[0][8] * arguments[1][6],
                            arguments[0][6] * arguments[1][1] + arguments[0][7] * arguments[1][4] + arguments[0][8] * arguments[1][7],
                            arguments[0][6] * arguments[1][2] + arguments[0][7] * arguments[1][5] + arguments[0][8] * arguments[1][8]
                        ); 
                    }
                    else if (typeof arguments[1] === 'number')
                    {
                        return this.Set(arguments[0],
                                        arguments[0][0] * arguments[1], arguments[0][1] * arguments[1], arguments[0][2] * arguments[1],
                                        arguments[0][3] * arguments[1], arguments[0][4] * arguments[1], arguments[0][5] * arguments[1],
                                        arguments[0][6] * arguments[1], arguments[0][7] * arguments[1], arguments[0][8] * arguments[1]);
                    }
                }
            }
        },
        
        /**
         * @function    RevMult:    {Float32Array}
         * @param       array1:     {Float32Array}
         * @param       array2:     {Float32Array}
         * @description Performs a matrix multiplication on two Float32Array but
         *              assigns the result to the second Float32Array.
         */
        RevMult:
        {
            value: function RevMult()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9 && arguments[1] instanceof Float32Array && arguments[1].length === 9)
                {
                    return this.Set
                    (
                        arguments[1],
                        arguments[0][0] * arguments[1][0] + arguments[0][1] * arguments[1][3] + arguments[0][2] * arguments[1][6],
                        arguments[0][0] * arguments[1][1] + arguments[0][1] * arguments[1][4] + arguments[0][2] * arguments[1][7],
                        arguments[0][0] * arguments[1][2] + arguments[0][1] * arguments[1][5] + arguments[0][2] * arguments[1][8],
                        
                        arguments[0][3] * arguments[1][0] + arguments[0][4] * arguments[1][3] + arguments[0][5] * arguments[1][6],
                        arguments[0][3] * arguments[1][1] + arguments[0][4] * arguments[1][4] + arguments[0][5] * arguments[1][7],
                        arguments[0][3] * arguments[1][2] + arguments[0][4] * arguments[1][5] + arguments[0][5] * arguments[1][8],
                        
                        arguments[0][6] * arguments[1][0] + arguments[0][7] * arguments[1][3] + arguments[0][8] * arguments[1][6],
                        arguments[0][6] * arguments[1][1] + arguments[0][7] * arguments[1][4] + arguments[0][8] * arguments[1][7],
                        arguments[0][6] * arguments[1][2] + arguments[0][7] * arguments[1][5] + arguments[0][8] * arguments[1][8]
                    );
                }                
            }
        } 
    });
}


/**
 * @name        Matrix4
 * @description This library contains the methods for 2x2 matrix operations.
 *              4x4 matrices are represented as a Float32Array of length 16.
 * @module      FWGE.Game.Maths 
 */
function Matrix4()
{
    Object.defineProperties(this,
    {
        /**
         * @function    Create: {Float32Array}
         * @param       array:  {Float32Array}  [null, override: 1]
         * @param       m11:    {Number}        [null, override: 2]
         * @param       m12:    {Number}        [null, override: 2]
         * @param       m13:    {Number}        [null, override: 2]
         * @param       m14:    {Number}        [null, override: 2]
         * @param       m21:    {Number}        [null, override: 2]
         * @param       m22:    {Number}        [null, override: 2]
         * @param       m23:    {Number}        [null, override: 2]
         * @param       m24:    {Number}        [null, override: 2]
         * @param       m31:    {Number}        [null, override: 2]
         * @param       m32:    {Number}        [null, override: 2]
         * @param       m33:    {Number}        [null, override: 2]
         * @param       m34:    {Number}        [null, override: 2]
         * @param       m41:    {Number}        [null, override: 2]
         * @param       m42:    {Number}        [null, override: 2]
         * @param       m43:    {Number}        [null, override: 2]
         * @param       m44:    {Number}        [null, override: 2]
         * @description Creates an new Float32Array with the Type set to "MATRIX4".
         *              It also has the appropriate value indexers:
         *              M11, M12,
         *              M21, M22
         */
        Create:
        {
            value: function Create()
            {                    
                var $ = new Float32Array(16);
                
                $[0] = typeof arguments[0] === 'number' ? arguments[0] : arguments[0] instanceof Array && typeof arguments[0][0] === 'number' ? arguments[0][0] : 0;
                $[1] = typeof arguments[1] === 'number' ? arguments[1] : arguments[0] instanceof Array && typeof arguments[0][1] === 'number' ? arguments[0][1] : 0;
                $[2] = typeof arguments[2] === 'number' ? arguments[2] : arguments[0] instanceof Array && typeof arguments[0][2] === 'number' ? arguments[0][2] : 0;
                $[3] = typeof arguments[3] === 'number' ? arguments[3] : arguments[0] instanceof Array && typeof arguments[0][3] === 'number' ? arguments[0][3] : 0;
                $[4] = typeof arguments[4] === 'number' ? arguments[4] : arguments[0] instanceof Array && typeof arguments[0][4] === 'number' ? arguments[0][4] : 0;
                $[5] = typeof arguments[5] === 'number' ? arguments[5] : arguments[0] instanceof Array && typeof arguments[0][5] === 'number' ? arguments[0][5] : 0;
                $[6] = typeof arguments[6] === 'number' ? arguments[6] : arguments[0] instanceof Array && typeof arguments[0][6] === 'number' ? arguments[0][6] : 0;
                $[7] = typeof arguments[7] === 'number' ? arguments[7] : arguments[0] instanceof Array && typeof arguments[0][7] === 'number' ? arguments[0][7] : 0;
                $[8] = typeof arguments[8] === 'number' ? arguments[8] : arguments[0] instanceof Array && typeof arguments[0][8] === 'number' ? arguments[0][8] : 0;
                $[9] = typeof arguments[9] === 'number' ? arguments[9] : arguments[0] instanceof Array && typeof arguments[0][9] === 'number' ? arguments[0][9] : 0;
                $[10] = typeof arguments[10] === 'number' ? arguments[10] : arguments[0] instanceof Array && typeof arguments[0][10] === 'number' ? arguments[0][10] : 0;
                $[11] = typeof arguments[11] === 'number' ? arguments[11] : arguments[0] instanceof Array && typeof arguments[0][11] === 'number' ? arguments[0][11] : 0;
                $[12] = typeof arguments[12] === 'number' ? arguments[12] : arguments[0] instanceof Array && typeof arguments[0][12] === 'number' ? arguments[0][12] : 0;
                $[13] = typeof arguments[13] === 'number' ? arguments[13] : arguments[0] instanceof Array && typeof arguments[0][13] === 'number' ? arguments[0][13] : 0;
                $[14] = typeof arguments[14] === 'number' ? arguments[14] : arguments[0] instanceof Array && typeof arguments[0][14] === 'number' ? arguments[0][14] : 0;
                $[15] = typeof arguments[15] === 'number' ? arguments[15] : arguments[0] instanceof Array && typeof arguments[0][15] === 'number' ? arguments[0][15] : 0;
                
                Object.defineProperties($,
                {
                    Type: { value: "MATRIX4" },
                    M11:
                    {
                        get: function getM11(){ return $[0]; },
                        set: function setM11(){ if (typeof arguments[0] === 'number') $[0] = arguments[0]; }
                    },
                    M12: 
                    {
                        get: function getM12(){ return $[1]; },
                        set: function setM12(){ if (typeof arguments[0] === 'number') $[1] = arguments[0]; }
                    },
                    M13:
                    {
                        get: function getM13(){ return $[2]; },
                        set: function setM13(){ if (typeof arguments[0] === 'number') $[2] = arguments[0]; }
                    },
                    M14:
                    {
                        get: function getM14(){ return $[3]; },
                        set: function setM14(){ if (typeof arguments[0] === 'number') $[3] = arguments[0]; }
                    },
                    M21: 
                    {
                        get: function getM21(){ return $[4]; },
                        set: function setM21(){ if (typeof arguments[0] === 'number') $[4] = arguments[0]; }
                    },
                    M22:
                    {
                        get: function getM22(){ return $[5]; },
                        set: function setM22(){ if (typeof arguments[0] === 'number') $[5] = arguments[0]; }
                    },
                    M23: 
                    {
                        get: function getM23(){ return $[6]; },
                        set: function setM23(){ if (typeof arguments[0] === 'number') $[6] = arguments[0]; }
                    },
                    M24: 
                    {
                        get: function getM24(){ return $[7]; },
                        set: function setM24(){ if (typeof arguments[0] === 'number') $[7] = arguments[0]; }
                    },
                    M31:
                    {
                        get: function getM31(){ return $[8]; },
                        set: function setM31(){ if (typeof arguments[0] === 'number') $[8] = arguments[0]; }
                    },
                    M32: 
                    {
                        get: function getM32(){ return $[9]; },
                        set: function setM32(){ if (typeof arguments[0] === 'number') $[9] = arguments[0]; }
                    },
                    M33: 
                    {
                        get: function getM33(){ return $[10]; },
                        set: function setM33(){ if (typeof arguments[0] === 'number') $[10] = arguments[0]; }
                    },
                    M34: 
                    {
                        get: function getM34(){ return $[11]; },
                        set: function setM34(){ if (typeof arguments[0] === 'number') $[11] = arguments[0]; }
                    },
                    M41:
                    {
                        get: function getM31(){ return $[12]; },
                        set: function setM31(){ if (typeof arguments[0] === 'number') $[12] = arguments[0]; }
                    },
                    M42: 
                    {
                        get: function getM32(){ return $[13]; },
                        set: function setM32(){ if (typeof arguments[0] === 'number') $[13] = arguments[0]; }
                    },
                    M43: 
                    {
                        get: function getM33(){ return $[14]; },
                        set: function setM33(){ if (typeof arguments[0] === 'number') $[14] = arguments[0]; }
                    },
                    M44: 
                    {
                        get: function getM34(){ return $[15]; },
                        set: function setM34(){ if (typeof arguments[0] === 'number') $[15] = arguments[0]; }
                    }
                });
                
                return $;
            }
        },
        
        /**
         * @function    Set:    {Float32Array}
         * @param       array1: {Float32Array}  [override: 1]
         * @param       array2: {Float32Array}  [override: 1]
         * @param       array:  {Float32Array}  [override: 2]
         * @param       m11:    {Number}        [override: 2]
         * @param       m12:    {Number}        [override: 2]
         * @param       m13:    {Number}        [override: 2]
         * @param       m14:    {Number}        [override: 2]
         * @param       m21:    {Number}        [override: 2]
         * @param       m22:    {Number}        [override: 2]
         * @param       m23:    {Number}        [override: 2]
         * @param       m24:    {Number}        [override: 2]
         * @param       m31:    {Number}        [override: 2]
         * @param       m32:    {Number}        [override: 2]
         * @param       m33:    {Number}        [override: 2]
         * @param       m34:    {Number}        [override: 2]
         * @param       m41:    {Number}        [override: 2]
         * @param       m42:    {Number}        [override: 2]
         * @param       m43:    {Number}        [override: 2]
         * @param       m44:    {Number}        [override: 2]
         * @description Assigns new to the a given Float32Array.
         */
        Set:
        {
            value: function Set()
            {         
                var $, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p;

                $ = arguments[0];
                if (arguments[1] instanceof Float32Array && arguments[0].length === 16)
                {
                    a = arguments[1][0];  b = arguments[1][1];  c = arguments[1][2];  d = arguments[1][3];
                    e = arguments[1][4];  f = arguments[1][5];  g = arguments[1][6];  h = arguments[1][7];
                    i = arguments[1][8];  j = arguments[1][9];  k = arguments[1][10]; l = arguments[1][11];
                    m = arguments[1][12]; n = arguments[1][13]; o = arguments[1][14]; p = arguments[1][15];
                }
                else
                {
                    a = arguments[1];  b = arguments[2];  c = arguments[3];  d = arguments[4];
                    e = arguments[5];  f = arguments[6];  g = arguments[7];  h = arguments[8];
                    i = arguments[9];  j = arguments[10]; k = arguments[11]; l = arguments[12];
                    m = arguments[13]; n = arguments[14]; o = arguments[15]; p = arguments[16];
                }
                
                if ($ instanceof Float32Array && arguments[0].length === 16 && typeof a === 'number' && typeof b === 'number' && typeof c === 'number' && typeof d === 'number' && typeof e === 'number' && typeof f === 'number' && typeof g === 'number' && typeof h === 'number' && typeof i === 'number' && typeof j === 'number' && typeof k === 'number' && typeof l === 'number' && typeof m === 'number' && typeof n === 'number' && typeof o === 'number' && typeof p === 'number')
                {
                    $[0] = a;  $[1] = b;  $[2] = c;  $[3] = d;                        
                    $[4] = e;  $[5] = f;  $[6] = g;  $[7] = h;                        
                    $[8] = i;  $[9] = j;  $[10] = k; $[11] = l;                        
                    $[12] = m; $[13] = n; $[14] = o; $[15] = p;

                    return $;
                }                  
            }
        },
        
        /**
         * @function    Transpose:  {Float32Array}
         * @param       array:      {Float32Array}
         * @description Transposes a matrix.
         */
        Transpose:
        {
            value: function Transpose()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 16)
                    return this.Set(arguments[0],
                                    arguments[0][0], arguments[0][4], arguments[0][8], arguments[0][12],
                                    arguments[0][1], arguments[0][5], arguments[0][9], arguments[0][13],
                                    arguments[0][2], arguments[0][6], arguments[0][10], arguments[0][14],
                                    arguments[0][3], arguments[0][7], arguments[0][11], arguments[0][15]);
                
                Error("TRANSPOSE", arguments);
            }
        },
        
        /**
         * @function    Identity:   {Float32Array}
         * @param       array:      {Float32Array}
         * @description If given a Float32Array, it resets it to an identity matrix.
         *              If not, it simply returns a new identity matrix.
         */
        Identity:
        {
            value: function Identiy()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 16)
                    return this.Set(arguments[0],
                                    1, 0, 0, 0,
                                    0, 1, 0, 0,
                                    0, 0, 1, 0,
                                    0, 0, 0, 1);
                else
                    return this.Create(1, 0, 0, 0,
                                       0, 1, 0, 0,
                                       0, 0, 1, 0,
                                       0, 0, 0, 1);
            }
        },
        
        /**
         * @function    Determinant:    {Number}
         * @param       array:          {Float32Array}
         * @description Calculates the determinant of a given Float32Array.
         */
        Determinant:
        {
            value: function Determinant()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 16)
                    return arguments[0][0] * arguments[0][5] * arguments[0][10] * arguments[0][15] +
                        arguments[0][0] * arguments[0][6] * arguments[0][11] * arguments[0][13] +
                        arguments[0][0] * arguments[0][7] *  arguments[0][9] * arguments[0][14] +
                        arguments[0][1] * arguments[0][4] * arguments[0][11] * arguments[0][14] +
                        arguments[0][1] * arguments[0][6] *  arguments[0][8] * arguments[0][15] +
                        arguments[0][1] * arguments[0][7] * arguments[0][10] * arguments[0][12] +
                        arguments[0][2] * arguments[0][4] *  arguments[0][9] * arguments[0][15] +
                        arguments[0][2] * arguments[0][5] * arguments[0][11] * arguments[0][12] +
                        arguments[0][2] * arguments[0][7] *  arguments[0][8] * arguments[0][13] +
                        arguments[0][3] * arguments[0][4] * arguments[0][10] * arguments[0][13] +
                        arguments[0][3] * arguments[0][5] *  arguments[0][8] * arguments[0][14] +
                        arguments[0][3] * arguments[0][6] *  arguments[0][9] * arguments[0][12] -
                        arguments[0][0] * arguments[0][5] * arguments[0][11] * arguments[0][14] -
                        arguments[0][0] * arguments[0][6] *  arguments[0][9] * arguments[0][15] -
                        arguments[0][0] * arguments[0][7] * arguments[0][10] * arguments[0][13] -
                        arguments[0][1] * arguments[0][4] * arguments[0][10] * arguments[0][15] -
                        arguments[0][1] * arguments[0][6] * arguments[0][11] * arguments[0][12] -
                        arguments[0][1] * arguments[0][7] *  arguments[0][8] * arguments[0][14] -
                        arguments[0][2] * arguments[0][4] * arguments[0][11] * arguments[0][13] -
                        arguments[0][2] * arguments[0][5] *  arguments[0][8] * arguments[0][15] -
                        arguments[0][2] * arguments[0][7] *  arguments[0][9] * arguments[0][12] -
                        arguments[0][3] * arguments[0][4] *  arguments[0][9] * arguments[0][14] -
                        arguments[0][3] * arguments[0][5] * arguments[0][10] * arguments[0][12] -
                        arguments[0][3] * arguments[0][6] *  arguments[0][8] * arguments[0][13];
            }
        },
        
        /**
         * @function    Inverse:    {Float32Array}
         * @param       array:      {Float32Array}
         * @description Inverts a given Float32Array when possible i.e. the determinant
         *              is not 0.
         */
        Inverse:
        {
            value: function Inverse()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 16)
                {
                    var det = this.Determinant(arguments[0]);
                    if (det !== 0)
                        return this.Set(arguments[0],
                                        (arguments[0][5] * arguments[0][10] * arguments[0][15] +
                                         arguments[0][6] * arguments[0][11] * arguments[0][13] +
                                         arguments[0][7] *  arguments[0][9] * arguments[0][14] -
                                         arguments[0][5] * arguments[0][11] * arguments[0][14] -
                                         arguments[0][6] *  arguments[0][9] * arguments[0][15] -
                                         arguments[0][7] * arguments[0][10] * arguments[0][13]) / det,
                                        (arguments[0][1] * arguments[0][11] * arguments[0][14] +
                                         arguments[0][2] *  arguments[0][9] * arguments[0][15] +
                                         arguments[0][3] * arguments[0][10] * arguments[0][13] -
                                         arguments[0][1] * arguments[0][10] * arguments[0][15] -
                                         arguments[0][2] * arguments[0][11] * arguments[0][13] -
                                         arguments[0][3] *  arguments[0][9] * arguments[0][14]) / det,
                                        (arguments[0][1] * arguments[0][6] * arguments[0][15] +
                                         arguments[0][2] * arguments[0][7] * arguments[0][13] +
                                         arguments[0][3] * arguments[0][5] * arguments[0][14] -
                                         arguments[0][1] * arguments[0][7] * arguments[0][14] -
                                         arguments[0][2] * arguments[0][5] * arguments[0][15] -
                                         arguments[0][3] * arguments[0][6] * arguments[0][13]) / det,
                                        (arguments[0][1] * arguments[0][7] * arguments[0][10] +
                                         arguments[0][2] * arguments[0][5] * arguments[0][11] +
                                         arguments[0][3] * arguments[0][6] *  arguments[0][9] -
                                         arguments[0][1] * arguments[0][6] * arguments[0][11] -
                                         arguments[0][2] * arguments[0][7] *  arguments[0][9] -
                                         arguments[0][3] * arguments[0][5] * arguments[0][10]) / det,
                                        
                                        (arguments[0][4] * arguments[0][11] * arguments[0][14] +
                                         arguments[0][6] *  arguments[0][8] * arguments[0][15] +
                                         arguments[0][7] * arguments[0][10] * arguments[0][12] -
                                         arguments[0][4] * arguments[0][10] * arguments[0][15] -
                                         arguments[0][6] * arguments[0][11] * arguments[0][12] -
                                         arguments[0][7] *  arguments[0][8] * arguments[0][14]) / det,
                                        (arguments[0][0] * arguments[0][10] * arguments[0][15] +
                                         arguments[0][2] * arguments[0][11] * arguments[0][12] +
                                         arguments[0][3] *  arguments[0][8] * arguments[0][14] -
                                         arguments[0][0] * arguments[0][11] * arguments[0][14] -
                                         arguments[0][2] *  arguments[0][8] * arguments[0][15] -
                                         arguments[0][3] * arguments[0][10] * arguments[0][12]) / det,
                                        (arguments[0][0] * arguments[0][7] * arguments[0][14] +
                                         arguments[0][2] * arguments[0][4] * arguments[0][15] +
                                         arguments[0][3] * arguments[0][6] * arguments[0][12] -
                                         arguments[0][0] * arguments[0][6] * arguments[0][15] -
                                         arguments[0][2] * arguments[0][7] * arguments[0][12] -
                                         arguments[0][3] * arguments[0][4] * arguments[0][14]) / det,
                                        (arguments[0][0] * arguments[0][6] * arguments[0][11] +
                                         arguments[0][2] * arguments[0][7] *  arguments[0][8] +
                                         arguments[0][3] * arguments[0][4] * arguments[0][10] -
                                         arguments[0][0] * arguments[0][7] * arguments[0][10] -
                                         arguments[0][2] * arguments[0][4] * arguments[0][11] -
                                         arguments[0][3] * arguments[0][6] * arguments[0][8]) / det,
                                        
                                        (arguments[0][4] *  arguments[0][9] * arguments[0][15] +
                                         arguments[0][5] * arguments[0][11] * arguments[0][12] +
                                         arguments[0][7] *  arguments[0][8] * arguments[0][13] -
                                         arguments[0][4] * arguments[0][11] * arguments[0][13] -
                                         arguments[0][5] *  arguments[0][8] * arguments[0][15] -
                                         arguments[0][7] *  arguments[0][9] * arguments[0][12]) / det,
                                        (arguments[0][0] * arguments[0][11] * arguments[0][13] +
                                         arguments[0][1] *  arguments[0][8] * arguments[0][15] +
                                         arguments[0][3] *  arguments[0][9] * arguments[0][12] -
                                         arguments[0][0] *  arguments[0][9] * arguments[0][15] -
                                         arguments[0][1] * arguments[0][11] * arguments[0][12] -
                                         arguments[0][3] *  arguments[0][8] * arguments[0][13]) / det,
                                        (arguments[0][0] * arguments[0][5] * arguments[0][15] +
                                         arguments[0][1] * arguments[0][7] * arguments[0][12] +
                                         arguments[0][3] * arguments[0][4] * arguments[0][13] -
                                         arguments[0][0] * arguments[0][7] * arguments[0][13] -
                                         arguments[0][1] * arguments[0][4] * arguments[0][15] -
                                         arguments[0][3] * arguments[0][5] * arguments[0][12]) / det,
                                        (arguments[0][0] * arguments[0][7] *  arguments[0][9] +
                                         arguments[0][1] * arguments[0][4] * arguments[0][11] +
                                         arguments[0][3] * arguments[0][5] *  arguments[0][8] -
                                         arguments[0][0] * arguments[0][5] * arguments[0][11] -
                                         arguments[0][1] * arguments[0][7] *  arguments[0][8] -
                                         arguments[0][3] * arguments[0][4] *  arguments[0][9]) / det,
                                        
                                        (arguments[0][4] * arguments[0][10] * arguments[0][13] +
                                         arguments[0][5] *  arguments[0][8] * arguments[0][14] +
                                         arguments[0][6] *  arguments[0][9] * arguments[0][12] -
                                         arguments[0][4] *  arguments[0][9] * arguments[0][14] -
                                         arguments[0][5] * arguments[0][10] * arguments[0][12] -
                                         arguments[0][6] *  arguments[0][8] * arguments[0][13]) / det,
                                        (arguments[0][0] *  arguments[0][9] * arguments[0][14] +
                                         arguments[0][1] * arguments[0][10] * arguments[0][12] +
                                         arguments[0][2] *  arguments[0][8] * arguments[0][13] -
                                         arguments[0][0] * arguments[0][10] * arguments[0][13] -
                                         arguments[0][1] *  arguments[0][8] * arguments[0][14] -
                                         arguments[0][2] *  arguments[0][9] * arguments[0][12]) / det,
                                        (arguments[0][0] * arguments[0][6] * arguments[0][13] +
                                         arguments[0][1] * arguments[0][4] * arguments[0][14] +
                                         arguments[0][2] * arguments[0][5] * arguments[0][12] -
                                         arguments[0][0] * arguments[0][5] * arguments[0][14] -
                                         arguments[0][1] * arguments[0][6] * arguments[0][12] -
                                         arguments[0][2] * arguments[0][4] * arguments[0][13]) / det,
                                        (arguments[0][0] * arguments[0][5] * arguments[0][10] +
                                         arguments[0][1] * arguments[0][6] * arguments[0][8] +
                                         arguments[0][2] * arguments[0][4] * arguments[0][9] -
                                         arguments[0][0] * arguments[0][6] * arguments[0][9] -
                                         arguments[0][1] * arguments[0][4] * arguments[0][10] -
                                         arguments[0][2] * arguments[0][5] * arguments[0][8]) / det);
                    else
                        return arguments[0];
                }
            }
        },
        
        /**
         * @function    Sum:        {Float32Array}
         * @param       array1:     {Float32Array}
         * @param       array2:     {Float32Array}
         * @description Adds two Float32Array component-wise.
         */
        Sum:
        {
            value: function Sum()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 16 && arguments[1] instanceof Float32Array && arguments[1].length === 16)
                    return this.Set(arguments[0],
                                    arguments[0][0]  + arguments[1][0], arguments[0][1]  + arguments[1][1],
                                    arguments[0][2]  + arguments[1][2], arguments[0][3]  + arguments[1][3],
                                    
                                    arguments[0][4]  + arguments[1][4], arguments[0][5]  + arguments[1][5],
                                    arguments[0][6]  + arguments[1][6], arguments[0][7]  + arguments[1][7],
                                    
                                    arguments[0][8]  + arguments[1][8], arguments[0][9]  + arguments[1][9],
                                    arguments[0][10] + arguments[1][10], arguments[0][11] + arguments[1][11],
                                    
                                    arguments[0][12] + arguments[1][12], arguments[0][13] + arguments[1][13],
                                    arguments[0][14] + arguments[1][14], arguments[0][15] + arguments[1][15]);
            }
        },
        
        /**
         * @function    Mult:       {Float32Array}
         * @param       array1:     {Float32Array}  [override 1]
         * @param       array2:     {Float32Array}  [override 1]
         * @param       array:      {Float32Array}  [override 2]
         * @param       constant:   {Number}        [override 2]
         * @description Performs a matrix multiplication on two Float32Array or
         *              multiply a Float32Array with a scalar value.
         */
        Mult:
        {
            value: function Mult()
            {
                
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 16)
                {
                    if (arguments[1] instanceof Float32Array && arguments[1].length === 16)
                    {
                        return this.Set
                        (
                            arguments[0],
                            arguments[0][0]  * arguments[1][0] + arguments[0][1]  * arguments[1][4] + arguments[0][2]  * arguments[1][8]  + arguments[0][3]  * arguments[1][12],
                            arguments[0][0]  * arguments[1][1] + arguments[0][1]  * arguments[1][5] + arguments[0][2]  * arguments[1][9]  + arguments[0][3]  * arguments[1][13],
                            arguments[0][0]  * arguments[1][2] + arguments[0][1]  * arguments[1][6] + arguments[0][2]  * arguments[1][10] + arguments[0][3]  * arguments[1][14],
                            arguments[0][0]  * arguments[1][3] + arguments[0][1]  * arguments[1][7] + arguments[0][2]  * arguments[1][11] + arguments[0][3]  * arguments[1][15],
                            
                            arguments[0][4]  * arguments[1][0] + arguments[0][5]  * arguments[1][4] + arguments[0][6]  * arguments[1][8]  + arguments[0][7]  * arguments[1][12],
                            arguments[0][4]  * arguments[1][1] + arguments[0][5]  * arguments[1][5] + arguments[0][6]  * arguments[1][9]  + arguments[0][7]  * arguments[1][13],
                            arguments[0][4]  * arguments[1][2] + arguments[0][5]  * arguments[1][6] + arguments[0][6]  * arguments[1][10] + arguments[0][7]  * arguments[1][14],
                            arguments[0][4]  * arguments[1][3] + arguments[0][5]  * arguments[1][7] + arguments[0][6]  * arguments[1][11] + arguments[0][7]  * arguments[1][15],
                            
                            arguments[0][8]  * arguments[1][0] + arguments[0][9]  * arguments[1][4] + arguments[0][10] * arguments[1][8]  + arguments[0][11] * arguments[1][12],
                            arguments[0][8]  * arguments[1][1] + arguments[0][9]  * arguments[1][5] + arguments[0][10] * arguments[1][9]  + arguments[0][11] * arguments[1][13],
                            arguments[0][8]  * arguments[1][2] + arguments[0][9]  * arguments[1][6] + arguments[0][10] * arguments[1][10] + arguments[0][11] * arguments[1][14],
                            arguments[0][8]  * arguments[1][3] + arguments[0][9]  * arguments[1][7] + arguments[0][10] * arguments[1][11] + arguments[0][11] * arguments[1][15],
                            
                            arguments[0][12] * arguments[1][0] + arguments[0][13] * arguments[1][4] + arguments[0][14] * arguments[1][8]  + arguments[0][15] * arguments[1][12],
                            arguments[0][12] * arguments[1][1] + arguments[0][13] * arguments[1][5] + arguments[0][14] * arguments[1][9]  + arguments[0][15] * arguments[1][13],
                            arguments[0][12] * arguments[1][2] + arguments[0][13] * arguments[1][6] + arguments[0][14] * arguments[1][10] + arguments[0][15] * arguments[1][14],
                            arguments[0][12] * arguments[1][3] + arguments[0][13] * arguments[1][7] + arguments[0][14] * arguments[1][11] + arguments[0][15] * arguments[1][15]
                        ); 
                    }
                    else if (typeof arguments[1] === 'number')
                    {
                        return this.Set(arguments[0],
                                        arguments[0][0] * arguments[1], arguments[0][1] * arguments[1], arguments[0][2] * arguments[1], arguments[0][3] * arguments[1],
                                        arguments[0][4] * arguments[1], arguments[0][5] * arguments[1], arguments[0][6] * arguments[1], arguments[0][7] * arguments[1],
                                        arguments[0][8] * arguments[1], arguments[0][9] * arguments[1], arguments[0][10] * arguments[1], arguments[0][11] * arguments[1],
                                        arguments[0][12] * arguments[1], arguments[0][13] * arguments[1], arguments[0][14] * arguments[1], arguments[0][15] * arguments[1]);
                    }
                }
            }
        },
        
        /**
         * @function    RevMult:    {Float32Array}
         * @param       array1:     {Float32Array}
         * @param       array2:     {Float32Array}
         * @description Performs a matrix multiplication on two Float32Array but
         *              assigns the result to the second Float32Array.
         */
        RevMult:
        {
            value: function RevMult()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9 && arguments[1] instanceof Float32Array && arguments[1].length === 16)
                {
                    return this.Set
                    (
                        arguments[1],
                        arguments[0][0]  * arguments[1][0] + arguments[0][1]  * arguments[1][4] + arguments[0][2]  * arguments[1][8]  + arguments[0][3]  * arguments[1][12],
                        arguments[0][0]  * arguments[1][1] + arguments[0][1]  * arguments[1][5] + arguments[0][2]  * arguments[1][9]  + arguments[0][3]  * arguments[1][13],
                        arguments[0][0]  * arguments[1][2] + arguments[0][1]  * arguments[1][6] + arguments[0][2]  * arguments[1][10] + arguments[0][3]  * arguments[1][14],
                        arguments[0][0]  * arguments[1][3] + arguments[0][1]  * arguments[1][7] + arguments[0][2]  * arguments[1][11] + arguments[0][3]  * arguments[1][15],

                        arguments[0][4]  * arguments[1][0] + arguments[0][5]  * arguments[1][4] + arguments[0][6]  * arguments[1][8]  + arguments[0][7]  * arguments[1][12],
                        arguments[0][4]  * arguments[1][1] + arguments[0][5]  * arguments[1][5] + arguments[0][6]  * arguments[1][9]  + arguments[0][7]  * arguments[1][13],
                        arguments[0][4]  * arguments[1][2] + arguments[0][5]  * arguments[1][6] + arguments[0][6]  * arguments[1][10] + arguments[0][7]  * arguments[1][14],
                        arguments[0][4]  * arguments[1][3] + arguments[0][5]  * arguments[1][7] + arguments[0][6]  * arguments[1][11] + arguments[0][7]  * arguments[1][15],

                        arguments[0][8]  * arguments[1][0] + arguments[0][9]  * arguments[1][4] + arguments[0][10] * arguments[1][8]  + arguments[0][11] * arguments[1][12],
                        arguments[0][8]  * arguments[1][1] + arguments[0][9]  * arguments[1][5] + arguments[0][10] * arguments[1][9]  + arguments[0][11] * arguments[1][13],
                        arguments[0][8]  * arguments[1][2] + arguments[0][9]  * arguments[1][6] + arguments[0][10] * arguments[1][10] + arguments[0][11] * arguments[1][14],
                        arguments[0][8]  * arguments[1][3] + arguments[0][9]  * arguments[1][7] + arguments[0][10] * arguments[1][11] + arguments[0][11] * arguments[1][15],

                        arguments[0][12] * arguments[1][0] + arguments[0][13] * arguments[1][4] + arguments[0][14] * arguments[1][8]  + arguments[0][15] * arguments[1][12],
                        arguments[0][12] * arguments[1][1] + arguments[0][13] * arguments[1][5] + arguments[0][14] * arguments[1][9]  + arguments[0][15] * arguments[1][13],
                        arguments[0][12] * arguments[1][2] + arguments[0][13] * arguments[1][6] + arguments[0][14] * arguments[1][10] + arguments[0][15] * arguments[1][14],
                        arguments[0][12] * arguments[1][3] + arguments[0][13] * arguments[1][7] + arguments[0][14] * arguments[1][11] + arguments[0][15] * arguments[1][15]
                    );
                }
            }
        } 
    });
}


function Quaternion()
{
    // TODO
}


/**
 * @name        Vector2
 * @description This library contains the methods for 2 component vector operations.
 *              2 component vector are represented as a Float32Array of length 2.
 * @module      FWGE.Game.Maths 
 */
function Vector2()
{
    Object.defineProperties(this,
    {
        /**
         * @function    Create: {Float32Array}
         * @param       array:  {Float32Array}  [null, override: 1]
         * @param       x:      {Number}        [null, override: 2]
         * @param       y:      {Number}        [null, override: 2]
         * @description Creates an new Float32Array with the Type set to "VECTOR2".
         *              It also has the appropriate value indexers:
         *              <X, Y>
         */
        Create:
        {
            value: function Create()
            {
                var $ = new Float32Array(2);
                
                $[0] = typeof arguments[0] === 'number' ? arguments[0] : arguments[0] instanceof Array && typeof arguments[0][0] === 'number' ? arguments[0][0] : 0;
                $[1] = typeof arguments[1] === 'number' ? arguments[1] : arguments[0] instanceof Array && typeof arguments[0][1] === 'number' ? arguments[0][1] : 0;
                
                Object.defineProperties($,
                {
                    Type: { value: "VECTOR2" },
                    X:
                    {
                        get: function getX(){ return $[0]; },
                        set: function setX()
                        {
                            if (typeof arguments[0] === 'number')
                                $[0] = arguments[0];
                        }
                    },
                    Y:
                    {
                        get: function getY(){ return $[1]; },
                        set: function setY()
                        {
                            if (typeof arguments[0] === 'number')
                                $[1] = arguments[0];
                        }
                    }
                });
                
                return $;
            }
        },
        
        /**
         * @function    Set:        {Float32Array}
         * @param       array1:     {Float32Array}  [override: 1]
         * @param       array2:     {Float32Array}  [override: 1]
         * @param       array:      {Float32Array}  [override: 2]
         * @param       x:          {Number}        [override: 2]
         * @param       y:          {Number}        [override: 2]
         * @description Assigns new values to the a given Float32Array.
         */
        Set:
        {
            value: function Set()
            {
                var $, x, y;

                $ = arguments[0];
                if (arguments[1] instanceof Float32Array && arguments[0].length === 2)
                {
                    x = arguments[1][0];
                    y = arguments[1][1];
                }
                else
                {
                    x = arguments[1];
                    y = arguments[2];
                }
                
                if ($ instanceof Float32Array && $.length === 2 && typeof x === 'number' && typeof y === 'number' && typeof z === 'number')
                {
                    $[0] = x;
                    $[1] = y;

                    return $;
                }
            }
        },
        
        /**
         * @function    Length: {Number}
         * @param       array:  {Float32Array}
         * @description Calculates the length of a given Float32Array.
         */
        Length:
        {
            value: function Length()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2)
                    return Math.sqrt(arguments[0][0] * arguments[0][0] + arguments[0][1] * arguments[0][1]);
            }
        },
        
        /**
         * @function    Sum:    {Float32Array}
         * @param       array1: {Float32Array}
         * @param       array2: {Float32Array}
         * @description Adds two Float32Array component-wise.
         */
        Sum:
        {
            value: function Sum()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2 && arguments[1] instanceof Float32Array && arguments[1].length === 2)
                    return this.Set(arguments[0], arguments[0][0] + arguments[1][0], arguments[0][1] + arguments[1][1]);
            }
        },
        
        /**
         * @function    Diff:   {Float32Array}
         * @param       array1: {Float32Array}
         * @param       array2: {Float32Array}
         * @description Subtracts two Float32Array component-wise.
         */
        Diff:
        {
            value: function Diff()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2 && arguments[1] instanceof Float32Array && arguments[1].length === 2)
                    return this.Create(arguments[1][0] - arguments[0][0], arguments[1][1] - arguments[0][1]);
            }
        },
        
        /**
         * @function    Mult:       {Float32Array}
         * @param       array1:     {Float32Array}  [override: 1]
         * @param       array2:     {Float32Array}  [override: 1]
         * @param       array:      {Float32Array}  [override: 2]
         * @param       constant:   {Number}        [override: 2]
         * @description Multiplies two Float32Array component-wise. If the second parameter is
         *              a number, the Float32Array is scale by it.
         */
        Mult:
        {
            value: function Mult()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2)
                {
                    if (arguments[1] instanceof Float32Array && arguments[1].length === 2)
                        return this.Set(arguments[0], arguments[0][0] * arguments[1][0], arguments[0][1] * arguments[1][1]);
                    else if (typeof arguments[1] === 'number')
                        return this.Set(arguments[0], arguments[0][0] * arguments[1], arguments[0][1] * arguments[1]);
                }
            }
        },
        
        /**
         * @function    Dot:    {Number}
         * @param       array:  {Float32Array}
         * @description Calculates the dot product of two Float32Array objects.
         */
        Dot:
        {
            value: function Dot()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2 && arguments[1] instanceof Float32Array && arguments[1].length === 2)
                        return arguments[0][0] * arguments[1][0] + arguments[0][1] * arguments[1][1];
            }
        },
        
        /**
         * @function    Unit:   {Float32Array}
         * @param       array:  {Float32Array}
         * @description Scales the given Float32Array down to a unit vector i.e. the length is 1
         */
        Unit:
        {
            value: function Unit()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2)
                {
                    var length = this.Length(arguments[0]);
                    if (length !== 0)
                        return this.Mult(arguments[0], 1 / length);
                }
            }
        },
        
        /**
         * @function    Cross:  {Float32Array}
         * @param       array1: {Float32Array}
         * @param       array2: {Float32Array}
         * @description Performs a cross multiplication on two Float32Array objects
         */
        Cross:
        {
            value: function Cross()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2 && arguments[1] instanceof Float32Array && arguments[1].length === 2)
                    return this.Create(arguments[0][1] * arguments[1][2] + arguments[0][2] * arguments[1][1], arguments[0][2] * arguments[1][0] - arguments[0][0] * arguments[1][2], arguments[0][0] * arguments[1][1] + arguments[0][1] * arguments[1][0]);
            }
        }
    });
}


/**
 * @name        Vector3
 * @description This library contains the methods for 2 component vector operations.
 *              3 component vector are represented as a Float32Array of length 3.
 * @module      FWGE.Game.Maths 
 */
function Vector3()
{
    Object.defineProperties(this,
    {
        /**
         * @function    Create: {Float32Array}
         * @param       array:  {Float32Array}  [null, override: 1]
         * @param       x:      {Number}        [null, override: 2]
         * @param       y:      {Number}        [null, override: 2]
         * @param       z:      {Number}        [null, override: 2]
         * @description Creates an new Float32Array with the Type set to "VECTOR3".
         *              It also has the appropriate value indexers:
         *              <X, Y, Z>
         */
        Create:
        {
            value: function Create()
            {
                var $ = new Float32Array(3);
                
                $[0] = typeof arguments[0] === 'number' ? arguments[0] : arguments[0] instanceof Array && typeof arguments[0][0] === 'number' ? arguments[0][0] : 0;
                $[1] = typeof arguments[1] === 'number' ? arguments[1] : arguments[0] instanceof Array && typeof arguments[0][1] === 'number' ? arguments[0][1] : 0;
                $[2] = typeof arguments[2] === 'number' ? arguments[2] : arguments[0] instanceof Array && typeof arguments[0][2] === 'number' ? arguments[0][2] : 0;
                
                Object.defineProperties($,
                {
                    Type: { value: "VECTOR3" },
                    X:
                    {
                        get: function getX(){ return $[0]; },
                        set: function setX()
                        {
                            if (typeof arguments[0] === 'number')
                                $[0] = arguments[0];
                        }
                    },
                    Y:
                    {
                        get: function getY(){ return $[1]; },
                        set: function setY()
                        {
                            if (typeof arguments[0] === 'number')
                                $[1] = arguments[0];
                        }
                    },
                    Z:
                    {
                        get: function getZ(){ return $[2]; },
                        set: function setZ()
                        {
                            if (typeof arguments[0] === 'number')
                                $[2] = arguments[0];
                        }
                    }
                });
                
                return $;
            }
        },
        
        /**
         * @function    Set:        {Float32Array}
         * @param       array1:     {Float32Array}  [override: 1]
         * @param       array2:     {Float32Array}  [override: 1]
         * @param       array:      {Float32Array}  [override: 2]
         * @param       x:          {Number}        [override: 2]
         * @param       y:          {Number}        [override: 2]
         * @param       z:          {Number}        [override: 2]
         * @description Assigns new values to the a given Float32Array.
         */
        Set:
        {
            value: function Set()
            {
                var $, x, y, z;

                $ = arguments[0];
                if (arguments[1] instanceof Float32Array && arguments[0].length === 3)
                {
                    x = arguments[1][0];
                    y = arguments[1][1];
                    z = arguments[1][2];
                }
                else
                {
                    x = arguments[1];
                    y = arguments[2];
                    z = arguments[3];
                }
                
                if ($ instanceof Float32Array && $.length === 3 && typeof x === 'number' && typeof y === 'number' && typeof z === 'number')
                {
                    $[0] = x;
                    $[1] = y;
                    $[2] = z;

                    return $;
                }
            }
        },
        
        /**
         * @function    Length: {Number}
         * @param       array:  {Float32Array}
         * @description Calculates the length of a given Float32Array.
         */
        Length:
        {
            value: function Length()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    return Math.sqrt(arguments[0][0] * arguments[0][0] + arguments[0][1] * arguments[0][1] + arguments[0][2] * arguments[0][2]);
            }
        },
        
        /**
         * @function    Sum:    {Float32Array}
         * @param       array1: {Float32Array}
         * @param       array2: {Float32Array}
         * @description Adds two Float32Array component-wise.
         */
        Sum:
        {
            value: function Sum()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3 && arguments[2] instanceof Float32Array && arguments[1].length === 3)
                    return this.Set(arguments[0], arguments[0][0] + arguments[1][0], arguments[0][1] + arguments[1][1], arguments[0][2] + arguments[1][2]);
            }
        },
        
        /**
         * @function    Diff:   {Float32Array}
         * @param       array1: {Float32Array}
         * @param       array2: {Float32Array}
         * @description Subtracts two Float32Array component-wise.
         */
        Diff:
        {
            value: function Diff()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3 && arguments[2] instanceof Float32Array && arguments[1].length === 3)
                    return this.Create(arguments[1][0] - arguments[0][0], arguments[1][1] - arguments[0][1], arguments[1][2] - arguments[0][2]);
            }
        },
        
        /**
         * @function    Mult:       {Float32Array}
         * @param       array1:     {Float32Array}  [override: 1]
         * @param       array2:     {Float32Array}  [override: 1]
         * @param       array:      {Float32Array}  [override: 2]
         * @param       constant:   {Number}        [override: 2]
         * @description Multiplies two Float32Array component-wise. If the second parameter is
         *              a number, the Float32Array is scale by it.
         */
        Mult:
        {
            value: function Mult()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                {
                    if (arguments[1] instanceof Float32Array && arguments[1].length === 3)
                        return this.Set(arguments[0], arguments[0][0] * arguments[1][0], arguments[0][1] * arguments[1][1], arguments[0][2] * arguments[1][2]);
                    else if (typeof arguments[1] === 'number')
                        return this.Set(arguments[0], arguments[0][0] * arguments[1], arguments[0][1] * arguments[1], arguments[0][2] * arguments[1]);
                }
            }
        },
        
        /**
         * @function    Dot:    {Number}
         * @param       array:  {Float32Array}
         * @description Calculates the dot product of two Float32Array objects.
         */
        Dot:
        {
            value: function Dot()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3 && arguments[1] instanceof Float32Array && arguments[1].length === 3)
                        return arguments[0][0] * arguments[1][0] + arguments[0][1] * arguments[1][1] + arguments[0][2] * arguments[1][2];
            }
        },
        
        /**
         * @function    Unit:   {Float32Array}
         * @param       array:  {Float32Array}
         * @description Scales the given Float32Array down to a unit vector i.e. the length is 1
         */
        Unit:
        {
            value: function Unit()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                {
                    var length = this.Length(arguments[0]);
                    if (length !== 0)
                        return this.Mult(arguments[0], 1 / length);
                }
            }
        },
        
        /**
         * @function    Cross:  {Float32Array}
         * @param       array1: {Float32Array}
         * @param       array2: {Float32Array}
         * @description Performs a cross multiplication on two Float32Array objects
         */
        Cross:
        {
            value: function Cross()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3 && arguments[1] instanceof Float32Array && arguments[1].length === 3)
                    return this.Create(arguments[0][1] * arguments[1][2] + arguments[0][2] * arguments[1][1], arguments[0][2] * arguments[1][0] - arguments[0][0] * arguments[1][2], arguments[0][0] * arguments[1][1] + arguments[0][1] * arguments[1][0]);
            }
        }
    });
}


/**
 * @name        Vector4
 * @description This library contains the methods for 2 component vector operations.
 *              4 component vector are represented as a Float32Array of length 4.
 * @module      FWGE.Game.Maths 
 */
function Vector4()
{
    Object.defineProperties(this,
    {
        /**
         * @function    Create: {Float32Array}
         * @param       array:  {Float32Array}  [null, override: 1]
         * @param       w:      {Number}        [null, override: 2]
         * @param       x:      {Number}        [null, override: 2]
         * @param       y:      {Number}        [null, override: 2]
         * @param       z:      {Number}        [null, override: 2]
         * @description Creates an new Float32Array with the Type set to "VECTOR4".
         *              It also has the appropriate value indexers:
         *              <W, X, Y, Z>
         */
        Create:
        {
            value: function Create()
            {
                var $ = new Float32Array(4);
                
                $[0] = typeof arguments[0] === 'number' ? arguments[0] : arguments[0] instanceof Array && typeof arguments[0][0] === 'number' ? arguments[0][0] : 0;
                $[1] = typeof arguments[1] === 'number' ? arguments[1] : arguments[0] instanceof Array && typeof arguments[0][1] === 'number' ? arguments[0][1] : 0;
                $[2] = typeof arguments[2] === 'number' ? arguments[2] : arguments[0] instanceof Array && typeof arguments[0][2] === 'number' ? arguments[0][2] : 0;
                $[3] = typeof arguments[3] === 'number' ? arguments[3] : arguments[0] instanceof Array && typeof arguments[0][3] === 'number' ? arguments[0][3] : 0;
                
                Object.defineProperties($,
                {
                    Type: { value: "VECTOR4" },
                    W:
                    {
                        get: function(){ return $[0]; },
                        set: function()
                        {
                            if (typeof arguments[0] === 'number')
                                $[0] = arguments[0];
                        }
                    },
                    X:
                    {
                        get: function(){ return $[1]; },
                        set: function()
                        {
                            if (typeof arguments[0] === 'number')
                                $[1] = arguments[0];
                        }
                    },
                    Y:
                    {
                        get: function(){ return $[2]; },
                        set: function()
                        {
                            if (typeof arguments[0] === 'number')
                                $[2] = arguments[0];
                        }
                    },
                    Z:
                    {
                        get: function(){ return $[3]; },
                        set: function()
                        {
                            if (typeof arguments[0] === 'number')
                                $[3] = arguments[0];
                        }
                    }
                });
                
                return $;
            }
        },
        
        /**
         * @function    Set:        {Float32Array}
         * @param       array1:     {Float32Array}  [override: 1]
         * @param       array2:     {Float32Array}  [override: 1]
         * @param       array:      {Float32Array}  [override: 2]
         * @param       w:          {Number}        [override: 2]
         * @param       x:          {Number}        [override: 2]
         * @param       y:          {Number}        [override: 2]
         * @param       z:          {Number}        [override: 2]
         * @description Assigns new values to the a given Float32Array.
         */
        Set:
        {
            value: function Set()
            {
                var $, w, x, y, z;

                $ = arguments[0];
                if (arguments[1] instanceof Float32Array && arguments[0].length === 4)
                {
                    w = arguments[1][0];
                    x = arguments[1][1];
                    y = arguments[1][2];
                    z = arguments[1][3];
                }
                else
                {
                    w = arguments[1];
                    x = arguments[2];
                    y = arguments[3];
                    z = arguments[4];
                }
                
                if ($ instanceof Float32Array && $.length === 4 && typeof w === 'number' && typeof x === 'number' && typeof y === 'number' && typeof z === 'number')
                {
                    $[0] = w;
                    $[1] = x;
                    $[2] = y;
                    $[3] = z;

                    return $;
                }
            }
        },
        
        /**
         * @function    Length: {Number}
         * @param       array:  {Float32Array}
         * @description Calculates the length of a given Float32Array.
         */
        Length:
        {
            value: function Length()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4)
                    return Math.sqrt(arguments[0][0] * arguments[0][0] + arguments[0][1] * arguments[0][1] + arguments[0][2] * arguments[0][2]);
            }
        },
        
        /**
         * @function    Sum:    {Float32Array}
         * @param       array1: {Float32Array}
         * @param       array2: {Float32Array}
         * @description Adds two Float32Array component-wise.
         */
        Sum:
        {
            value: function Sum()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4 && arguments[2] instanceof Float32Array && arguments[1].length === 4)
                    return this.Set(arguments[0], arguments[0][0] + arguments[1][0], arguments[0][1] + arguments[1][1], arguments[0][2] + arguments[1][2], arguments[0][3] + arguments[1][3]);
            }
        },
        
        /**
         * @function    Diff:   {Float32Array}
         * @param       array1: {Float32Array}
         * @param       array2: {Float32Array}
         * @description Subtracts two Float32Array component-wise.
         */
        Diff:
        {
            value: function Diff()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4 && arguments[2] instanceof Float32Array && arguments[1].length === 4)
                    return this.Create(arguments[1][0] - arguments[0][0], arguments[1][1] - arguments[0][1], arguments[1][2] - arguments[0][2], arguments[1][3] - arguments[0][3]);
            }
        },
        
        /**
         * @function    Mult:       {Float32Array}
         * @param       array1:     {Float32Array}  [override: 1]
         * @param       array2:     {Float32Array}  [override: 1]
         * @param       array:      {Float32Array}  [override: 2]
         * @param       constant:   {Number}        [override: 2]
         * @description Multiplies two Float32Array component-wise. If the second parameter is
         *              a number, the Float32Array is scale by it.
         */
        Mult:
        {
            value: function Mult()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4)
                {
                    if (arguments[1] instanceof Float32Array && arguments[1].length === 3)
                        return this.Set(arguments[0], arguments[0][0] * arguments[1][0], arguments[0][1] * arguments[1][1], arguments[0][2] * arguments[1][2], arguments[0][3] * arguments[1][3]);
                    else if (typeof arguments[1] === 'number')
                        return this.Set(arguments[0], arguments[0][0] * arguments[1], arguments[0][1] * arguments[1], arguments[0][2] * arguments[1], arguments[0][3] * arguments[1]);
                }
            }
        },
        
        /**
         * @function    Dot:    {Number}
         * @param       array:  {Float32Array}
         * @description Calculates the dot product of two Float32Array objects.
         */
        Dot:
        {
            value: function Dot()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4 && arguments[1] instanceof Float32Array && arguments[1].length === 4)
                        return arguments[0][0] * arguments[1][0] + arguments[0][1] * arguments[1][1] + arguments[0][2] * arguments[1][2] + arguments[0][3] * arguments[1][3];
            }
        },
        
        /**
         * @function    Unit:   {Float32Array}
         * @param       array:  {Float32Array}
         * @description Scales the given Float32Array down to a unit vector i.e. the length is 1
         */
        Unit:
        {
            value: function Unit()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4)
                {
                    var length = this.Length(arguments[0]);
                    if (length !== 0)
                        return this.Mult(arguments[0], 1 / length);
                }
            }
        }
    });
}


/**
 * @name        Particle
 * @description Definition of a single particle.
 * @module      FWGE.Game.ParticleSystem
 */
function Particle(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "PARTICLE ";
    
    Item.call(this, request);
}
/**
 * @name        ParticleSystem
 * @description Definition of a particle system.
 * @module      FWGE.Game
 */
function ParticleSystem(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "PARTICLESYSTEM ";
    
    GameItem.call(this, request);
}


/**
 * @name PhysicsEngine
 * @description Something...
 * @module      FWGE
 */
function PhysicsEngine()
{
    Object.defineProperties(this,
    {
        /**
         * @property    Collision: {Function}
         * @description Constructor for a Colliders object.
         * @see         FWGE.Physics.Colliders
         */
        Colliders:      { value: new Colliders },
        
        /**
         * @property    PhysicsBody: {Function}
         * @description Constructor for a Physics Body.
         * @see         FWGE.Physics.PhysicsBody
         */
        PhysicsBody:    {value: PhysicsBody},
        
        /**
         * @property    PhysicsItem: {Function}
         * @description Constructor for a Physics Body.
         * @see         FWGE.Physics.PhysicsItem
         */
        PhysicsItem:    {value: PhysicsItem},
        
        /**
         * @property    PhysicsMaterial: {Function}
         * @description Constructor for a PhysicsMaterial.
         * @see         FWGE.Physics.PhysicsMaterial
         */
        PhysicsMaterial:{value: PhysicsMaterial},

        /**
         * @constant    Gravity: {Number}
         * @description Gravity in m/s
         */
        Gravity:        { value: -9.8 },

        /**
         * @function    Init: void
         * @description Initializes the physics engine
         */
        Init:
        {
            value: function Init()
            {

            }
        },

        /**
         * @function    PhysicsUpdate: void
         * @description Initializes the physics engine
         */
        PhysicsUpdate:
        {
            value: function PhysicsUpdate()
            {

            }
        }
    });
}


/**
 * @name PhysicsItem
 * @description The physics item
 * @module      FWGE.Physics
 * @param       request: {Object}
 */
function PhysicsItem(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "PHYSICSITEM ";

    GameItem.call(this, request);

    var _Collision = request.collision instanceof Collision ? request.collision : undefined;
    var _PhysicsMaterial = request.material instanceof PhysicsMaterial ? request.material : undefined;
    
    Object.defineProperties(this,
    {
        /**
         * @property    PhysicsBody: {PhysicsBody} [read]
         * @description Add some words...
         */
        PhysicsBody: { value: request.body instanceof PhysicsBody ? request.body : new PhysicsBody() },

        /**
         * @property    Collision: {Collision} [read|write]
         * @description Add some words...
         */
        Collision:
        {
            get: function getCollision() { return _Collision },
            set: function setCollision()
            {
                if (arguments[0] instanceof Collision)
                {
                    _Collision = arguments[0];
                    _Collision.PhysicsItem = this;
                }
                else if (arguments[0] === undefined)
                {
                    _Collision.PhysicsItem = undefined;
                    _Collision = undefined;
                }
            }
        },

        /**
         * @property    PhysicsMaterial: {PhysicsMaterial} [read|write]
         * @description Add some words...
         */
        PhysicsMaterial:
        {
            get: function getPhysicsMaterial() { return _PhysicsMaterial },
            set: function setPhysicsMaterial()
            {
                if (arguments[0] instanceof PhysicsMaterial || undefined)
                    _PhysicsMaterial = arguments[0];
            }
        },

        /**
         * @property    PhysicsUpdate: {Function}
         * @description Update the physics stuffs...
         */
        PhysicsUpdate:
        {
            value: function PhysicsUpdate()
            {
                if (!this.PhysicsBody.LockY)
                {
                    this.PhysicsBody.Velocity += (FWGE.Physics.Gravity * (FWGE.Game.Time.Delta / 1000));
                    this.GameObject.Transform.Position.Y += this.PhysicsBody.Velocity;
                }
            }
        }
    });
}


var __PHYSICSMATERIAL__ = [];

/**
 * @name        PhysicsMaterial
 * @description Some words of encouragement
 */
function PhysicsMaterial(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "PHYSICSMATERIAL ";

    Item.call(this, request);
}
/**
 * @name PhysicsBody
 * @description This object provides the masic physical properties of an object.
 * @module      FWGE.Physics
 */
function PhysicsBody(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "PHYSICSBODY ";

    Item.call(this, request);

    var _Mass       = typeof request.mass  === 'number' ?  request.mass  : 1.0; 
    var _LockX      = typeof request.lockx === 'boolean'?  request.lockx : true;
    var _LockY      = typeof request.locky === 'boolean'?  request.locky : true;
    var _LockZ      = typeof request.lockz === 'boolean'?  request.lockz : true;
    var _Grounded   = false;
    var _Velocity   = 0.0;
    
    Object.defineProperties(this,
    {
        /**
         * @property    Velocity: {Number} [read|write]
         * @description The mass of the gameobject this physics body is attached to.
         */
        Velocity:
        {
            get: function getVelocity() { return _Velocity; },
            set: function setVelocity()
            {
                if (typeof arguments[0] === 'number')
                    _Velocity = arguments[0];
            },
        },
        /**
         * @property    Mass: {Number} [read|write]
         * @description The mass of the gameobject this physics body is attached to.
         */
        Mass:
        {
            get: function getMass() { return _Mass; },
            set: function setMass()
            {
                if (typeof arguments[0] === 'number' && arguments[0] >= 0.0)
                    _Mass = arguments[0];
            },
        },
        
        /**
         * @property    LockX: {Boolean} [read|write]
         * @description Determines whether gravity will affect it along the x-axis
         */
        LockX:
        {
            get: function getLockX() { return _LockX; },
            set: function setLockX()
            {
                if (typeof arguments[0] === 'boolean')
                    _LockX = arguments[0];
            },
        },
        
        /**
         * @property    LockY: {Boolean} [read|write]
         * @description Determines whether gravity will affect it along the y-axis
         */
        LockY:
        {
            get: function getLockY() { return _LockY; },
            set: function setLockY()
            {
                if (typeof arguments[0] === 'boolean')
                    _LockY = arguments[0];
            },
        },
        
        /**
         * @property    LockZ: {Boolean} [read|write]
         * @description Determines whether gravity will affect it along the z-axis
         */
        LockZ:
        {
            get: function getLockZ() { return _LockZ; },
            set: function setLockZ()
            {
                if (typeof arguments[0] === 'boolean')
                    _LockZ = arguments[0];
            },
        },
        
        /**
         * @property    Grounded: {Boolean} [read]
         * @description Determines whether the object is on top of another
         */
        Grounded: { get: function IsGrounded() { return _Grounded; } }
    });
}


/**
 * @name 		Colliders
 * @description This module creates collision objects.
 * @module      FWGE.Physics
 */
function Colliders()
{
	Object.defineProperties(this, 
	{
		/**
		 * @function	BoxCollider: {BoxCollider}
		 * @description	A cube-shaped collider	
		 */
		BoxCollider: { value: function CreateBoxCollider() { return new BoxCollider(arguments); } },

		/**
		 * @function	SphereCollider: {SphereCollider}
		 * @description	A cube-shaped collider	
		 */
		SphereCollider: { value: function CreateSphereCollider() { return new SphereCollider(arguments); } }
	});
}
/**
 * @name        Collider
 * @description This is the base object for collision objects
 * @module      FWGE.Physics
 */
function Collider(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "COLLISION ";
    
    Item.call(this, request);

    var _PhysicsItem = request.parent instanceof PhysicsItem ? request.parent : undefined;

    Object.defineProperties(this,
    {
        /**
         * @property    PhysicsItem: {PhysicsItem} [read|write]
         * @description The physics item this collider is attached to
         */
        PhysicsItem:
        {
            get: function getPhysicsItem() { return _PhysicsItem; },
            set: function setPhysicsItem()
            {
                if (arguments[0] instanceof PhysicsItem || arguments === undefined)
                    _PhysicsItem = arguments[0];
            }
        }
    });   
}


/**
 * @name        BoxCollider
 * @description This is a cube-shaped collision object
 * @module      FWGE.Physics
 */
function BoxCollider(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "BOXCOLLISION ";
    
    Collider.call(this, request);

    //define dimensions   
}


/**
 * @name        SphereCollider
 * @description This is a sphere-shaped collision object
 * @module      FWGE.Physics
 */
function SphereCollider(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "SPHERECOLLISION ";
    
    Collider.call(this, request);

    //define dimensions   
}


/**
 * @name        CollisionEvent
 * @description A collision event object
 * @module      FWGE.Physics
 */
function CollisionEvent(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "COLLISIONEVENT ";
    
    Item.call(this, request);

    //define dimensions   
}


/**
 * @name RenderEngine
 * @description This module contains all the visual related aspects of the 
 *              game engine.
 * @module      FWGE 
 */
function RenderEngine()
{
    var _Renderer;

    Object.defineProperties(this,
    {
        /**
         * @property    Colour: {Colour}
         * @description This module creates colour arrays.
         * @see         FWGE.Render.Colour
         */
        Colour:         {value: new Colour()},
        /**
         * @property    Mesh: {Function}
         * @description This is the constructor for a Mesh object.
         * @see         FWGE.Render.Mesh
         */
        Mesh:           {value: function createMesh(){ return new Mesh(arguments[0]); } },
        /**
         * @property    RenderMaterial: {Function}
         * @description This is the constructor for a Render Material.
         * @see         FWGE.Render.RenderMaterial
         */
        RenderMaterial: {value: function createRenderMaterial(){ return new RenderMaterial(arguments[0]); } },
        /**
         * @property    Shader: {Function}
         * @description This is a constructor for a Shader object.
         * @see         FWGE.Render.Shader
         */
        Shader:         {value: function createShader(){ return new Shader(arguments[0]); } },

        /**
         *  @function       Init: {undefined}
         *  @description    Initializes the rendering engine
         */
        Init:
        {
            value: function Init()
            {
                __MODELVIEW__ = new ModelView();
                __PROJECTION__ = new Projection();
                _Renderer = new Renderer();
                GL.enable(GL.DEPTH_TEST);
            }
        },

        /**
         *  @function       RenderUpdate: {undefined}
         *  @description    Updates the rendering to the screen
         */
        RenderUpdate:
        {
            value: function RenderUpdate()
            {
                _Renderer.Render();
            }
        }
    });
}


var __SHADER__ = [];

/**
 * @name        Shader
 * @module      FWGE.Render
 * @description This object links with the vertex and fragment shaders
 */
function Shader(request)
{
    if (!request) request = {};
    if (!request.name || typeof request.name !== 'string') return;
    if (!request.vertexShader || typeof request.vertexShader !== 'string') return;
    if (!request.fragmentShader || typeof request.fragmentShader !== 'string') return;
    
    request.type = "SHADER ";
    Item.call(this, request);

    Object.defineProperties(this,
    {
        /**
         * @property    Program: {WebGLProgram} [read]
         * @description Some description
         */
        Program:        { value: GL.createProgram() },

        /**
         * @property    Texture: {WebGLTexture} [read]
         * @description Some description
         */
        Texture:        { value: GL.createTexture() },

        /**
         * @property    FrameBuffer: {WebGLFramebuffer} [read]
         * @description Some description
         */
        FrameBuffer:    { value: GL.createFramebuffer() },

        /**
         * @property    RenderBuffer: {WebGLRenderbuffer} [read]
         * @description Some description
         */
        RenderBuffer:   { value: GL.createRenderbuffer() },

        /**
         * @property    Height: {Number} [read]
         * @description Some description
         */
        Height:         { value: 1024 },

        /**
         * @property    Width: {Number} [read]
         * @description Some description
         */
        Width:          { value: 1024 }        
    });

    GL.bindFramebuffer(GL.FRAMEBUFFER, this.FrameBuffer); 
    GL.bindRenderbuffer(GL.RENDERBUFFER, this.RenderBuffer);
    GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, this.Width, this.Height);
    GL.bindTexture(GL.TEXTURE_2D, this.Texture);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, this.Width, this.Height, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.Texture, 0);
    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, this.RenderBuffer);  
        
    switch (GL.checkFramebufferStatus(GL.FRAMEBUFFER))
    {
        case GL.FRAMEBUFFER_COMPLETE: 
            console.log("Complete");
        break;

        case GL.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 
            console.log("Incomplete Attachment");
        break;

        case GL.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 
            console.log("Missing Attachment");
        break;

        case GL.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 
            console.log("Dimensions");
        break;

        case GL.FRAMEBUFFER_UNSUPPORTED: 
            console.log("Unsuppported");
        break;        
    }
        
    GL.bindTexture(GL.TEXTURE_2D, null);
    GL.bindRenderbuffer(GL.RENDERBUFFER, null);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
    
    
    var vs = GL.createShader(GL.VERTEX_SHADER);
    GL.shaderSource(vs, request.vertexShader);
    GL.compileShader(vs);
    if (!GL.getShaderParameter(vs, GL.COMPILE_STATUS))
    {
        throw new Error("Vertex Shader: " + GL.getShaderInfoLog(vs));
        return;
    }
    
    var fs = GL.createShader(GL.FRAGMENT_SHADER);
    GL.shaderSource(fs, request.fragmentShader);
    GL.compileShader(fs);
    if (!GL.getShaderParameter(fs, GL.COMPILE_STATUS))
    {
        throw new Error("Fragment Shader: " + GL.getShaderInfoLog(fs));
        return;
    }        
    
    GL.attachShader(this.Program, vs);
    GL.attachShader(this.Program, fs);
    GL.linkProgram(this.Program);
    if (!GL.getProgramParameter(this.Program, GL.LINK_STATUS)) return;
    
    GL.useProgram(this.Program);
        
    Object.defineProperties(this,
    {
        Attributes:
        { 
            value:
            {
                Position:               GL.getAttribLocation(this.Program, "A_Position"),
                Colour:                 GL.getAttribLocation(this.Program, "A_Colour"),
                UV:                     GL.getAttribLocation(this.Program, "A_UV"),
                Normal:                 GL.getAttribLocation(this.Program, "A_Normal")
            }
        },
        Uniforms:
        {
            value:
            {
                Material:
                {
                    Ambient:            GL.getUniformLocation(this.Program, "U_Material.Ambient"),
                    Diffuse:            GL.getUniformLocation(this.Program, "U_Material.Diffuse"),
                    Specular:           GL.getUniformLocation(this.Program, "U_Material.Specular"),
                    Shininess:          GL.getUniformLocation(this.Program, "U_Material.Shininess"),
                    Alpha:              GL.getUniformLocation(this.Program, "U_Material.Alpha"),

                    HasImage:           GL.getUniformLocation(this.Program, "U_Material.HasImage"),
                    HasBump:            GL.getUniformLocation(this.Program, "U_Material.HasBump"),
                    HasSpecular:        GL.getUniformLocation(this.Program, "U_Material.HasSpecular"),
                },
                Matrix:
                {
                    ModelView:          GL.getUniformLocation(this.Program, "U_Matrix.ModelView"),
                    Projection:         GL.getUniformLocation(this.Program, "U_Matrix.Projection"),
                    Normal:             GL.getUniformLocation(this.Program, "U_Matrix.Normal")
                },
                Light:
                {
                    Ambient:
                    {
                        Colour:         GL.getUniformLocation(this.Program, "U_Ambient.Colour"),
                        Intensity:      GL.getUniformLocation(this.Program, "U_Ambient.Intensity")
                    },
                    Directional:
                    {
                        Colour:         GL.getUniformLocation(this.Program, "U_Directional.Colour"),
                        Intensity:      GL.getUniformLocation(this.Program, "U_Directional.Intensity"),
                        Direction:      GL.getUniformLocation(this.Program, "U_Directional.Direction")
                    },
                    Point:
                    [
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[0].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[0].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[0].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[0].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[0].Angle")
                        },
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[1].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[1].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[1].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[1].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[1].Angle")
                        },
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[2].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[2].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[2].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[2].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[2].Angle")
                        },
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[3].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[3].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[3].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[3].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[3].Angle")
                        },
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[4].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[4].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[4].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[4].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[4].Angle")
                        },
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[5].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[5].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[5].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[5].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[5].Angle")
                        },
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[6].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[6].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[6].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[6].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[6].Angle")
                        },
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[7].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[7].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[7].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[7].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[7].Angle")
                        }
                    ],
                    PointCount:         GL.getUniformLocation(this.Program, "U_Point_Count"),
                },
                Sampler:
                {
                    Image:              GL.getUniformLocation(this.Program, "U_Sampler.Image"),
                    Bump:               GL.getUniformLocation(this.Program, "U_Sampler.Bump"),
                    Specular:           GL.getUniformLocation(this.Program, "U_Sampler.Specular")
                }
            }
        }
    });
    
    GL.useProgram(null);
    
    __SHADER__.push(this);
}


/**
 * @name Colour
 * @description This module is used to create simple 3 valued arrays
 *              representing the rgb values of colours.
 * @module      FWGE.Render
 */
function Colour()
{
    Object.defineProperties(this,
    {
        /**
         * @function    Create: {Float32Array}
         * @description Creates a new Float32Array array. These arrays have R,G, and B accessors.
         * @param       {Float32Array}  [nullable, override 1]
         * @param       {Number}        [nullable, override 2]
         * @param       {Number}        [nullable, override 2]
         * @param       {Number}        [nullable, override 2]
         */
        Create:
        {
            value: function Create()
            {
                var $ = new Float32Array(3);

                $[0] = typeof arguments[0] === 'number' ? arguments[0] : (typeof arguments[0][0] === 'number' ? arguments[0][0] : 0);
                $[1] = typeof arguments[1] === 'number' ? arguments[1] : (typeof arguments[0][1] === 'number' ? arguments[0][1] : 0);
                $[2] = typeof arguments[2] === 'number' ? arguments[2] : (typeof arguments[0][2] === 'number' ? arguments[0][2] : 0);

                Object.defineProperties($,
                {
                    Type: { value: ["COLOUR"] },
                    R:
                    {
                        get: function getR(){ return $[0]; },
                        set: function setR()
                        {
                            if (typeof arguments[0] === 'number')
                                $[0] = Math.clamp(arguments[0], 0, 1);
                        },
                    },
                    G:
                    {
                        get: function getG(){ return $[1]; },
                        set: function setG()
                        {
                            if (typeof arguments[0] === 'number')
                                $[1] = Math.clamp(arguments[0], 0, 1);
                        },
                    },
                    B:
                    {
                        get: function getB(){ return $[2]; },
                        set: function setB()
                        {
                            if (typeof arguments[0] === 'number')
                                $[2] = Math.clamp(arguments[0], 0, 1);
                        },
                    }
                });
                
                return $;
            }
        }
    });
}


var __MESH__ = [];

/**
 * @name        Mesh
 * @description The vertex array buffer containers
 * @module      FWGE.Render
 */
function Mesh(request)
{   
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "MESH ";
    
    GameItem.call(this, request);
    
    function validate(array, constructor)
    {
        var i = array.length;

        while (--i > 0)
            if (typeof array[i] !== 'number')
                return undefined;

        return new constructor(array);
    }

    request.position    = validate(request.position, Float32Array);
    request.uvs         = validate(request.uvs,     Float32Array);
    request.colours     = validate(request.colours, Float32Array);
    request.normals     = validate(request.normals, Float32Array);
    request.indices     = validate(request.indices, Uint16Array);

    Object.defineProperties(this,
    {
        /**
         * @constant    PositionBuffer: {WebGLBuffer} [read]
         * @description Buffer containing all the vertex position vectors
         */
        PositionBuffer: { value: GL.createBuffer() },

        /**
         * @constant    UVBuffer: {WebGLBuffer} [read]
         * @description Buffer containing all the uv coordinate vectors
         */
        UVBuffer: { value: GL.createBuffer() },

        /**
         * @constant    ColourBuffer: {WebGLBuffer} [read]
         * @description Buffer containing all the colour for the vertices
         */
        ColourBuffer: { value: GL.createBuffer() },

        /**
         * @constant    NormalBuffer: {WebGLBuffer} [read]
         * @description Buffer containing all the nromal vectors
         */
        NormalBuffer: { value: GL.createBuffer() },
        
        /**
         * @constant    IndexBuffer: {WebGLBuffer} [read]
         * @description Buffer containing all the indices
         */
        IndexBuffer: { value: GL.createBuffer() },
        
        /**
         * @constant    VertexCount: {Number} [read]
         * @description The number of vertices in the mesh
         */
        VertexCount: { value: !!request.indices ? request.indices.length : 0 }
    });

    if (!!request.position)
    {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.PositionBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, request.position, GL.STATIC_DRAW);
    }
    if (!!request.uvs)
    {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.UVBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, request.uvs, GL.STATIC_DRAW);
    }
    if (!!request.colours)
    {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.ColourBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, request.colours, GL.STATIC_DRAW);
    }
    if (!!request.normals)
    {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.NormalBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, request.normals, GL.STATIC_DRAW);
    }
    if (!!request.indices)
    {
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, request.indices, GL.STATIC_DRAW);
    }
    
    __MESH__.push(this);
}


var __MATERIAL__ = [];

/**
 * @name        Material
 * @description This object defines how the mesh in a gameobject will look
 *              like when rendered to a screen.
 * @module      FWGE.Render
 */
function RenderMaterial(request)
{
    if (!request) request = {};
    request.type = "MATERIAL";
    Item.call(this, request);

    function colour(item)
    {
        if (!item || !(item instanceof Array)) item = [0, 0, 0];
        
        switch (item.length)
        {
            case 0: item.position[0] = 0;
            case 1: item.position[1] = 0;
            case 2: item.position[2] = 0;
        }

        return FWGE.Render.Colour.Create(item);
    }
   
    var _Ambient     = colour(request.ambient);
    var _Diffuse     = colour(request.diffuse);
    var _Specular    = colour(request.specular);
    var _Alpha       = typeof request.alpha     === 'number' && request.alpha     >= 0 ? request.alpha     : 1.0;
    var _Shininess   = typeof request.shininess === 'number' && request.shininess >= 0 ? request.shininess : 5.0;
    var _Shader      = request.shader instanceof Shader ? request.shader : undefined;
    var _ImageMap    = undefined;
    var _BumpMap     = undefined;
    var _SpecularMap = undefined;
    
    Object.defineProperties(this,
    {
        /**
         * @property    Ambient: {Float32Array} [read|write]
         * @description The colour of the material under no light
         */
        Ambient:
        {
            get: function getAmbient() { return _Ambient; },
            set: function setAmbient()
            {
                if (arguments[0].Type === 'COLOUR')
                    FWGE.Game.Maths.Vector3.Set(_Ambient, arguments[0]);
            }
        },

        /**
         * @property    Diffuse: {Float32Array} [read|write]
         * @description The colour of the object under even/flat light
         */
        Diffuse:
        {
            get: function getDiffuse() { return _Diffuse; },
            set: function setDiffuse()
            {
                if (arguments[0].Type === 'COLOUR')
                    FWGE.Game.Maths.Vector3.Set(_Diffuse, arguments[0]);
            }
        },

        /**
         * @property    Specular: {Float32Array} [read|write]
         * @description The colour of the object when reflection specular light
         */
        Specular:
        {
            get: function getSpecular() { return _Specular; },
            set: function setSpecular()
            {
                if (arguments[0].Type === 'COLOUR')
                    FWGE.Game.Maths.Vector3.Set(_Specular, arguments[0]);
            }
        },

        /**
         * @property    Alpha: {Number} [read|write]
         * @description The opacity of the material
         */
        Alpha:
        {
            get: function getAlpha() { return _Alpha; },
            set: function setAlpha()
            {
                if (typeof arguments[0] === 'number')
                    _Alpha = arguments[0];
            }
        },

        /**
         * @property    Shininess: {Number} [read|write]
         * @description This amount of shine the specular light shows
         */
        Shininess:
        {
            get: function getShininess() { return _Shininess; },
            set: function setShininess()
            {
                if (typeof arguments[0] === 'number')
                    _Shininess = arguments[0];
            }
        },

        /**
         * @property    Shader: {Shader} [read|write]
         * @description The shader used to the render
         */
        Shader:
        {
            get: function getShader() { return _Shader; },
            set: function setShader()
            {
                if (arguments[0] instanceof Shader)
                    _Shader = arguments[0];
            }
        },

        /**
         * @property    ImageMap: {WebGLTexture} [read|write]
         * @description The texture map for the material
         */
        ImageMap:
        {
            get: function getImageMap() { return _ImageMap; },
            set: function setImageMap()
            {
                if (arguments[0] instanceof WebGLTexture)
                    _ImageMap = arguments[0];
                else if (arguments[0] === undefined)
                {
                    GL.deleteTexture(_ImageMap);
                    _ImageMap = undefined;
                }
            }
        },

        /**
         * @property    BumpMap: {WebGLTexture} [read|write]
         * @description The bump map for the material
         */
        BumpMap:
        {
            get: function getBumpMap() { return _BumpMap; },
            set: function setBumpMap()
            {
                if (arguments[0] instanceof WebGLTexture)
                    _BumpMap = arguments[0];
                else if (arguments[0] === undefined)
                {
                    GL.deleteTexture(_BumpMap);
                    _BumpMap = undefined;
                }
            }
        },

        /**
         * @property    SpecularMap: {WebGLTexture} [read|write]
         * @description The specular map for the material
         */
        SpecularMap:
        {
            get: function getSpecularMap() { return _SpecularMap; },
            set: function setSpecularMap()
            {
                if (arguments[0] instanceof WebGLTexture)
                    _SpecularMap = arguments[0];
                else if (arguments[0] === undefined)
                {
                    GL.deleteTexture(_SpecularMap);
                    _SpecularMap = undefined;
                }
            }
        }
    });

    this.SetTextures(request);
    
    __MATERIAL__.push(this);
}
Object.defineProperties(RenderMaterial.prototype,
{
    constructor: { value: RenderMaterial },
    
    /**
     * @function    SetTextures: void
     * @description This function simply loads the appropriate textures into memory.   
     * @param       request:        {Object}
     *              > imagemap:     {String}    [null]
     *              > bumpmap:      {String}    [null]
     *              > specularmap:  {String}    [null]
     */
    SetTextures:
    {
        value: function SetTextures(request)
        {
            if (!request) request = {};
            if (typeof request.imagemap === 'string')
            {
                if (!this.ImageMap)
                    this.ImageMap = GL.createTexture();
                apply_image(request.imagemap, this.ImageMap);
            }
            if (typeof request.bumpmap === 'string')
            {
                if (!this.BumpMap)
                    this.BumpMap = GL.createTexture();
                apply_image(request.bumpmap, this.BumpMap);
            }
            if (typeof request.specularmap === 'string')
            {
                if (!this.SpecularMap)
                    this.SpecularMap = GL.createTexture();
                apply_image(request.specularmap, this.Specular);
            }

            function apply_image(src, texture)
            {
                var img = new Image()
                img.onload = function()
                {
                    GL.bindTexture(GL.TEXTURE_2D, texture);
                    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
                    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, img);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
                    GL.generateMipmap(GL.TEXTURE_2D);
                    GL.bindTexture(GL.TEXTURE_2D, null);
                };
                img.src = src;
            }
        }
    }
});


/**
 * @name        ModelView
 * @description This module handles the model view matrices of the
 *              objects within the scene by applying the appropriate
 *              transformations.
 */
function ModelView()
{
    var _Stack  = [];
    
    Object.defineProperties(this,
    {
        /**
         * @function    PushMatrix: void
         * @description Pushes a copy of the last matrix onto the stack. If the stack is
         *              currently empty, an identity matrix is pushed.
         */
        PushMatrix:
        {
            value: function PushMatrix()
            {
                var peek = this.PeekMatrix();
                _Stack.push(FWGE.Game.Maths.Matrix4.Create
                (
                    peek.M11, peek.M12, peek.M13, peek.M14,
                    peek.M21, peek.M22, peek.M23, peek.M24,
                    peek.M31, peek.M32, peek.M33, peek.M34,
                    peek.M41, peek.M42, peek.M43, peek.M44
                ));
            }
        },

        /**
         * @function    PeekMatrix: {Float32Array}
         * @description Returns the matrix on the top of the stack. If the stack
         *              is empty, an identity matrix is returned.
         */
        PeekMatrix:
        {
            value: function PeekMatrix()
            {
                if (_Stack.length === 0)
                {
                    var mat =  FWGE.Game.Maths.Matrix4.Identity();
                    mat.M41 = -FWGE.Game.Camera.Transform.Position.X;
                    mat.M42 = -FWGE.Game.Camera.Transform.Position.Y;
                    mat.M43 = -FWGE.Game.Camera.Transform.Position.Z;
                    return mat;
                }
                else
                    return _Stack[_Stack.length - 1];
            }
        },

        /**
         * @function    PopMatrix: {Float32Array}
         * @description Returns and removes the matrix on the top os the stack.
         */
        PopMatrix:
        {
            value: function PopMatrix()
            {
                return _Stack.pop();
            }
        },

        /**
         * @function    Transform: void
         * @description Performs the appropriate matrix operations for the different
         *              transformations on the the top matrix.
         * @param       transform: {Transform}
         */
        Transform:
        {
            value: function Transform(transform)
            {
                FWGE.Game.Maths.Matrix4.Set
                (
                    this.PeekMatrix(),
                    this.Shear
                    (
                        this.Scale
                        (
                            this.Rotate
                            (
                                this.Translate
                                (
                                    this.PeekMatrix(),
                                    transform.Position
                                ),
                                transform.Rotation
                            ),
                            transform.Scale
                        ),
                        transform.Shear
                    )
                );
            }
        },

        /**
         * @function    Translate: {Float32Array}
         * @description Returns a translation matrix.
         * @param       matrix:         {Float32Array}
         * @param       translation:    {Float32Array}
         */
        Translate:
        {
            value: function Translate(matrix, translation)
            {
                return FWGE.Game.Maths.Matrix4.Create
                (
                    matrix[0],  matrix[1],  matrix[2],  matrix[3],
                    matrix[4],  matrix[5],  matrix[6],  matrix[7],
                    matrix[8],  matrix[9], matrix[10], matrix[11],

                    matrix[0] * translation[0] + matrix[4] * translation[1] +  matrix[8] * translation[2] + matrix[12],
                    matrix[1] * translation[0] + matrix[5] * translation[1] +  matrix[9] * translation[2] + matrix[13],
                    matrix[2] * translation[0] + matrix[6] * translation[1] + matrix[10] * translation[2] + matrix[14],
                    matrix[3] * translation[0] + matrix[7] * translation[1] + matrix[11] * translation[2] + matrix[15]
                );
            }
        },

        RotateAround:
        {
            value: function RotateAround()
            {
                /* TODO */   
            }
        },

        /**
         * @function    Translate: {Float32Array}
         * @description Returns a rotation matrix.
         * @param       matrix:     {Float32Array}
         * @param       rotation:   {Float32Array}
         */
        Rotate:
        {
            value: function Rotate(matrix, rotation)
            {                    
                return FWGE.Game.Maths.Matrix4.Mult
                (
                    FWGE.Game.Maths.Matrix4.Create
                    (
                        1.0,                   0.0,                    0.0, 0.0,
                        0.0, Math.cos(rotation[0]), -Math.sin(rotation[0]), 0.0,
                        0.0, Math.sin(rotation[0]),  Math.cos(rotation[0]), 0.0,
                        0.0,                   0.0,                    0.0, 1.0
                    ),
                    FWGE.Game.Maths.Matrix4.Mult
                    (
                        FWGE.Game.Maths.Matrix4.Create
                        (
                             Math.cos(rotation[1]), 0.0, Math.sin(rotation[1]), 0.0,
                                               0.0, 1.0,                   0.0, 0.0,
                            -Math.sin(rotation[1]), 0.0, Math.cos(rotation[1]), 0.0,
                                               0.0, 0.0,                   0.0, 1.0
                        ),
                        FWGE.Game.Maths.Matrix4.Mult
                        (
                            FWGE.Game.Maths.Matrix4.Create
                            (
                                 Math.cos(rotation[2]), -Math.sin(rotation[2]), 0.0, 0.0,
                                 Math.sin(rotation[2]),  Math.cos(rotation[2]), 0.0, 0.0,
                                                   0.0,                    0.0, 1.0, 0.0,
                                                   0.0,                    0.0, 0.0, 1.0
                            ),
                            matrix
                        )
                    )
                );
            }
        },

        /**
         * @function    Translate: {Float32Array}
         * @description Returns a scaler matrix.
         * @param       matrix:     {Float32Array}
         * @param       scalers:    {Float32Array}
         */
        Scale:
        {
            value: function Scale(matrix, scalers)
            {                    
                return FWGE.Game.Maths.Matrix4.Create
                (
                     matrix[0] * scalers[0],  matrix[1] * scalers[0],  matrix[2] * scalers[0],  matrix[3] * scalers[0],
                     matrix[4] * scalers[1],  matrix[5] * scalers[1],  matrix[6] * scalers[1],  matrix[7] * scalers[1],
                     matrix[8] * scalers[2],  matrix[9] * scalers[2], matrix[10] * scalers[2], matrix[11] * scalers[2],
                                 matrix[12],              matrix[13],              matrix[14],              matrix[15],
                                 matrix[12],              matrix[13],              matrix[14],              matrix[15]
                );
            }
        },

        /**
         * @function    Shear: {Float32Array}
         * @description Returns a shearing matrix.
         * @param       matrix:    {Float32Array}
         * @param       angles:    {Float32Array}
         */
        Shear:
        {
            value: function Shear(matrix, angles)
            {
                var phi   = Math.radian(angles[0]);
                var theta = Math.radian(angles[1]);
                var rho   = Math.radian(angles[2]);

                return FWGE.Game.Maths.Matrix4.Mult
                (
                    FWGE.Game.Maths.Matrix4.Create
                    (
                                  1.0,                0.0, Math.tan(rho), 0.0,
                        Math.tan(phi),                1.0,           0.0, 0.0,
                                  0.0, Math.tan(theta),           1.0, 0.0,
                                  0.0,                0.0,           0.0, 1.0
                    ),
                    matrix
                );
            }
        }
    });
}


/**
 * @name Projection
 * @description This module handles the matrices regarding the camera's current
 *              view mode, and its orientation within the scene.
 * @module      FWGE.Render
 */
function Projection()
{
    var _Camera = FWGE.Game.Maths.Matrix4.Identity();
    
    function Orthographic(left, right, top, bottom, near, far, theta, phi)
    {
        theta   = Math.cot(Math.radian(theta));
        phi     = Math.cot(Math.radian(phi));

        left    -= near * theta;
        right   -= near * theta;
        top     -= near * phi;
        bottom  -= near * phi;

        FWGE.Game.Maths.Matrix4.Set
        (
            _Camera,

                          2 / (right - left),                                0,                            0, 0,
                                           0,               2 / (top - bottom),                            0, 0,
                                       theta,                              phi,            -2 / (far - near), 0,
            -(left + right) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
        );
        
    }
    
    function Perspective(field_of_view, aspect_ratio, near, far)
    {
        var top     = near * Math.tan(Math.radian(field_of_view));
        var right   = top * aspect_ratio;
        
        var left    = -right;
        var bottom  = -top;
        var width   = right - left;
        var height  = top - bottom;
        var depth   = far - near;

        FWGE.Game.Maths.Matrix4.Set
        (
            _Camera,

                  2 * near / width,                       0,                         0,  0,
                                 0,       2 * near / height,                         0,  0,
            (right + left) / width, (top + bottom) / height,     -(far + near) / depth, -1,
                                 0,                       0, -(2 * far * near) / depth,  1
        );
    }
    
    Object.defineProperties(this,
    {
        ProjectionUpdate:
        {
            value: function ProjectionUpdate()
            {                            
                switch (FWGE.Game.Camera.Mode)
                {
                    case FWGE.Game.Camera.PERSPECTIVE:
                        Perspective
                        (
                            FWGE.Game.Camera.FOV,
                            FWGE.Game.Camera.Aspect,
                            FWGE.Game.Camera.Near,
                            FWGE.Game.Camera.Far
                        );
                    break;

                    case FWGE.Game.Camera.ORTHOGRAPHIC:
                        Orthographic
                        (
                            FWGE.Game.Camera.Left,
                            FWGE.Game.Camera.Right,
                            FWGE.Game.Camera.Top,
                            FWGE.Game.Camera.Bottom,
                            FWGE.Game.Camera.Near,
                            FWGE.Game.Camera.Far,
                            FWGE.Game.Camera.Theta,
                            FWGE.Game.Camera.Phi
                        );
                    break;
                }
            }
        },
        
        GetViewer: { value: function GetViewer() { return _Camera; } }
    });
}



var __MODELVIEW__;
var __PROJECTION__;

/**
 * @name        Renderer
 * @description This module handles the actual rendering of the scene to
 *              the screen.
 * @module      FWGE.Render
 */
function Renderer()
{
    var _Shader = (function()
    {
        var vertexShader = "attribute vec3 A_Position;\nattribute vec2 A_UV;\n\nuniform mat4 P;\nuniform mat4 MV;\n\nvarying vec2 V_UV;\n\nvoid main(void)\n{\n\tV_UV = A_UV;\n\tgl_Position = P * MV * vec4(A_Position, 1.0);\n}\n";
        var fragmentShader = "precision mediump float;\n\nconst int MAX_SHADERS = 8;\nuniform int U_Sampler_Count;\nuniform sampler2D U_Samplers[8];\n\nvarying vec2 V_UV;\n\nvoid main(void)\n{\n\t/*for (int i = 0; i < MAX_SHADERS; ++i)\n\t{\n\t\tif (i == U_Sampler_Count) break;\n\t\tgl_FragColor *= texture2D(U_Samplers[i], V_UV);\n\t}*/\n\tgl_FragColor = vec4(1.0);\n}\n";

        console.log("=======================================================\n"+vertexShader+"=======================================================\n"+fragmentShader+"=======================================================\n");

        function FinalShader()
        {
            var vs = GL.createShader(GL.VERTEX_SHADER);
            GL.shaderSource(vs, vertexShader);
            GL.compileShader(vs);

            var fs = GL.createShader(GL.FRAGMENT_SHADER);
            GL.shaderSource(fs, fragmentShader);
            GL.compileShader(fs);
            
            this.Program = GL.createProgram();

            GL.attachShader(this.Program, vs);
            GL.attachShader(this.Program, fs);
            GL.linkProgram(this.Program);            
            GL.useProgram(this.Program);
            
            this.PositionPointer = GL.getAttribLocation(this.Program, "A_Position");
            GL.enableVertexAttribArray(this.PositionPointer);
            this.UVPointer = GL.getAttribLocation(this.Program, "A_UV");
            GL.enableVertexAttribArray(this.UVPointer);

            this.Samplers = [];
            for (var  i = 0; i < 8; ++i)
                this.Samplers.push(GL.getUniformLocation(this.Program, "U_Samplers[" + i + "]"));
            this.SamplerCount = GL.getUniformLocation(this.Program, "U_Sampler_Count");

            this.ModelView = GL.getUniformLocation(this.Program, "MV");
            this.Projection = GL.getUniformLocation(this.Program, "P");

            this.PositionBuffer = GL.createBuffer();
            GL.bindBuffer(GL.ARRAY_BUFFER, this.PositionBuffer);
            GL.bufferData(GL.ARRAY_BUFFER, new Float32Array([ -1.0,1.0,0.0, -1.0,-1.0,0.0, 1.0,-1.0,0.0, 1.0,1.0,0.0 ]), GL.STATIC_DRAW);

            this.UVBuffer = GL.createBuffer();
            GL.bindBuffer(GL.ARRAY_BUFFER, this.UVBuffer);
            GL.bufferData(GL.ARRAY_BUFFER, new Float32Array([ 0.0,1.0, 0.0,0.0, 1.0,0.0, 1.0,1.0 ]), GL.STATIC_DRAW);

            this.IndexBuffer = GL.createBuffer();
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), GL.STATIC_DRAW);
            
            GL.useProgram(null);
        }

        return new FinalShader();
    })();

    console.log(_Shader);

    Object.defineProperties(this,
    {
        Render:
        {
            value: function Render()
            {
                this.ClearBuffers();

                var i = __OBJECT__.length;
                while (--i >= 0)
                {
                    this.SetGlobalUniforms();
                    this.RenderObject(__OBJECT__[i]);
                }

                //this.FinalDraw();
            }
        },

        ClearBuffers:
        {
            value: function ClearBuffers()
            {
                var i = __SHADER__.length;
                while (--i >= 0)
                {
                    var shader = __SHADER__[i];

                    GL.bindFramebuffer(GL.FRAMEBUFFER, shader.FrameBuffer);
                    GL.viewport(0, 0, shader.Width, shader.Height);
                    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
                }
                
                GL.bindFramebuffer(GL.FRAMEBUFFER, null);
                GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
                GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
            }
        },

        RenderObject:
        {
            value: function RenderObject(object)
            {
                
                __MODELVIEW__.PushMatrix();
                __MODELVIEW__.Transform(object.Transform);
                
                var i = object.Children.length;
                while (--i >= 0)
                    this.RenderObject(object.Children[i]);
                
                if (!!object.Mesh && !!object.RenderMaterial)
                {
                    var shader = object.RenderMaterial.Shader

                    GL.useProgram(shader.Program);
                    
                    GL.enableVertexAttribArray(shader.Attributes.Position);
                    if (shader.Attributes.Normal !== -1) GL.enableVertexAttribArray(shader.Attributes.Normal);
                    if (shader.Attributes.Colour !== -1) GL.enableVertexAttribArray(shader.Attributes.Colour);
                    if (shader.Attributes.UV !== -1) GL.enableVertexAttribArray(shader.Attributes.UV);

                    if (object.RenderMaterial.Alpha !== 1.0)
                    {
                        GL.enable(GL.BLEND);
                        GL.disable(GL.DEPTH_TEST);
                        GL.blendFunc(GL.SRC_ALPHA, GL.ONE);
                    }
                    
                    this.BindAttributes(object.Mesh, object.RenderMaterial, shader.Attributes);
                    this.SetObjectUniforms(object.RenderMaterial, shader.Uniforms);
                    this.Draw(object.Mesh.VertexCount, shader.FrameBuffer);
                    
                    if (object.RenderMaterial.Alpha !== 1.0)
                    {
                        GL.enable(GL.DEPTH_TEST);
                        GL.disable(GL.BLEND);
                    }
            
                    GL.disableVertexAttribArray(shader.Attributes.Position);
                    if (shader.Attributes.Normal !== -1) GL.disableVertexAttribArray(shader.Attributes.Normal);
                    if (shader.Attributes.Colour !== -1) GL.disableVertexAttribArray(shader.Attributes.Colour);
                    if (shader.Attributes.UV !== -1) GL.disableVertexAttribArray(shader.Attributes.UV);

                    GL.useProgram(null);
                }
                   
                __MODELVIEW__.PopMatrix();
            }
        },

        BindAttributes:
        {
            value: function BindAttributes(mesh, material, attributes)
            {
                GL.bindBuffer(GL.ARRAY_BUFFER, mesh.PositionBuffer);
                GL.vertexAttribPointer(attributes.Position, 3, GL.FLOAT, false, 0, 0);
                
                if (attributes.UV !== -1)
                {
                    if (!!mesh.UVBuffer)
                    {
                        GL.bindBuffer(GL.ARRAY_BUFFER, mesh.UVBuffer);
                        GL.vertexAttribPointer(attributes.UV, 2, GL.FLOAT, false, 0, 0);
                    }
                    else
                        GL.disableVertexAttribArray(attributes.UV);
                }
                
                if (attributes.Colour !== -1)
                {
                    if (!!mesh.ColourBuffer)
                    {
                        GL.bindBuffer(GL.ARRAY_BUFFER, mesh.ColourBuffer);
                        GL.vertexAttribPointer(attributes.Colour, 3, GL.FLOAT, false, 0, 0);                            
                    }
                    else
                        GL.disableVertexAttribArray(attributes.Colour);
                }
                
                if (attributes.Normal !== -1)
                {
                    if (!!mesh.NormalBuffer)
                    {
                        GL.bindBuffer(GL.ARRAY_BUFFER, mesh.NormalBuffer);
                        GL.vertexAttribPointer(attributes.Normal, 3, GL.FLOAT, false, 0, 0);
                    }
                    else
                        GL.disableVertexAttribArray(attributes.Normal);
                }
                
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);
            }
        },

        SetObjectUniforms:
        {
            value: function SetObjectUniforms(material, uniforms)
            {
                GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, __MODELVIEW__.PeekMatrix());
                GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, this.CalculateNormalMatrix());
                
                GL.uniform3fv(uniforms.Material.Ambient, material.Ambient);
                GL.uniform3fv(uniforms.Material.Diffuse, material.Diffuse);
                GL.uniform3fv(uniforms.Material.Specular, material.Specular);
                GL.uniform1f(uniforms.Material.Shininess, material.Shininess);
                GL.uniform1f(uniforms.Material.Alpha, material.Alpha);
            
                if (!!material.ImageMap)
                {
                    GL.activeTexture(GL.TEXTURE0);
                    GL.bindTexture(GL.TEXTURE_2D, material.ImageMap);
                    GL.uniform1i(uniforms.Material.HasImage, 1);
                    GL.uniform1i(uniforms.Sampler.Image, 0);
                }
                else
                {
                    GL.activeTexture(GL.TEXTURE0);
                    GL.bindTexture(GL.TEXTURE_2D, null);
                    GL.uniform1i(uniforms.Material.HasImage, 0);
                }
                
                if (!!material.BumpMap)
                {
                    GL.activeTexture(GL.TEXTURE1);
                    GL.bindTexture(GL.TEXTURE_2D, material.BumpMap);
                    GL.uniform1i(uniforms.Material.HasBump, 1);
                    GL.uniform1i(uniforms.Sampler.Bump, 1);
                }
                else
                {
                    GL.activeTexture(GL.TEXTURE1);
                    GL.bindTexture(GL.TEXTURE_2D, null);
                    GL.uniform1i(uniforms.Material.HasBump, 0);
                }
                
                if (!!material.SpecularMap)
                {
                    GL.activeTexture(GL.TEXTURE2);
                    GL.bindTexture(GL.TEXTURE_2D, material.SpecularMap);
                    GL.uniform1i(uniforms.Material.HasSpecular, 1);
                    GL.uniform1i(uniforms.Sampler.Specular, 2);
                }
                else
                {
                    GL.activeTexture(GL.TEXTURE2);
                    GL.bindTexture(GL.TEXTURE_2D, null);
                    GL.uniform1i(uniforms.Material.HasBump, 0);
                }
            }
        },

        SetGlobalUniforms:
        {
            value: function SetGlobalUniform()
            {            
                var i = __SHADER__.length;
                while (--i >= 0)
                {
                    var point_count = 0;
                    
                    GL.useProgram(__SHADER__[i].Program);                
                    var uniforms = __SHADER__[i].Uniforms.Light;
                    
                    var j = __LIGHT__.length;
                    while (--j >= 0)
                    {
                        var light = __LIGHT__[j];
                        
                        if (!!light)
                        {
                            switch (light.Type[0])
                            {
                                case "AMBIENTLIGHT":
                                    GL.uniform3fv(uniforms.Ambient.Colour, light.Colour);
                                    GL.uniform1f(uniforms.Ambient.Intensity, light.Intensity);
                                break;
                                    
                                case "DIRECTIONALLIGHT":
                                    GL.uniform3fv(uniforms.Directional.Colour, light.Colour);
                                    GL.uniform1f(uniforms.Directional.Intensity, light.Intensity);
                                    GL.uniform3fv(uniforms.Directional.Direction, light.Direction);
                                break;
                                    
                                case "POINTLIGHT":
                                    __MODELVIEW__.PushMatrix();
                                    __MODELVIEW__.Transform(light.GameObject.Transform);
                                    var pos = __MODELVIEW__.PopMatrix();

                                    GL.uniform3fv(uniforms.Point[point_count].Colour, light.Colour);
                                    GL.uniform1f(uniforms.Point[point_count].Intensity, light.Intensity);
                                    GL.uniform3f(uniforms.Point[point_count].Position, pos.M41, pos.M42, pos.M43);
                                    GL.uniform1f(uniforms.Point[point_count].Radius, light.Radius);
                                    GL.uniform1f(uniforms.Point[point_count].Angle, light.Angle);

                                    point_count++;
                                break;
                            }
                        }
                    }

                    GL.uniform1i(uniforms.PointCount, point_count);
                    
                    // SET UNIFORM FOR NUMBER OF POINT LIGHTS
                    GL.uniformMatrix4fv(__SHADER__[i].Uniforms.Matrix.Projection, false, __PROJECTION__.GetViewer());
                }
                
                GL.useProgram(null);
            }
        },

        CalculateNormalMatrix:
        {
            value: function CalculateNormalMatrix()
            {
                var mat = __MODELVIEW__.PeekMatrix();
                FWGE.Game.Maths.Matrix4.Inverse(mat);
                return FWGE.Game.Maths.Matrix3.Create
                (
                    mat.M11, mat.M21, mat.M31,
                    mat.M12, mat.M22, mat.M32,
                    mat.M13, mat.M23, mat.M33
                );
            }
        },

        Draw:
        {
            value: function Draw(vertexCount, framebuffer)
            {
                GL.bindFramebuffer(GL.FRAMEBUFFER, null);
                GL.drawElements(GL.TRIANGLES, vertexCount, GL.UNSIGNED_SHORT, 0);
                GL.bindFramebuffer(GL.FRAMEBUFFER, null);
            }
        },

        FinalDraw:
        {
            value: function FinalDraw()
            {
                GL.useProgram(_Shader.Program);
                GL.bindFramebuffer(GL.FRAMEBUFFER, null);

                GL.bindBuffer(GL.ARRAY_BUFFER, _Shader.PositionBuffer);
                GL.vertexAttribPointer(_Shader.PositionPointer, 3, GL.FLOAT, false, 0, 0);

                GL.bindBuffer(GL.ARRAY_BUFFER, _Shader.UVBuffer);
                GL.vertexAttribPointer(_Shader.UVPointer, 2, GL.FLOAT, false, 0, 0);

                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, _Shader.IndexBuffer);

                GL.uniformMatrix4fv(_Shader.ModelView, false, __MODELVIEW__.PeekMatrix());
                GL.uniformMatrix4fv(_Shader.Projection, false, __PROJECTION__.GetViewer());

                var i =__SHADER__.length;
                GL.uniform1i(_Shader.SamplerCount, 1);
                GL.activeTexture(GL.TEXTURE0);
                GL.bindTexture(GL.TEXTURE_2D, __SHADER__[0].Texture);
                GL.uniform1i(_Shader.Samplers[0], 0);

                /*while (--i >= 0)
                {
                    GL.activeTexture(GL.TEXTURE0 + i);
                    GL.bindTexture(GL.TEXTURE_2D, __SHADER__[i].Texture);
                    GL.uniform1i(_Shader.Samplers[i], i);
                }*/
                
                GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_SHORT, 0);
                
                GL.bindFramebuffer(GL.FRAMEBUFFER, null);
                GL.useProgram(null);
            }
        }
    });

    __PROJECTION__.ProjectionUpdate();
};


/**
 * @name        FWGE
 * @module      {}
 * @description Some description.
 */
function FWGEPrototype()
{
    Object.defineProperties(this,
    {
        /**
         * @property    Game: {GameEngine}
         * @description The main engine.
		 * @see         FWGE.Game
         */
        Game:           { value: new GameEngine() },

        /**
         * @property    Physics: {PhysicsEngine}
         * @description The physics engine.
		 * @see         FWGE.Physics
         */
        Physics:        { value: new PhysicsEngine() },

        /**
         * @property    Render: {RenderEngine}
         * @description The rendering engine.
		 * @see         Render
         */
        Render:         { value: new RenderEngine() },

        /**
         * @function    Init: {undefined}
         * @description Initializes the webgl context and the seperate engines
         * @param       request:     {Object}
         *              > Canvas:    {HTMLCanvasElement}
         *              > Height:    {Number}               [null]
         *              > Width:     {Number}               [null]
         *              > Clear:     {Float32Array}         [null]
         */
        Init: 
        {
            value: function Init(request)
            {
                if (!request) request = {};
                if (!(request.clear instanceof Float32Array) || request.clear.length === 4)
                    request.clear = [0, 0, 0, 0];

                GL = request.canvas.getContext("webgl") || request.canvas.getContext("experimental-webglrequest.");

                if (!GL)
                    throw new Error("Webgl context could not be initialized.");

                GL.clearColor(request.clear[0] || 0, request.clear[1] || 0, request.clear[2] || 0, request.clear[3] || 0);

                this.Game.Init();
                this.Physics.Init();
                this.Render.Init();
            }
        }
    });
}


window.FWGE = new FWGEPrototype();

})();

