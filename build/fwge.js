"use strict";

(function()
{

var GL = undefined;

Object.defineProperties(Math,
{
    cot: { value: function cot(radian) { return 1 / Math.tan(radian); } },
    radian: { value: function radian(degree) { return Math.PI / 180 * degree; } },
    clamp: { value: function clamp(value, min, max) { return Math.max(Math.min(value, max), main); } }
});

var IDCounter = new function IDCounter(){ var id = 0; this.next = function next(){ return id++ }; };
// ITEM
/*!
 *  @param  {GameObject}    The GameObject this item is attached to.
 *  @param  {String}        The type of the item.
 */
function GameItem(gameobject, type)
{
    var $ = this;
    var _GameObject = gameobject;
    
    Object.defineProperties($,
    {
        Type: { value: type },
        GameObject:
        {
            get: function getGameObject(){ return _GameObject; },
            set: function setGameObject()
            {
                if (arguments[0] instanceof GameObject || arguments[0] === undefined)
                    _GameObject = arguments[0];
            }
        }
    });
}


function Transform(request)
{
    var $ = this;
    
    if (!request) request = {};

    console.log(FWGE);
    
    if (!request.position) request.position = FWGE.Maths.Vector3.Create();
    if (!(request.position instanceof Float32Array) || request.length !== 3) request.position = FWGE.Maths.Vector3.Create(request.position);
    if (!request.rotation) request.rotation = FWGE.Maths.Vector3.Create();
    if (!(request.rotation instanceof Float32Array) || request.length !== 3) request.rotation = FWGE.Maths.Vector3.Create(request.rotation);
    if (!request.scale) request.scale = FWGE.Maths.Vector3.Create();
    if (!(request.scale instanceof Float32Array) || request.length !== 3) request.scale = FWGE.Maths.Vector3.Create(1.0,1.0,1.0);
    if (!request.shear) request.shear = FWGE.Maths.Vector3.Create();
    if (!(request.shear instanceof Float32Array) || request.length !== 3) request.shear = FWGE.Maths.Vector3.Create(request.shear);
    
    GameItem.call($, request.gameobject, "TRANSFORM");
    
    var _Position = request.position;
    var _Rotation = request.rotation;
    var _Scale = request.scale;
    var _Shear = request.shear;
    
    var _Up = FWGE.Maths.Vector3.Create(0, 1, 0);
    var _Forward = FWGE.Maths.Vector3.Create(0, 0, 1);
    var _Right = FWGE.Maths.Vector3.Create(1, 0, 0);
    
    Object.defineProperties($,
    {
        Position:
        {
            get: function getPosition(){ return _Position; },
            set: function setPosition()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Position, arguments[0]);
            }
        },            
        Rotation:
        {
            get: function getRotation(){ return _Rotation; },
            set: function setRotation()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Rotation, arguments[0]);
            }
        },
        Scale:
        {
            get: function getScale(){ return _Scale; },
            set: function setScale()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Scale, arguments[0]);
            }
        },            
        Shear:
        {
            get: function getShear(){ return _Shear; },
            set: function setShear()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Shear, arguments[0]);
            }
        },
        Up:         { get: function(){ return _Up; } },
        Forward:    { get: function(){ return _Forward; } },
        Right:      { get: function(){ return _Right; } },
        
        TransformUpdate:
        {
            value: function TransformUpdate()
            {
                // TODO
                // UPDATE: UP, FORWARD, AND RIGHT
            }
        }
    });
    
    this.TransformUpdate();
}


/*!
 *
 */
