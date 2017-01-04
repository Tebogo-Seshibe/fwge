"use strict";

(function()
{
	
var GL = undefined;

Object.defineProperties(Math,
{
    cot: 	{ value: function cot(radian) 				{ return 1 / Math.tan(radian); 					} },
    radian: { value: function radian(degree) 			{ return Math.PI / 180 * degree; 				} },
    clamp: 	{ value: function clamp(value, min, max) 	{ return Math.max(Math.min(value, max), main); 	} }
});

var IDCounter = new function IDCounter(){ var id = 0; this.next = function next(){ return id++ }; };


/*!
 * 	@constructor	GameEngine
 * 	@module			FWGE
 *	@description	Something...
 */
function GameEngine()
{
	var _Running 		= false;
	var _AnimationFrame = undefined;

	Object.defineProperties(this,
	{
		GameObject: 	{value: GameObject},
		Animation: 		{value: Animation},
		Input: 			{value: new Input()},
		Time: 			{value: new Time()},
		Transform: 		{value: Transform},
		Light: 			{value: new Light()},
		Maths: 			{value: new Maths()},
		ParticleSystem: {value: ParticleSystem},
		Particle: 		{value: Particle},
		Camera: 		{value: new Camera()},

        /*!
         *  @function       {undefined: Init}
         *  @description    Initializes the game engine
         */
		Init:
		{
			value: function Init()
			{
				// TODO
			}
		},

        /*!
         *  @function       {undefined: Run}
         *  @description    Runs the main game loop
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

        /*!
         *  @function       {undefined: GameUpdate}
         *  @description    Updates the objects
         */
		GameUpdate:
		{
			value: function GameUpdate()
			{
	            FWGE.Game.Time.TimeUpdate();

	            var i = __OBJECT__.length;
	            while (--i >= 0)
	                __OBJECT__[i].ObjectUpdate();

	            FWGE.Game.Input.InputUpdate();
			}
		},

        /*!
         *  @function       {undefined: Start}
         *  @description    Initiates/resumes the main game loop
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

        /*!
         *  @function       {undefined: Stop}
         *  @description    Suspends the main game loop
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


/*!
 * 	@constructor 	Item
 *	@module 		FWGE.GameEngine
 *	@description 	The base object for every item
 *					used by the game engine.
 *	@param			{GameObject: request}
 *					> {String: type}
 *					> {String: name}
 */
function Item(request)
{
	if (!request) request = {};

	var $ 	  = this;
	var _Name = request.name || "Item";

	Object.defineProperties(this,
	{
        /*!
         *  @property       {String: Type}
         *					> get
         *  @description    A string descriptior for the type of item.
         */
		Type: { value: request.type || "ITEM" },

        /*!
         *  @property       {String: Name}
         *					> get
         *					> set
         *  @description    A string descriptior for the item.
         */
		Name:
		{
			get: function getName() { return _Name; },
			set: function setName(name)
			{
				if (typeof name === 'string')
					_Name = name;
			}
		}
	});
}
/*!
 *  @constructor    GameItem
 *  @module         FWGE.GameEngine
 *  @description    The base container for objects used within the scene.
 *  @param          {Object: request}
 *                  > {GameObject: gameobject}
 */
function GameItem(request)
{
    if (!request) request = {};
    Item.call(this, request);

    var $           = this;
    var _GameObject = request.gameobject;
    
    Object.defineProperties($,
    {
        /*!
         *  @property       {GameObject: GameObject}
         *                  > get
         *                  > set
         *  @description    The GameObject this item is attached to.
         */
        GameObject:
        {
            get: function getGameObject() { return _GameObject; },
            set: function setGameObject(gameobject)
            {
                if (parent instanceof GameObject || gameobject === undefined)
                    _GameObject = gameobject;
            }
        }
    });
}


var __OBJECT__ = [];

/*!
 *  @constructor    GameObject
 *  @module         FWGE.GameEngine
 *  @description    The main object container for object types.   
 *  @param          {Object: request}
 *                  > {Material: material}
 *                  > {Mesh: mesh}
 *                  > {Transform: transform}
 *                  > {Physics: physics}
 *                  > {Animation: animation}
 *                  > {LightObject: lightitem}
 *                  > {Function: begin}
 *                  > {Function: update}
 *                  > {Function: end}
 */
function GameObject(request)
{
    if (!request) request = {};
    request.type = "GAMEOBJECT";
    request.name = typeof request.name === 'string' ? request.name : "GameObject";
    GameItem.call(this, request);

    var _Children       = [];
    var _RenderMaterial = request.material       instanceof RenderMaterial  ? request.material       : undefined;
    var _Mesh           = request.mesh           instanceof Mesh            ? request.mesh           : undefined;
    var _PhysicsItem    = request.physicsitem    instanceof PhysicsItem     ? request.physicsitem    : undefined;
    var _Animation      = request.animation      instanceof Animation       ? request.animation      : undefined;
    var _LightItem      = request.lightitem      instanceof LightItem       ? request.lightitem      : undefined;
    var _ParticleSystem = request.particlesystem instanceof ParticleSystem  ? request.particlesystem : undefined;
    
    var _Begin  = typeof request.begin  === 'function' ? request.begin  : function Begin(){};
    var _Update = typeof request.update === 'function' ? request.update : function Update(){};
    var _End    = typeof request.end    === 'function' ? request.end    : function End(){};
    
    Object.defineProperties(this,
    {
        /*!
         *  @property       {String: ID}
         *                  > get
         *  @description    Something...
         */
        ID: { value: "[go-" + IDCounter.next() + "]" },

        /*!
         *  @property       {Transform: Transform}
         *                  > get
         *  @description    
         */
        Transform: { value: request.transform instanceof Transform ? request.transform : new Transform() },

        /*!
         *  @property       {Array: Children}
         *  @description    
         */
        Children: { get: function getChildren() { return _Children } },

        /*!
        *   @function       {GameObject: AddChild}
         *  @param          {GameObject: gameobject}
         *  @description    Pushes a gameobect to the current object's childrens array, and
         *                  move it down the rendering tree.
         */
        AddChild: 
        {
            value: function AddChild(gameobject)
            {
                if (gameobject instanceof GameObject)
                {
                    _Children.push(gameobject);
                    var index = __OBJECT__.indexOf(gameobject);

                    if (index !== -1)
                        __OBJECT__.slice(index, 1);
                }

                return gameobject;
            }
        },

        /*!
         *   @function       {GameObject: RemoveChild}
         *  @description    Removes a gameobect from the current object's childrens array, and
         *                  moves it up the rendering tree.
         *  @param          {GameObject: gameobject}
         */
        RemoveChild: 
        {
            value: function RemoveChild(gameobject)
            {
                if (gameobject instanceof GameObject)
                {
                    var index = _Children.indexOf(gameobject);

                    if (index !== -1)
                    {
                        _Children.slice(index, 1);
                        __OBJECT__.push(gameobject);
                    }
                }

                return gameobject;
            }
        },

        /*!
         *  @property       {Material: material}
         *                  > get
         *                  > set
         *  @description    Something...
         */
        RenderMaterial:
        {
            get: function getRenderMaterial() { return _RenderMaterial; },
            set: function setRenderMaterial(rendermaterial)
            {
                if (rendermaterial instanceof RenderMaterial || rendermaterial === undefined)
                    _RenderMaterial = rendermaterial;
            }
        },

        /*!
         *  @property       {Mesh: mesh}
         *                  > get
         *                  > set
         *  @description    Something...
         */
        Mesh:
        {
            get: function getMesh() { return _Mesh; },
            set: function setMesh(mesh)
            {
                if (mesh instanceof Mesh || mesh === undefined)
                    _Mesh = mesh;
            }
        },

        /*!
         *  @property       {PhysicsItem: physicsitem}
         *                  > get
         *                  > set
         *  @description    Something...
         */
        PhysicsItem:
        {
            get: function getPhysicsItem() { return _PhysicsItem; },
            set: function setPhysicsItem(physicsitem)
            {
                if (physicsitem instanceof PhysicsItem || physicsitem === undefined)
                    _PhysicsItem = physicsitem;
            }
        },

        /*!
         *  @property       {Animation: animation}
         *                  > get
         *                  > set
         *  @description    Something...
         */
        Animation:
        {
            get: function getAnimation() { return _Animation; },
            set: function setAnimation(animation)
            {
                if (animation instanceof Animation || animation === undefined)
                    _Animation = animation;
            }
        },

        /*!
         *  @property       {ParticleSystem: particlesystem}
         *                  > get
         *                  > set
         *  @description    Something...
         */
        ParticleSystem:
        {
            get: function getParticleSystem() { return _ParticleSystem; },
            set: function setParticleSystem(particlesystem)
            {
                if (particlesystem instanceof ParticleSystem || particlesystem === undefined)
                    _ParticleSystem = particlesystem;
            }
        },

        /*!
         *  @property       {Function: Begin}
         *                  > get
         *                  > set
         *  @description    Something...
         */
        Begin:
        {
            get: function getBegin() { return _Begin; },
            set: function setBegin(begin)
            {
                if (typeof begin === 'function')
                    _Begin = begin;
            }
        },

        /*!
         *  @property       {Function: Update}
         *                  > get
         *                  > set
         *  @description    Something...
         */
        Update:
        {
            get: function getUpdate() { return _Update; },
            set: function setUpdate(update)
            {
                if (typeof update === 'function')
                    _Update = update;
            }
        },

        /*!
         *  @property       {Function: End}
         *                  > get
         *                  > set
         *  @description    Something...
         */
        End:
        {
            get: function getEnd() { return _End; },
            set: function setEnd(end)
            {
                if (typeof end === 'function')
                    _End = end;
            }
        }
    });
    
    __OBJECT__.push(this);
}
Object.defineProperties(GameObject.prototype,
{
    constructor: { value: GameObject },
    
    /*!
     *  @function       {GameObject: Clone}
     *  @description    Something
     *  @param          {GameObject: gameobject}
     */
    Clone:
    {
        value: function Clone(gameobject)
        {       
            var $ = (gameobject instanceof GameObject) ? gameobject : this;

            var clone = new GameObject
            ({
                name:           $.name,
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

    /*!
     *  @function       {undefined: Destroy}
     *  @description    Something
     *  @param          {GameObject: gameobject}
     */
    Destroy:
    {
        value: function Destroy()
        {
            var timeout = typeof arguments[0] === 'number' ? arguments[0] : 0;
            var self = this;
                var i = __OBJECT__.length;
                while (--i >= 0)
                    if (__OBJECT__[i] === self)
                        __OBJECT__ = __OBJECT__.slice(i, i + 1);
            
            setTimeout(function()
            {

            }, timeout * 1000);
        }
    },

    /*!
     *  @function       {undefined: ObjectUpdate}
     *  @description    Something
     *  @param          {GameObject: gameobject}
     */
    ObjectUpdate:
    {
        value: function ObjectUpdate()
        {
            this.Update();
            this.Transform.TransformUpdate();
            if (!!this.PhysicsItem)     this.PhysicsItem.PhysicsUpdate();
            if (!!this.Animation)       this.Animation.AnimationUpdate();
            if (!!this.LightItem)       this.LightItem.LightUpdate();
            if (!!this.ParticleSystem)  this.ParticleSystem.ParticleSystemUpdate();
        }
    }
});


/*!
 *  @constructor    Camera
 *  @module         FWGE.GameEngine
 *  @description    Something...
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
    	PERSPECTIVE:  { value: 0 },
    	ORTHOGRAPHIC: { value: 1 },
        
    	Mode:
    	{ 
    		get: function getMode() { return _Mode; },
    		set: function setMode()
    		{ 
    			if (arguments[0] === this.PERSPECTIVE || arguments[0] === this.ORTHOGRAPHIC)
    				_Mode = arguments[0];
    		}
    	}, 
    	FOV:
    	{ 
    		get: function getFOV() { return _FOV; },
    		set: function setFOV()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_FOV = arguments[0];
    		}
    	},
    	Aspect:
    	{ 
    		get: function getAspect() { return _Aspect; },
    		set: function setAspect()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Aspect = arguments[0];
    		}
    	},
    	Near:
    	{ 
    		get: function getNear() { return _Near; },
    		set: function setNear()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Near = arguments[0];
    		}
    	},
    	Far:
    	{ 
    		get: function getFar() { return _Far; },
    		set: function setFar()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Far = arguments[0];
    		}
    	},
    	Left:
    	{ 
    		get: function getLeft() { return _Left; },
    		set: function setLeft()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Left = arguments[0];
    		}
    	},
    	Right:
    	{ 
    		get: function getRight() { return _Right; },
    		set: function setRight()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Right = arguments[0];
    		}
    	},
    	Top:
    	{ 
    		get: function getTop() { return _Top; },
    		set: function setTop()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Top = arguments[0];
    		}
    	},
    	Bottom:
    	{ 
    		get: function getBottom() { return _Bottom; },
    		set: function setBottom()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Bottom = arguments[0];
    		}
    	},
    	Theta:
    	{ 
    		get: function getTheta() { return _Theta; },
    		set: function setTheta()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Theta = arguments[0];
    		}
    	},
    	Phi:
    	{ 
    		get: function getPhi() { return _Phi; },
    		set: function setPhi()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Phi = arguments[0];
    		}
    	},
        CameraUpdate:
        {
            value: function CameraUpdate()
            {
                GL.canvas.height = GL.canvas.clientHeight;
                GL.canvas.width = GL.canvas.clientWidth;
				_Aspect = GL.drawingBufferWidth/GL.drawingBufferHeight;
            }
        }
    });
}


/*!
 * 	{GameObject: request}
 */
function Animation(request)
{
    if (!request) request = {};
    GameItem.call(this, request);

    
}


function Other()
{
    var $ = this;
    
    Object.defineProperties($,
    {        
        File:     { value: new File() },
        Input:    { value: new Input() },
        Time:     { value: new Time() },
        Physics:     { value: new Physics() },
    });
}


function Time()
{
    var $     = this;
    var _Now  = undefined,
        _Then = undefined;
    
    Object.defineProperties($,
    {
        Delta:      { get: function(){ return (_Now - _Then) / 60; } },
        DeltaTime:  { get: function(){ return _Now - _Then; } },
        Now:        { get: function(){ return new Date(Date.now()); } },
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


/*!
 *  @constructor    Transform
 *  @description    Hello
 *  @param          {Object: request}
 *                  {Array: position}
 *                  {Array: rotation}
 *                  {Array: scale}
 *                  {Array: shear}
 */
function Transform(request)
{
    if (!request) request = {};
    request.type ="TRANSFORM";
    GameItem.call(this, request);
    
    function setup(item)
    {
        if (!item || !(item instanceof Array)) item = [0,0,0];
        if (item.length < 3)
        {
            switch (item.length)
            {
                case 0: item.position[0] = 0;
                case 1: item.position[1] = 0;
                case 2: item.position[2] = 0;
            }
        }

        return FWGE.Game.Maths.Vector3.Create(item);
    }
    
    var $           = this;
    var _Position   = setup(request.position);
    var _Rotation   = setup(request.rotation);
    var _Scale      = setup(request.scale);
    var _Shear      = setup(request.shear);
    
    var _Up         = FWGE.Game.Maths.Vector3.Create(0, 1, 0);
    var _Forward    = FWGE.Game.Maths.Vector3.Create(0, 0, 1);
    var _Right      = FWGE.Game.Maths.Vector3.Create(1, 0, 0);
    
    Object.defineProperties($,
    {
        /*!
         *  @property       {Float32Array: Position}
         *  @description    Hello
         */
        Position:
        {
            get: function getPosition() { return _Position; },
            set: function setPosition()
            {
                if (arguments[0].Type === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Position, arguments[0]);
            }
        },

        /*!
         *  @property       {Float32Array: Rotation}
         *  @description    Hello
         */           
        Rotation:
        {
            get: function getRotation() { return _Rotation; },
            set: function setRotation()
            {
                if (arguments[0].Type === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Rotation, arguments[0]);
            }
        },

        /*!
         *  @property       {Float32Array: Scale}
         *  @description    Hello
         */
        Scale:
        {
            get: function getScale() { return _Scale; },
            set: function setScale()
            {
                if (arguments[0].Type === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Scale, arguments[0]);
            }
        },

        /*!
         *  @property       {Float32Array: Shear}
         *  @description    Hello
         */
        Shear:
        {
            get: function getShear() { return _Shear; },
            set: function setShear()
            {
                if (arguments[0].Type === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Shear, arguments[0]);
            }
        },

        /*!
         *  @property       {Float32Array: Up}
         *  @description    Hello
         */
        Up:         { get: function() { return _Up; } },
        
        /*!
         *  @property       {Float32Array: Forward}
         *  @description    Hello
         */
        Forward:    { get: function() { return _Forward; } },
        
        /*!
         *  @property       {Float32Array: Right}
         *  @description    Hello
         */
        Right:      { get: function() { return _Right; } },
    });
    
    $.TransformUpdate();
}
Object.defineProperties(Transform.prototype,
{
    constructor: {value: Transform},

    /*!
     *  @property       {Float32Array: Position}
     *  @description    Hello
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

/*!
 *  @constructor    Input
 *  @description    The input detector
 */
function Input()
{
    var UP      = 0;
    var PRESS   = 128;
    var DOWN    = 256;
    var END     = 384;

    var _Keys   = new Array(END);
    var _Mouse  = new Array(8);
    var _Axis   = new Array(16);

    for (var i = 0; i < PRESS; ++i)
        _Keys[i] = true;

    for (var i = PRESS; i < END; ++i)
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

        _Keys[key + UP   ]    = true;
        _Keys[key + PRESS]    = false;
        _Keys[key + DOWN ]    = false;
    };
    window.onkeydown = function onkeydown(e)
    {
        var key = handle_event(e);

        _Keys[key + UP   ]    = false;
        _Keys[key + PRESS]    = true;
        _Keys[key + DOWN ]    = true;
    };

    document.body.oncontextmenu = function oncontextmenu(e) { return false; };
    window.onmouseenter = function onmouseenter(e) { var key = handle_event(e) };
    window.onmousemove = function onmousemove(e) { var key = handle_event(e); };
    window.onmouseleave = function onmouseleave(e) { var key = handle_event(e); };
    window.onmousedown = function onmousedown(e) { var key = handle_event(e); };
    window.onmouseup = function onmouseup(e) { var key = handle_event(e); };
    
    Object.defineProperties(this, 
    {
        KEY_F1_UP:      { get: function getF1KeyUp()     { return _Keys[112 + UP   ]; } },
        KEY_F1_PRESS:   { get: function getF1KeyPress()  { return _Keys[112 + PRESS]; } },
        KEY_F1_DOWN:    { get: function getF1KeyDown()   { return _Keys[112 + DOWN ]; } },

        KEY_F2_UP:      { get: function getF2KeyUp()     { return _Keys[113 + UP   ]; } },
        KEY_F2_PRESS:   { get: function getF2KeyPress()  { return _Keys[113 + PRESS]; } },
        KEY_F2_DOWN:    { get: function getF2KeyDown()   { return _Keys[113 + DOWN ]; } },

        KEY_F3_UP:      { get: function getF3KeyUp()     { return _Keys[114 + UP   ]; } },
        KEY_F3_PRESS:   { get: function getF3KeyPress()  { return _Keys[114 + PRESS]; } },
        KEY_F3_DOWN:    { get: function getF3KeyDown()   { return _Keys[114 + DOWN ]; } },

        KEY_F4_UP:      { get: function getF4KeyUp()     { return _Keys[115 + UP   ]; } },
        KEY_F4_PRESS:   { get: function getF4KeyPress()  { return _Keys[115 + PRESS]; } },
        KEY_F4_DOWN:    { get: function getF4KeyDown()   { return _Keys[115 + DOWN ]; } },

        KEY_F5_UP:      { get: function getF5KeyUp()     { return _Keys[116 + UP   ]; } },
        KEY_F5_PRESS:   { get: function getF5KeyPress()  { return _Keys[116 + PRESS]; } },
        KEY_F5_DOWN:    { get: function getF5KeyDown()   { return _Keys[116 + DOWN ]; } },

        KEY_F6_UP:      { get: function getF6KeyUp()     { return _Keys[117 + UP   ]; } },
        KEY_F6_PRESS:   { get: function getF6KeyPress()  { return _Keys[117 + PRESS]; } },
        KEY_F6_DOWN:    { get: function getF6KeyDown()   { return _Keys[117 + DOWN ]; } },

        KEY_F7_UP:      { get: function getF7KeyUp()     { return _Keys[118 + UP   ]; } },
        KEY_F7_PRESS:   { get: function getF7KeyPress()  { return _Keys[118 + PRESS]; } },
        KEY_F7_DOWN:    { get: function getF7KeyDown()   { return _Keys[118 + DOWN ]; } },

        KEY_F8_UP:      { get: function getF8KeyUp()     { return _Keys[119 + UP   ]; } },
        KEY_F8_PRESS:   { get: function getF8KeyPress()  { return _Keys[119 + PRESS]; } },
        KEY_F8_DOWN:    { get: function getF8KeyDown()   { return _Keys[119 + DOWN ]; } },

        KEY_F9_UP:      { get: function getF9KeyUp()     { return _Keys[120 + UP   ]; } },
        KEY_F9_PRESS:   { get: function getF9KeyPress()  { return _Keys[120 + PRESS]; } },
        KEY_F9_DOWN:    { get: function getF9KeyDown()   { return _Keys[120 + DOWN ]; } },

        KEY_F10_UP:     { get: function getF10KeyUp()    { return _Keys[121 + UP   ]; } },
        KEY_F10_PRESS:  { get: function getF10KeyPress() { return _Keys[121 + PRESS]; } },
        KEY_F10_DOWN:   { get: function getF10KeyDown()  { return _Keys[121 + DOWN ]; } },

        KEY_F11_UP:     { get: function getF11KeyUp()    { return _Keys[122 + UP   ]; } },
        KEY_F11_PRESS:  { get: function getF11KeyPress() { return _Keys[122 + PRESS]; } },
        KEY_F11_DOWN:   { get: function getF11KeyDown()  { return _Keys[122 + DOWN ]; } },

        KEY_F12_UP:     { get: function getF12KeyUp()    { return _Keys[123 + UP   ]; } },
        KEY_F12_PRESS:  { get: function getF12KeyPress() { return _Keys[123 + PRESS]; } },
        KEY_F12_DOWN:   { get: function getF12KeyDown()  { return _Keys[123 + DOWN ]; } },


        KEY_0_UP:       { get: function get0KeyUp()    { return _Keys[48 + UP   ]; } },
        KEY_0_PRESS:    { get: function get0KeyPress() { return _Keys[48 + PRESS]; } },
        KEY_0_DOWN:     { get: function get0KeyDown()  { return _Keys[48 + DOWN ]; } },

        KEY_1_UP:       { get: function get1KeyUp()    { return _Keys[49 + UP   ]; } },
        KEY_1_PRESS:    { get: function get1KeyPress() { return _Keys[49 + PRESS]; } },
        KEY_1_DOWN:     { get: function get1KeyDown()  { return _Keys[49 + DOWN ]; } },

        KEY_2_UP:       { get: function get2KeyUp()    { return _Keys[50 + UP   ]; } },
        KEY_2_PRESS:    { get: function get2KeyPress() { return _Keys[50 + PRESS]; } },
        KEY_2_DOWN:     { get: function get2KeyDown()  { return _Keys[50 + DOWN ]; } },

        KEY_3_UP:       { get: function get3KeyUp()    { return _Keys[51 + UP   ]; } },
        KEY_3_PRESS:    { get: function get3KeyPress() { return _Keys[51 + PRESS]; } },
        KEY_3_DOWN:     { get: function get3KeyDown()  { return _Keys[51 + DOWN ]; } },

        KEY_4_UP:       { get: function get4KeyUp()    { return _Keys[52 + UP   ]; } },
        KEY_4_PRESS:    { get: function get4KeyPress() { return _Keys[52 + PRESS]; } },
        KEY_4_DOWN:     { get: function get4KeyDown()  { return _Keys[52 + DOWN ]; } },

        KEY_5_UP:       { get: function get5KeyUp()    { return _Keys[53 + UP   ]; } },
        KEY_5_PRESS:    { get: function get5KeyPress() { return _Keys[53 + PRESS]; } },
        KEY_5_DOWN:     { get: function get5KeyDown()  { return _Keys[53 + DOWN ]; } },

        KEY_6_UP:       { get: function get6KeyUp()    { return _Keys[54 + UP   ]; } },
        KEY_6_PRESS:    { get: function get6KeyPress() { return _Keys[54 + PRESS]; } },
        KEY_6_DOWN:     { get: function get6KeyDown()  { return _Keys[54 + DOWN ]; } },

        KEY_7_UP:       { get: function get7KeyUp()    { return _Keys[55 + UP   ]; } },
        KEY_7_PRESS:    { get: function get7KeyPress() { return _Keys[55 + PRESS]; } },
        KEY_7_DOWN:     { get: function get7KeyDown()  { return _Keys[55 + DOWN ]; } },

        KEY_8_UP:       { get: function get8KeyUp()    { return _Keys[56 + UP   ]; } },
        KEY_8_PRESS:    { get: function get8KeyPress() { return _Keys[56 + PRESS]; } },
        KEY_8_DOWN:     { get: function get8KeyDown()  { return _Keys[56 + DOWN ]; } },

        KEY_9_UP:       { get: function get9KeyUp()    { return _Keys[57 + UP   ]; } },
        KEY_9_PRESS:    { get: function get9KeyPress() { return _Keys[57 + PRESS]; } },
        KEY_9_DOWN:     { get: function get9KeyDown()  { return _Keys[57 + DOWN ]; } },


        KEY_TAB_UP:          { get: function getTABKeyUp()          { return _Keys[9 + UP   ]; } },
        KEY_TAB_PRESS:       { get: function getTABKeyPress()       { return _Keys[9 + PRESS]; } },
        KEY_TAB_DOWN:        { get: function getTABKeyDown()        { return _Keys[9 + DOWN ]; } },

        KEY_CAPS_UP:         { get: function getCAPSKeyUp()         { return _Keys[20 + UP   ]; } },
        KEY_CAPS_PRESS:      { get: function getCAPSKeyPress()      { return _Keys[20 + PRESS]; } },
        KEY_CAPS_DOWN:       { get: function getCAPSKeyDown()       { return _Keys[20 + DOWN ]; } },

        KEY_SHIFT_UP:        { get: function getSHIFTKeyUp()        { return _Keys[16 + UP   ]; } },
        KEY_SHIFT_PRESS:     { get: function getSHIFTKeyPress()     { return _Keys[16 + PRESS]; } },
        KEY_SHIFT_DOWN:      { get: function getSHIFTKeyDown()      { return _Keys[16 + DOWN ]; } },

        KEY_CTRL_UP:         { get: function getCTRLKeyUp()         { return _Keys[17 + UP   ]; } },
        KEY_CTRL_PRESS:      { get: function getCTRLKeyPress()      { return _Keys[17 + PRESS]; } },
        KEY_CTRL_DOWN:       { get: function getCTRLKeyDown()       { return _Keys[17 + DOWN ]; } },

        KEY_ALT_UP:          { get: function getALTKeyUp()          { return _Keys[18 + UP   ]; } },
        KEY_ALT_PRESS:       { get: function getALTKeyPress()       { return _Keys[18 + PRESS]; } },
        KEY_ALT_DOWN:        { get: function getALTKeyDown()        { return _Keys[18 + DOWN ]; } },

        KEY_BACKSPACE_UP:    { get: function getBACKSPACEKeyUp()    { return _Keys[8 + UP   ]; } },
        KEY_BACKSPACE_PRESS: { get: function getBACKSPACEKeyPress() { return _Keys[8 + PRESS]; } },
        KEY_BACKSPACE_DOWN:  { get: function getBACKSPACEKeyDown()  { return _Keys[8 + DOWN ]; } },

        KEY_ENTER_UP:        { get: function getENTERKeyUp()        { return _Keys[13 + UP   ]; } },
        KEY_ENTER_PRESS:     { get: function getENTERKeyPress()     { return _Keys[13 + PRESS]; } },
        KEY_ENTER_DOWN:      { get: function getENTERKeyDown()      { return _Keys[13 + DOWN ]; } },


        KEY_UP_UP:       { get: function getUPKeyUp()       { return _Keys[38 + UP   ]; } },
        KEY_UP_PRESS:    { get: function getUPKeyPress()    { return _Keys[38 + PRESS]; } },
        KEY_UP_DOWN:     { get: function getUPKeyDown()     { return _Keys[38 + DOWN ]; } },

        KEY_LEFT_UP:     { get: function getLEFTKeyUp()     { return _Keys[37 + UP   ]; } },
        KEY_LEFT_PRESS:  { get: function getLEFTKeyPress()  { return _Keys[37 + PRESS]; } },
        KEY_LEFT_DOWN:   { get: function getLEFTKeyDown()   { return _Keys[37 + DOWN ]; } },

        KEY_RIGHT_UP:    { get: function getRIGHTKeyUp()    { return _Keys[40 + UP   ]; } },
        KEY_RIGHT_PRESS: { get: function getRIGHTKeyPress() { return _Keys[40 + PRESS]; } },
        KEY_RIGHT_DOWN:  { get: function getRIGHTKeyDown()  { return _Keys[40 + DOWN ]; } },

        KEY_DOWN_UP:     { get: function getDOWNKeyUp()     { return _Keys[39 + UP   ]; } },
        KEY_DOWN_PRESS:  { get: function getDOWNKeyPress()  { return _Keys[39 + PRESS]; } },
        KEY_DOWN_DOWN:   { get: function getDOWNKeyDown()   { return _Keys[39 + DOWN ]; } },


        KEY_BRACKET_L_UP:     { get: function getTABKeyUp()    { return _Keys[219 + UP   ]; } },
        KEY_BRACKET_L_PRESS:  { get: function getTABKeyPress() { return _Keys[219 + PRESS]; } },
        KEY_BRACKET_L_DOWN:   { get: function getTABKeyDown()  { return _Keys[219 + DOWN ]; } },

        KEY_BRACKET_R_UP:     { get: function getTABKeyUp()    { return _Keys[221 + UP   ]; } },
        KEY_BRACKET_R_PRESS:  { get: function getTABKeyPress() { return _Keys[221 + PRESS]; } },
        KEY_BRACKET_R_DOWN:   { get: function getTABKeyDown()  { return _Keys[221 + DOWN ]; } },

        KEY_COLON_UP:         { get: function getTABKeyUp()    { return _Keys[186 + UP   ]; } },
        KEY_COLON_PRESS:      { get: function getTABKeyPress() { return _Keys[186 + PRESS]; } },
        KEY_COLON_DOWN:       { get: function getTABKeyDown()  { return _Keys[186 + DOWN ]; } },

        KEY_QUOTE_UP:         { get: function getTABKeyUp()    { return _Keys[222 + UP   ]; } },
        KEY_QUOTE_PRESS:      { get: function getTABKeyPress() { return _Keys[222 + PRESS]; } },
        KEY_QUOTE_DOWN:       { get: function getTABKeyDown()  { return _Keys[222 + DOWN ]; } },

        KEY_COMMA_UP:         { get: function getTABKeyUp()    { return _Keys[188 + UP   ]; } },
        KEY_COMMA_PRESS:      { get: function getTABKeyPress() { return _Keys[188 + PRESS]; } },
        KEY_COMMA_DOWN:       { get: function getTABKeyDown()  { return _Keys[188 + DOWN ]; } },

        KEY_PERIOD_UP:        { get: function getTABKeyUp()    { return _Keys[190 + UP   ]; } },
        KEY_PERIOD_PRESS:     { get: function getTABKeyPress() { return _Keys[190 + PRESS]; } },
        KEY_PERIOD_DOWN:      { get: function getTABKeyDown()  { return _Keys[190 + DOWN ]; } },

        KEY_SLASH_F_UP:       { get: function getTABKeyUp()    { return _Keys[191 + UP   ]; } },
        KEY_SLASH_F_PRESS:    { get: function getTABKeyPress() { return _Keys[191 + PRESS]; } },
        KEY_SLASH_F_DOWN:     { get: function getTABKeyDown()  { return _Keys[191 + DOWN ]; } },

        KEY_SLASH_B_UP:       { get: function getTABKeyUp()    { return _Keys[220 + UP   ]; } },
        KEY_SLASH_B_PRESS:    { get: function getTABKeyPress() { return _Keys[220 + PRESS]; } },
        KEY_SLASH_B_DOWN:     { get: function getTABKeyDown()  { return _Keys[220 + DOWN ]; } },


        KEY_A_UP:       { get: function getAKeyUp()     { return _Keys[65 + UP   ]; } },
        KEY_A_PRESS:    { get: function getAKeyPress()  { return _Keys[65 + PRESS]; } },
        KEY_A_DOWN:     { get: function getAKeyDown()   { return _Keys[65 + DOWN ]; } },

        KEY_B_UP:       { get: function getBKeyUp()     { return _Keys[66 + UP   ]; } },
        KEY_B_PRESS:    { get: function getBKeyPress()  { return _Keys[66 + PRESS]; } },
        KEY_B_DOWN:     { get: function getBKeyDown()   { return _Keys[66 + DOWN ]; } },

        KEY_C_UP:       { get: function getCKeyUp()     { return _Keys[67 + UP   ]; } },
        KEY_C_PRESS:    { get: function getCKeyPress()  { return _Keys[67 + PRESS]; } },
        KEY_C_DOWN:     { get: function getCKeyDown()   { return _Keys[67 + DOWN ]; } },

        KEY_D_UP:       { get: function getDKeyUp()     { return _Keys[68 + UP   ]; } },
        KEY_D_PRESS:    { get: function getDKeyPress()  { return _Keys[68 + PRESS]; } },
        KEY_D_DOWN:     { get: function getDKeyDown()   { return _Keys[68 + DOWN ]; } },

        KEY_E_UP:       { get: function getEKeyUp()     { return _Keys[69 + UP   ]; } },
        KEY_E_PRESS:    { get: function getEKeyPress()  { return _Keys[69 + PRESS]; } },
        KEY_E_DOWN:     { get: function getEKeyDown()   { return _Keys[69 + DOWN ]; } },

        KEY_F_UP:       { get: function getFKeyUp()     { return _Keys[70 + UP   ]; } },
        KEY_F_PRESS:    { get: function getFKeyPress()  { return _Keys[70 + PRESS]; } },
        KEY_F_DOWN:     { get: function getFKeyDown()   { return _Keys[70 + DOWN ]; } },

        KEY_G_UP:       { get: function getGKeyUp()     { return _Keys[71 + UP   ]; } },
        KEY_G_PRESS:    { get: function getGKeyPress()  { return _Keys[71 + PRESS]; } },
        KEY_G_DOWN:     { get: function getGKeyDown()   { return _Keys[71 + DOWN ]; } },

        KEY_H_UP:       { get: function getHKeyUp()     { return _Keys[72 + UP   ]; } },
        KEY_H_PRESS:    { get: function getHKeyPress()  { return _Keys[72 + PRESS]; } },
        KEY_H_DOWN:     { get: function getHKeyDown()   { return _Keys[72 + DOWN ]; } },

        KEY_I_UP:       { get: function getIKeyUp()     { return _Keys[73 + UP   ]; } },
        KEY_I_PRESS:    { get: function getIKeyPress()  { return _Keys[73 + PRESS]; } },
        KEY_I_DOWN:     { get: function getIKeyDown()   { return _Keys[73 + DOWN ]; } },

        KEY_J_UP:       { get: function getJKeyUp()     { return _Keys[74 + UP   ]; } },
        KEY_J_PRESS:    { get: function getJKeyPress()  { return _Keys[74 + PRESS]; } },
        KEY_J_DOWN:     { get: function getJKeyDown()   { return _Keys[74 + DOWN ]; } },

        KEY_K_UP:       { get: function getKKeyUp()     { return _Keys[75 + UP   ]; } },
        KEY_K_PRESS:    { get: function getKKeyPress()  { return _Keys[75 + PRESS]; } },
        KEY_K_DOWN:     { get: function getKKeyDown()   { return _Keys[75 + DOWN ]; } },

        KEY_L_UP:       { get: function getLKeyUp()     { return _Keys[76 + UP   ]; } },
        KEY_L_PRESS:    { get: function getLKeyPress()  { return _Keys[76 + PRESS]; } },
        KEY_L_DOWN:     { get: function getLKeyDown()   { return _Keys[76 + DOWN ]; } },

        KEY_M_UP:       { get: function getMKeyUp()     { return _Keys[77 + UP   ]; } },
        KEY_M_PRESS:    { get: function getMKeyPress()  { return _Keys[77 + PRESS]; } },
        KEY_M_DOWN:     { get: function getMKeyDown()   { return _Keys[77 + DOWN ]; } },

        KEY_N_UP:       { get: function getNKeyUp()     { return _Keys[78 + UP   ]; } },
        KEY_N_PRESS:    { get: function getNKeyPress()  { return _Keys[78 + PRESS]; } },
        KEY_N_DOWN:     { get: function getNKeyDown()   { return _Keys[78 + DOWN ]; } },

        KEY_O_UP:       { get: function getOKeyUp()     { return _Keys[79 + UP   ]; } },
        KEY_O_PRESS:    { get: function getOKeyPress()  { return _Keys[79 + PRESS]; } },
        KEY_O_DOWN:     { get: function getOKeyDown()   { return _Keys[79 + DOWN ]; } },

        KEY_P_UP:       { get: function getPKeyUp()     { return _Keys[80 + UP   ]; } },
        KEY_P_PRESS:    { get: function getPKeyPress()  { return _Keys[80 + PRESS]; } },
        KEY_P_DOWN:     { get: function getPKeyDown()   { return _Keys[80 + DOWN ]; } },

        KEY_Q_UP:       { get: function getQKeyUp()     { return _Keys[81 + UP   ]; } },
        KEY_Q_PRESS:    { get: function getQKeyPress()  { return _Keys[81 + PRESS]; } },
        KEY_Q_DOWN:     { get: function getQKeyDown()   { return _Keys[81 + DOWN ]; } },

        KEY_R_UP:       { get: function getRKeyUp()     { return _Keys[82 + UP   ]; } },
        KEY_R_PRESS:    { get: function getRKeyPress()  { return _Keys[82 + PRESS]; } },
        KEY_R_DOWN:     { get: function getRKeyDown()   { return _Keys[82 + DOWN ]; } },

        KEY_S_UP:       { get: function getSKeyUp()     { return _Keys[83 + UP   ]; } },
        KEY_S_PRESS:    { get: function getSKeyPress()  { return _Keys[83 + PRESS]; } },
        KEY_S_DOWN:     { get: function getSKeyDown()   { return _Keys[83 + DOWN ]; } },

        KEY_T_UP:       { get: function getTKeyUp()     { return _Keys[84 + UP   ]; } },
        KEY_T_PRESS:    { get: function getTKeyPress()  { return _Keys[84 + PRESS]; } },
        KEY_T_DOWN:     { get: function getTKeyDown()   { return _Keys[84 + DOWN ]; } },

        KEY_U_UP:       { get: function getUKeyUp()     { return _Keys[85 + UP   ]; } },
        KEY_U_PRESS:    { get: function getUKeyPress()  { return _Keys[85 + PRESS]; } },
        KEY_U_DOWN:     { get: function getUKeyDown()   { return _Keys[85 + DOWN ]; } },

        KEY_V_UP:       { get: function getVKeyUp()     { return _Keys[86 + UP   ]; } },
        KEY_V_PRESS:    { get: function getVKeyPress()  { return _Keys[86 + PRESS]; } },
        KEY_V_DOWN:     { get: function getVKeyDown()   { return _Keys[86 + DOWN ]; } },

        KEY_W_UP:       { get: function getWKeyUp()     { return _Keys[87 + UP   ]; } },
        KEY_W_PRESS:    { get: function getWKeyPress()  { return _Keys[87 + PRESS]; } },
        KEY_W_DOWN:     { get: function getWKeyDown()   { return _Keys[87 + DOWN ]; } },

        KEY_X_UP:       { get: function getXKeyUp()     { return _Keys[88 + UP   ]; } },
        KEY_X_PRESS:    { get: function getXKeyPress()  { return _Keys[88 + PRESS]; } },
        KEY_X_DOWN:     { get: function getXKeyDown()   { return _Keys[88 + DOWN ]; } },

        KEY_Y_UP:       { get: function getYKeyUp()     { return _Keys[89 + UP   ]; } },
        KEY_Y_PRESS:    { get: function getYKeyPress()  { return _Keys[89 + PRESS]; } },
        KEY_Y_DOWN:     { get: function getYKeyDown()   { return _Keys[89 + DOWN ]; } },

        KEY_Z_UP:       { get: function getZKeyUp()     { return _Keys[90 + UP   ]; } },
        KEY_Z_PRESS:    { get: function getZKeyPress()  { return _Keys[90 + PRESS]; } },
        KEY_Z_DOWN:     { get: function getZKeyDown()   { return _Keys[90 + DOWN ]; } },

        InputUpdate:
        {
            value: function InputUpdate()
            {
                for (var i = PRESS; i < DOWN; ++i)
                    if (_Keys[i])
                        _Keys[i] = false;
            }
        }
    });
}


var __LIGHT__ = new Array(12);

/*!
 * 	@constructor 	Light
 *	@description	Some words in a sentence
 */
function Light()
{
	var _AmbientCount 		= 0;
	var _DirectionalCount 	= 0;
	var _PointCount 		= 0;
    
    var _MAX_AMBIENT 		= 1;
    var _MAX_DIRECTIONAL 	= 3;
    var _MAX_POINT 			= 8;

    Object.defineProperties(this,
    {
    	/*!
    	 *	@function		Ambient
    	 *	@description	Description
    	 *	@return 		{AmbientLight}
    	 */
        Ambient:
        {
        	value: function Ambient(request)
        	{
        		if (_AmbientCount < _MAX_AMBIENT)
        		{
        			__LIGHT__[0] = new AmbientLight(request);
        			_AmbientCount++;
        		}
    		
    			return __LIGHT__[0];
        	}
        },

    	/*!
    	 *	@function		Directional
    	 *	@description	Description
    	 *	@return 		{DirectionalLight}
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
		        			_DirectionalCount++;

		        			return __LIGHT__[i];		
        				}
        			}
        		}

        		return undefined;
        	}
        },

    	/*!
    	 *	@function		Point
    	 *	@description	Description
    	 *	@return 		{PointLight}
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
		        			_PointCount++;

		        			return __LIGHT__[i];		
        				}
        			}
        		}

        		return undefined;
        	}
        },

    	/*!
    	 *	@function		Remove
    	 *	@description	Description
    	 *	@param			{LightItem: light}
    	 */
        Remove:
        {
        	value: function Remove(light)
        	{
        		if (!!light)
        		{
        			switch (light.Type)
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


/*!
 *  @constructor    LightItem
 *  @description    Hello
 *  @param          {Object: request}
 *                  > {Float32Array: colour}
 *                  > {Number: intensity}
 */
function LightItem(request)
{
    GameItem.call(this, request);

    if (!request) request = {};
    
    var $ = this;
    var _Colour     = request.colour instanceof Float32Array ? request.colour    : new Float32Array(3);
    var _Intensity  = typeof request.intensity === 'number'  ? request.intensity : 1.0;
    
    Object.defineProperties($,
    {
        Colour:
        {
            get: function getColour(){ return _Colour; },
            set: function setColour(colour)
            {
                if (colour instanceof Float32Array && colour.length === 3)
                    FWGE.Game.Maths.Vector3.Set(_Colour, colour);
            }
        },
        Intensity:
        {
            get: function getIntensity(){ return _Intensity; },
            set: function setIntensity(colour)
            {
                if (typeof colour === 'number')
                    _Intensity = colour;
            }
        }
    });
    
    __LIGHT__.push($);
}


/*!
 * 	@constructor	AmbientLight
 *	@description 	Ambient lighting
 *	@param			{Object: request}[nullable]
 */
function AmbientLight(request)
{
    if (!request)   request = {};
    request.type = "AMBIENTLIGHT";
    
    LightItem.call(this, request);
}


/*!
 *  @constructor    DirectionalLight
 *  @description    Directional lighting
 *  @param          {Object: request} [nullable]
 */
function DirectionalLight(request)
{
    if (!request)   request = {};
    request.type = "DIRECTIONALLIGHT";
    LightObject.call(this, request);
    
    var $           = this;
    var _Direction  = (request.direction instanceof Float32Array && request.direction.length === 3) ? request.direction : new Float32Array(3);
    
    Object.defineProperties($,
    {
        Direction: { get: function getDirection() { return _Direction; } },

        DirectionalUpdate:
        {
            value: function DirectionalUpdate()
            {
                // TODO
                // Update the direction based on the orientation of the containing object.
            }
        }
    });
}


/*!
 *  @constructor    PointLight
 *  @description    Point lighting
 *  @param          {Object: request}
 *                  > {Number: radius}
 *                  > {Number: angle}
 */
function PointLight(request)
{
    if (!request) request = {};
    request.type = "POINTLIGHT";
    LightObject.call(this, request);
    
    var $       = this;
    var _Radius = typeof request.radius === 'number' ? request.radius   : 5;
    var _Angle  = typeof request.angle  === 'number' ? request.angle    : 180;
    
    Object.defineProperties($, 
    {
        Radius:
        {
            get: function getRadius() { return _Radius; },
            set: function setRadius(radius)
            {
                if (typeof radius === 'number')
                    _Radius = radius;
            }
        },
        Angle:
        {
            get: function getAngle() { return _Angle; },
            set: function setAngle(angle)
            {
                if (typeof angle === 'number')
                    _Angle = Math.clamp(0, 180, angle);
            }
        }
    });
}


function Maths()
{
    Object.defineProperties(this,
    {
        Matrix2:      { value: new Matrix2() },
        Matrix3:      { value: new Matrix3() },
        Matrix4:      { value: new Matrix4() },
        Vector2:      { value: new Vector2() },
        Vector3:      { value: new Vector3() },
        Vector4:      { value: new Vector4() },
        Quaternion:   { value: new Quaternion() }
    });
};


function Matrix2()
{        
    var $ = this;
    
    function Error()
    {
        var parameter = [];
        console.log(arguments);

        if (arguments[1].length === 0)
            parameter = "undefined";
        else
            for (var e in arguments[1])
                parameter.push(typeof arguments[1][e]);
        
        switch (arguments[0])
        {
            case "SET":
                console.error(new window.Error
                (
                    "No match for given parameters: " + parameter.toString() + 
                    "\n\tFWGE.Maths.Matrix2.Set(Float32Array, Float32Array)" +
                    "\n\tFWGE.Maths.Matrix2.Set(Float32Array, number, number, number, number)"
                ));
            break;
        }
    }
    
    Object.defineProperties($,
    {
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

                Error("SET", arguments);                    
            }
        },
        Transpose:
        {
            value: function Transpose()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4)
                    return this.Set(arguments[0],
                                    arguments[0][0], arguments[0][2],
                                    arguments[0][1], arguments[0][3]);
                
                Error("TRANSPOSE", arguments);
            }
        },
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
        Determinant:
        {
            value: function Determinant()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4)
                    return arguments[0][0] * arguments[0][3] - arguments[0][2] * arguments[0][1];
                
                Error("DETERMINANT", arguments);
            }
        },
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
                
                Error("INVERSE", arguments);
            }
        },
        Sum:
        {
            value: function Sum()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4 && arguments[1] instanceof Float32Array && arguments[1].length === 4)
                    return this.Set(arguments[0],
                                    arguments[0][0] + arguments[1][0], arguments[0][1] + arguments[1][1],
                                    arguments[0][2] + arguments[1][2], arguments[0][3] + arguments[1][3]);
                
                Error("SUM", arguments);
            }
        },
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
                
                Error("MULT", arguments);
            }
        },
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
                
                Error("REVMULT", arguments);
                
            }
        } 
    });
}


function Matrix3()
{
    var $ = this;
    
    function Error()
    {
        var parameter = [];
        console.log(arguments);

        if (arguments[1].length === 0)
            parameter = "undefined";
        else
            for (var e in arguments[1])
                parameter.push(typeof arguments[1][e]);
        
        switch (arguments[0])
        {
            case "SET":
                console.error(new window.Error
                (
                    "No match for given parameters: " + parameter.toString() + 
                    "\n\tFWGE.Maths.Matrix2.Set(Float32Array, Float32Array)" +
                    "\n\tFWGE.Maths.Matrix2.Set(Float32Array, number, number, number, number)"
                ));
            break;
        }
    }
    
    Object.defineProperties($,
    {
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

                Error("SET", arguments);                    
            }
        },
        Transpose:
        {
            value: function Transpose()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9)
                    return this.Set(arguments[0],
                                    arguments[0][0], arguments[0][3], arguments[0][6],
                                    arguments[0][1], arguments[0][4], arguments[0][7],
                                    arguments[0][2], arguments[0][5], arguments[0][8]);
                
                Error("TRANSPOSE", arguments);
            }
        },
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
        Determinant:
        {
            value: function Determinant()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9)
                    return arguments[0][0] * (arguments[0][4] * arguments[0][8] - arguments[0][5] * arguments[0][7]) -
                            arguments[0][1] * (arguments[0][3] * arguments[0][8] - arguments[0][5] * arguments[0][6]) + 
                            arguments[0][2] * (arguments[0][3] * arguments[0][7] - arguments[0][4] * arguments[0][6]);
                
                Error("DETERMINANT", arguments);
            }
        },
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
                
                Error("INVERSE", arguments);
            }
        },
        Sum:
        {
            value: function Sum()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9 && arguments[1] instanceof Float32Array && arguments[1].length === 9)
                    return this.Set(arguments[0],
                                    arguments[0][0] + arguments[1][0], arguments[0][1] + arguments[1][1], arguments[0][2] + arguments[1][2],
                                    arguments[0][3] + arguments[1][3], arguments[0][4] + arguments[1][4], arguments[0][5] + arguments[1][5],
                                    arguments[0][6] + arguments[1][6], arguments[0][7] + arguments[1][7], arguments[0][8] + arguments[1][8]);
                
                Error("SUM", arguments);
            }
        },
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
                
                Error("MULT", arguments);
            }
        },
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
                
                Error("REVMULT", arguments);
                
            }
        } 
    });
}


