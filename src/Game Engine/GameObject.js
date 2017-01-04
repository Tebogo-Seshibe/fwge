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
            console.log("Destroying current object");
            var timeout = typeof arguments[0] === 'number' ? arguments[0] : 0;
            setTimeout(function()
            {
                var i = __OBJECT__.length;
                while (--i >= 0)
                    if (__OBJECT__[i] === this)
                        __OBJECT__.slice(i, 1)
            });
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