function Mesh(request)
{        
    var $ = this;
    
    console.log(request);
    GameItem.call($, undefined, "MESH");
    
    Object.defineProperties($,
    {
        VertexCount:      { value: request.indices.length   },
        PositionBuffer:   { value: GL.createBuffer() },
        UVBuffer:         { value: !!request.uvs 		? GL.createBuffer() : undefined },
        ColourBuffer:     { value: !!request.colours 	? GL.createBuffer() : undefined },            
        NormalBuffer:     { value: !!request.normals 	? GL.createBuffer() : undefined },
        IndexBuffer:      { value: GL.createBuffer() }
    });
    
    GL.bindBuffer(GL.ARRAY_BUFFER, $.PositionBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(request.position), GL.STATIC_DRAW);
    GL.bindBuffer(GL.ARRAY_BUFFER, $.UVBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(request.uvs), GL.STATIC_DRAW);
    GL.bindBuffer(GL.ARRAY_BUFFER, $.ColourBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(request.colours), GL.STATIC_DRAW);
    GL.bindBuffer(GL.ARRAY_BUFFER, $.NormalBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(request.normals), GL.STATIC_DRAW);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, $.IndexBuffer);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(request.indices), GL.STATIC_DRAW);
    
    __MESH__.push($);
}


function Material(request)
{
    var $ = this;

    if (!request)   request = {};
    if (!request.ambient || request.ambient.Type !== "COLOUR") request.ambient = FWGE.Render.Colour.Create(request.ambient);
    if (!request.diffuse || request.diffuse.Type !== "COLOUR") request.diffuse = FWGE.Render.Colour.Create(request.diffuse);
    if (!request.specular || request.specular.Type !== "COLOUR") request.specular = FWGE.Render.Colour.Create(request.specular);
    if (typeof request.alpha !== 'number') request.alpha = 1.0;
    if (typeof request.shininess !== 'number') request.shininess = 5.0;
    if (!request.shader) request.shader = undefined;
    if (!request.imagemap) request.imagemap = undefined;
    if (!request.bumpmap) request.bumpmap = undefined;
    
    console.log(request);

    GameItem.call($, undefined, "MATERIAL");
    
    var _Ambient    = request.ambient;
    var _Diffuse    = request.diffuse;
    var _Specular   = request.specular;
    var _Alpha      = request.alpha;
    var _Shininess	= request.shininess;
    var _Shader     = request.shader;
    var _Image      = undefined;
    var _Bump       = undefined;
    
    Object.defineProperties($,
    {
        Ambient:
        {
            get: function getAmbient(){ return _Ambient; },
            set: function setAmbient()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Ambient, arguments[0]);
            }
        },
        Diffuse:
        {
            get: function getDiffuse(){ return _Diffuse; },
            set: function setDiffuse()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Diffuse, arguments[0]);
            }
        },
        Specular:
        {
            get: function getSpecular(){ return _Specular; },
            set: function setSpecular()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Specular, arguments[0]);
            }
        },
        Alpha:
        {
            get: function getAlpha(){ return _Alpha; },
            set: function setAlpha()
            {
                if (typeof arguments[0] === 'number')
                    _Alpha = arguments[0];
            }
        },
        Shininess:
        {
            get: function getShininess(){ return _Shininess; },
            set: function setShininess()
            {
                if (typeof arguments[0] === 'number')
                    _Shininess = arguments[0];
            }
        },
        Shader:
        {
            get: function getShader(){ return _Shader; },
            set: function setShader()
            {
                if (arguments[0] instanceof Shader)
                    _Shader = arguments[0];
            }
        },
        Image:
        {
            get: function getImage(){ return _Image; },
            set: function setImage()
            {
                if (arguments[0] instanceof WebGLTexture || arguments[0] === undefined)
                    _Image = arguments[0];
            }
        },
        Bump:
        {
            get: function getBump(){ return _Bump; },
            set: function setBump()
            {
                if (arguments[0] instanceof WebGLTexture || arguments[0] === undefined)
                    _Bump = arguments[0];
            }
        }
    });
    
    __MATERIAL__.push($);
}
Object.defineProperties(Material.prototype,
{
    constructor: { value: Material },
    SetTexture:
    {
        value: function SetTexture(imagemap, bumpmap)
        {
            if (!!imagemap)
            {
                var image = new Image();
                image.onload = function(){ this.LoadImage(image, this.Image) };
                image.src = imagemap;
            }
            
            if (!!bumpmap)
            {
                var bump = new Image();
                bump.onload = function(){ this.LoadImage(bump, this.Bump) };
                bump.src = bumpmap;
            }
        }
    },
    LoadImage:
    {
        value: function LoadImage(image, texture)
        {
            
        }
    }
});