function Matrix4()
{
    var $ = this;
    
    function Error()
    {
        var parameter = [];
        console.log(arguments);

        if (arguments[1].length === 0)
            parameter = "undefined";
        else
            for (var e in arguments[1])
                parameter.push(typeof arguments[1][e]);
        
        switch (arguments[0])
        {
            case "SET":
                console.error(new window.Error
                (
                    "No match for given parameters: " + parameter.toString() + 
                    "\n\tFWGE.Maths.Matrix2.Set(Float32Array, Float32Array)" +
                    "\n\tFWGE.Maths.Matrix2.Set(Float32Array, number, number, number, number)"
                ));
            break;
        }
    }
    
    Object.defineProperties($,
    {
        "Create":
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

                Error("SET", arguments);                    
            }
        },
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
                
                Error("DETERMINANT", arguments);
            }
        },
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
                
                Error("INVERSE", arguments);
            }
        },
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
                
                Error("SUM", arguments);
            }
        },
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
                
                Error("MULT", arguments);
            }
        },
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
                
                Error("REVMULT", arguments);
                
            }
        } 
    });
}


function Quaternion()
{
    var $ = this;

    // TODO
}


function Vector2()
{
    var $ = this;
    
    Object.defineProperties($,
    {
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
        Length:
        {
            value: function Length()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2)
                    return Math.sqrt(arguments[0][0] * arguments[0][0] + arguments[0][1] * arguments[0][1]);
            }
        },
        Sum:
        {
            value: function Sum()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2 && arguments[1] instanceof Float32Array && arguments[1].length === 2)
                    return this.Set(arguments[0], arguments[0][0] + arguments[1][0], arguments[0][1] + arguments[1][1]);
            }
        },
        Diff:
        {
            value: function Diff()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2 && arguments[1] instanceof Float32Array && arguments[1].length === 2)
                    return this.Create(arguments[1][0] - arguments[0][0], arguments[1][1] - arguments[0][1]);
            }
        },
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
        Dot:
        {
            value: function Dot()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2 && arguments[1] instanceof Float32Array && arguments[1].length === 2)
                        return arguments[0][0] * arguments[1][0] + arguments[0][1] * arguments[1][1];
            }
        },
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


