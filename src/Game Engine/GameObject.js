var __OBJECT__ = [];

/**
 * @constructor GameObject
 * @description The main object container for object types.   
 * @module      FWGE.Game
 * @param       request:        {Object}
 *              > material:     {Material}      [nullable]
 *              > mesh:         {Mesh}          [nullable]
 *              > transform:    {Transform}     [nullable]
 *              > physics:      {Physics}       [nullable]
 *              > animation:    {Animation}     [nullable]
 *              > lightitem:    {LightObject}   [nullable]
 *              > begin:        {Function}      [nullable]
 *              > update:       {Function}      [nullable]
 *              > end:          {Function}      [nullable]
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
         * @property    ID: {String}
         *              > get
         * @description Unique identifier for the gameobject
         */
        ID: { value: "[go-" + IDCounter.next() + "]" },

        /**
         * @property    Transform:  {Transform}
         *              > get
         * @description The transform object attached to the current gameobject
         */
        Transform: { value: request.transform instanceof Transform ? request.transform : new Transform() },

        /**
         * @property    Children:   {Array}
         *              > get
         * @description An array of gameobjects. All children transformation will be relative to 
         *              the parent gameobject.
         */
        Children: { value: [] },

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
        },

        /**
         * @property    RenderMaterial: {RenderMaterial}
         *              > get
         *              > set
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
         * @property    Mesh: {Mesh}
         *              > get
         *              > set
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
         * @property    LightItem: {LightItem}
         *              > get
         *              > set
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
         * @property    PhysicsItem: {PhysicsItem}
         *              > get
         *              > set
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
         * @property    Animation: {Animation}
         *              > get
         *              > set
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
         * @property    particlesystem: {ParticleSystem}
         *              > get
         *              > set
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
         * @property    Begin:{Function}
         *              > get
         *              > set
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
         * @property    Update: {Function}
         *              > get
         *              > set
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
         * @property    End: {Function}
         *              > get
         *              > set
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
        }
    });

    this.RenderMaterial = request.material       instanceof RenderMaterial  ? request.material       : undefined;
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
     * @function    Destroy: void
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
     * @function        ObjectUpdate: void
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