function Collision(request)
{
    var $ = this;
    
    GameItem.call($, request.gameobject, "COLLISION");
}


function Animation(request)
{
    var $ = this;
    
    GameItem.call($, request.gameobject, "ANIMATION");
}


function ParticleSystem(request)
{
    var $ = this;
    
    GameItem.call($, request.gameobject, "PARTICLESYSTEM");
}


function PhysicsItem(request)
{
    var $ = this;
    
    GameItem.call($, request.gameobject, "PHYSICS");
}


/*!
 *  @param      request
 *      @param  name
 *      @param  material
 *      @param  mesh
 *      @param  transform
 *      @param  physics
 *      @param  animation
 *      @param  begin
 *      @param  update
 *      @param  end
 */
function GameObject(request)
{
    var $ = this;
    
    if (!request) request = {};
    if (!request.name) request.name = "GameObject";
    
    if (!request.material) request.material    = undefined;
    if (!request.mesh) request.mesh = undefined;
    if (!request.transform) request.transform   = new Transform({ gameobject: $ });
    if (!request.physicsitem) request.physicsitem = undefined;
    if (!request.animation) request.animation   = undefined;
    if (!request.lightitem) request.lightitem   = undefined;
    
    if (!request.begin)         request.begin       = function(){};
    if (!request.update)        request.update      = function(){};
    if (!request.end)           request.end         = function(){};
    
    console.log(request);
    
    GameItem.call($, $, "GAMEOBJECT");
    
    var _Name           = request.name;
    var _Material       = request.material;
    var _Mesh           = request.mesh;
    var _Transform      = request.transform;
    var _PhysicsItem    = request.physicsitem;
    var _Animation      = request.animation;
    var _LightItem      = request.lightitem;
    var _ParticleSystem = request.particlesystem;
    
    var _Begin          = request.begin;
    var _Update         = request.update;
    var _End            = request.end;
    
    Object.defineProperties($,
    {
        ID:         { value: "[go-" + IDCounter.next() + "]" },
        Children:   { value: [] },
        Transform:  { value: request.transform },
        Name:
        {
            get: function getName(){ return _Name; },
            set: function setName()
            {
                if (typeof arguments[0] === 'string')
                    _Name = arguments[0];
            }
        },
        Material:
        {
            get: function getMaterial() { return _Material; },
            set: function setMaterial()
            {
                if (arguments[0] instanceof Material || arguments[0] === undefined)
                    _Material = arguments[0];
            }
        },
        Mesh:
        {
            get: function getMesh() { return _Mesh; },
            set: function setMesh()
            {
                if (arguments[0] instanceof Mesh || arguments[0] === undefined)
                    _Mesh = arguments[0];
            }
        },
        PhysicsItem:
        {
            get: function getPhysicsItem() { return _PhysicsItem; },
            set: function setPhysicsItem()
            {
                if (arguments[0] instanceof PhysicsItem || arguments[0] === undefined)
                    _PhysicsItem = arguments[0];
            }
        },
        Animation:
        {
            get: function getAnimation() { return _Animation; },
            set: function setAnimation()
            {
                if (arguments[0] instanceof Animation || arguments[0] === undefined)
                    _Animation = arguments[0];
            }
        },
        ParticleSystem:
        {
            get: function getParticleSystem() { return _ParticleSystem; },
            set: function setParticleSystem()
            {
                if (arguments[0] instanceof ParticleSystem || arguments[0] === undefined)
                    _ParticleSystem = arguments[0];
            }
        },
        Begin:
        {
            get: function getBegin() { return _Begin; },
            set: function setBegin()
            {
                if (typeof arguments[0] === 'function' || arguments[0] === undefined)
                    _Begin = arguments[0];
            }
        },
        Update:
        {
            get: function getUpdate() { return _Update; },
            set: function setUpdate()
            {
                if (typeof arguments[0] === 'function' || arguments[0] === undefined)
                    _Update = arguments[0];
            }
        },
        End:
        {
            get: function getEnd() { return _End; },
            set: function setEnd()
            {
                if (typeof arguments[0] === 'function' || arguments[0] === undefined)
                    _End = arguments[0];
            }
        }
    });
    
    __OBJECT__.push($);
}
Object.defineProperties(GameObject.prototype,
{
    constructor: { value: GameObject },
    Clone:
    {
        value: function Clone()
        {                
            var clone = new GameObject
            ({
                name:           this.name,
                material:       this.Material,
                mesh:           this.Mesh,
                transform:      new Transform
                ({
                    position:   this.Transform.Position,
                    rotation:   this.Transform.Rotation,
                    scale:      this.Transform.Scale,
                    shear:      this.Transform.Shear
                }),
                physics:        this.Physics,
                animation:      this.Aniamation
            });
            
            for (var i = 0; i < this.Children.length; ++i)
                clone.Children.push(this.Children[i].Clone());
            
            return clone;
        }
    },
    Destroy:
    {
        value: function Destroy()
        {
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
    ObjectUpdate:
    {
        value: function ObjectUpdate()
        {
            this.Update();
            this.Transform.TransformUpdate();
            if (!!this.PhysicsItem)     this.PhysicsItem.PhysicsUpdate();
            if (!!this.PhysicsItem)     this.PhysicsItem.PhysicsUpdate();
            if (!!this.Animation)       this.Animation.AnimationUpdate();
            if (!!this.LightItem)       this.LightItem.LightUpdate();
            if (!!this.ParticleSystem)  this.ParticleSystem.ParticleSystemUpdate();
        }
    }
});


function Item()
{
    var $ = this;
    
    Object.defineProperties($,
    {
        GameObject:       { value: GameObject },
        Mesh:             { value: Mesh },
        Material:         { value: Material },
        Transform:        { value: Transform },
        PhysicsItem:      { value: PhysicsItem },
        Collision:        { value: Collision },
        Animation:        { value: Animation },
        ParticleSystem:   { value: ParticleSystem }
    });
}


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


function Quaternion()
{
    var $ = this;

    // TODO
}


function Maths()
{
    var $ = this;
    
    Object.defineProperties($,
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


function obj()
{
    var $ = this;
}


function threejs()
{
    var $ = this;
}


function fbx()
{
    
}


function dae()
{
    
}


function Convert()
{
    var $ = this;
    
    Object.defineProperties($,
    {
        obj:      	{ value: new obj() },
        threejs:  	{ value: new threejs() },
        fbx:  		{ value: new fbx() },
        dae:  		{ value: new dae() }
    });
}


function File()
{
    var $ = this;
}


function Input()
{
    var $ = this;
    var _Keys = [];
    
    function Set()
    {
            
    }
    
    Object.defineProperty($, "InputUpdate",
    {
        value: function InputUpdate()
        {
            
        }
    });
}


function Time()
{
    var $ = this;
    var _Now = undefined, _Then = undefined;
    
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


function Physics()
{
    var $ = this;
    
    Object.defineProperties($,
    {
        PhysicsUpdate:
        {
            value: function PhysicsUpdate(){}
        }
    });
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


function LightObject(request)
{
    var $ = this;
    
    if (!request.colour) request.colour = new Float32Array(3);
    if (!request.intensity) request.intensity = 1;
    
    GameItem.call($, request.gameobject, request.type);
    
    var _Colour = request.colour;
    var _Intensity = request.intensity;
    
    Object.defineProperties($,
    {
        Colour:
        {
            get: function getColour(){ return _Colour; },
            set: function setColour()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Colour, arguments[0]);
            }
        },
        Intensity:
        {
            get: function getIntensity(){ return _Intensity; },
            set: function setIntensity()
            {
                if (typeof arguments[0] === 'number')
                    _Intensity = arguments[0];
            }
        }
    });
    
    __LIGHT__.push($);
}


function Ambient(request)
{
    var $ = this;
    
    if (!request)   request = {};
    
    request.type = "AMBIENTLIGHT";
    LightObject.call($, request);
}


function Directional(request)
{
    var $ = this;
    
    if (!request)   request = {};
    if (!request.direction || !(request.direction instanceof Float32Array && request.direction.length === 3)) request.direction = FWGE.Maths.Vector3.Create();
    
    request.type = "DIRECTIONALLIGHT";
    LightObject.call($, request);
    
    var _Direction = request.direction;
    
    Object.defineProperties($,
    {
        Direction:
        {
            get: function getDirection() { return _Direction; },
            set: function setDirection()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Direction, arguments[0]);
            }
        }
    });
}


function Point(request)
{
    var $ = this;
    
    if (!request) request = {};
    if (!request.transform) request.transform = new FWGE.Item.Transform();
    if (!request.radius) request.radius = 5;
    if (!request.angle) request.angle = 180;       
    
    request.type = "POINTLIGHT";
    LightObject.call($, request);
    
    var _Transform = request.transform;
    var _Radius = request.radius;
    var _Angle = request.angle;
    
    Object.defineProperties($, 
    {
        Radius:
        {
            get: function getRadius() { return _Radius; },
            set: function setRadius()
            {
                if (typeof arguments[0] === 'number')
                    _Radius = arguments[0];
            }
        },
        Angle:
        {
            get: function getAngle() { return _Angle; },
            set: function setAngle()
            {
                if (typeof arguments[0] === 'number')
                    _Angle = arguments[0];
            }
        },
        Transform: { get: function getTransform(){ return _Transform; } }
    });
}


function Light()
{
    var $ = this;
    
    Object.defineProperties($,
    {
        Ambient:      { value: Ambient },
        Directional:  { value: Directional },
        Point:        { value: Point }       
    });
}


function Camera()
{
    var $ = this;
    
    var _Mode = 0;
    var _FOV = 35;
    var _Aspect = 16/9;
    var _Near = 0.1;
    var _Far = 900;
    var _Left = -10;
    var _Right = 10;
    var _Top = 10;
    var _Bottom = 10;
    var _Theta = 90;
    var _Phi = 90;

    Object.defineProperties($,
    {
    	PERSPECTIVE:  { value: 0 },
    	ORTHOGRAPHIC: { value: 1 },
    	Mode:
    	{ 
    		get: function getMode() { return _Mode; },
    		set: function setMode()
    		{ 
    			if (arguments[0] === $.PERSPECTIVE || arguments[0] === $.ORTHOGRAPHIC)
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


function Colour()
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


function Render()
{
    var $ = this;
    
    Object.defineProperties($,
    {
        Camera:   	{ value: new Camera() },
        Colour:   	{ value: new Colour() },
        GameScreen: { value: new GameScreen() },
        Shader:   	{ value: Shader },
        Light:    	{ value: new Light() }
    });
}


function Shader(request)
{
    var $ = this;
    
    if (!request) request = {};
    if (!request.name || typeof request.name !== 'string') return;
    if (!request.vertexShader || typeof request.vertexShader !== 'string') return;
    if (!request.fragmentShader || typeof request.fragmentShader !== 'string') return;
    if (typeof request.width !== 'number') request.width = 512;
    if (typeof request.height !== 'number') request.height = 512;
    
    Object.defineProperties($,
    {
        Name:             { value: request.name },
        Program:          { value: GL.createProgram() },
        Texture:          { value: GL.createTexture() },
        FrameBuffer:      { value: GL.createFramebuffer() },
        RenderBuffer:     { value: GL.createRenderbuffer() }
    });

    GL.bindFramebuffer(GL.FRAMEBUFFER, $.FrameBuffer);		 	
    GL.bindRenderbuffer(GL.RENDERBUFFER, $.RenderBuffer);
    GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, 1024, 768);
    GL.bindTexture(GL.TEXTURE_2D, $.Texture);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1024, 768, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, $.Texture, 0);
    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, $.RenderBuffer);
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
    
    GL.attachShader($.Program, vs);
    GL.attachShader($.Program, fs);
    GL.linkProgram($.Program);
    if (!GL.getProgramParameter($.Program, GL.LINK_STATUS)) return;
    
    GL.useProgram($.Program);
    
    Object.defineProperties($,
    {
        Attributes:
        { 
            value:
            {
                Position:   GL.getAttribLocation($.Program, "A_Position"),
                Colour:     GL.getAttribLocation($.Program, "A_Colour"),
                UV:         GL.getAttribLocation($.Program, "A_UV"),
                Normal:     GL.getAttribLocation($.Program, "A_Normal")
            }
        },
        Uniforms:
        {
            value:
            {
                Material:
                {
                    Ambient:    GL.getUniformLocation($.Program, "U_Material.Ambient"),
                    Diffuse:    GL.getUniformLocation($.Program, "U_Material.Diffuse"),
                    Specular:   GL.getUniformLocation($.Program, "U_Material.Specular"),
                    Shininess:  GL.getUniformLocation($.Program, "U_Material.Shininess"),
                    Alpha:      GL.getUniformLocation($.Program, "U_Material.Alpha")
                },
                Matrix:
                {
                    ModelView:  GL.getUniformLocation($.Program, "U_Matrix.ModelView"),
                    Projection: GL.getUniformLocation($.Program, "U_Matrix.Projection"),
                    Normal:     GL.getUniformLocation($.Program, "U_Matrix.Normal")
                },
                Light:
                {
                    Ambient:
                    {
                        Colour:     GL.getUniformLocation($.Program, "U_Ambient.Colour"),
                        Intensity:  GL.getUniformLocation($.Program, "U_Ambient.Intensity")
                    },
                    Directional:
                    {
                        Colour:     GL.getUniformLocation($.Program, "U_Directional.Colour"),
                        Intensity:  GL.getUniformLocation($.Program, "U_Directional.Intensity"),
                        Direction:  GL.getUniformLocation($.Program, "U_Directional.Direction")
                    },
                    Point:
                    [
                        {
                            Colour:     GL.getUniformLocation($.Program, "U_Point[0].Colour"),
                            Intensity:  GL.getUniformLocation($.Program, "U_Point[0].Intensity"),
                            Position:   GL.getUniformLocation($.Program, "U_Point[0].Position"),
                            Radius:     GL.getUniformLocation($.Program, "U_Point[0].Radius"),
                            Angle:      GL.getUniformLocation($.Program, "U_Point[0].Angle")
                        }
                    ],
                    PointCount: GL.getUniformLocation($.Program, "U_Point_Count"),
                },
                Sampler:
                {
                    Image:      GL.getUniformLocation($.Program, "U_Sampler.Image"),
                    Bump:       GL.getUniformLocation($.Program, "U_Sampler.Bump")
                }
            }
        }
    });
    
    GL.useProgram(null);
    
    __SHADER__.push($);
}


function GameScreen()
{
    var $ = this;
}


function ModelView()
{
    var $ = this;
    var _Stack = [];
    
    Object.defineProperties($,
    {
        PushMatrix:
        {
            value: function PushMatrix()
            {
                var peek = $.PeekMatrix();
                _Stack.push(FWGE.Maths.Matrix4.Create
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
                    return FWGE.Maths.Matrix4.Identity();
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
                FWGE.Maths.Matrix4.Set
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
                return FWGE.Maths.Matrix4.Create
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
                return FWGE.Maths.Matrix4.Mult
                (
                    FWGE.Maths.Matrix4.Create
                    (
                        1.0,                   0.0,                    0.0, 0.0,
                        0.0, Math.cos(rotation[0]), -Math.sin(rotation[0]), 0.0,
                        0.0, Math.sin(rotation[0]),  Math.cos(rotation[0]), 0.0,
                        0.0,                   0.0,                    0.0, 1.0
                    ),
                    FWGE.Maths.Matrix4.Mult
                    (
                        FWGE.Maths.Matrix4.Create
                        (
                             Math.cos(rotation[1]), 0.0, Math.sin(rotation[1]), 0.0,
                                               0.0, 1.0,                   0.0, 0.0,
                            -Math.sin(rotation[1]), 0.0, Math.cos(rotation[1]), 0.0,
                                               0.0, 0.0,                   0.0, 1.0
                        ),
                        FWGE.Maths.Matrix4.Mult
                        (
                            FWGE.Maths.Matrix4.Create
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
                return FWGE.Maths.Matrix4.Create
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

                return FWGE.Maths.Matrix4.Mult
                (
                    FWGE.Maths.Matrix4.Create
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
    var $ = this;
    var _Camera = FWGE.Maths.Matrix4.Identity();
    
    function Orthographic(left, right, top, bottom, near, far, theta, phi)
    {
        theta = Math.cot(Math.radian(theta));
        phi = Math.cot(Math.radian(phi));

        left -= near * theta;
        right -= near * theta;
        top -= near * phi;
        bottom -= near * phi;

        FWGE.Maths.Matrix4.Set
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

        FWGE.Maths.Matrix4.Set
        (
            _Camera,

                  2 * near / width,                       0,                         0,  0,
                                 0,       2 * near / height,                         0,  0,
            (right + left) / width, (top + bottom) / height,     -(far + near) / depth, -1,
                                 0,                       0, -(2 * far * near) / depth,  1
        );
    }
    
    Object.defineProperties($,
    {
        ProjectionUpdate:
        {
            value: function ProjectionUpdate()
            {                            
                switch (FWGE.Render.Camera.Mode)
                {
                    case FWGE.Render.Camera.PERSPECTIVE:
                        Perspective
                        (
                            FWGE.Render.Camera.FOV,
                            FWGE.Render.Camera.Aspect,
                            FWGE.Render.Camera.Near,
                            FWGE.Render.Camera.Far
                        );
                    break;

                    case FWGE.Render.Camera.ORTHOGRAPHIC:
                        Orthographic
                        (
                            FWGE.Render.Camera.Left,
                            FWGE.Render.Camera.Right,
                            FWGE.Render.Camera.Top,
                            FWGE.Render.Camera.Bottom,
                            FWGE.Render.Camera.Near,
                            FWGE.Render.Camera.Far,
                            FWGE.Render.Camera.Theta,
                            FWGE.Render.Camera.Phi
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
	var $ = this;

	Object.defineProperties($,
	{
		Render:
		{
			value: function Render()
			{
                $.ClearBuffers();

				var i = __OBJECT__.length;
				while (--i >= 0)
				{
                	$.SetGlobalUniforms();
					$.RenderObject(__OBJECT__[i]);

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
	                $.RenderObject(object.Children[i]);
	            
	            if (!!object.Mesh && !!object.Material)
	            {
	                var shader = object.Material.Shader

	                GL.useProgram(shader.Program);
	                GL.enableVertexAttribArray(shader.Attributes.Position);
	                GL.enableVertexAttribArray(shader.Attributes.Normal);
	                GL.enableVertexAttribArray(shader.Attributes.Colour);
	                GL.enableVertexAttribArray(shader.Attributes.UV);

	                if (object.Material.Alpha !== 1.0)
	                {
	                    GL.enable(GL.BLEND);
	                    GL.disable(GL.DEPTH_TEST);
	                    GL.blendFunc(GL.SRC_ALPHA, GL.ONE);
	                }
	                
	                $.BindAttributes(object.Mesh, object.Material, object.Material.Shader.Attributes);
	                $.SetObjectUniforms(object.Material, object.Material.Shader.Uniforms);
	                $.Draw(object.Mesh.VertexCount);
	                
					if (object.Material.Alpha !== 1.0)
					{
	                    GL.enable(GL.DEPTH_TEST);
	                    GL.disable(GL.BLEND);
	                }
            
	                GL.disableVertexAttribArray(shader.Attributes.Position);
	                GL.disableVertexAttribArray(shader.Attributes.Normal);
	                GL.disableVertexAttribArray(shader.Attributes.Colour);
	                GL.disableVertexAttribArray(shader.Attributes.UV);	                
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
	            GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, $.CalculateNormalMatrix());
	            
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
				FWGE.Maths.Matrix4.Inverse(mat);
				return FWGE.Maths.Matrix3.Create
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


function Engine()
{
	var $ = this;
	var _Running = false;
	var _AnimationFrame = undefined;

	Object.defineProperties($,
	{
		Run: 
		{ 
			value: function Run()
			{
				_AnimationFrame = window.requestAnimationFrame($.Run);

	            FWGE.Other.Time.TimeUpdate();

	            if (_Running)
	            {
		            FWGE.Other.Input.InputUpdate();
		            FWGE.Render.Camera.CameraUpdate();
		            
		            var i = __OBJECT__.length;
		            while (--i >= 0)
		                __OBJECT__[i].ObjectUpdate();

					__RENDERER__.Render();
				}
			}
		},
		Start: 	{ value: function Start() { if (!_Running) _Running = true; if (!_AnimationFrame) $.Run(); } },
		Stop: 	{ value: function Stop()  { if (_Running) _Running = false; } }
	});
};


function FWGEPrototype()
{
	var $ = this;

	Object.defineProperties($,
	{
        Item:     { value: new Item()       },
        Maths:    { value: new Maths()      },
        Render:   { value: new Render()     },
        Physics:  { value: new Physics()    },
        Convert:  { value: new Convert() 	},
        Other:    { value: new Other()      },

		Init: 
		{
			value: function Init(canvas)
			{
				GL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

				if (!GL)
					throw "Webgl context could not be initialized.";

				window.onresize = function onresize(e)
				{
					FWGE.Render.Camera.CameraUpdate();
					__PROJECTION__.ProjectionUpdate();
				};
				FWGE.Render.Camera.CameraUpdate();
				__PROJECTION__.ProjectionUpdate();

				shader = new FWGE.Render.Shader
				({
					name: "Simple Shader",
					vertexShader: vs_text,
					fragmentShader: fs_text
				});
				GL.useProgram(shader.Program);

				GL.clearColor(0, 0, 0, 0);
				GL.enable(GL.DEPTH_TEST);
			}
		},
		Start: { value: function Start() { __ENGINE__.Start();  } },
		Stop:  { value: function Stop()  { __ENGINE__.Stop(); } }
	});
}

    Object.defineProperty(window, "FWGE", { value: new FWGEPrototype() });

    
    var __MODELVIEW__   = new ModelView();
    var __PROJECTION__  = new Projection();
    var __RENDERER__    = new Renderer();
    var __ENGINE__      = new Engine();
    var __OBJECT__      = [];
    var __MATERIAL__    = [];
    var __MESH__        = [];
    var __LIGHT__       = [];
    var __SHADER__      = [];
})();