function Vector3()
{
    var $ = this;
    
    Object.defineProperties($,
    {
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
        Length:
        {
            value: function Length()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    return Math.sqrt(arguments[0][0] * arguments[0][0] + arguments[0][1] * arguments[0][1] + arguments[0][2] * arguments[0][2]);
            }
        },
        Sum:
        {
            value: function Sum()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3 && arguments[2] instanceof Float32Array && arguments[1].length === 3)
                    return this.Set(arguments[0], arguments[0][0] + arguments[1][0], arguments[0][1] + arguments[1][1], arguments[0][2] + arguments[1][2]);
            }
        },
        Diff:
        {
            value: function Diff()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3 && arguments[2] instanceof Float32Array && arguments[1].length === 3)
                    return this.Create(arguments[1][0] - arguments[0][0], arguments[1][1] - arguments[0][1], arguments[1][2] - arguments[0][2]);
            }
        },
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
        Dot:
        {
            value: function Dot()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3 && arguments[1] instanceof Float32Array && arguments[1].length === 3)
                        return arguments[0][0] * arguments[1][0] + arguments[0][1] * arguments[1][1] + arguments[0][2] * arguments[1][2];
            }
        },
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


function Vector4()
{
    var $ = this;
    
    Object.defineProperties($,
    {
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
        Length:
        {
            value: function Length()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4)
                    return Math.sqrt(arguments[0][0] * arguments[0][0] + arguments[0][1] * arguments[0][1] + arguments[0][2] * arguments[0][2]);
            }
        },
        Sum:
        {
            value: function Sum()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4 && arguments[2] instanceof Float32Array && arguments[1].length === 4)
                    return this.Set(arguments[0], arguments[0][0] + arguments[1][0], arguments[0][1] + arguments[1][1], arguments[0][2] + arguments[1][2], arguments[0][3] + arguments[1][3]);
            }
        },
        Diff:
        {
            value: function Diff()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4 && arguments[2] instanceof Float32Array && arguments[1].length === 4)
                    return this.Create(arguments[1][0] - arguments[0][0], arguments[1][1] - arguments[0][1], arguments[1][2] - arguments[0][2], arguments[1][3] - arguments[0][3]);
            }
        },
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
        Dot:
        {
            value: function Dot()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 4 && arguments[1] instanceof Float32Array && arguments[1].length === 4)
                        return arguments[0][0] * arguments[1][0] + arguments[0][1] * arguments[1][1] + arguments[0][2] * arguments[1][2] + arguments[0][3] * arguments[1][3];
            }
        },
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


function Particle(request)
{
	if (!request) request = {};

	
}
function ParticleSystem(request)
{
    if (!request) request = {};
    request.type = "PARTICLESYSTEM";
    GameItem.call(this, request);

    var $ = this;
}


/*!
 *  @constructor    PhysicsEngine
 *  @description    Hello
 */
function PhysicsEngine()
{
    Object.defineProperties(this,
    {
        Collision:          {value: Collision},
        PhysicsBody:        {value: PhysicsBody},
        PhysicsMaterial:    {value: PhysicsMaterial},

        /*!
         *  @property       {Number: Gravity}
         *  @description    Gravity in m/s
         */
    	Gravity: { value: -9.8 },

        /*!
         *  @function       Init
         *  @description    Initializes the physics engine
         */
        Init:
        {
            value: function Init()
            {

            }
        },

        /*!
         *  @function       PhysicsUpdate
         *  @description    Initializes the physics engine
         */
        PhysicsUpdate:
        {
            value: function PhysicsUpdate()
            {

            }
        }
    });
}


/*!
 * 	@constructor 	PhysicsItem
 *	@description 	The physics item
 *	@param			{Object: request}
 */
function PhysicsItem(request)
{
    if (!request) request = {};
    GameItem.call(this, request);

    Object.defineProperties(this,
    {
        
    });
}


var __PHYSICSMATERIAL__ = [];

/*!
 * 	@constructor	PhysicsMaterial
 * 	@description 	Some words of encouragement
 * 	@param			{Object: request}
 */
function PhysicsMaterial()
{

}
function PhysicsBody(request)
{
	if (request) request = {};
    request.type = "RIGIDBODY";
	PhysicsItem.call(this, request);

    var _Mass  = typeof request.mass  === 'number' ?  request.mass  : 1.0; 
    var _LockX = typeof request.lockx === 'boolean'?  request.lockx : false;
    var _LockY = typeof request.locky === 'boolean'?  request.locky : false;
    var _LockZ = typeof request.lockz === 'boolean'?  request.lockz : false;
    
	Object.defineProperties(this,
	{
    	Mass:
    	{
    		get: function getMass() { return _Mass; },
    		set: function setMass(mass)
    		{
    			if (typeof mass === 'number' && mass >= 0.0)
    				_Mass = mass;
    		},
    	},
        LockX:
        {
            get: function getLockX() { return _LockX; },
            set: function setLockX(lockx)
            {
                if (typeof lockx === 'boolean')
                    _LockX = lockx;
            },
        },
        LockY:
        {
            get: function getLockY() { return _LockY; },
            set: function setLockY(locky)
            {
                if (typeof locky === 'boolean')
                    _LockY = locky;
            },
        },
        LockZ:
        {
            get: function getLockZ() { return _LockZ; },
            set: function setLockZ(lockz)
            {
                if (typeof lockz === 'boolean')
                    _LockZ = lockz;
            },
        }
    });
}
/*!
 * 	{GameObject: request}
 */
function Collision(request)
{
    if (!request) request = {};
    request.type = "COLLISION";
    PhysicsItem.call(this, request);

}


function RenderEngine()
{
    var _Renderer;

    Object.defineProperties(this,
    {
        Colour:         {value: new Colour()},
        Mesh:           {value: Mesh},
        RenderMaterial: {value: RenderMaterial},
        Shader:         {value: Shader},
        GameScreen:     {value: new GameScreen()},

        /*!
         *  @function       Init
         *  @description    Initializes the rendering engine
         */
    	Init:
    	{
    		value: function Init()
    		{
                _Renderer = new Renderer();
    		}
    	},

        /*!
         *  @function       RenderUpdate
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


/*!
 * 	@constructor 	RenderItem
 *	@description 	The base item regarding rendering.
 *	@param 			{Object: request}
 */
function RenderItem(request)
{
	Item.call(this, request);
}
var __SHADER__ = [];

/*!
 *  @constructor    Shader
 *  @description    Something
 *  @param          {Object: request}
 *                  > {String: name}
 *                  > {String: vertexShader}
 *                  > {String: fragmentShader}
 *                  > {Number: width}
 *                  > {Number: height}
 */
function Shader(request)
{
    if (!request) request = {};
    if (!request.name || typeof request.name !== 'string') return;
    if (!request.vertexShader || typeof request.vertexShader !== 'string') return;
    if (!request.fragmentShader || typeof request.fragmentShader !== 'string') return;
    if (typeof request.width !== 'number') request.width = 512;
    if (typeof request.height !== 'number') request.height = 512;
    
    Object.defineProperties(this,
    {
        Name:             { value: request.name },
        Program:          { value: GL.createProgram() },
        Texture:          { value: GL.createTexture() },
        FrameBuffer:      { value: GL.createFramebuffer() },
        RenderBuffer:     { value: GL.createRenderbuffer() }
    });

    GL.bindFramebuffer(GL.FRAMEBUFFER, this.FrameBuffer);		 	
    GL.bindRenderbuffer(GL.RENDERBUFFER, this.RenderBuffer);
    GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, 1024, 768);
    GL.bindTexture(GL.TEXTURE_2D, this.Texture);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1024, 768, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.Texture, 0);
    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, this.RenderBuffer);
    GL.bindTexture(GL.TEXTURE_2D, null);
    GL.bindRenderbuffer(GL.RENDERBUFFER, null);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
    
    var vs = GL.createShader(GL.VERTEX_SHADER);
    GL.shaderSource(vs, request.vertexShader);
    GL.compileShader(vs);
    if (!GL.getShaderParameter(vs, GL.COMPILE_STATUS))
    {
        console.error(new Error("Vertex Shader: " + GL.getShaderInfoLog(vs)));
        return;
    }
    
    var fs = GL.createShader(GL.FRAGMENT_SHADER);
    GL.shaderSource(fs, request.fragmentShader);
    GL.compileShader(fs);
    if (!GL.getShaderParameter(fs, GL.COMPILE_STATUS))
    {
        console.error(new Error("Fragment Shader: " + GL.getShaderInfoLog(fs)));
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
                    Alpha:              GL.getUniformLocation(this.Program, "U_Material.Alpha")
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
                    Bump:               GL.getUniformLocation(this.Program, "U_Sampler.Bump")
                }
            }
        }
    });
    
    GL.useProgram(null);
    
    __SHADER__.push(this);
}


function Colour()
{
    Object.defineProperties(this,
    {
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
                	Type: { value: "COLOUR" },
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
                            if (typeof arguments[1] === 'number')
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


function GameScreen()
{
    var $ = this;
}


var __MESH__ = [];

/*!
 *  @constructor    Mesh
 *  @description    The vertex array buffer containers 
 *  @param          {Object: request}
 *                  {Array: position}
 *                  {Array: uvs}
 *                  {Array: colours}
 *                  {Array: normals}
 *                  {Array: indices}
 */
function Mesh(request)
{   
    if (!request) request = {};
    request.type = "MESH";
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
        /*!
         *  @property       {WebGLBuffer: PositionBuffer}
         *  @description    Vertex buffer object for the 
         */
        PositionBuffer: { value: GL.createBuffer() },

        /*!
         *  @property       {WebGLBuffer: UVBuffer}
         *  @description    Hello
         */
        UVBuffer: { value: GL.createBuffer() },

        /*!
         *  @property       {WebGLBuffer: ColourBuffer}
         *  @description    Hello
         */
        ColourBuffer: { value: GL.createBuffer() },

        /*!
         *  @property       {WebGLBuffer: NormalBuffer}
         *  @description    Hello
         */
        NormalBuffer: { value: GL.createBuffer() },
        
        /*!
         *  @property       {WebGLBuffer: IndexBuffer}
         *  @description    Hello
         */
        IndexBuffer: { value: GL.createBuffer() },
        
        /*!
         *  @property       {Number: VertexCount}
         *  @description    Hello
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

/*!
 *  @constructor    Material
 *  @description    Hello
 *  @param          {Object: request}
 *                  > {Array: ambient}
 *                  > {Array: diffuse}
 *                  > {Array: specular}
 *                  > {Number: alpha}
 *                  > {Number: shininess}
 *                  > {Number: shader}
 *                  > {String: imagemap}
 *                  > {String: bumpmap}
 *                  > {String: specularmap}
 */
function RenderMaterial(request)
{
    if (!request) request = {};
    request.type = "MATERIAL";
    RenderItem.call(this, {parent: undefined, });

    function colour(item)
    {
        if (!item || !(item instanceof Array)) item = [0, 0, 0];
        if (item.length < 3)
        {
            switch (item.length)
            {
                case 0: item.position[0] = 0;
                case 1: item.position[1] = 0;
                case 2: item.position[2] = 0;
            }
        }

        return FWGE.Render.Colour.Create(item);
    }
   
    var _Ambient     = colour(request.ambient);
    var _Diffuse     = colour(request.diffuse);
    var _Specular    = colour(request.specular);
    var _Alpha       = typeof request.alpha     === 'number' && request.alpha     >= 0 ? request.alpha     : 1.0;
    var _Shininess	 = typeof request.shininess === 'number' && request.shininess >= 0 ? request.shininess : 5.0;
    var _Shader      = request.shader instanceof Shader ? request.shader : undefined;
    var _ImageMap    = undefined;
    var _BumpMap     = undefined;
    var _SpecularMap = undefined;
    
    Object.defineProperties(this,
    {
        /*!
         *  @property       {Float32Array: Ambient}
         *  @description    
         */
        Ambient:
        {
            get: function getAmbient() { return _Ambient; },
            set: function setAmbient(ambient)
            {
                if (ambient.Type === 'COLOUR')
                    FWGE.Game.Maths.Vector3.Set(_Ambient, ambient);
            }
        },

        /*!
         *  @property       {Float32Array: Diffuse}
         *  @description    
         */
        Diffuse:
        {
            get: function getDiffuse() { return _Diffuse; },
            set: function setDiffuse(diffuse)
            {
                if (diffuse.Type === 'COLOUR')
                    FWGE.Game.Maths.Vector3.Set(_Diffuse, diffuse);
            }
        },

        /*!
         *  @property       {Float32Array: Specular}
         *  @description    
         */
        Specular:
        {
            get: function getSpecular() { return _Specular; },
            set: function setSpecular(specular)
            {
                if (specular.Type === 'COLOUR')
                    FWGE.Game.Maths.Vector3.Set(_Specular, specular);
            }
        },

        /*!
         *  @property       {Number: Alpha}
         *  @description    
         */
        Alpha:
        {
            get: function getAlpha() { return _Alpha; },
            set: function setAlpha(alpha)
            {
                if (typeof alpha === 'number')
                    _Alpha = alpha;
            }
        },

        /*!
         *  @property       {Number: Shininess}
         *  @description    
         */
        Shininess:
        {
            get: function getShininess() { return _Shininess; },
            set: function setShininess(shininess)
            {
                if (typeof shininess === 'number')
                    _Shininess = shininess;
            }
        },

        /*!
         *  @property       {Shader: Shader}
         *  @description    
         */
        Shader:
        {
            get: function getShader() { return _Shader; },
            set: function setShader(shader)
            {
                if (shader instanceof Shader)
                    _Shader = shader;
            }
        },

        /*!
         *  @property       {WebGLTexture: ImageMap}
         *  @description    
         */
        ImageMap:
        {
            get: function getImageMap() { return _ImageMap; },
            set: function setImageMap(imagemap)
            {
                if (imagemap instanceof WebGLTexture || imagemap === undefined)
                    _ImageMap = imagemap;
            }
        },

        /*!
         *  @property       {WebGLTexture: BumpMap}
         *  @description    
         */
        BumpMap:
        {
            get: function getBumpMap() { return _BumpMap; },
            set: function setBumpMap(bumpmap)
            {
                if (bumpmap instanceof WebGLTexture || bumpmap === undefined)
                    _BumpMap = bumpmap;
            }
        },

        /*!
         *  @property       {WebGLTexture: SpecularMap}
         *  @description    
         */
        SpecularMap:
        {
            get: function getSpecularMap() { return _SpecularMap; },
            set: function setSpecularMap(specularmap)
            {
                if (specularmap instanceof WebGLTexture || specularmap === undefined)
                    _SpecularMap = specularmap;
            }
        }
    });
    
    __MATERIAL__.push(this);
}
Object.defineProperties(RenderMaterial.prototype,
{
    constructor: { value: RenderMaterial },
    
    /*!
     *  @description    
     *  @param          {Object}
     *                  {String: image}
     *                  {String: bump}
     *                  {String: specular}
     */
    SetTexture:
    {
        value: function SetTextures(request)
        {
            if (!request) request = {};
            if (typeof request.image === 'string')      apply_image(request.image, this.ImageMap);
            if (typeof request.bump === 'string')       apply_image(request.bump, this.BumpMap);
            if (typeof request.specular === 'string')   apply_image(request.specular, this.Specular);

            function apply_image(src, texture)
            {
                var img = new Image();
                img.onload = function onload()
                {
                    //this.LoadImage(img, texture);
                };
                img.src = src;
            }
        }
    }
});


function ModelView()
{
    var _Stack  = [];
    
    Object.defineProperties(this,
    {
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
        PeekMatrix:
        {
            value: function PeekMatrix()
            {
                if (_Stack.length === 0)
                    return FWGE.Game.Maths.Matrix4.Identity();
                else
                    return _Stack[_Stack.length - 1];
            }
        },
        PopMatrix:
        {
            value: function PopMatrix()
            {
                return _Stack.pop();
            }
        },
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
                                  1.0, 			   0.0, Math.tan(rho), 0.0,
                        Math.tan(phi), 			   1.0, 		  0.0, 0.0,
                                  0.0, Math.tan(theta), 		  1.0, 0.0,
                                  0.0, 			   0.0, 		  0.0, 1.0
                    ),
                    matrix
                );
            }
        }
    });
}


function Projection()
{
    var _Camera = FWGE.Game.Maths.Matrix4.Identity();
    
    function Orthographic(left, right, top, bottom, near, far, theta, phi)
    {
        theta = Math.cot(Math.radian(theta));
        phi = Math.cot(Math.radian(phi));

        left -= near * theta;
        right -= near * theta;
        top -= near * phi;
        bottom -= near * phi;

        FWGE.Game.Maths.Matrix4.Set
        (
            _Camera,

                          2 / (right - left), 								 0, 		 			       0, 0,
                                           0, 				2 / (top - bottom), 		 			 	   0, 0,
                                        theta, 							   phi, 		   -2 / (far - near), 0,
            -(left + right) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
        );
        
    }
    
    function Perspective(field_of_view, aspect_ratio, near, far)
    {
        var top = near * Math.tan(Math.radian(field_of_view));
        var right = top * aspect_ratio;
        
        var left = -right;
        var bottom = -top;
        var width = right - left;
        var height = top - bottom;
        var depth = far - near;

        console.log(left, right, top, bottom, height, depth);

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
        GetViewer:
        {
            value: function GetViewer()
            {
                return _Camera;
            }
        }
    });
}


function Renderer()
{
	var __MODELVIEW__ = new ModelView();
	var __PROJECTION__ = new Projection();
	__PROJECTION__.ProjectionUpdate();

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
			}
		},
		ClearBuffers:
		{
			value: function ClearBuffers()
			{
	            var i = __SHADER__.length;
	            while (--i >= 0)
	            {
	                GL.bindFramebuffer(GL.FRAMEBUFFER, __SHADER__[i].FrameBuffer);
	                GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
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
	                
	                this.BindAttributes(object.Mesh, object.RenderMaterial, object.RenderMaterial.Shader.Attributes);
	                this.SetObjectUniforms(object.RenderMaterial, object.RenderMaterial.Shader.Uniforms);
	                this.Draw(object.Mesh.VertexCount);
	                
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
	        
	            if (!!material.Image)
	            {
	                GL.activeTexture(GL.TEXTURE0);
	                GL.bindTexture(GL.TEXTURE_2D, material.Image);
	                GL.uniform1i(uniforms.Material.HasImageMap, true);
	                GL.uniform1i(uniforms.Sampler.Image, 0);
	            }
	            else
	            {
	                GL.bindTexture(GL.TEXTURE_2D, null);
	                GL.uniform1i(uniforms.Material.HasImageMap, false);
	            }
	            
	            if (!!material.Bump)
	            {
	                GL.activeTexture(GL.TEXTURE1);
	                GL.bindTexture(GL.TEXTURE_2D, material.Bump);
	                GL.uniform1i(uniforms.Material.HasBumpMap, true);
	                GL.uniform1i(uniforms.Sampler.Bump, 1);
	            }
	            else
	            {
	                GL.bindTexture(GL.TEXTURE_2D, null);
	                GL.uniform1i(uniforms.Material.HasBumpMap, false);
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
	                    var light = __LIGHT__[i];
	                    
	                    if (!!light)
	                    {
		                    switch (light.Type)
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
		                        	__MODELVIEW__.Transform(light.Transform);
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
			value: function Draw(vertexCount)
	        {
	            GL.drawElements(GL.TRIANGLES, vertexCount, GL.UNSIGNED_SHORT, 0);
	        }
		},
		FinalDraw:
		{
			value: function FinalDraw()
			{

			}
		}
	});
};


/*!
 * 	@constructor 	FWGE
 *	@module			{}
 */
function FWGEPrototype()
{
	Object.defineProperties(this,
	{
		/*!
		 * 	@property		{GameEngine: Game}
		 *  @description	<link>GameEngine</link>
		 */
		Game: 		{value: new GameEngine()},

		/*!
		 * 	@property		{PhysicsEngine: Physics}
		 *  @description	<link>PhysicsEngine</link>
		 */
		Physics: 	{value: new PhysicsEngine()},

		/*!
		 * 	@property		{RenderEngine: Render}
		 *  @description	<link>RenderEngine</link>
		 */
		Render: 	{value: new RenderEngine()},

		/*!
		 * 	@function 		Init
		 *	@description 	Initializes the webgl context
		 *	@param			{Object: request}
		 * 					> {HTMLCanvasElement: canvas}
		 *					> {Number: height}
		 *					> {Number: width}
		 *					> {Float32Array: clear}
		 */
		Init: 
		{
			value: function Init(request)
			{
				if (!request) request = {};
				if (!request.clear) request.clear = [0, 0, 0, 0];

				GL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

                        GL.enable(GL.DEPTH_TEST);

				if (!GL)
					throw "Webgl context could not be initialized.";

				GL.clearColor(request.clear[0] || 0, request.clear[1] || 0, request.clear[2] || 0, request.clear[3] || 0);

				this.Game.Init();
				this.Physics.Init();
				this.Render.Init();
			}
		},

		/*!
		 * 	@function 		Start
		 * 	@description 	Starts up the engine
		 */
		Start: { value: function Start() { if (!!GL) this.Game.Start();  } },


		/*!
		 * 	@function 		Stop
		 * 	@description 	Stops the engine
		 */
		Stop:  { value: function Stop()  { this.Game.Stop(); } }
	});
}

window.FWGE = new FWGEPrototype();



})();

