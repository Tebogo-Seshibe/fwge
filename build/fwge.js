(function(window)
{
    'use strict';


    /**
     * @name        BufferedArray
     * @module      FWGE.Interfaces
     * @description This object is a base container for any fixed-lenth array with accesssors
     */
    
    let BufferedArray = (function()
    {
        /**
         * @param   {number}    length
         * @param   {Function}  arraytype
         */
        function BufferedArray(length = 0, arraytype = Array)
        {
            var type = typeof length;
            var self = this;
    
            if (type !== 'number')
                throw `Expected number, ${type} found.`;
                
            if (length <= 0)
                throw 'Length provided must be larger than 0';
    
            Object.defineProperties(this,
            {
                /**
                 * @property    {Buffer}
                 * @type        {Array}
                 */
                Buffer: { value: new arraytype(length), configurable: false, enumerable: true, writable: false  },
    
                /**
                 * @property    {length}
                 * @type        {number}
                 */
                length: { value: length, configurable: false, enumerable: true, writable: false }
            });
    
            for (var i = 0; i < length; ++i)
            {
                (function(index)
                {
                    Object.defineProperty(self, index,
                    {
                        set: function set(value) { this.Buffer[index] = value; },
                        get: function get() { return this.Buffer[index]; },
                        configurable: false, enumerable: true
                    });
                })(i);
            }
        }
    
        BufferedArray.prototype = Object.create(null);
        Object.seal(BufferedArray.prototype);
    
        return BufferedArray;
    })();
    Object.seal(BufferedArray);
    
    /**
     * @name        Converter
     * @module      FWGE.Game
     * @description Base object converter
     */
    
    let Converter = (function()
    {
        /**
         * 
         * @param {Function} parse 
         * @param {Function} gameobject 
         * @param {Function} mesh 
         * @param {Function} rendermaterial 
         */
        function Converter(parse = function Parse(){}, gameobject = function ParseGameObject(){}, mesh = function ParseMesh(){}, rendermaterial = function ParseRenderMaterial(){})
        {
            Object.defineProperties(this,
            {
                /**
                 * @function    Read
                 * @param       {string}    path
                 * @return      {string}
                 */
                Read:
                {
                    value: function Read(path)
                    {
                        let xml = new XMLHttpRequest();
    
                        xml.open('GET', path, false);
                        xml.send(null);
                        
                        return xml.responseText;
                    },
                    configurable: false, enumerable: true, writable: false
                },
    
                /**
                 * @function    Parse
                 * @return      {GameObject}
                 */
                Parse: { value: parse, configurable: false, enumerable: true, writable: false },
                
                /**
                 * @function    GameObject
                 * @return      {GameObject}
                 */
                ParseGameObject: { value: gameobject, configurable: false, enumerable: true, writable: false },
                
                /**
                 * @function    Mesh
                 * @return      {Mesh}
                 */
                ParseMesh: { value: mesh, configurable: false, enumerable: true, writable: false },
                
                /**
                 * @function    RenderMaterial
                 * @return      {RenderMaterial}
                 */
                ParseRenderMaterial: { value: rendermaterial, configurable: false, enumerable: true, writable: false }
            });
        }
    
        Converter.prototype = Object.create(null);
        Object.seal(Converter.prototype);
    
        return Converter;
    })();
    Object.seal(Converter);
    
    /**
     * @name        OBJConverter
     * @module      FWGE.Render
     * @description Some description
     */
    
    window.OBJConverter = (function()
    {
        function OBJConverter()
        {
            Converter.call(this,
                function Parse(obj, mtl)
                {
                    var object_name = obj.split(/(\/|\\)/).filter(function(string){if (string.indexOf('.obj') !== -1) return string;})[0].replace('.obj', '');
                    var self = this;
                    var OBJ = this.Read(obj).split('\n');
                    var MTL = this.Read(mtl).split('\n');
                    var Children = new Array();
                    var Materials = {};
                    var Meshes = {};
    
                    var curr = -1;
                    var name = '';
                    MTL.forEach(function(item, index, array)
                    {
                        if (item.indexOf('newmtl') !== -1)
                        {
                            if (curr !== -1)
                                Materials[name] = MTL.slice(curr, index).join('\n');
    
                            curr = index;
                            name = item.split(' ')[1].trim();
                        }
    
                        if (index === array.length - 1)
                            Materials[name] = MTL.slice(curr, array.length).join('\n');
                    });
    
                    curr = -1;
                    OBJ.forEach(function(item, index, array)
                    {
                        if (item.indexOf('o ') !== -1)
                        {
                            if (curr !== -1)
                                Meshes[name] = OBJ.slice(curr, index).join('\n');
    
                            curr = index;
                            name = item.split(' ')[1].trim();
                        }
    
                        if (index === array.length - 1)
                            Meshes[name] = OBJ.slice(curr, array.length).join('\n');
                    });
    
                    Object.keys(Materials).forEach(function(key, index, array) { Materials[key] = self.ParseRenderMaterial(Materials[key]); });
                    Object.keys(Meshes).forEach(function(key, index, array)
                    {
                        var mesh = self.ParseMesh(Meshes[key]);
                        var material = Meshes[key].split('\n').filter(function(item){if(item.indexOf('usemtl ')!==-1)return item;}).join('').replace('usemtl ', '');
    
                        Children.push(new GameObject(
                        {
                            name:       mesh.Name,
                            mesh:       mesh,
                            material:   Materials[material]
                        }));
                    });
    
                    var result = undefined;
    
                    if (Children.length === 1)
                        return Children.pop();
    
                    return new GameObject(
                    {
                        name:       object_name,
                        children:   Children
                    });
                },
                
                function ParseGameObject(ParseMesh, materials, meshes)
                {
                    return new GameObject();
                },
    
                function ParseMesh(obj)
                {
                    var lines = obj.split('\n');
                    var vertices = [];
                    var normals = [];
                    var uvs = [];
                    var request =
                    {
                        position:   [],
                        normal:     [],
                        uv:         [],
                        colour:     [],
                        index:      [],
                        wireframe:  []
                    };
                    var face_offset = 0;
                    var wireframe_offset = 0;
                    
                    for (var i = 0; i < lines.length; ++i)
                    {
                        var line = lines[i];
                        var type = line.split(' ')[0];
                        var value = line.substring(type.length).trim();
                        var values = value.split(' ');
    
    
                        switch (type)
                        {
                            case 'o':
                                request.name = value;
                            break;
                            
                            case 'v':
                                vertices.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
                            break;
                            
                            case 'vn':
                                normals.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
                            break;
                            
                            case 'vt':
                                uvs.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
                            break;
    
                            case 'f':
                                values.forEach(function(face, index, array)
                                {
                                    var face_i = face.split('/').map(function(item)
                                    { 
                                        var val = parseInt(item);
                                        
                                        if (!isNaN(val))
                                            return val - 1;
    
                                        return NaN;
                                    });
    
                                    if (!isNaN(face_i[0]))
                                        request.position = request.position.concat(vertices[face_i[0]]);
                                    
                                    if (!isNaN(face_i[1]))
                                        request.uv = request.uv.concat(uvs[face_i[1]]);
                                    
                                    if (!isNaN(face_i[2]))
                                        request.normal = request.normal.concat(normals[face_i[2]]);
    
                                    if (index >= 2)
                                        request.index.push(face_offset, face_offset + index - 1, face_offset + index);
                                });
                                
                                for (var j = 0; j < values.length; ++j)
                                {
                                    if (j === values.length - 1)
                                        request.wireframe.push(wireframe_offset + j, wireframe_offset);
                                    else
                                        request.wireframe.push(wireframe_offset + j, wireframe_offset + j + 1);
                                }
                                wireframe_offset += values.length;
                                face_offset += values.length;
                            break;
                        }
                    }
    
                    return new Mesh(request);
                },
                
                function ParseRenderMaterial(mtl)
                {
                    var lines = mtl.split('\n');
                    var request = {};
    
                    for (var i = 0; i < lines.length; ++i)
                    {
                        var line = lines[i];
                        var type = line.split(' ')[0];
                        var value = line.substring(type.length).trim();
                        var values = value.split(' ');
    
                        switch (type)
                        {
                            case 'newmtl':
                                request.name = value;
                            break;
    
                            case 'Ns':
                                request.shininess = parseFloat(value);
                            break;
    
                            case 'Ka':
                                request.ambient = new Colour(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                            break;
    
                            case 'Kd':
                                request.diffuse = new Colour(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                            break;
    
                            case 'Ks':
                                request.specular = new Colour(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                            break;
                            
                            case 'd':
                                request.alpha = parseFloat(value);
                            break;
    
                            case 'Tr':
                                request.alpha = 1 - parseFloat(value);
                            break;
                        }
                    }
    
                    return new RenderMaterial(request);
                }
            );
    
            Object.seal(this);
        }
    
        OBJConverter.prototype = Object.create(null);
        Object.seal(OBJConverter.prototype);
    
        return new OBJConverter();
    })();
    Object.seal(OBJConverter);
    
    /**
     * @name        KeyFrame
     * @module      FWGE.Interface
     * @description SOme description
     */
    
    let KeyFrame = (function()
    {
        /**
         * 
         * @param {Function}    T 
         * @param {T}           before 
         * @param {T}           after 
         * @param {number}      length 
         */
        function KeyFrame(T, before, after, length)
        {
            var _Current = new T();
            var _Offset = new T();
    
            Object.defineProperties(this,
            {
                /**
                 * @property    {Before}
                 * @type        {T}
                 */
                Before: { value: before, configurable: false, enumerable: true, writable: false },
    
                /**
                 * @property    {After}
                 * @type        {T}
                 */
                After: { value: after, configurable: false, enumerable: true, writable: false },
                
                /**
                 * @property    {Length}
                 * @type        {number}
                 */
                Length: { value: length, configurable: false, enumerable: true, writable: false }
            });
        }
    
        return KeyFrame;
    })();
    Object.seal(KeyFrame);
    
    /**
     * @name        Animation
     * @module      FWGE.Game
     * @description An animation object
     */
    
    window.Animation = (function()
    {
        /**
         * @param   {Object}    request
         * @param   {string}    request.name
         */
        function Animation({name = 'Animation', particle = undefined, frames = [], length = 0} = {})
        {
            Item.call(this, name);
    
            Object.defineProperties(this,
            {
                Frames:     { value: [], configurable: false, enumerable: true, writable: true },
                Parctle:    { value: particle instanceof Particle ? particle : undefined, configurable: false, enumerable: true, writable: true },
                Length:     { value: length, configurable: false, enumerable: true, writable: true }
            });
            Object.seal(this);
        }
    
        Animation.prototype = Object.create(null);
        Object.seal(Animation.prototype);
    
        return Animation;
    })();
    Object.seal(Animation);
    
    /**
     * @name        AnimationFrame
     * @module      FWGE.Game
     * @description The base animation frame object
     */
    
    let AnimationFrame = (function()
    {
        /** 
         * @param {Function}    T 
         * @param {T}           before 
         * @param {T}           after 
         * @param {number}      length 
         */
        function AnimationFrame(T, before, after, length)
        {
            KeyFrame.call(this, T, before, after, length);
        }
    
        AnimationFrame.prototype = Object.create(null);
        Object.seal(AnimationFrame.prototype);
    
        return AnimationFrame;
    })();
    Object.seal(AnimationFrame);
    
    /**
     * @name        ColourAnimationFrame
     * @module      FWGE.Game
     * @description An animation frame that changes the colour of the object.
     */
    
    window.ColourAnimationFrame = (function()
    {
        /**
         * @param   {Object}    equest
         * @param   {Colour}    request.before 
         * @param   {Colour}    request.after 
         * @param   {number}    request.length 
         */
        function ColourAnimationFrame({before = new Colour(), after = new Colour(), length = 0} = {})
        {
            AnimationFrame.call(this, Colour, before, after, length);
            Object.seal(this);
        }
    
        ColourAnimationFrame.prototype = Object.create(null);
        Object.seal(ColourAnimationFrame.prototype);
    
    
        return ColourAnimationFrame;
    })();
    Object.seal(ColourAnimationFrame);
    
    /**
     * @name        Particle
     * @module      GameEngine
     * @description ...
     */
    
    window.Particle = (function()
    {
        /**
         * @param   {Object}            request
         * @param   {string}            request.name
         * @param   {Mesh}              request.mesh
         * @param   {RenderMaterial}    request.material
         */
        function Particle({name = 'Particle', mesh = undefined, material = undefined} = {})
        {
            Item.call(this, name);
    
            Object.defineProperties(this,
            {
                Mesh:       { value: mesh instanceof Mesh ? mesh : undefined, configurable: false, enumerable: true, writable: true },
                Material:   { value: material instanceof RenderMaterial ? material : undefined, configurable: false, enumerable: true, writable: true}
            });
            Object.seal(this);
        }
    
        Particle.prototype = Object.create(null);
        Object.seal(Particle.prototype);
    
        return Particle;
    })();
    Object.seal(Particle);
    
    /**
     * @name        TransformAnimationFrame
     * @module      FWGE.Game
     * @description An animation frame thay changes the transform attributes of an object
     */
    
    window.TransformAnimationFrame = (function()
    {
        /**
         * @param   {Object}    request
         * @param   {Transform} request.before
         * @param   {Transform} request.after
         * @param   {number}    request.length
         */
        function TransformAnimationFrame({before = new Transform(), after = new Transform(), length = 0} = {})
        {
            AnimationFrame.call(this, Transform, before, after, length);
            Object.seal(this);
        }
    
        TransformAnimationFrame.prototype = Object.create(null);
        Object.seal(TransformAnimationFrame.prototype);
    
    
        return TransformAnimationFrame;
    })();
    Object.seal(TransformAnimationFrame);
    
    /**
     * @name        Camera
     * @module      FWGE.Game
     * @description Something...
     */
    
    let Camera = (function()
    {
        function Camera()
        {
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
    
            Object.defineProperties(this, 
            {
                constructor: Camera,
    
                //Transform: { value : new Transform(), configurable: false, enumerable: true,  writable: false },
                CameraMode: { value: 0, configurable: false, enumerable: true, writable: true },
    
                Mode:
                { 
                    get: function get() { return _Mode; },
                    set: function set(m)
                    {
                        switch (m)
                        {
                            case 0:
                            case 1:
                                _Mode = m;
                            break;
                        }
                    }
                },
    
                FOV: 
                {
                    get: function get() { return _FOV; },
                    set: function set(f) { if (typeof f === 'number') _FOV = f; }
                },
                Aspect: 
                {
                    get: function get() { return _Aspect; },
                    set: function set(a) { if (typeof a === 'number') _Aspect = a; }
                },
                Near: 
                {
                    get: function get() { return _Near; },
                    set: function set(n) { if (typeof n === 'number') _Near = n; }
                },
                Far: 
                {
                    get: function get() { return _Far; },
                    set: function set(f) { if (typeof f === 'number') _Far = f; }
                },
                Left: 
                {
                    get: function get() { return _Left; },
                    set: function set(l) { if (typeof l === 'number') _Left = l; }
                },
                Right: 
                {
                    get: function get() { return _Right; },
                    set: function set(r) { if (typeof r === 'number') _Right = r; }
                },
                Top: 
                {
                    get: function get() { return _Top; },
                    set: function set(t) { if (typeof t === 'number') _Top = t; }
                },
                Bottom: 
                {
                    get: function get() { return _Bottom; },
                    set: function set(b) { if (typeof b === 'number') _Bottom = b; }
                },
                Theta: 
                {
                    get: function get() { return _Theta; },
                    set: function set(t) { if (typeof t === 'number') _Theta = t; }
                },
                Phi: 
                {
                    get: function get() { return _Phi; },
                    set: function set(p) { if (typeof p === 'number') _Phi = p; }
                },
                
                Update:
                {
                    value: function Update()
                    {
                        if (FWGE.GL.canvas.width != FWGE.GL.canvas.clientWidth || FWGE.GL.canvas.height != FWGE.GL.canvas.clientHeight)
                        {
                            FWGE.GL.canvas.width  = FWGE.GL.canvas.clientWidth;
                            FWGE.GL.canvas.height = FWGE.GL.canvas.clientHeight;
                        }
                        
                        this.Aspect = FWGE.GL.drawingBufferWidth / FWGE.GL.drawingBufferHeight;
                    }
                }
            });
        }
        Camera.prototype = Object.create(null);
    
        return new Camera();
    })();
    /**
     * @name        CameraMode
     * @description ...
     */
    
    window.CameraMode = (function()
    {
        function CameraMode()
        {
            Object.defineProperties(this,
            {
                PERSPECTIVE:    { value: 0, configurable: false, enumerable: true, writable: false },
                ORTHOGRAPHIC:   { value: 1, configurable: false, enumerable: true, writable: false },
                '0': { value: 'PERSPECTIVE', configurable: false, enumerable: true, writable: false },
                '1': { value: 'ORTHOGRAPHIC', configurable: false, enumerable: true, writable: false }
            });
    
            Object.seal(this);
        }
    
        CameraMode.prototype = Object.create(null);
        Object.seal(CameraMode.prototype);
    
        return new CameraMode();
    })();
    Object.seal(CameraMode);
    /**
     * @name        Viewer
     * @module      FWGE.Game.Camera
     * @description This represnent an eye within the scene. Rendeering to the screen is
     *              based on what any viewer in the scene 'sees'.'
     */
    
    window.Viewer = (function()
    {
        /**
         * @param {Object}  request 
         * @param {Array}   request.position
         * @param {Array}   request.target
         */
        function Viewer({position = Vector3.Zero.Buffer, target = Vector3.Zero.Buffer} = {})
        {
            var _Direction = Vector3.Zero;
            var _Up = Vector3.Zero;
            var _Right = Vector3.Zero;
                
            Object.defineProperties(this,
            {
                /**
                 * @property    {Position}
                 * @type        {Vector3}
                 */
                Position: { value: new Vector3(position), configurable: false, enumerable: true, writable: false },
    
                /**
                 * @property    {Target}
                 * @type        {Vector3}
                 */
                Target: { value: new Vector3(target), configurable: false, enumerable: true, writable: false },
    
                /**
                 * @property    {Matrix}
                 * @type        {Matrix4}
                 */
                Matrix: { value: Matrix4.Identity, configurable: false, enumerable: false, writable: false },
    
                /**
                 * @function    Update
                 * @return      {undefined}
                 */
                Update:
                {
                    value: function Update()
                    {
                        _Direction.Set(_Position).Diff(this.Target).Unit();
                        _Right.Set(_Up).Cross(_Direction).Unit();
                        _Up.Set(_Direction).Cross(_Right).Unit();
    
                        this.Matrix.Set(
                        [
                            _Right.X,       _Right.Y,       _Right.Z,       0,
                            _Up.X,          _Up.Y,          _Up.Z,          0,
                            _Direction.X,   _Direction.Y,   _Direction.Z,   0,
                            0,                  0,                  0,                  1
                        ]).Mult(
                        [
                            1,                  0,                  0,                  0,
                            0,                  1,                  0,                  0,
                            0,                  0,                  1,                  0,
                            _Position.X,    _Position.Y,    this.Position.Z,    1
                        ]);
                    },
                    configurable: false, enumerable: false, writable: false
                }
            });
            
            Object.seal(this);
        }
    
        Viewer.prototype = Object.create(null);
        Object.seal(Viewer.prototype);
    
        return Viewer;
    })();
    Object.seal(Viewer);
    
    /**
     * @name        GameEngine
     * @module      FWGE
     * @description Something...
     */
    
    let GameEngine = (function()
    {
        function GameEngine()
        {
            let self = this;
            let _Running  = false;
            let _AnimationFrame = -1;
    
            /**
             * @function    Run
             * @return      {undefined}
             * @description Runs the main game loop
             */
            function _Run()
            {
                _AnimationFrame = window.requestAnimationFrame(_Run);
    
                self.Update();
    
                if (_Running)
                {
                    PhysicsEngine.Update();
                    RenderEngine.Update();
                }
            }
    
            Object.defineProperties(this,
            {
                /**
                 * @function    GameUpdate
                 * @return      {undefined}
                 */
                Update:
                {
                    value: function Update()
                    {
                        Time.Update();
                        Camera.Update();
    
                        var i = GameObject.Objects.length;
                        while (--i >= 0)
                            GameObject.Objects[i].ObjectUpdate();
    
                        Input.InputUpdate();
                    },
                    configurable: false, configurable: false, enumerable: true
                },
    
                /**
                 * @function    Start
                 * @return      {undefined}
                 */
                Start:
                {
                    value: function Start()
                    {
                        if(!_Running)
                            _Running = true;
    
                        if (_AnimationFrame === -1)
                            _Run();
                    },
                    configurable: false, configurable: false, enumerable: true
                },
    
                /**
                 * @function    Pause
                 * @return      {undefined}
                 */
                Pause:
                {
                    value: function Pause()
                    {
                        if (!_Running)
                            _Running = false;
                    },
                    configurable:false, configurable: false, enumerable: true
                },
    
                /**
                 * @function    Stop
                 * @return      {undefined}
                 */
                Stop:
                {
                    value: function Stop()
                    {
                        if (_Running)
                            _Running = false;
    
                        if (_AnimationFrame !== -1)
                        {
                            window.cancelAnimationFrame(_AnimationFrame);
                            _AnimationFrame = -1;
                        }
    
                        Time.Reset();
                    },
                    configurable:false, configurable: false, enumerable: true
                }
            });
    
            Object.seal(this);
        }
    
        GameEngine.prototype = Object.create(null);
        Object.seal(GameEngine.prototype);
    
        return new GameEngine();
    })();
    Object.seal(GameEngine);
    
    /**
     * @name        GameItem
     * @module      FWGE.Game
     */
    
    let GameItem = (function()
    {
        /**
         * @param   {string}        name
         * @param   {GameObject}    gameobject
         */
        function GameItem(name, gameobject)
        {
            Item.call(this, name);
    
            Object.defineProperties(this,
            {
                /**
                 * @property    {GameObject}
                 * @type        {GameObject}
                 */
                GameObject: { value: gameobject, configurable: false, enumerable: true, writable: false }
            });
        }
    
        GameItem.prototype = Object.create(null);
        Object.seal(GameItem.prototype);
    
        return GameItem;
    })();
    Object.seal(GameItem);
    
    /**
     * @name GameObject
     * @description The main object container for object types.   
     * @module      FWGE.Game
     */
    
    window.GameObject = (function()
    {
        /**
         * 
         */
        function GameObject({name, transform, material, mesh, physics, animation, begin = function Begin(){}, update = function Update(){}, end = function End(){}, children} = {})
        {
            Item.call(this, name);
    
            Object.defineProperties(this,
            {
                /**
                 * @property    {Children}
                 * @type        {Array<GameObject>}
                 */
                Children: { value: [], configurable: false, enumerable: true, writable: false },
    
                /**
                 * @property    {Transform}
                 * @type        {Transform}
                 */
                Transform: { value: transform instanceof Transform ? transform : new Transform(transform), configurable: false, enumerable: true, writable: false },
    
                /**
                 * @property    {RenderMaterial}
                 * @type        {RenderMaterial}
                 */
                Material: { value: material instanceof RenderMaterial ? material : undefined, configurable: false, enumerable: true, writable: true },
    
                /**
                 * @property    {Mesh}
                 * @type        {Mesh}
                 */
                Mesh: { value: mesh instanceof Mesh ? mesh : undefined, configurable: false, enumerable: true, writable: true },
    
                /**
                 * @property    {PhysicsItem}
                 * @type        {PhysicsItem}
                 */
                Physics: { value: physics instanceof PhysicsItem ? physics : undefined, configurable: false, enumerable: true, writable: true },
    
                /**
                 * @property    {Animation}
                 * @type        {Animation}
                 */
                Animation: { value: new Animation(animation), configurable: false, enumerable: true, writable: true },
    
                /**
                 * @property    {Begin}
                 * @type        {Function}
                 */
                Begin: { value: begin, configurable: false, enumerable: true, writable: true },
    
                /**
                 * @property    {Update}
                 * @type        {Function}
                 */
                Update: { value: update, configurable: false, enumerable: true, writable: true },
    
                /**
                 * @property    {End}
                 * @type        {Function}
                 */
                End: { value: end, configurable: false, enumerable: true, writable: true }
            });
            
            GameObject.Objects.push(this);
    
            if (children)
                children.forEach(function(child){ self.Add(child); });
    
            this.Begin();
    
            Object.seal(this);
        }
        Object.defineProperties(GameObject,
        {
            /**
             * @property    {Objects}
             * @type        {Array}
             * @description List of all the objects in the scene
             */
            Objects: { value: [], configurable: false, enumerable: false, writable: false },
    
            /**
             * @function    Clone
             * @param       {GameObject} gameobject
             * @return      {GameObject}
             * @description Creates a clone of a gameobject. If no gameobject is provided,
             *              it creates a clone of the calling gameobject.
             */
            Clone:
            { 
                value: function Clone(gameObject)
                {
                    var clone = new GameObject(
                    {
                        name:       gameObject.Name,
                        transform:  new Transform(
                        {
                            position:   gameObject.Transform.Position.Buffer,
                            rotation:   gameObject.Transform.Rotation.Buffer,
                            scale:      gameObject.Transform.Scale.Buffer,
                            shear:      gameObject.Transform.Shear.Buffer
                        }),
                        mesh:       gameObject.Mesh,
                        material:   gameObject.Material,
                        physics:    gameObject.Physics,
                        begin:      gameObject.Begin,
                        update:     gameObject.Update,
                        end:        gameObject.End
                    });
                    
                    for (var i = 0; i < gameObject.Children.length; ++i)
                        clone.Children.push(gameObject.Children[i].Clone());
                    
                    return clone;
                }
            }
        });
    
        GameObject.prototype = Object.create(null);
        Object.defineProperties(GameObject.prototype,
        {
            constructor: { value: GameObject },
            
            /**
             * @function    Add
             * @param       {GameObject}    gameobject
             * @return      {undefined}
             */
            Add:
            {
                value: function Add(gameObject)
                {
                    let self = this;
    
                    if (gameObject instanceof Array  && gameObject.length > 0)
                        gameObject.forEach(function(element) { self.Add(element); });
    
                    else if (gameObject instanceof GameObject && gameObject !== this)
                    {
                        var index = GameObject.Objects.indexOf(gameObject);
    
                        if (index !== -1)
                            GameObject.Objects.splice(index, 1);
    
                        this.Children.push(gameObject);
                    }
                }
            },
    
            /**
             * @function    Remove
             * @param       {GameObject | number}    gameobject
             * @return      {GameObject}
             */
            Remove:
            {
                value: function Remove(gameObject)
                {
                    if (gameObject instanceof GameObject)
                        gameObject = this.Children.indexOf(gameObject);
                        
                    if (gameObject >= 0)
                    {
                        gameObject = this.Children.splice(gameObject, 1)[0];
                        GameObject.Objects.push(gameObject);
    
                        return gameObject;
                    }
                    
                    return null;
                }
            },
            
            /**
             * @function    Clone
             * @return      {GameObject}
             */
            Clone:
            {
                value: function Clone()
                {
                    return GameObject.Clone(this);
                }
            },
            
    
            /**
             * @function    Destroy
             * @param       {number} timeout
             * @return      {undefined}
             */
            Destroy:
            {
                value: function Destroy(timeout)
                {
                    var self = this;
    
                    if (typeof timeout !== 'number')
                        timeout = 0;
    
                    this.Children.forEach(child => {child.Destroy(timeout); });
    
                    setTimeout(function()
                    {
                        var i = GameObject.Objects.indexOf(self);
                        
                        if (i + -1)
                            GameObject.Objects.splice(i, 1);
    
                        self.End();
                    }, 1000 * timeout);
                }
            },
    
            /**
             * @function        ObjectUpdate
             * @param           {GameEngine}    Game
             * @param           {PhysicsEngine} Physics
             * @return          {undefined}
             */        
            ObjectUpdate:
            {
                value: function ObjectUpdate(Game, Physics)
                {
                    this.Update();
                    this.Children.forEach(child => { child.ObjectUpdate(Game, Physics); });
                }
            }
        });
        Object.seal(GameObject.prototype);
    
        return GameObject;
    })();
    Object.seal(GameObject);
    
    /**
     * @name        Input
     * @module      FWGE.Game
     * @description This module handles all user key and mouse inputs.
     */
    
    /**
     * @param   {HTMLCanvasElement} canvas
     */
    
    window.Input = (function()
    {
        function Input()
        {
            const _UP_K     = 0;
            const _PRESS_K  = 128;
            const _DOWN_K   = 256;
            const _END_K    = 384;
            let _Keys       = new Array(_END_K);
    
            const _UP_M     = 0;
            const _CLICK_M  = 3;
            const _DOWN_M   = 6;
            const _WHEEL_U  = 9;
            const _WHEEL_D  = 10;
            const _END_M    = 11;
            let _Mouse      = new Array(_END_M);
    
            const _X        = 0;
            const _Y        = 1;
            const _CURR_A   = 0;
            const _PREV_A   = 2;
            const _DELTA_A  = 4;
            const _END_A    = 8;
            let _Axis       = new Array(_END_A);
            
            function _handle_event(e)
            {
                var key = e instanceof MouseEvent ? e.button :  e.which || 0;
                
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
    
                return key;
            }
    
            for (var i = 0; i < _PRESS_K; ++i)
                _Keys[i] = true;
    
            for (var i = _PRESS_K; i < _END_K; ++i)
                _Keys[i] = false;
    
            for (var i = 0; i < _CLICK_M; ++i)
                _Mouse[i] = true;
    
            for (var i = _CLICK_M; i < _END_M; ++i)
                _Mouse[i] = false;
    
            for (var i = 0; i < _END_A; ++i)
                _Axis[i] = undefined;
            
            Object.defineProperties(this,
            {
                /**
                 * @property    {KEY_F1_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF1Up: { get: function get() { return _Keys[112 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F1_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF1Press: { get: function get() { return _Keys[112 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F1_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF1Down: { get: function get() { return _Keys[112 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_F2_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF2Up: { get: function get() { return _Keys[113 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F2_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF2Press: { get: function get() { return _Keys[113 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F2_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF2Down: { get: function get() { return _Keys[113 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_F3_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF3Up: { get: function get() { return _Keys[114 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F3_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF3Press: { get: function get() { return _Keys[114 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F3_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF3Down: { get: function get() { return _Keys[114 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_F4_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF4Up: { get: function get() { return _Keys[115 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F4_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF4Press: { get: function get() { return _Keys[115 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F4_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF4Down: { get: function get() { return _Keys[115 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_F5_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF5Up: { get: function get() { return _Keys[116 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F5_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF5Press: { get: function get() { return _Keys[116 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F5_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF5Down: { get: function get() { return _Keys[116 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_F6_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF6Up: { get: function get() { return _Keys[117 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F6_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF6Press: { get: function get() { return _Keys[117 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F6_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF6Down: { get: function get() { return _Keys[117 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_F7_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF7Up: { get: function get() { return _Keys[118 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F7_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF7Press: { get: function get() { return _Keys[118 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F7_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF7Down: { get: function get() { return _Keys[118 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_F8_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF8Up: { get: function get() { return _Keys[119 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F8_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF8Press: { get: function get() { return _Keys[119 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F8_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF8Down: { get: function get() { return _Keys[119 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_F9_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF9Up: { get: function get() { return _Keys[120 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F9_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF9Press: { get: function get() { return _Keys[120 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F9_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF9Down: { get: function get() { return _Keys[120 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_F10_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF10Up: { get: function get() { return _Keys[121 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F10_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF10Press: { get: function get() { return _Keys[121 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F10_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF10Down: { get: function get() { return _Keys[121 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_F11_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF11Up: { get: function get() { return _Keys[122 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F11_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF11Press: { get: function get() { return _Keys[122 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F11_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF11Down: { get: function get() { return _Keys[122 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_F12_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF12Up: { get: function get() { return _Keys[123 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F12_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF12Press: { get: function get() { return _Keys[123 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F12_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyF12Down: { get: function get() { return _Keys[123 + _DOWN_K]; }, configurable: false, enumerable: true },
    
    
            
                /**
                 * @property    {KEY_0_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key0Up: { get: function get() { return _Keys[48 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_0_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key0Press: { get: function get() { return _Keys[48 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_0_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key0Down: { get: function get() { return _Keys[48 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_1_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key1Up: { get: function get() { return _Keys[49 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_1_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key1Press: { get: function get() { return _Keys[49 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_1_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key1Down: { get: function get() { return _Keys[49 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_2_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key2Up: { get: function get() { return _Keys[50 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_2_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key2Press: { get: function get() { return _Keys[50 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_2_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key2Down: { get: function get() { return _Keys[50 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_3_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key3Up: { get: function get() { return _Keys[51 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_3_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key3Press: { get: function get() { return _Keys[51 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_3_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key3Down: { get: function get() { return _Keys[51 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_4_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key4Up: { get: function get() { return _Keys[52 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_4_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key4Press: { get: function get() { return _Keys[52 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_4_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key4Down: { get: function get() { return _Keys[52 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_5_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key5Up: { get: function get() { return _Keys[53 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_5_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key5Press: { get: function get() { return _Keys[53 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_5_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key5Down: { get: function get() { return _Keys[53 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_6_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key6Up: { get: function get() { return _Keys[54 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_6_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key6Press: { get: function get() { return _Keys[54 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_6_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key6Down: { get: function get() { return _Keys[54 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_7_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key7Up: { get: function get() { return _Keys[55 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_7_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key7Press: { get: function get() { return _Keys[55 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_7_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key7Down: { get: function get() { return _Keys[55 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_8_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key8Up: { get: function get() { return _Keys[56 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_8_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key8Press: { get: function get() { return _Keys[56 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_8_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key8Down: { get: function get() { return _Keys[56 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_9_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key9Up: { get: function get() { return _Keys[57 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_9_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key9Press: { get: function get() { return _Keys[57 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_9_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Key9Down: { get: function get() { return _Keys[57 + _DOWN_K]; }, configurable: false, enumerable: true },
    
    
            
                /**
                 * @property    {NUMPAD_0_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad0Up: { get: function get() { return _Keys[96 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_0_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad0Press: { get: function get() { return _Keys[96 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_0_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad0Down: { get: function get() { return _Keys[96 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {NUMPAD_1_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad1Up: { get: function get() { return _Keys[97 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_1_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad1Press: { get: function get() { return _Keys[97 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_1_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad1Down: { get: function get() { return _Keys[97 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {NUMPAD_2_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad2Up: { get: function get() { return _Keys[98 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_2_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad2Press: { get: function get() { return _Keys[98 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_2_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad2Down: { get: function get() { return _Keys[98 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {NUMPAD_3_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad3Up: { get: function get() { return _Keys[99 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_3_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad3Press: { get: function get() { return _Keys[99 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_3_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad3Down: { get: function get() { return _Keys[99 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {NUMPAD_4_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad4Up: { get: function get() { return _Keys[100 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_4_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad4Press: { get: function get() { return _Keys[100 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_4_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad4Down: { get: function get() { return _Keys[100 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {NUMPAD_5_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad5Up: { get: function get() { return _Keys[101 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_5_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad5Press: { get: function get() { return _Keys[101 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_5_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad5Down: { get: function get() { return _Keys[101 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {NUMPAD_6_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad6Up: { get: function get() { return _Keys[102 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_6_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad6Press: { get: function get() { return _Keys[102 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_6_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad6Down: { get: function get() { return _Keys[102 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {NUMPAD_7_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad7Up: { get: function get() { return _Keys[103 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_7_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad7Press: { get: function get() { return _Keys[103 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_7_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad7Down: { get: function get() { return _Keys[103 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {NUMPAD_8_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad8Up: { get: function get() { return _Keys[104 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_8_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad8Press: { get: function get() { return _Keys[104 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_8_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad8Down: { get: function get() { return _Keys[104 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {NUMPAD_9_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad9Up: { get: function get() { return _Keys[105 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_9_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad9Press: { get: function get() { return _Keys[105 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {NUMPAD_9_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                Numpad9Down: { get: function get() { return _Keys[105 + _DOWN_K]; }, configurable: false, enumerable: true },
    
    
            
                /**
                 * @property    {KEY_DIVIDE_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyDivideUp: { get: function get() { return _Keys[111 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_DIVIDE_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyDividePress: { get: function get() { return _Keys[111 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_DIVIDE_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyDivideDown: { get: function get() { return _Keys[111 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_MULTIPLY_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyMultiplyUp: { get: function get() { return _Keys[106 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_MULTIPLY_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyMultiplyPress: { get: function get() { return _Keys[106 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_MULTIPLY_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyMultiplyDown: { get: function get() { return _Keys[106 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_SUBTRACT_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeySubtractUp: { get: function get() { return _Keys[109 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_SUBTRACT_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeySubtractPress: { get: function get() { return _Keys[109 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_SUBTRACT_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeySubtractDown: { get: function get() { return _Keys[109 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_ADD_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyAddUp: { get: function get() { return _Keys[107 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_ADD_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyAddPress: { get: function get() { return _Keys[107 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_ADD_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyAddDown: { get: function get() { return _Keys[107 + _DOWN_K]; }, configurable: false, enumerable: true },
    
    
            
                /**
                 * @property    {KEY_TAB_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyTabUp: { get: function get() { return _Keys[9 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_TAB_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyTabPress: { get: function get() { return _Keys[9 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_TAB_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyTabDown: { get: function get() { return _Keys[9 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_CAPS_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyCapsUp: { get: function get() { return _Keys[20 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_CAPS_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyCapsPress: { get: function get() { return _Keys[20 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_CAPS_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyCapsDown: { get: function get() { return _Keys[20 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_SHIFT_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyShiftUp: { get: function get() { return _Keys[16 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_SHIFT_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyShiftPress: { get: function get() { return _Keys[16 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_SHIFT_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyShiftDown: { get: function get() { return _Keys[16 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_CTRL_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyCtrlUp: { get: function get() { return _Keys[17 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_CTRL_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyCtrlPress: { get: function get() { return _Keys[17 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_CTRL_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyCtrlDown: { get: function get() { return _Keys[17 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_ALT_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyAltUp: { get: function get() { return _Keys[18 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_ALT_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyAltPress: { get: function get() { return _Keys[18 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_ALT_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyAltDown: { get: function get() { return _Keys[18 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_BACKSPACE_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyBackspaceUp: { get: function get() { return _Keys[8 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_BACKSPACE_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyBackspacePress: { get: function get() { return _Keys[8 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_BACKSPACE_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyBackspaceDown: { get: function get() { return _Keys[8 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_ENTER_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyEnterUp: { get: function get() { return _Keys[13 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_ENTER_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyEnterPress: { get: function get() { return _Keys[13 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_ENTER_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyEnterDown: { get: function get() { return _Keys[13 + _DOWN_K]; }, configurable: false, enumerable: true },
    
    
            
                /**
                 * @property    {KEY_UP_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyUpUp: { get: function get() { return _Keys[38 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_UP_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyUpPress: { get: function get() { return _Keys[38 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_UP_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyUpDown: { get: function get() { return _Keys[38 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_LEFT_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyLeftUp: { get: function get() { return _Keys[37 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_LEFT_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyLeftPress: { get: function get() { return _Keys[37 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_LEFT_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyLeftDown: { get: function get() { return _Keys[37 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_RIGHT_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyRightUp: { get: function get() { return _Keys[39 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_RIGHT_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyRightPress: { get: function get() { return _Keys[39 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_RIGHT_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyRightDown: { get: function get() { return _Keys[39 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_DOWN_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyDownUp: { get: function get() { return _Keys[40 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_DOWN_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyDownPress: { get: function get() { return _Keys[40 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_DOWN_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyDownDown: { get: function get() { return _Keys[40 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_A_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyAUp: { get: function get() { return _Keys[65 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_A_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyAPress: { get: function get() { return _Keys[65 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_A_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyADown: { get: function get() { return _Keys[65 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_B_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyBUp: { get: function get() { return _Keys[66 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_B_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyBPress: { get: function get() { return _Keys[66 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_B_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyBDown: { get: function get() { return _Keys[66 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_C_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyCUp: { get: function get() { return _Keys[67 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_C_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyCPress: { get: function get() { return _Keys[67 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_C_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyCDown: { get: function get() { return _Keys[67 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_D_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyDUp: { get: function get() { return _Keys[68 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_D_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyDPress: { get: function get() { return _Keys[68 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_D_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyDDown: { get: function get() { return _Keys[68 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_E_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyEUp: { get: function get() { return _Keys[69 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_E_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyEPress: { get: function get() { return _Keys[69 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_E_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyEDown: { get: function get() { return _Keys[69 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_F_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyFUp: { get: function get() { return _Keys[70 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyFPress: { get: function get() { return _Keys[70 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_F_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyFDown: { get: function get() { return _Keys[70 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_G_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyGUp: { get: function get() { return _Keys[71 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_G_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyGPress: { get: function get() { return _Keys[71 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_G_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyGDown: { get: function get() { return _Keys[71 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_H_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyHUp: { get: function get() { return _Keys[72 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_H_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyHPress: { get: function get() { return _Keys[72 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_H_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyHDown: { get: function get() { return _Keys[72 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_I_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyIUp: { get: function get() { return _Keys[73 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_I_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyIPress: { get: function get() { return _Keys[73 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_I_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyIDown: { get: function get() { return _Keys[73 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_J_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyJUp: { get: function get() { return _Keys[74 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_J_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyJPress: { get: function get() { return _Keys[74 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_J_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyJDown: { get: function get() { return _Keys[74 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_K_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyKUp: { get: function get() { return _Keys[75 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_K_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyKPress: { get: function get() { return _Keys[75 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_K_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyKDown: { get: function get() { return _Keys[75 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_L_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyLUp: { get: function get() { return _Keys[76 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_L_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyLPress: { get: function get() { return _Keys[76 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_L_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyLDown: { get: function get() { return _Keys[76 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_M_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyMUp: { get: function get() { return _Keys[77 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_M_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyMPress: { get: function get() { return _Keys[77 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_M_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyMDown: { get: function get() { return _Keys[77 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_N_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyNUp: { get: function get() { return _Keys[78 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_N_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyNPress: { get: function get() { return _Keys[78 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_N_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyNDown: { get: function get() { return _Keys[78 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_O_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyOUp: { get: function get() { return _Keys[79 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_O_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyOPress: { get: function get() { return _Keys[79 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_O_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyODown: { get: function get() { return _Keys[79 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_P_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyPUp: { get: function get() { return _Keys[80 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_P_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyPPress: { get: function get() { return _Keys[80 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_P_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyPDown: { get: function get() { return _Keys[80 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_Q_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyQUp: { get: function get() { return _Keys[81 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_Q_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyQPress: { get: function get() { return _Keys[81 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_Q_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyQDown: { get: function get() { return _Keys[81 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_R_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyRUp: { get: function get() { return _Keys[82 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_R_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyRPress: { get: function get() { return _Keys[82 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_R_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyRDown: { get: function get() { return _Keys[82 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_S_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeySUp: { get: function get() { return _Keys[83 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_S_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeySPress: { get: function get() { return _Keys[83 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_S_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeySDown: { get: function get() { return _Keys[83 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_T_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyTUp: { get: function get() { return _Keys[84 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_T_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyTPress: { get: function get() { return _Keys[84 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_T_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyTDown: { get: function get() { return _Keys[84 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_U_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyUUp: { get: function get() { return _Keys[85 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_U_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyUPress: { get: function get() { return _Keys[85 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_U_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyUDown: { get: function get() { return _Keys[85 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_V_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyVUp: { get: function get() { return _Keys[86 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_V_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyVPress: { get: function get() { return _Keys[86 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_V_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyVDown: { get: function get() { return _Keys[86 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_W_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyWUp: { get: function get() { return _Keys[87 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_W_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyWPress: { get: function get() { return _Keys[87 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_W_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyWDown: { get: function get() { return _Keys[87 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_X_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyXUp: { get: function get() { return _Keys[88 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_X_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyXPress: { get: function get() { return _Keys[88 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_X_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyXDown: { get: function get() { return _Keys[88 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_Y_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyYUp: { get: function get() { return _Keys[89 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_Y_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyYPress: { get: function get() { return _Keys[89 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_Y_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyYDown: { get: function get() { return _Keys[89 + _DOWN_K]; }, configurable: false, enumerable: true },
    
            
                /**
                 * @property    {KEY_Z_UP}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyZUp: { get: function get() { return _Keys[90 + _UP_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_Z_PRESS}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyZPress: { get: function get() { return _Keys[90 + _PRESS_K]; }, configurable: false, enumerable: true },
            
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                KeyZDown: { get: function get() { return _Keys[90 + _DOWN_K]; }, configurable: false, enumerable: true },
            
    
    
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                MouseLeftUp: { get: function get() { return _Mouse[0 + _UP_M]; }, configurable: false, enumerable: true },
    
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                MouseLeftClick: { get: function get() { return _Mouse[0 + _CLICK_M]; }, configurable: false, enumerable: true },
    
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                MouseLeftDown: { get: function get() { return _Mouse[0 + _DOWN_M]; }, configurable: false, enumerable: true },
    
    
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                MouseMiddleUp: { get: function get() { return _Mouse[1 + _UP_M]; }, configurable: false, enumerable: true },
    
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                MouseMiddleClick: { get: function get() { return _Mouse[1 + _CLICK_M]; }, configurable: false, enumerable: true },
    
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                MouseMiddleDown: { get: function get() { return _Mouse[1 + _DOWN_M]; }, configurable: false, enumerable: true },
    
    
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                MouseRightUp: { get: function get() { return _Mouse[2 + _UP_M]; }, configurable: false, enumerable: true },
    
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                MouseRightClick: { get: function get() { return _Mouse[2 + _CLICK_M]; }, configurable: false, enumerable: true },
    
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                MouseRightDown: { get: function get() { return _Mouse[2 + _DOWN_M]; }, configurable: false, enumerable: true },
    
    
    
    
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                MouseX: { get: function get() { return _Axis[_X + _CURR_A]; }, configurable: false, enumerable: true },
    
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                MouseY: { get: function get() { return _Axis[_Y + _CURR_A]; }, configurable: false, enumerable: true },
    
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                MouseDeltaX: { get: function get() { return _Axis[_X + _DELTA_A]; }, configurable: false, enumerable: true },
    
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                MouseDeltaY: { get: function get() { return _Axis[_Y + _DELTA_A]; }, configurable: false, enumerable: true },
    
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                MouseWheelUp: { get: function get() { return _Mouse[_WHEEL_U]; }, configurable: false, enumerable: true },
    
                /**
                 * @property    {KEY_Z_DOWN}
                 * @type        {Boolean}
                 * @description Some description
                 */
                MouseWheelDown: { get: function get() { return _Mouse[_WHEEL_D]; }, configurable: false, enumerable: true },
    
    
                Init:
                {
                    value: function Init(canvas)
                    {
                        document.body.onkeyup = function onkeyup(e)
                        {
                            var key = _handle_event(e);
    
                            _Keys[key + _UP_K]      = true;
                            _Keys[key + _PRESS_K]   = false;
                            _Keys[key + _DOWN_K]    = false;
                        };
                        document.body.onkeydown = function onkeydown(e)
                        {
                            var key = _handle_event(e);
    
                            _Keys[key + _UP_K]      = false;
                            _Keys[key + _PRESS_K]   = true;
                            _Keys[key + _DOWN_K]    = true;
                        };
    
                        canvas.oncontextmenu = function oncontextmenu(e) { _handle_event(e); return false; };
                        canvas.onmouseenter = function onmouseenter(e)
                        {
                            _Axis[_X + _PREV_A] = e.clientX;
                            _Axis[_Y + _PREV_A] = e.clientY;
                            
                            _Axis[_X + _CURR_A] = e.clientX;
                            _Axis[_Y + _CURR_A] = e.clientY;
    
                            _Axis[_X + _DELTA_A] = 0;
                            _Axis[_Y + _DELTA_A] = 0;
                        };
                        canvas.onmousemove = function onmousemove(e) 
                        {
                            if (!_Axis[_X + _CURR_A] || !_Axis[_Y + _CURR_A])
                            {
                                _Axis[_X + _CURR_A] = e.clientX;
                                _Axis[_Y + _CURR_A] = e.clientY;
                            }
    
                            _Axis[_X + _PREV_A] = _Axis[_X + _CURR_A];
                            _Axis[_Y + _PREV_A] = _Axis[_Y + _CURR_A];
                            _Axis[_X + _CURR_A] = e.clientX;
                            _Axis[_Y + _CURR_A] = e.clientY;
    
                            _Axis[_X + _DELTA_A] = _Axis[_X + _CURR_A] - _Axis[_X + _PREV_A];
                            _Axis[_Y + _DELTA_A] = _Axis[_Y + _CURR_A] - _Axis[_Y + _PREV_A];
                        };
                        canvas.onmouseleave = function onmouseleave(e)
                        {
                            _Axis[_X + _PREV_A] = undefined;
                            _Axis[_Y + _PREV_A] = undefined;
                            
                            _Axis[_X + _CURR_A] = undefined;
                            _Axis[_Y + _CURR_A] = undefined;
    
                            _Axis[_X + _DELTA_A] = 0;
                            _Axis[_Y + _DELTA_A] = 0;
                        };
                        canvas.onmouseup = function onmouseup(e)   
                        {
                            var key = _handle_event(e);
    
                            _Mouse[key + _UP_M] = true;
                            _Mouse[key + _CLICK_M] = false;
                            _Mouse[key + _DOWN_M] = false;
                        };
                        canvas.onmousedown = function onmousedown(e) 
                        {
                            var key = _handle_event(e);
    
                            _Mouse[key + _UP_M] = false;
                            _Mouse[key + _CLICK_M] = true;
                            _Mouse[key + _DOWN_M] = true;
                        };
                        canvas.onmousewheel = function onmousewheel(e)
                        {
                            _Mouse[e.deltaY < 0 ? _WHEEL_U : _WHEEL_D] = true;
                        };
                    }
                },
    
                /**
                 * @function    InputUpdate
                 * @return      {udefined}
                 */
                InputUpdate:
                {
                    value: function InputUpdate()
                    {
                        for (var i = _PRESS_K; i < _DOWN_K; ++i)
                            if (_Keys[i])
                                _Keys[i] = false;
    
                        for (var i = _CLICK_M; i < _DOWN_M; ++i)
                            if (_Mouse[i])
                                _Mouse[i] = false;
    
                        _Axis[_X + _DELTA_A] = 0;
                        _Axis[_Y + _DELTA_A] = 0;
                        _Mouse[_WHEEL_U] = false;
                        _Mouse[_WHEEL_D] = false;
                    }
                }
            });
    
            Object.seal(this);
        }
    
        Input.prototype = Object.create(null);
        Object.seal(Input.prototype);
    
        return new Input();
    })();
    Object.seal(Input);
    
    /**
     * @name        Item
     * @module      FWGE.Game
     * @description The {Item} object is the base item for all usable item in the system.
    */
    
    let Item = (function()
    {
        /**
         * @param   {string} Name
         */
        function Item(name = 'Item')
        {
            Object.defineProperties(this,
            {
                /**
                 * @property    {ID}
                 * @type        {number}
                 */
                ID: { value: Item.hashcode(Item.ID_COUNTER++), configurable: false, enumerable: true, writable: false },
    
                /**
                 * @property    {Name}
                 * @type        {String}
                 */
                Name: { value: name, configurable: false, enumerable: true, writable: true }
            });
        }
        Object.defineProperties(Item,
        {
            /**
             * @property    {ID_COUNTER}
             * @type        {number}
             */
            ID_COUNTER: { value: 0, configurable: false, enumerable: false, writable: true },
    
            /**
             * @function    hashcode
             * @param       {number} number
             * @return      {number}
             */
            hashcode:
            {
                value: function hashcode(number)
                {
                    var i = 0;
                    var hash = 0;
                    var chr = 0;
                    var string = number + '';
    
                    for (i = 0; i < string.length; i++)
                    {
                        chr   = string.charCodeAt(i);
                        hash  = ((hash << 5) - hash) + chr;
                        hash |= 0;
                    }
    
                    return hash;
                },
                configurable: false, enumerable: false, writable: false
            }
        });
    
        Item.prototype = Object.create(null);
        Object.seal(Item.prototype);
    
        return Item;
    })();
    Object.seal(Item);
    
    /**
     * @name        AmbienLight
     * @module      FWGE.Game
     * @description Represents a light object that illumnintates the scene evenly with a specific colour
     */
    
    window.AmbientLight = (function()
    {
        /** 
         * @param {Object} request 
         * @param {string} request.name 
         * @param {GameObject} request.gameobject 
         * @param {Array} request.colour
         * @param {number} request.intensity
         */
        function AmbientLight({name = 'Ambient Light', colour = [1, 1, 1, 1], intensity = 1.0} = {})
        {
            LightItem.call(this, name, colour, intensity);
            
            Lights.push(this);
            Object.seal(this);
        }
    
        AmbientLight.prototype = Object.create(null);
        Object.seal(AmbientLight.prototype);
    
        return AmbientLight;
    })();
    Object.seal(AmbientLight);
    
    /**
     * @name        DirectionalLight
     * @module      FWGE.Game.Light
     * @description This light illuminates the scene in a given direction, similar that to the sun
    */
    
    window.DirectionalLight = (function()
    {
        /**
         * @param {Object}      request
         * @param {string}      request.name
         * @param {GameObject}  request.gameobject
         * @param {Array}       request.colour
         * @param {number}      request.intensity
         * @param {Array}       request.direction
         */
        function DirectionalLight({name = 'Directional Light', colour = [1, 1, 1, 1], intensity = 1.0, direction = Vector3.One} = {})
        {
            LightItem.call(this, name, colour, intensity)
    
            Object.defineProperties(this,
            {
                /**
                 * @property    {Direction}
                 * @type        {Vector3}
                 */
                Direction: { value: new Vector3(direction[0], direction[1], direction[2]), configurable: false, enumerable: true, writable: false }
            });
    
            Lights.push(this);
            Object.seal(this);
        }
    
        DirectionalLight.prototype = Object.create(null);
        Object.seal(DirectionalLight.prototype);
    
        return DirectionalLight;
    })();
    Object.seal(DirectionalLight);
    
        /**
         * @name        Light
         * @module      FWGE.Game
         * @description Module used to create lightobject in the scene.
         *              There can only be 12 lights at a given time:
         *              1: Ambient Light
         *              3: Directional Lights
         *              8: Point Lights
         */
    
    let Lights = new Array();
    
    (function()
    {
        function Light()
        {
            var AmbientCount = 0;
            var DirectionalCount = 0;
            var PointCount = 0;
            
            const MAX_AMBIENT = 1;
            const MAX_DIRECTIONAL = 3;
            const MAX_POINT = 8;
            const MAX_LIGHTS = 12;
    
            Object.defineProperties(this,
            {    
                /**
                 * @function    Ambient
                 * @param       {Object} request 
                 * @param       {string} request.name 
                 * @param       {GameObject | undefined} request.gameobject 
                 * @param       {Array | undefined} request.colour
                 * @param       {number | undefined} request.intensity
                 * @return      {AmbientLight | undefined}
                 */        
                Ambient:
                {
                    value: function Ambient(request)
                    {
                        var light = null;
    
                        if (this.AmbientCount < this.MAX_AMBIENT)
                        {
                            light = new AmbientLight(request);
                            light.GameObject.Light = light;
                            
                            this.AmbientCount++;
                            Light.Lights[0] = light;
                        }
    
                        return light;
                    }
                },
                
                /**
                 * @function    Ambient
                 * @param       {Object} request 
                 * @param       {string} request.name
                 * @param       {GameObject | null | undefined} request.gameobject
                 * @param       {Array} request.colour
                 * @param       {number} request.intensity
                 * @param       {Array} request.direction
                 * @return      {AmbientLight | undefined}
                 */ 
                Directional:
                {
                    value: function Directional(request)
                    {
                        var light = null;
    
                        if (this.DirectionalCount < this.MAX_DIRECTIONAL)
                        {
                            for (var i = this.MAX_AMBIENT; i < this.MAX_DIRECTIONAL; ++i)
                            {
                                if (!Light.Lights[i])
                                {
                                    light = new DirectionalLight(request);
                                    light.GameObject.Light = light;
    
                                    this.DirectionalCount++;
                                    Light.Lights[i] = light;
    
                                    break;
                                }
                            }
                        }
    
                        return light;
                    }
                },
                
                /**
                 * @function    Ambient
                 * @param       {Object} request 
                 * @param       {string} request.name 
                 * @param       {GameObject | undefined} request.gameobject 
                 * @param       {Array | undefined} request.colour
                 * @param       {number | undefined} request.intensity
                 * @return      {AmbientLight | undefined}
                 */ 
                Point:
                {
                    value: function Point(request)
                    {
                        var light = null;
    
                        if (this.PointCount < this.MAX_POINT)
                        {
                            for (var i = this.MAX_DIRECTIONAL; i < this.MAX_LIGHTS; ++i)
                            {
                                if (!Light.Lights[i])
                                {
                                    light = new PointLight(request);
                                    light.GameObject.Light = light;
    
                                    this.PointCount++;
                                    Light.Lights[i] = light;
    
                                    break;
                                }
                            }
                        }
    
                        return light
                    }
                },
                
                /**
                 * @function    Ambient
                 * @param       {AmbientLight | DirectionalLight | PointLight} light 
                 * @return      {AmbientLight | DirectionalLight | PointLight}
                 * @description Removes a light from the given scene.
                 */ 
                Remove:
                {
                    valeu: function Remove(light)
                    {
                        for (var i in  Light.Lights)
                            if (!!Light.Lights[i] && light.ID === Light.Lights[i].ID)
                                Light.Lights[i] = null;
    
                        return light;
                    }
                }
            });
        }
        Light.prototype = Object.create(null);
        Object.defineProperties(Light,
        {    
            Lights: { value: new Array(12), configurable: false, enumerable: true, writable: false }
        });
    })();
    /**
     * @name        LightItem
     * @module      FWGE.Game.Light
     * @description This is the base definition of a light oject within the scene
     */
    
    let LightItem = (function()
    {
        /**
         * @param {string} name 
         * @param {GameObject} gameobject 
         * @param {Array} colour 
         * @param {number} intensity 
         */
        function LightItem(name, colour, intensity)
        {
            Item.call(this, name);
    
            Object.defineProperties(this,
            {
                /**
                 * @property    {Colour}
                 * @type        {Colour}
                 */
                Colour: { value: new Colour(colour[0], colour[1], colour[2], colour[3]), configurable: false, enumerable: true, writable: false },
    
                /**
                 * @property    {Intensity}
                 * @type        {number}
                 */
                Intensity: { value: intensity, configurable: false, enumerable: true, writable: false }
            });
        }
    
        LightItem.prototype = Object.create(null);
    
        return LightItem;
    })();
    Object.seal(LightItem);
    
    /**
     * @name        PointLight
     * @module      FWGE.Game
     * @description Represents a light object that illumntes froma fixed point in space,
     *              within a given radius.
     */
    
    window.PointLight = (function()
    {
        /** 
         * @param {Object}      request 
         * @param {string}      request.name 
         * @param {GameOject}   request.gameobject 
         * @param {Array}       request.colour 
         * @param {number}      request.intensity 
         * @param {number}      request.radius 
         * @param {number}      request.angle 
         * @param {number}      request.ahininess 
         */
        function PointLight({name = 'Point Light', position = Vector3.Zero, colour = [1,1,1,1], intensity = 1, radius = 5, angle = 180, shininess = 255} = {})
        {
            LightItem.call(this, name, colour, intensity);
    
            Object.defineProperties(this,
            {
                /**
                 * @property    {Position}
                 * @type        {Vector3}
                 */
                Position: { value: position, configurable: false, enumerable: true, writable: true },
    
                /**
                 * @property    {Radius}
                 * @type        {number}
                 */
                Radius: { value: radius, configurable: false, enumerable: true, writable: true },
    
                /**
                 * @property    {Angle}
                 * @type        {number}
                 */
                Angle: { value: angle, configurable: false, enumerable: true, writable: true },
    
                /**
                 * @property    {Shininess}
                 * @type        {number}
                 */
                Shininess: { value: shininess, configurable: false, enumerable: true, writable: true },
            });
    
            Lights.push(this);
            Object.seal(this);
        }
    
        PointLight.prototype = Object.create(null);
        Object.seal(PointLight.prototype);
    
        return PointLight;
    })();
    Object.seal(PointLight);
    /**
     * @name Maths
     * @description This module contains the methods required for matrix and vector
     *              operations.
     * @module      FWGE.Game
     */
    
    window.Maths = (function()
    {
        function Maths()
        {
            Object.defineProperties(this,
            {
                Radian: { value: function Radian(degree)            { return Math.PI / 180 * degree; } },
                Cot:    { value: function Cot(angle)                { return 1 / Math.tan(angle)} },
                Clamp:  { value: function Clamp(value, min, max)    { return Math.max(Math.min(value, max), min); } }
            });
        }
    
        return new Maths();
    })();
    /**
     * @name        Matrix2
     * @module      FWGE.Game.Maths 
     * @description This library contains the methods for 2x2 matrix operations.
     *              2x2 matrices are represented as a Matrix2 of length 4.
     */
    
    window.Matrix2 = (function()
    {
        /**
         * @param   {number} m11
         * @param   {number} m12
         * @param   {number} m21
         * @param   {number} m22
         */
        function Matrix2(m11 = 0, m12 = 0, m21 = 0, m22 = 0)
        {
            BufferedArray.call(this, 4, Matrix2);
            this.Set(m11, m12, m21, m22);
    
            Object.seal(this);
        }
        Object.defineProperties(Matrix2,
        {
            /**
             * @property    {Identity}
             * @type        {Matrix2}
             */
            Identity:
            {
                get: function get() { return new Matrix2(1, 0, 0, 1); },
                configurable: false, enumerable: true
            },
    
            /**
             * @function    Set
             * @param       {number} m11
             * @param       {number} m12
             * @param       {number} m21
             * @param       {number} m22
             * @return      {Matrix2}
             */
            Set:
            {
                value: function Set(matrix, m11, m12, m21, m22)
                {
                    matrix.M11 = m11;
                    matrix.M12 = m12;
                    matrix.M21 = m21;
                    matrix.M22 = m22;
    
                    return matrix;
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Transpose
             * @param       {Matrix2} array
             * @return      {Matrix2}
             */
            Transpose:
            {
                value: function Transpose(matrix)
                {
                    return new Matrix2(matrix.M11, matrix.M21, matrix.M12, matrix.M22);
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Determinant
             * @param       {Matrix2}  array
             * @return      {number}
             */
            Determinant:
            {
                value: function Determinant(m11, m12, m21, m22)
                {
                    return m11 * m22 - m21 * m12;
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Inverse
             * @param       {Matrix2}  array
             * @return      {Matrix2}
             */
            Inverse:
            {
                value: function Inverse(matrix)
                {
                    let det = matrix.Determinant;
    
                    if (det === 0)
                        det = 1;
    
                    return new Matrix2(matrix.M22 / det, -matrix.M12 / det, -matrix.M21 / det,  matrix.M11 / det);
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Sum
             * @param       {number} m11
             * @param       {number} m12
             * @param       {number} m21
             * @param       {number} m22
             * @return      {Matrix2} 
             */
            Sum:
            {
                value: function Sum(matrix, m11, m12, m21, m22)
                {
                    return new Matrix2(matrix.M11 + m11, matrix.M12 + m12, matrix.M21 + m21, matrix.M22 + m22);
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Mult
             * @param       {number} m11
             * @param       {number} m12
             * @param       {number} m21
             * @param       {number} m22
             * @return      {Matrix2}
             */
            Mult:
            {
                value: function Mult(matrix, m11, m12, m21, m22)
                {
                    return new Matrix2
                    (
                        matrix.M11 * m11 + matrix.M12 * m21,
                        matrix.M11 * m12 + matrix.M12 * m22,                
                        matrix.M21 * m11 + matrix.M22 * m21,
                        matrix.M21 * m12 + matrix.M22 * m22
                    );
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Scale
             * @param       {number}   scalar
             * @return      {Matrix2}
             */
            Scale:
            {
                value: function Scale(matrix, scaler)
                {
                    return Matrix2.Mult(matrix, scaler, scaler, scaler, scaler);
                },
                configurable: false, enumerable: true, writable: false
            }    
        });
    
        Matrix2.prototype = Object.create(null);
        Object.defineProperties(Matrix2.prototype,
        {
            /**
             * @property    {M11}
             * @type        {number}
             */
            M11:
            {
                get: function get() { return this.Buffer[0]; },
                set: function set(m11) { this.Buffer[0] = m11; },
                configurable: false, enumerable: true
            },
    
            /**
             * @property    {M12}
             * @type        {number}
             */
            M12:
            {
                get: function get() { return this.Buffer[1]; },
                set: function set(m12) { this.Buffer[1] = m12; },
                configurable: false, enumerable: true
            },
    
            /**
             * @property    {M21}
             * @type        {number}
             */
            M21:
            {
                get: function get() { return this.Buffer[2]; },
                set: function set(m21) { this.Buffer[2] = m21; },
                configurable: false, enumerable: true
            },
    
            /**
             * @property    {M22}
             * @type        {number}
             */
            M22:
            {
                get: function get() { return this.Buffer[3]; },
                set: function set(m22) { this.Buffer[3] = m22; },
                configurable: false, enumerable: true
            },
    
    
            /**
             * @function    Set
             * @param       {number} m11
             * @param       {number} m12
             * @param       {number} m21
             * @param       {number} m22
             * @return      {Matrix2}
             */
            Set:
            {
                value: function Set(m11, m12, m21, m22)
                {
                    return Matrix2.Set(this, m11 instanceof Matrix2 || m11 instanceof Float32Array ? m11 : [m11, m12, m21, m22]);
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Transpose
             * @param       {Matrix2} array
             * @return      {Matrix2}
             */
            Transpose:
            {
                value: function Transpose()
                {
                    return Matrix2.Set(this, this.M11, this.M21, this.M12, this.M22);
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Identity
             * @param       {Matrix2} array
             * @return      {Matrix2}
             */
            Identity:
            {
                value: function Identity()
                {
                    return Matrix2.Set(this, 1, 0, 0, 1);
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Determinant
             * @param       {Matrix2}  array
             * @return      {number}
             */
            Determinant:
            {
                get: function Determinant()
                {
                    return Matrix2.Determinant(this.M11, this.M12, this.M21, this.M22);
                },
                configurable: false, enumerable: true
            },
            
            /**
             * @function    Inverse
             * @param       {Matrix2}  array
             * @return      {Matrix2}
             */
            Inverse:
            {
                value: function Inverse()
                {
                    let det = matrix.Determinant;
    
                    if (det === 0)
                        det = 1;
    
                    return Matrix2.Set
                    (
                         this,
                         this.M22 / det,
                        -this.M12 / det,
                        -this.M21 / det,
                         this.M11 / det
                    );
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Sum
             * @param       {number} m11
             * @param       {number} m12
             * @param       {number} m21
             * @param       {number} m22
             * @return      {Matrix2} 
             */
            Sum:
            {
                value: function Sum(m11, m12, m21, m22)
                {
                    return Matrix2.Set
                    (
                        this,
                        this.M11 + m11,
                        this.M12 + m12,
                        this.M21 + m21,
                        this.M22 + m22
                    );
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Mult
             * @param       {number} m11
             * @param       {number} m12
             * @param       {number} m21
             * @param       {number} m22
             * @return      {Matrix2}
             */
            Mult:
            {
                value: function Mult(m11, m12, m21, m22)
                {
                    return Matrix2.Set
                    (
                        this,
                        this.M11 * m11 + this.M12 * m21,
                        this.M11 * m12 + this.M12 * m22,                
                        this.M21 * m11 + this.M22 * m21,
                        this.M21 * m12 + this.M22 * m22
                    );
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Scale
             * @param       {number}   scalar
             * @return      {Matrix2}
             */
            Scale:
            {
                value: function Scale(scaler)
                {
                    return this.Mult(scaler, scaler, scaler, scaler);
                },
                configurable: false, enumerable: true, writable: false
            }
        });
        Object.seal(Matrix2.prototype);
    
        return Matrix2;
    })();
    Object.seal(Matrix2);
    
    /**
     * @name        Matrix3
     * @module      FWGE.Game.Maths
     * @description This library contains the methods for 3x3 matrix operations.
     *              3x3 matrices are represented as a Float32Array of length 9.
     */
    
    window.Matrix3 = (function()
    {
        /**
         * @param       {number}    m11
         * @param       {number}    m12
         * @param       {number}    m13
         * @param       {number}    m21
         * @param       {number}    m22
         * @param       {number}    m23
         * @param       {number}    m31
         * @param       {number}    m32
         * @param       {number}    m33
         */
        function Matrix3(m11 = 0, m12 = 0, m13 = 0, m21 = 0, m22 = 0, m23 = 0, m31 = 0, m32 = 0, m33 = 0)
        {
            BufferedArray.call(this, 9, Float32Array);
            this.Set(m11, m12, m13, m21, m22, m23, m31, m32, m33);
    
            Object.seal(this);
        }
        Object.defineProperties(Matrix3,
        {
            Identity: { get Identity() { return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1); } },
                
            /**
             * @function    Set
             * @param       {number}    m11
             * @param       {number}    m12
             * @param       {number}    m13
             * @param       {number}    m21
             * @param       {number}    m22
             * @param       {number}    m23
             * @param       {number}    m31
             * @param       {number}    m32
             * @param       {number}    m33
             * @param       {Matrix3}
             */
            Set:
            {
                value: function Set(matrix, m11, m12, m13, m21, m22, m23, m31, m32, m33)
                {
                    if (m11 instanceof Matrix3)
                        m11 = m11.Buffer;
    
                    if (m11 instanceof Array)
                    {
                        m33 = m11[8]; m32 = m11[7]; m31 = m11[6];
                        m23 = m11[5]; m22 = m11[4]; m21 = m11[3];
                        m13 = m11[2]; m12 = m11[1]; m11 = m11[0];
                    }
    
                    matrix.M11 = m11; matrix.M12 = m12; matrix.M13 = m13;
                    matrix.M21 = m21; matrix.M22 = m22; matrix.M23 = m23;
                    matrix.M31 = m31; matrix.M32 = m32; matrix.M33 = m33;
    
                    return matrix;
                }
            },
            
            /**
             * @function    Transpose
             * @param       {Matrix3}   matrix
             * @param       {Matrix3}
             */
            Transpose:
            {
                value: function Transpose(matrix)
                {
                    return new Matrix3
                    (
                        matrix.M11, matrix.M21, matrix.M31,
                        matrix.M12, matrix.M22, matrix.M32,
                        matrix.M13, matrix.M23, matrix.M33
                    );
                }
            },
    
            /**
             * @function    Determinant
             * @param       {Matrix3}   matrix
             * @return      {number}
             */
            Determinant:
            {
                value: function Determinant(matrix)
                {
                    return  matrix.M11 * (matrix.M22 * matrix.M33 - matrix.M23 * matrix.M32) -
                            matrix.M12 * (matrix.M21 * matrix.M33 - matrix.M23 * matrix.M31) + 
                            matrix.M13 * (matrix.M21 * matrix.M32 - matrix.M22 * matrix.M31);
                }
            },
            
            /**
             * @function    Inverse
             * @param       {Matrix3}   matrix
             * @return      {Matrixs}
             */
            Inverse:
            {
                value: function Inverse(matrix)
                {
                    let det = this.Determinant;
    
                    if (det !== 0)
                        det = 1;
    
                    new Matrix3
                    (
                        (this.M22 * this.M33 - this.M32 * this.M23) / det,
                        -(this.M12 * this.M33 - this.M32 * this.M13) / det,
                        (this.M12 * this.M23 - this.M22 * this.M13) / det,
    
                        -(this.M21 * this.M33 - this.M31 * this.M23) / det,
                        (this.M11 * this.M33 - this.M31 * this.M13) / det,
                        -(this.M11 * this.M23 - this.M21 * this.M13) / det,
    
                        (this.M21 * this.M32 - this.M31 * this.M22) / det,
                        -(this.M11 * this.M32 - this.M31 * this.M12) / det,
                        (this.M11 * this.M22 - this.M21 * this.M12) / det
                    );
                }
            },
            
            /**
             * @function    Sum
             * @param       {Matrix3}   matrix
             * @param       {number}    m11
             * @param       {number}    m12
             * @param       {number}    m13
             * @param       {number}    m21
             * @param       {number}    m22
             * @param       {number}    m23
             * @param       {number}    m31
             * @param       {number}    m32
             * @param       {number}    m33
             * @return      {Matrix3}
             */
            Sum:
            {
                value: function Sum(matrix, m11, m12, m13, m21, m22, m23, m31, m32, m33)
                {
                    return new Matrix3
                    (
                        matrix.M11 + m11, matrix.M12 + m12, matrix.M13 + m13,
                        matrix.M21 + m21, matrix.M22 + m22, matrix.M23 + m23,
                        matrix.M31 + m31, matrix.M32 + m32, matrix.M33 + m33
                    );
                }
            },
            
            /**
             * @function    Mult
             * @param       {Matrix3}   matrix
             * @param       {number}    m11
             * @param       {number}    m12
             * @param       {number}    m13
             * @param       {number}    m21
             * @param       {number}    m22
             * @param       {number}    m23
             * @param       {number}    m31
             * @param       {number}    m32
             * @param       {number}    m33
             * @return      {Matrix3}
             */
            Mult:
            {
                value: function Mult(matrix, m11, m12, m13, m21, m22, m23, m31, m32, m33)
                {    
                    return new Matrix3
                    (
                        matrix.M11 * m11 + matrix.M12 * m21 + matrix.M13 * m31,
                        matrix.M11 * m12 + matrix.M12 * m22 + matrix.M13 * m32,
                        matrix.M11 * m13 + matrix.M12 * m23 + matrix.M13 * m33,
                        
                        matrix.M21 * m11 + matrix.M22 * m21 + matrix.M23 * m31,
                        matrix.M21 * m12 + matrix.M22 * m22 + matrix.M23 * m32,
                        matrix.M21 * m13 + matrix.M22 * m23 + matrix.M23 * m33,
                        
                        matrix.M31 * m11 + matrix.M32 * m21 + matrix.M33 * m31,
                        matrix.M31 * m12 + matrix.M32 * m22 + matrix.M33 * m32,
                        matrix.M31 * m13 + matrix.M32 * m23 + matrix.M33 * m33
                    ); 
                }
            },
    
            Scale:
            {
                value: function Scale(scalar)
                {
                    return Matrix3.Mult(scalar, scalar, scalar, scalar, scalar, scalar, scalar, scalar, scalar);
                }
            }
        });
    
        Object.defineProperties(Matrix3.prototype,
        {
            M11:
            {
                get: function M11()  { return this.Buffer[0]; },
                set: function M11(m11) { this.Buffer[0] = m11;  }
            },
            M12:
            {
                get: function M12()  { return this.Buffer[1]; },
                set: function M12(m12) { this.Buffer[1] = m12;  }
            },
            M13:
            {
                get: function M13()  { return this.Buffer[2]; },
                set: function M13(m13) { this.Buffer[2] = m13;  }
            },
            M21:
            {
                get: function M21()  { return this.Buffer[3]; },
                set: function M21(m21) { this.Buffer[3] = m21;  }
            },
            M22:
            {
                get: function M22()  { return this.Buffer[4]; },
                set: function M22(m22) { this.Buffer[4] = m22;  }
            },
            M23:
            {
                get: function M23()  { return this.Buffer[5]; },
                set: function M23(m23) { this.Buffer[5] = m23;  }
            },
            M31:
            {
                get: function M31()  { return this.Buffer[6]; },
                set: function M31(m31) { this.Buffer[6] = m31;  }
            },
            M32:
            {
                get: function M32()  { return this.Buffer[7]; },
                set: function M32(m32) { this.Buffer[7] = m32;  }
            },
            M33:
            {
                get: function M33()  { return this.Buffer[8]; },
                set: function M33(m33) { this.Buffer[8] = m33;  }
            },
            
            /**
             * @function    Set
             * @param       {number}    m11
             * @param       {number}    m12
             * @param       {number}    m13
             * @param       {number}    m21
             * @param       {number}    m22
             * @param       {number}    m23
             * @param       {number}    m31
             * @param       {number}    m32
             * @param       {number}    m33
             * @param       {Matrix3}
             */
            Set:
            {
                value: function Set(m11, m12, m13, m21, m22, m23, m31, m32, m33)
                {
                    return Matrix3.Set(this, m11 instanceof Array || m11 instanceof Matrix3 ? m11 : [m11, m12, m13, m21, m22, m23, m31, m32, m33]);
                }
            },
            
            /**
             * @function    Transpose
             * @param       {Matrix3}   matrix
             * @param       {Matrix3}
             */
            Transpose:
            {
                value: function Transpose()
                {
                    return this.Set
                    (
                        this.M11, this.M21, this.M31,
                        this.M12, this.M22, this.M32,
                        this.M13, this.M23, this.M33
                    );
                }
            },
    
            /**
             * @function    Determinant
             * @param       {Matrix3}   matrix
             * @return      {number}
             */
            Determinant:
            {
                get: function Determinant()
                {
                    return Matrix3.Determinant(this);
                }
            },
            
            /**
             * @function    Inverse
             * @param       {Matrix3}   matrix
             * @return      {Matrixs}
             */
            Inverse:
            {
                value: function Inverse()
                {
                    let det = this.Determinant;
    
                    if (det !== 0)
                        det = 1;
    
                    return this.Set
                    (
                        (this.M22 * this.M33 - this.M32 * this.M23) / det,
                        -(this.M12 * this.M33 - this.M32 * this.M13) / det,
                        (this.M12 * this.M23 - this.M22 * this.M13) / det,
    
                        -(this.M21 * this.M33 - this.M31 * this.M23) / det,
                        (this.M11 * this.M33 - this.M31 * this.M13) / det,
                        -(this.M11 * this.M23 - this.M21 * this.M13) / det,
    
                        (this.M21 * this.M32 - this.M31 * this.M22) / det,
                        -(this.M11 * this.M32 - this.M31 * this.M12) / det,
                        (this.M11 * this.M22 - this.M21 * this.M12) / det
                    );
                }
            },
    
            /**
             * @function    Identity
             * @return      {Matrix3}
             */
            Identity:
            {
                value: function Identity()
                {
                    return this.Set
                    (
                        1, 0, 0,
                        0, 1, 0,
                        0, 0, 1
                    );
                }
            },
            
            /**
             * @function    Sum
             * @param       {Matrix3}   matrix
             * @param       {number}    m11
             * @param       {number}    m12
             * @param       {number}    m13
             * @param       {number}    m21
             * @param       {number}    m22
             * @param       {number}    m23
             * @param       {number}    m31
             * @param       {number}    m32
             * @param       {number}    m33
             * @return      {Matrix3}
             */
            Sum:
            {
                value: function Sum(m11, m12, m13, m21, m22, m23, m31, m32, m33)
                {
                    return this.Set
                    (
                        this.M11 + m11, this.M12 + m12, this.M13 + m13,
                        this.M21 + m21, this.M22 + m22, this.M23 + m23,
                        this.M31 + m31, this.M32 + m32, this.M33 + m33
                    );
                }
            },
            
            /**
             * @function    Mult
             * @param       {Matrix3}   matrix
             * @param       {number}    m11
             * @param       {number}    m12
             * @param       {number}    m13
             * @param       {number}    m21
             * @param       {number}    m22
             * @param       {number}    m23
             * @param       {number}    m31
             * @param       {number}    m32
             * @param       {number}    m33
             * @return      {Matrix3}
             */
            Mult:
            {
                value: function Mult(m11, m12, m13, m21, m22, m23, m31, m32, m33)
                {    
                    return this.Set
                    (
                        this.M11 * m11 + this.M12 * m21 + this.M13 * m31,
                        this.M11 * m12 + this.M12 * m22 + this.M13 * m32,
                        this.M11 * m13 + this.M12 * m23 + this.M13 * m33,
                        
                        this.M21 * m11 + this.M22 * m21 + this.M23 * m31,
                        this.M21 * m12 + this.M22 * m22 + this.M23 * m32,
                        this.M21 * m13 + this.M22 * m23 + this.M23 * m33,
                        
                        this.M31 * m11 + this.M32 * m21 + this.M33 * m31,
                        this.M31 * m12 + this.M32 * m22 + this.M33 * m32,
                        this.M31 * m13 + this.M32 * m23 + this.M33 * m33
                    ); 
                }
            },
    
            Scale:
            {
                value: function Scale(scalar)
                {
                    return this.Mult(scalar, scalar, scalar, scalar, scalar, scalar, scalar, scalar, scalar);
                }
            }
        });
        Object.seal(Matrix3.prototype);
    
        return Matrix3;
    })();
    Object.seal(Matrix3);
    
    /**
     * @name        Matrix4
     * @module      FWGE.Game.Maths
     * @description This library contains the methods for 2x2 matrix operations.
     *              4x4 matrices are represented as a Float32Array of length 16.
     */
    
    window.Matrix4 = (function()
    {
        /**
         * @param   {number}    m11
         * @param   {number}    m12
         * @param   {number}    m13
         * @param   {number}    m14
         * @param   {number}    m21
         * @param   {number}    m22
         * @param   {number}    m23
         * @param   {number}    m24
         * @param   {number}    m31
         * @param   {number}    m32
         * @param   {number}    m33
         * @param   {number}    m34
         * @param   {number}    m41
         * @param   {number}    m42
         * @param   {number}    m43
         * @param   {number}    m44
         */
        function Matrix4(m11 = 0, m12 = 0, m13 = 0, m14 = 0, m21 = 0, m22 = 0, m23 = 0, m24 = 0, m31 = 0, m32 = 0, m33 = 0, m34 = 0, m41 = 0, m42 = 0, m43 = 0, m44 = 0)
        {
            BufferedArray.call(this, 16, Float32Array);
            this.Set(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
    
            Object.seal(this);
        }
    
        Object.defineProperties(Matrix4,
        {
            Identity: { get: function Identity() { return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); } },
            
            /**
             * @function    Set
             * @param       {Matrix4}   matrix
             * @param       {number}    m11
             * @param       {number}    m12
             * @param       {number}    m13
             * @param       {number}    m14
             * @param       {number}    m21
             * @param       {number}    m22
             * @param       {number}    m23
             * @param       {number}    m24
             * @param       {number}    m31
             * @param       {number}    m32
             * @param       {number}    m33
             * @param       {number}    m34
             * @param       {number}    m41
             * @param       {number}    m42
             * @param       {number}    m43
             * @param       {number}    m44
             * @return      {Matrix4}
             */
            Set:
            {
                value: function Set(matrix, m11 = 0, m12 = 0, m13 = 0, m14 = 0, m21 = 0, m22 = 0, m23 = 0, m24 = 0, m31 = 0, m32 = 0, m33 = 0, m34 = 0, m41 = 0, m42 = 0, m43 = 0, m44 = 0)
                {
                    if (m11 instanceof Matrix4)
                        m11 = m11.Buffer;
    
                    if (m11 instanceof Float32Array || m11 instanceof Array)
                    {
                        m44 = m11[15]; m43 = m11[14]; m42 = m11[13]; m41 = m11[12];
                        m34 = m11[11]; m33 = m11[10]; m32 = m11[9];  m31 = m11[8];
                        m24 = m11[7];  m23 = m11[6];  m22 = m11[5];  m21 = m11[4];
                        m14 = m11[3];  m13 = m11[2];  m12 = m11[1];  m11 = m11[0];
                    }
    
                    matrix.M11 = m11; matrix.M12 = m12; matrix.M13 = m13; matrix.M14 = m14;
                    matrix.M21 = m21; matrix.M22 = m22; matrix.M23 = m23; matrix.M24 = m24;
                    matrix.M31 = m31; matrix.M32 = m32; matrix.M33 = m33; matrix.M34 = m34;
                    matrix.M41 = m41; matrix.M42 = m42; matrix.M43 = m43; matrix.M44 = m44;
    
                    return matrix;
                }
            },    
            /**
             * @function    Transpose
             * @return      {Matrix4}
             */
            Transpose:
            {
                value: function Transpose(matrix)
                {
                    return new Matrix4
                    (
                        matrix.M11, matrix.M21, matrix.M31, matrix.M41,
                        matrix.M12, matrix.M22, matrix.M32, matrix.M42,
                        matrix.M13, matrix.M23, matrix.M33, matrix.M43,
                        matrix.M14, matrix.M24, matrix.M34, matrix.M44
                    );
                }
            },
            
            /**
             * @function    Determinant
             * @param       {Matrix4} matrix
             * @return      {Matrix4}
             */
            Determinant:
            {
                value: function Determinant(matrix)
                {
                    return  matrix.M11 * matrix.M22 * matrix.M33 * matrix.M44 +
                            matrix.M11 * matrix.M23 * matrix.M34 * matrix.M42 +
                            matrix.M11 * matrix.M24 * matrix.M32 * matrix.M43 +
                            matrix.M12 * matrix.M21 * matrix.M34 * matrix.M43 +
                            matrix.M12 * matrix.M23 * matrix.M31 * matrix.M44 +
                            matrix.M12 * matrix.M24 * matrix.M33 * matrix.M41 +
                            matrix.M13 * matrix.M21 * matrix.M32 * matrix.M44 +
                            matrix.M13 * matrix.M22 * matrix.M34 * matrix.M41 +
                            matrix.M13 * matrix.M24 * matrix.M31 * matrix.M42 +
                            matrix.M14 * matrix.M21 * matrix.M33 * matrix.M42 +
                            matrix.M14 * matrix.M22 * matrix.M31 * matrix.M43 +
                            matrix.M14 * matrix.M23 * matrix.M32 * matrix.M41 -
                            matrix.M11 * matrix.M22 * matrix.M34 * matrix.M43 -
                            matrix.M11 * matrix.M23 * matrix.M32 * matrix.M44 -
                            matrix.M11 * matrix.M24 * matrix.M33 * matrix.M42 -
                            matrix.M12 * matrix.M21 * matrix.M33 * matrix.M44 -
                            matrix.M12 * matrix.M23 * matrix.M34 * matrix.M41 -
                            matrix.M12 * matrix.M24 * matrix.M31 * matrix.M43 -
                            matrix.M13 * matrix.M21 * matrix.M34 * matrix.M42 -
                            matrix.M13 * matrix.M22 * matrix.M31 * matrix.M44 -
                            matrix.M13 * matrix.M24 * matrix.M32 * matrix.M41 -
                            matrix.M14 * matrix.M21 * matrix.M32 * matrix.M43 -
                            matrix.M14 * matrix.M22 * matrix.M33 * matrix.M41 -
                            matrix.M14 * matrix.M23 * matrix.M31 * matrix.M42;
                }
            },
            
            /**
             * @function    Inverse
             * @param       {Matrix4}   matrix
             * @return      {Matrix4}
             */
            Inverse:
            {
                value: function Inverse(matrix)
                {
                    var det = matrix.Determinant;
    
                    if (det !== 0)
                        det = 1;
    
                    return new Matrix4
                    (
                        (matrix.M22 * matrix.M33 * matrix.M44 +
                        matrix.M23 * matrix.M34 * matrix.M42 +
                        matrix.M24 * matrix.M32 * matrix.M43 -
                        matrix.M22 * matrix.M34 * matrix.M43 -
                        matrix.M23 * matrix.M32 * matrix.M44 -
                        matrix.M24 * matrix.M33 * matrix.M42) / det,
                        (matrix.M12 * matrix.M34 * matrix.M43 +
                        matrix.M13 * matrix.M32 * matrix.M44 +
                        matrix.M14 * matrix.M33 * matrix.M42 -
                        matrix.M12 * matrix.M33 * matrix.M44 -
                        matrix.M13 * matrix.M34 * matrix.M42 -
                        matrix.M14 * matrix.M32 * matrix.M43) / det,
                        (matrix.M12 * matrix.M23 * matrix.M44 +
                        matrix.M13 * matrix.M24 * matrix.M42 +
                        matrix.M14 * matrix.M22 * matrix.M43 -
                        matrix.M12 * matrix.M24 * matrix.M43 -
                        matrix.M13 * matrix.M22 * matrix.M44 -
                        matrix.M14 * matrix.M23 * matrix.M42) / det,
                        (matrix.M12 * matrix.M24 * matrix.M33 +
                        matrix.M13 * matrix.M22 * matrix.M34 +
                        matrix.M14 * matrix.M23 * matrix.M32 -
                        matrix.M12 * matrix.M23 * matrix.M34 -
                        matrix.M13 * matrix.M24 * matrix.M32 -
                        matrix.M14 * matrix.M22 * matrix.M33) / det,
                    
                        (matrix.M21 * matrix.M34 * matrix.M43 +
                        matrix.M23 * matrix.M31 * matrix.M44 +
                        matrix.M24 * matrix.M33 * matrix.M41 -
                        matrix.M21 * matrix.M33 * matrix.M44 -
                        matrix.M23 * matrix.M34 * matrix.M41 -
                        matrix.M24 * matrix.M31 * matrix.M43) / det,
                        (matrix.M11 * matrix.M33 * matrix.M44 +
                        matrix.M13 * matrix.M34 * matrix.M41 +
                        matrix.M14 * matrix.M31 * matrix.M43 -
                        matrix.M11 * matrix.M34 * matrix.M43 -
                        matrix.M13 * matrix.M31 * matrix.M44 -
                        matrix.M14 * matrix.M33 * matrix.M41) / det,
                        (matrix.M11 * matrix.M24 * matrix.M43 +
                        matrix.M13 * matrix.M21 * matrix.M44 +
                        matrix.M14 * matrix.M23 * matrix.M41 -
                        matrix.M11 * matrix.M23 * matrix.M44 -
                        matrix.M13 * matrix.M24 * matrix.M41 -
                        matrix.M14 * matrix.M21 * matrix.M43) / det,
                        (matrix.M11 * matrix.M23 * matrix.M34 +
                        matrix.M13 * matrix.M24 * matrix.M31 +
                        matrix.M14 * matrix.M21 * matrix.M33 -
                        matrix.M11 * matrix.M24 * matrix.M33 -
                        matrix.M13 * matrix.M21 * matrix.M34 -
                        matrix.M14 * matrix.M23 * matrix.M31) / det,
                    
                        (matrix.M21 *  matrix.M32 * matrix.M44 +
                        matrix.M22 * matrix.M34 * matrix.M41 +
                        matrix.M24 * matrix.M31 * matrix.M42 -
                        matrix.M21 * matrix.M34 * matrix.M42 -
                        matrix.M22 * matrix.M31 * matrix.M44 -
                        matrix.M24 * matrix.M32 * matrix.M41) / det,
                        (matrix.M11 * matrix.M34 * matrix.M42 +
                        matrix.M12 * matrix.M31 * matrix.M44 +
                        matrix.M14 * matrix.M32 * matrix.M41 -
                        matrix.M11 * matrix.M32 * matrix.M44 -
                        matrix.M12 * matrix.M34 * matrix.M41 -
                        matrix.M14 * matrix.M31 * matrix.M42) / det,
                        (matrix.M11 * matrix.M22 * matrix.M44 +
                        matrix.M12 * matrix.M24 * matrix.M41 +
                        matrix.M14 * matrix.M21 * matrix.M42 -
                        matrix.M11 * matrix.M24 * matrix.M42 -
                        matrix.M12 * matrix.M21 * matrix.M44 -
                        matrix.M14 * matrix.M22 * matrix.M41) / det,
                        (matrix.M11 * matrix.M24 * matrix.M32 +
                        matrix.M12 * matrix.M21 * matrix.M34 +
                        matrix.M14 * matrix.M22 * matrix.M31 -
                        matrix.M11 * matrix.M22 * matrix.M34 -
                        matrix.M12 * matrix.M24 * matrix.M31 -
                        matrix.M14 * matrix.M21 * matrix.M32) / det,
                    
                        (matrix.M21 * matrix.M33 * matrix.M42 +
                        matrix.M22 * matrix.M31 * matrix.M43 +
                        matrix.M23 * matrix.M32 * matrix.M41 -
                        matrix.M21 * matrix.M32 * matrix.M43 -
                        matrix.M22 * matrix.M33 * matrix.M41 -
                        matrix.M23 * matrix.M31 * matrix.M42) / det,
                        (matrix.M11 * matrix.M32 * matrix.M43 +
                        matrix.M12 * matrix.M33 * matrix.M41 +
                        matrix.M13 * matrix.M31 * matrix.M42 -
                        matrix.M11 * matrix.M33 * matrix.M42 -
                        matrix.M12 * matrix.M31 * matrix.M43 -
                        matrix.M13 * matrix.M32 * matrix.M41) / det,
                        (matrix.M11 * matrix.M23 * matrix.M42 +
                        matrix.M12 * matrix.M21 * matrix.M43 +
                        matrix.M13 * matrix.M22 * matrix.M41 -
                        matrix.M11 * matrix.M22 * matrix.M43 -
                        matrix.M12 * matrix.M23 * matrix.M41 -
                        matrix.M13 * matrix.M21 * matrix.M42) / det,
                        (matrix.M11 * matrix.M22 * matrix.M33 +
                        matrix.M12 * matrix.M23 * matrix.M31 +
                        matrix.M13 * matrix.M21 * matrix.M32 -
                        matrix.M11 * matrix.M23 * matrix.M32 -
                        matrix.M12 * matrix.M21 * matrix.M33 -
                        matrix.M13 * matrix.M22 * matrix.M31) / det
                    );
                }
            },
    
            /**
             * @function    Sum
             * @param       {Matrix4}   matrix    
             * @param       {number}    m11
             * @param       {number}    m12
             * @param       {number}    m13
             * @param       {number}    m14
             * @param       {number}    m21
             * @param       {number}    m22
             * @param       {number}    m23
             * @param       {number}    m24
             * @param       {number}    m31
             * @param       {number}    m32
             * @param       {number}    m33
             * @param       {number}    m34
             * @param       {number}    m41
             * @param       {number}    m42
             * @param       {number}    m43
             * @param       {number}    m44
             * @return      {Matrix4}
             */
            Sum:
            {   
                value: function Sum(matrix, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
                {
                    if (m11 instanceof Matrix4)
                        m11 = m11.Buffer;
    
                    if (m11 instanceof Float32Array || m11 instanceof Array)
                    {
                        m44 = m11[15]; m43 = m11[14]; m42 = m11[13]; m41 = m11[12];
                        m34 = m11[11]; m33 = m11[10]; m32 = m11[9];  m31 = m11[8];
                        m24 = m11[7];  m23 = m11[6];  m22 = m11[5];  m21 = m11[4];
                        m14 = m11[3];  m13 = m11[2];  m12 = m11[1];  m11 = m11[0];
                    }
    
                    return new Matrix4
                    (
                        matrix.M11 + m11, matrix.M12 + m12, matrix.M13 + m13, matrix.M14 + m14,
                        matrix.M21 + m21, matrix.M22 + m22, matrix.M23 + m23, matrix.M24 + m24,
                        matrix.M31 + m31, matrix.M32 + m32, matrix.M33 + m33, matrix.M34 + m34,
                        matrix.M41 + m41, matrix.M42 + m42, matrix.M43 + m43, matrix.M44 + m44
                    );
                }
            },
            
            /**
             * @function    Mult
             * @param       {number}    m11
             * @param       {number}    m12
             * @param       {number}    m13
             * @param       {number}    m14
             * @param       {number}    m21
             * @param       {number}    m22
             * @param       {number}    m23
             * @param       {number}    m24
             * @param       {number}    m31
             * @param       {number}    m32
             * @param       {number}    m33
             * @param       {number}    m34
             * @param       {number}    m41
             * @param       {number}    m42
             * @param       {number}    m43
             * @param       {number}    m44
             * @return      {Matrix4}
             */
            Mult:
            {
                value: function Mult(matrix, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
                {
                    if (m11 instanceof Matrix4)
                        m11 = m11.Buffer;
    
                    if (m11 instanceof Float32Array || m11 instanceof Array)
                    {
                        m44 = m11[15]; m43 = m11[14]; m42 = m11[13]; m41 = m11[12];
                        m34 = m11[11]; m33 = m11[10]; m32 = m11[9];  m31 = m11[8];
                        m24 = m11[7];  m23 = m11[6];  m22 = m11[5];  m21 = m11[4];
                        m14 = m11[3];  m13 = m11[2];  m12 = m11[1];  m11 = m11[0];
                    }
                    return new Matrix4
                    (
                        matrix.M11 * m11 + matrix.M12 * m21 + matrix.M13 * m31 + matrix.M14 * m41,
                        matrix.M11 * m12 + matrix.M12 * m22 + matrix.M13 * m32 + matrix.M14 * m42,
                        matrix.M11 * m13 + matrix.M12 * m23 + matrix.M13 * m33 + matrix.M14 * m43,
                        matrix.M11 * m14 + matrix.M12 * m24 + matrix.M13 * m34 + matrix.M14 * m44,
                        
                        matrix.M21 * m11 + matrix.M22 * m21 + matrix.M23 * m31 + matrix.M24 * m41,
                        matrix.M21 * m12 + matrix.M22 * m22 + matrix.M23 * m32 + matrix.M24 * m42,
                        matrix.M21 * m13 + matrix.M22 * m23 + matrix.M23 * m33 + matrix.M24 * m43,
                        matrix.M21 * m14 + matrix.M22 * m24 + matrix.M23 * m34 + matrix.M24 * m44,
                        
                        matrix.M31 * m11 + matrix.M32 * m21 + matrix.M33 * m31 + matrix.M34 * m41,
                        matrix.M31 * m12 + matrix.M32 * m22 + matrix.M33 * m32 + matrix.M34 * m42,
                        matrix.M31 * m13 + matrix.M32 * m23 + matrix.M33 * m33 + matrix.M34 * m43,
                        matrix.M31 * m14 + matrix.M32 * m24 + matrix.M33 * m34 + matrix.M34 * m44,
                        
                        matrix.M41 * m11 + matrix.M42 * m21 + matrix.M43 * m31 + matrix.M44 * m41,
                        matrix.M41 * m12 + matrix.M42 * m22 + matrix.M43 * m32 + matrix.M44 * m42,
                        matrix.M41 * m13 + matrix.M42 * m23 + matrix.M43 * m33 + matrix.M44 * m43,
                        matrix.M41 * m14 + matrix.M42 * m24 + matrix.M43 * m34 + matrix.M44 * m44
                    ); 
                }
            },
    
            Scale:
            {
                value: function Scale(matrix, scaler)
                {
                    return Matrix4.Mult
                    (
                        matrix,
                        scaler, scaler, scaler, scaler,
                        scaler, scaler, scaler, scaler,
                        scaler, scaler, scaler, scaler,
                        scaler, scaler, scaler, scaler
                    );
                }
            }
        });
    
        Object.defineProperties(Matrix4.prototype,
        {
            M11:
            {
                get: function M11() { return this.Buffer[0];  },
                set: function M11(m11) { this.Buffer[0] = m11;   }
            },
            M12:
            {
                get: function M12() { return this.Buffer[1];  },
                set: function M12(m12) { this.Buffer[1] = m12;   }
            },
            M13:
            {
                get: function M13() { return this.Buffer[2];  },
                set: function M13(m13) { this.Buffer[2] = m13;   }
            },
            M14:
            {
                get: function M14() { return this.Buffer[3];  },
                set: function M14(m14) { this.Buffer[3] = m14;   }
            },
            M21:
            {
                get: function M21() { return this.Buffer[4];  },
                set: function M21(m21) { this.Buffer[4] = m21;   }
            },
            M22:
            {
                get: function M22() { return this.Buffer[5];  },
                set: function M22(m22) { this.Buffer[5] = m22;   }
            },
            M23:
            {
                get: function M23() { return this.Buffer[6];  },
                set: function M23(m23) { this.Buffer[6] = m23;   }
            },
            M24:
            {
                get: function M24() { return this.Buffer[7];  },
                set: function M24(m24) { this.Buffer[7] = m24;   }
            },
            M31:
            {
                get: function M31() { return this.Buffer[8];  },
                set: function M31(m31) { this.Buffer[8] = m31;   }
            },
            M32:
            {
                get: function M32() { return this.Buffer[9];  },
                set: function M32(m32) { this.Buffer[9] = m32;   }
            },
            M33:
            {
                get: function M33() { return this.Buffer[10]; },
                set: function M33(m33) { this.Buffer[10] = m33;  }
            },
            M34:
            {
                get: function M34() { return this.Buffer[11]; },
                set: function M34(m34) { this.Buffer[11] = m34;  }
            },
            M41:
            {
                get: function M41() { return this.Buffer[12]; },
                set: function M41(m41) { this.Buffer[12] = m41;  }
            },
            M42:
            {
                get: function M42() { return this.Buffer[13]; },
                set: function M42(m42) { this.Buffer[13] = m42;  }
            },
            M43:
            {
                get: function M43() { return this.Buffer[14]; },
                set: function M43(m43) { this.Buffer[14] = m43;  }
            },
            M44:
            {
                get: function M44() { return this.Buffer[15]; },
                set: function M44(m44) { this.Buffer[15] = m44;  }
            },
    
    
            /**
             * @function    Set
             * @param       {Matrix4}   matrix
             * @param       {number}    m11
             * @param       {number}    m12
             * @param       {number}    m13
             * @param       {number}    m14
             * @param       {number}    m21
             * @param       {number}    m22
             * @param       {number}    m23
             * @param       {number}    m24
             * @param       {number}    m31
             * @param       {number}    m32
             * @param       {number}    m33
             * @param       {number}    m34
             * @param       {number}    m41
             * @param       {number}    m42
             * @param       {number}    m43
             * @param       {number}    m44
             * @return      {Matrix4}
             */
            Set:
            {
                value: function Set(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
                {
                    return Matrix4.Set(this, m11 instanceof Array || m11 instanceof Float32Array || m11 instanceof Matrix4 ? m11 : [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44]);
                }
            },
    
            /**
             * @function    Transpose
             * @return      {Matrix4}
             */
            Transpose:
            {
                value: function Transpose()
                {
                    return this.Set
                    (
                        this.M11, this.M21, this.M31, this.M41,
                        this.M12, this.M22, this.M32, this.M42,
                        this.M13, this.M23, this.M33, this.M43,
                        this.M14, this.M24, this.M34, this.M44
                    );
                }
            },
            
            /**
             * @function    Identity
             * @return      {Matrix4}
             */
            Identity:
            {
                value: function Identity()
                {
                    return this.Set
                    (
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1
                    );
                }
            },
    
            /**
             * @function    Determinant
             * @return      {Matrix4}
             */
            Determinant:
            {
                get: function Determinant()
                {
                    return Matrix4.Determinant(this);
                }
            },
    
            /**
             * @function    Inverse
             * @return      {Matrix4}
             */
            Inverse:
            {
                value: function Inverse()
                {
                    var det = this.Determinant;
    
                    if (det !== 0)
                        det = 1;
    
                    return this.Set
                    (
                        (this.M22 * this.M33 * this.M44 +
                        this.M23 * this.M34 * this.M42 +
                        this.M24 * this.M32 * this.M43 -
                        this.M22 * this.M34 * this.M43 -
                        this.M23 * this.M32 * this.M44 -
                        this.M24 * this.M33 * this.M42) / det,
                        (this.M12 * this.M34 * this.M43 +
                        this.M13 * this.M32 * this.M44 +
                        this.M14 * this.M33 * this.M42 -
                        this.M12 * this.M33 * this.M44 -
                        this.M13 * this.M34 * this.M42 -
                        this.M14 * this.M32 * this.M43) / det,
                        (this.M12 * this.M23 * this.M44 +
                        this.M13 * this.M24 * this.M42 +
                        this.M14 * this.M22 * this.M43 -
                        this.M12 * this.M24 * this.M43 -
                        this.M13 * this.M22 * this.M44 -
                        this.M14 * this.M23 * this.M42) / det,
                        (this.M12 * this.M24 * this.M33 +
                        this.M13 * this.M22 * this.M34 +
                        this.M14 * this.M23 * this.M32 -
                        this.M12 * this.M23 * this.M34 -
                        this.M13 * this.M24 * this.M32 -
                        this.M14 * this.M22 * this.M33) / det,
                    
                        (this.M21 * this.M34 * this.M43 +
                        this.M23 * this.M31 * this.M44 +
                        this.M24 * this.M33 * this.M41 -
                        this.M21 * this.M33 * this.M44 -
                        this.M23 * this.M34 * this.M41 -
                        this.M24 * this.M31 * this.M43) / det,
                        (this.M11 * this.M33 * this.M44 +
                        this.M13 * this.M34 * this.M41 +
                        this.M14 * this.M31 * this.M43 -
                        this.M11 * this.M34 * this.M43 -
                        this.M13 * this.M31 * this.M44 -
                        this.M14 * this.M33 * this.M41) / det,
                        (this.M11 * this.M24 * this.M43 +
                        this.M13 * this.M21 * this.M44 +
                        this.M14 * this.M23 * this.M41 -
                        this.M11 * this.M23 * this.M44 -
                        this.M13 * this.M24 * this.M41 -
                        this.M14 * this.M21 * this.M43) / det,
                        (this.M11 * this.M23 * this.M34 +
                        this.M13 * this.M24 * this.M31 +
                        this.M14 * this.M21 * this.M33 -
                        this.M11 * this.M24 * this.M33 -
                        this.M13 * this.M21 * this.M34 -
                        this.M14 * this.M23 * this.M31) / det,
                    
                        (this.M21 *  this.M32 * this.M44 +
                        this.M22 * this.M34 * this.M41 +
                        this.M24 * this.M31 * this.M42 -
                        this.M21 * this.M34 * this.M42 -
                        this.M22 * this.M31 * this.M44 -
                        this.M24 * this.M32 * this.M41) / det,
                        (this.M11 * this.M34 * this.M42 +
                        this.M12 * this.M31 * this.M44 +
                        this.M14 * this.M32 * this.M41 -
                        this.M11 * this.M32 * this.M44 -
                        this.M12 * this.M34 * this.M41 -
                        this.M14 * this.M31 * this.M42) / det,
                        (this.M11 * this.M22 * this.M44 +
                        this.M12 * this.M24 * this.M41 +
                        this.M14 * this.M21 * this.M42 -
                        this.M11 * this.M24 * this.M42 -
                        this.M12 * this.M21 * this.M44 -
                        this.M14 * this.M22 * this.M41) / det,
                        (this.M11 * this.M24 * this.M32 +
                        this.M12 * this.M21 * this.M34 +
                        this.M14 * this.M22 * this.M31 -
                        this.M11 * this.M22 * this.M34 -
                        this.M12 * this.M24 * this.M31 -
                        this.M14 * this.M21 * this.M32) / det,
                    
                        (this.M21 * this.M33 * this.M42 +
                        this.M22 * this.M31 * this.M43 +
                        this.M23 * this.M32 * this.M41 -
                        this.M21 * this.M32 * this.M43 -
                        this.M22 * this.M33 * this.M41 -
                        this.M23 * this.M31 * this.M42) / det,
                        (this.M11 * this.M32 * this.M43 +
                        this.M12 * this.M33 * this.M41 +
                        this.M13 * this.M31 * this.M42 -
                        this.M11 * this.M33 * this.M42 -
                        this.M12 * this.M31 * this.M43 -
                        this.M13 * this.M32 * this.M41) / det,
                        (this.M11 * this.M23 * this.M42 +
                        this.M12 * this.M21 * this.M43 +
                        this.M13 * this.M22 * this.M41 -
                        this.M11 * this.M22 * this.M43 -
                        this.M12 * this.M23 * this.M41 -
                        this.M13 * this.M21 * this.M42) / det,
                        (this.M11 * this.M22 * this.M33 +
                        this.M12 * this.M23 * this.M31 +
                        this.M13 * this.M21 * this.M32 -
                        this.M11 * this.M23 * this.M32 -
                        this.M12 * this.M21 * this.M33 -
                        this.M13 * this.M22 * this.M31) / det);
                }
            },
    
            /**
             * @function    Sum
             * @param       {number}    m11
             * @param       {number}    m12
             * @param       {number}    m13
             * @param       {number}    m14
             * @param       {number}    m21
             * @param       {number}    m22
             * @param       {number}    m23
             * @param       {number}    m24
             * @param       {number}    m31
             * @param       {number}    m32
             * @param       {number}    m33
             * @param       {number}    m34
             * @param       {number}    m41
             * @param       {number}    m42
             * @param       {number}    m43
             * @param       {number}    m44
             * @return      {Matrix4}
             */
            Sum:
            {   
                value: function Sum(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
                {
                    if (m11 instanceof Matrix4)
                        m11 = m11.Buffer;
    
                    if (m11 instanceof Array)
                    {
                        m44 = m11[15]; m43 = m11[14]; m42 = m11[13]; m41 = m11[12];
                        m34 = m11[11]; m33 = m11[10]; m32 = m11[9];  m31 = m11[8];
                        m24 = m11[7];  m23 = m11[6];  m22 = m11[5];  m21 = m11[4];
                        m14 = m11[3];  m13 = m11[2];  m12 = m11[1];  m11 = m11[0];
                    }
    
                    return this.Set
                    (
                        this.M11 + m11, this.M12 + m12, this.M13 + m13, this.M14 + m14,
                        this.M21 + m21, this.M22 + m22, this.M23 + m23, this.M24 + m24,
                        this.M31 + m31, this.M32 + m32, this.M33 + m33, this.M34 + m34,
                        this.M41 + m41, this.M42 + m42, this.M43 + m43, this.M44 + m44
                    );
                }
            },
            
            /**
             * @function    Mult
             * @param       {number}    m11
             * @param       {number}    m12
             * @param       {number}    m13
             * @param       {number}    m14
             * @param       {number}    m21
             * @param       {number}    m22
             * @param       {number}    m23
             * @param       {number}    m24
             * @param       {number}    m31
             * @param       {number}    m32
             * @param       {number}    m33
             * @param       {number}    m34
             * @param       {number}    m41
             * @param       {number}    m42
             * @param       {number}    m43
             * @param       {number}    m44
             * @return      {Matrix4}
             */
            Mult:
            {
                value: function Mult(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
                {
                    if (m11 instanceof Matrix4)
                        m11 = m11.Buffer;
    
                    if (m11 instanceof Float32Array || m11 instanceof Array)
                    {
                        m44 = m11[15]; m43 = m11[14]; m42 = m11[13]; m41 = m11[12];
                        m34 = m11[11]; m33 = m11[10]; m32 = m11[9];  m31 = m11[8];
                        m24 = m11[7];  m23 = m11[6];  m22 = m11[5];  m21 = m11[4];
                        m14 = m11[3];  m13 = m11[2];  m12 = m11[1];  m11 = m11[0];
                    }
                    return this.Set
                    (
                        this.M11 * m11 + this.M12 * m21 + this.M13 * m31 + this.M14 * m41,
                        this.M11 * m12 + this.M12 * m22 + this.M13 * m32 + this.M14 * m42,
                        this.M11 * m13 + this.M12 * m23 + this.M13 * m33 + this.M14 * m43,
                        this.M11 * m14 + this.M12 * m24 + this.M13 * m34 + this.M14 * m44,
                        
                        this.M21 * m11 + this.M22 * m21 + this.M23 * m31 + this.M24 * m41,
                        this.M21 * m12 + this.M22 * m22 + this.M23 * m32 + this.M24 * m42,
                        this.M21 * m13 + this.M22 * m23 + this.M23 * m33 + this.M24 * m43,
                        this.M21 * m14 + this.M22 * m24 + this.M23 * m34 + this.M24 * m44,
                        
                        this.M31 * m11 + this.M32 * m21 + this.M33 * m31 + this.M34 * m41,
                        this.M31 * m12 + this.M32 * m22 + this.M33 * m32 + this.M34 * m42,
                        this.M31 * m13 + this.M32 * m23 + this.M33 * m33 + this.M34 * m43,
                        this.M31 * m14 + this.M32 * m24 + this.M33 * m34 + this.M34 * m44,
                        
                        this.M41 * m11 + this.M42 * m21 + this.M43 * m31 + this.M44 * m41,
                        this.M41 * m12 + this.M42 * m22 + this.M43 * m32 + this.M44 * m42,
                        this.M41 * m13 + this.M42 * m23 + this.M43 * m33 + this.M44 * m43,
                        this.M41 * m14 + this.M42 * m24 + this.M43 * m34 + this.M44 * m44
                    ); 
                }
            },
    
            Scale:
            {
                value: function Scale(scaler)
                {
                    return this.Mult
                    (
                        scaler, scaler, scaler, scaler,
                        scaler, scaler, scaler, scaler,
                        scaler, scaler, scaler, scaler,
                        scaler, scaler, scaler, scaler
                    );
                }
            }
        });
        Object.seal(Matrix4.prototype);
    
        return Matrix4;
    })();
    Object.seal(Matrix4);
    
    /**
     * @name        Quaternion
     * @module      FWGE.Maths
     * @description ...
     */
    
    /**
     * @param {number}  w
     * @param {number}  x
     * @param {number}  y
     * @param {number}  z
     */
    function Quaternion(w, x, y, z)
    {
        Vector4.call(this, w, x, y, z);
    }
    
    /**
     * @name        Vector2
     * @module      FWGE.Game.Maths 
     * @description This library contains the methods for 2 component vector operations.
     *              2 component vector are represented as a Float32Array of length 2.
     */
    
    window.Vector2 = (function()
    {
        /**
         * @param   {number}    x
         * @param   {number}    y
         */
        function Vector2(x = 0, y = 0)
        {
            BufferedArray.call(this, 2, Float32Array);
            this.Set(x, y);
    
            Object.seal(this);
        }
        Vector2.prototype = Object.create(null);
    
        Object.defineProperties(Vector2,
        {
            /**
             * @property    {Zero}
             * @type        {Vector2}
             */
            Zero: { get Zero()   { return new Vector2(0, 0); } },
            
            /**
             * @property    {One}
             * @type        {Vector2}
             */
            One: { get One()    { return new Vector2(1, 1); } },
            
            /**
             * @property    {Unit}
             * @type        {Vector2}
             */
            Unit: { get Unit()   { return new Vector2(Math.sqrt(1/2), Math.sqrt(1/2)); } },
            
    
            /**
             * @function    Length
             * @param       {Vector2}   vector
             * @param       {number}    x
             * @param       {number}    y
             * @return      {number}
             */
            Length:
            {
                value: function Length(x, y)
                {
                    return Math.sqrt(x * x + y * y);
                }
            },
    
            /**
             * @function    Set
             * @param       {Vector2}   vector
             * @param       {number}    x
             * @param       {number}    y
             * @return      {Vector2}
             */
            Set:
            {
                value: function Set(vector, x, y)
                {
                    vector.X = x;
                    vector.Y = y;
    
                    return vector;
                }
            },
            
            /**
             * @function    Sum
             * @param       {Vector}    vector
             * @param       {number}    x
             * @param       {number}    y
             * @return      {Vector2}
             */
            Sum:
            {
                value: function Sum(vector, x, y)
                {   
                    return new Vector2(vector.X + x, vector.Y + y);
                }
            },
            
            /**
             * @function    Diff
             * @param       {Vector}    vector
             * @param       {number}    x
             * @param       {number}    y
             * @return      {Vector2}
             */
            Diff:
            {
                value: function Diff(vector, x, y)
                {   
                    return new Vector2(x - vector.X, y - vector.Y);
                }
            },
            
            /**
             * @function    Mult
             * @param       {Vector}    vector
             * @param       {number}    x
             * @param       {number}    y
             * @return      {Vector2}
             */
            Mult:
            {
                value: function Mult(vector, x, y)
                {   
                    return new Vector2(vector.X * x, vector.Y * y);
                }
            },
            
            /**
             * @function    Scale
             * @param       {Vector}    vector
             * @param       {number}    x
             * @param       {number}    y
             * @return      {Vector2}
             */
            Scale:
            {
                value: function Scale(vector, scalar)
                {   
                    return Vector2.Mult(vector, scalar, scalar);
                }
            },
            
            /**
             * @function    Dot
             * @param       {Vector2}   vector
             * @param       {number}    x
             * @param       {number}    y
             * @return      {number}
             */
            Dot:
            {
                value: function Dot(vector, x, y)
                {
                    return vector.X * x + vector.Y * y;
                }
            },
            
            /**
             * @function    Unit
             * @param       {Vector2} vector
             * @return      {Vector2}
             */
            Unit:
            {
                value: function Unit(vector)
                {
                    let length = vector.Length;
    
                    if (length !== 0)
                        length = 1;
    
                    return Vector2.Scale(vector, 1 / length);
                }
            }
        });
    
        Object.defineProperties(Vector2.prototype,
        {
            constructor: { value: Vector2 },
    
            /**
             * @property    {X}
             * @type        {number}
             */
            X:
            {
                get: function X()  { return this.Buffer[0]; },
                set: function X(x) { this.Buffer[0] = x;    }
            },
    
            /**
             * @property    {Y}
             * @type        {number}
             */
            Y:
            {
                get: function Y()  { return this.Buffer[1]; },
                set: function Y(y) { this.Buffer[1] = y;    }
            },
    
            /**
             * @function    Length
             * @param       {number}    x
             * @param       {number}    y
             * @return      {number}
             */
            Length:
            {
                get: function Length()
                {
                    return Vector2.Length(this.X, this.Y);
                }
            },
            
            /**
             * @function    Set
             * @param       {number}    x
             * @param       {number}    y
             * @return      {Vector2}
             */
            Set:
            {
                value: function Set(x, y)
                {
                    return Vector2.Set(this, x, y);
                }
            },
            
            /**
             * @function    Sum
             * @param       {number}    x
             * @param       {number}    y
             * @return      {Vector2}
             */
            Sum:
            {
                value: function Sum(x, y)
                {   
                    return Vector2.Set(this, this.X + x, this.Y + y);
                }
            },
            
            
            /**
             * @function    Diff
             * @param       {number}    x
             * @param       {number}    y
             * @return      {Vector2}
             */
            Diff:
            {
                value: function Diff(x, y)
                {   
                    return Vector2.Set(this, x - this.X, y - this.Y);
                }
            },
            
    
            /**
             * @function    Mult
             * @param       {number}    x
             * @param       {number}    y
             * @return      {Vector2}
             */
            Mult:
            {
                value: function Mult(x, y)
                {   
                    return Vector2.Set(this, this.X * x, this.Y * y);
                }
            },
            
    
            /**
             * @function    Scale
             * @param       {number}    scalar
             * @return      {Vector2}
             */
            Scale:
            {
                value: function Scale(scalar)
                {   
                    return this.Mult(scalar, scalar);
                }
            },
            
            
            /**
             * @function    Dot
             * @param       {number}    x
             * @param       {number}    y
             * @return      {number}
             */
            Dot:
            {
                value: function Dot(x, y)
                {
                    return Vector2.Dot(this, x, y);
                }
            },
    
            
            /**
             * @function    Unit
             * @return      {Vector2}
             */
            Unit:
            {
                value: function Unit()
                {
                    let length = this.Length;
    
                    if (length !== 0)
                        length = 1;
    
                    return this.Scale(1 / length);
                }
            }
        });
        Object.seal(Vector2.prototype);
    
        return Vector2;
    })();
    Object.seal(Vector2);
    
    
    /**
     * @name        Vector3
     * @module      FWGE.Game.Maths
     * @description  MathsTHis object represents a 3-valued vector.
     */
    
    window.Vector3 = (function()
    {
        /**
         * @param {number}  x 
         * @param {number}  y 
         * @param {number}  z 
         */
        function Vector3(x = 0, y = 0, z = 0)
        {
            BufferedArray.call(this, 3, Float32Array);
            this.Set(x, y, z);
    
            Object.seal(this);
        }
        Object.defineProperties(Vector3,
        {
            /**
             * @property    {Zero}
             * @type        {Vector3}
             */
            Zero: { get: function Zero() { return new Vector3(0, 0, 0); }, configurable: false, enumerable: true },
    
            /**
             * @property    {One}
             * @type        {Vector3}
             */
            One: { get: function One() { return new Vector3(1, 1, 1); }, configurable: false, enumerable: true },
    
            /**
             * @property    {Unit}
             * @type        {Vector3}
             */
            Unit: { get Unit() { return new Vector3(Math.sqrt(1/3), Math.sqrt(1/3), Math.sqrt(1/3)); }, configurable: false, enumerable: true },
            
    
            /**
             * @function    Set
             * @param       {Vector3}   vector
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector3}
             */
            Set: 
            { 
                value: function Set(vector, x, y, z)
                {        
                    vector.X = x;
                    vector.Y = y;
                    vector.Z = z;
    
                    return vector;
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Length
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {numbers}
             * @description ...
             */
            Length:
            {
                value: function Length(x, y, z)
                {
                    return Math.sqrt(x * x + y * y + z * z);
                },
                configurable: false, enumerable: true, writable: false
            },
    
            /**
             * @function    Sum
             * @param       {Vector3}   vector
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector3}
             * @description ...
             */
            Sum:
            {
                value: function Sum(vector, x, y, z)
                {
                    return new Vector3(vector.X + x, vector.Y + y, vector.Z + z)
                },
                configurable: false, enumerable: true, writable: false
            },
    
            /**
             * @function    Diff
             * @param       {Vector3}   vector
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector3}
             * @description ...
             */
            Diff:
            {
                value: function Diff(vector, x, y, z)
                {
                    return new Vector3(x - vector.X, y - vector.Y, z - vector.Z);
                },
                configurable: false, enumerable: true, writable: false
            },
    
            /**
             * @function    Mult
             * @param       {Vector3}   vector
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector3}
             * @description ...
             */
            Mult:
            {
                value: function Mult(vector, x, y, z)
                {
                    return new Vector3(vector.X * x, vector.Y * y, vector.Z * z)
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Scale
             * @param       {Vector3}   vector
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector3}
             * @description ...
             */
            Scale:
            {
                value: function Scale(vector, scaler)
                {
                    return Vector3.Mult(vector, scaler, scaler, scaler);
                },
                configurable: false, enumerable: true, writable: false
            },
    
            /**
             * @function    Dot
             * @param       {Vector3} vector
             * @param       {number} x
             * @param       {number} x
             * @param       {number} x
             */
            Dot:
            {
                value: function Dot(vector, x, y, z)
                {
                    return vector.X * x + vector.Y * y + vector.Z * z;
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Cross
             * @param       {Vector3}   vector
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector3}
             * @description ...
             */
            Cross:
            {
                value: function Cross(vector, x, y, z)
                {
                    return new Vector3(vector.Y * z + vector.Z * y, vector.Z * x - vector.X * z, vector.X * y + vector.Y * x);
                },
                configurable: false, enumerable: true, writable: false
            },
    
            /**
             * @function    Unit
             * @param       {Vector3}   vector
             * @return      {Vector3}
             * @description ...
             */
            Unit:
            {
                value: function Unit(vector)
                {
                    var length = vector.Length;
    
                    if (length !== 0)
                        length = 1;
    
                    return Vector3.Scale(vector, 1 / length);
                },
                configurable: false, enumerable: true, writable: false
            }
        });
    
        Vector3.prototype = Object.create(null);
        Object.defineProperties(Vector3.prototype,
        {    
            /**
             * @property    {X}
             * @type        {number}
             * @description Returns a zero-valued vector
             */
            X:
            {
                get: function get()  { return this.Buffer[0]; },
                set: function set(x) { this.Buffer[0] = x; },
                configurable: false, enumerable: true
            },
    
            /**
             * @property    {Y}
             * @type        {number}
             * @description Returns a zero-valued vector
             */
            Y:
            {
                get: function get()  { return this.Buffer[1]; },
                set: function set(y) { this.Buffer[1] = y; },
                configurable: false, enumerable: true
            },
    
            /**
             * @property    {Z}
             * @type        {number}
             * @description Returns a zero-valued vector
             */
            Z:
            {
                get: function get()  { return this.Buffer[2]; },
                set: function set(z) { this.Buffer[2] = z; },
                configurable: false, enumerable: true
            },
                
            /**
             * @property    {Length}
             * @type        {number}
             * @description Returns a zero-valued vector
             */
            Length:
            {
                get: function get() { return Vector3.Length(this.X, this.Y, this.Z); },
                configurable: false, enumerable: true
            },
            
            
            /**
             * @function    Cross
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector3}
             */
            Set:
            {
                value: function Set(x, y, z)
                {
                    return Vector3.Set(this, x, y, z);
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Cross
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector3}
             */
            Sum:
            {
                value: function Sum(x, y, z)
                {
                    return Vector3.Set(this, this.X + x, this.Y + y, this.Z + z);
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Diff
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector3}
             */
            Diff:
            {
                value: function Diff(x, y, z)
                {
                    return Vector3.Set(this, x - this.X, y - this.Y, z - this.Z);
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Mult
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector3}
             */
            Mult:
            {
                value: function Mult(x, y, z)
                {        
                    return Vector3.Set(this.X * x, this.Y * y, this.Z * z);
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Dot
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {number}
             */
            Dot:
            {
                value: function Dot(x, y, z)
                {
                    return Vector3.Dot(this, x, y, Z);
                },
                configurable: false, enumerable: true, writable: false
            },
    
            /**
             * @function    Cross
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector3}
             */
            Cross:
            {     
                value: function Cross(x, y, z)
                {
                    return Vector3.Set(this, this.Y * z + this.Z * y, this.Z * x - this.X * z, this.X * y + this.Y * x);
                },
                configurable: false, enumerable: true, writable: false
            },
    
            /**
             * @function    Scale
             * @param       {number}    scalar
             * @return      {Vector3}
             */
            Scale:
            {
                value: function Scale(scaler)
                {
                    return Vector3.Set(this, this.X * scaler, this.Y * scaler, this.Z * scaler);
                },
                configurable: false, enumerable: true, writable: false
            },
            
            /**
             * @function    Unit
             * @return      {Vector3}
             */
            Unit:
            {
                value: function Unit()
                {
                    var length = this.Length;
    
                    if (length !== 0)
                        Vector3.Scale(this, 1 / length);
    
                    return this;
                },
                configurable: false, enumerable: true, writable: false
            }
        });
        Object.seal(Vector3.prototype);
    
        return Vector3;
    })();
    Object.seal(Vector3);
    
    /**
     * @name        Vector4
     * @module      FWGE.Game.Maths 
     * @description vector library contains the methods for 2 component vector operations.
     *              4 component vector are represented as a Float32Array of length 4.
     */
    
    window.Vector4 = (function()
    {
        /**
         * @param   {number}    w
         * @param   {number}    x
         * @param   {number}    y
         * @param   {number}    z
         */
        function Vector4(w = 0, x = 0, y = 0, z = 0)
        {
            BufferedArray.call(this, 4, Float32Array);
            this.Set(w, x, y, z);
    
            Object.seal(this);
        }
        Object.defineProperties(Vector4,
        {
            
            Zero: { get: function Zero() { return new Vector4(0, 0, 0, 0); } },
            One: { get: function One() { return new Vector4(1, 1, 1, 1); } },
            Unit: { get: function Unit()  { return new Vector4(0.5, 0.5, 0.5, 0.5); } },
    
            /**
             * @function    Set
             * @param       {Vector4}   vector
             * @param       {number}    w
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector4}
             */
            Set:
            {
                value: function Set(vector, w, x, y, z)
                {
                    vector.W = w;
                    vector.X = x;
                    vector.Y = y;
                    vector.Z = z;
    
                    return vector;
                }
            },
            
            /**
             * @function    Length
             * @param       {Vector4}   vector
             * @return      {number}
             */
            Length:
            {
                value: function Length(vector)
                {
                    return Math.sqrt(vector.W * vector.W + vector.X * vector.X + vector.Y * vector.Y + vector.Z * vector.Z);
                }
            },
            
            /**
             * @function    Sum
             * @param       {Vector4}   vector
             * @param       {number}    w
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector4}
             */
            Sum:
            {
                value: function Sum(vector, w, x, y, z)
                {
                    return new Vector4(vector.W + w, vector.X + x, vector.Y + y, vector.Z + z);
                }
            },
            
            /**
             * @function    Diff
             * @param       {Vector4}   vector
             * @param       {number}    w
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector4}
             */
            Diff:
            {
                value: function Diff(vector, w, x, y, z)
                {
                    return new Vector4(w - vector.W, x - vector.X, y - vector.Y, z - vector.Z);
                }
            },
    
            /**
             * @function    Mult
             * @param       {Vector4}   vector
             * @param       {number}    w
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @param       {Vector4}
             */
            Mult:
            {
                value: function Mult(vector, w, x, y, z)
                {
                    return new Vector4(vector.W * w, vector.X * x, vector.Y * y, vector.Z * z);
                }
            },
    
            /**
             * @function    Scale
             * @param       {Vector4}   vector
             * @param       {number}    scalar
             * @return      {Vector4}
             */
            Scale:
            {
                value: function Scale(vector, scaler)
                {
                    return Vector4.Mult(vector, scaler, scaler, scaler, scaler);
                }
            },
            
            /**
             * @function    Dot
             * @param       {Vector4}   vector
             * @param       {number}    w
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector4}
             */
            Dot:
            {
                value: function Dot(vector, w, x, y, z)
                {
                    return vector.W * w + vector.X * x + vector.Y * y + vector.Z * z;
                }
            },
    
            /**
             * @function    Unit
             * @param       {Vector4}   vector
             * @return      {Vector4}
             */
            Unit:
            {
                value: function Unit(vector)
                {   
                    let length = vector.Length;
    
                    if (length !== 0)
                        length = 1;
    
                    return Vector4.Scale(vector, 1 / length);
                }
            }
        });
    
        Object.defineProperties(Vector4.prototype,
        {
            constructor: { value: Vector4 },
    
            W:
            {
                get: function W()  { return this.Buffer[0]; },
                set: function W(w) { this.Buffer[0] = w;    }
            },
            
            X:
            {
                get: function X()  { return this.Buffer[1]; },
                set: function X(x) { this.Buffer[1] = x;    }
            },
    
            Y:
            {
                get: function Y()  { return this.Buffer[2]; },
                set: function Y(y) { this.Buffer[2] = y;    }
            },
            
            Z:
            {
                get: function Z()  { return this.Buffer[3]; },
                set: function Z(z) { this.Buffer[3] = z;    }
            },
    
            /**
             * @function    Set
             * @param       {Vector4}   vector
             * @param       {number}    w
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector4}
             */
            Set:
            {
                value: function Set(w, x, y, z)
                {
                    return Vector4.Set(this, w, x, y, z);
                }
            },
            
            /**
             * @function    Length
             * @param       {Vector4}   vector
             * @return      {number}
             */
            Length:
            {
                get: function Length()
                {
                    return Vector4.Length(this);
                }
            },
            
            /**
             * @function    Sum
             * @param       {Vector4}   vector
             * @param       {number}    w
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector4}
             */
            Sum:
            {
                value: function Sum(w, x, y, z)
                {
                    return new Vector4(this.W + w, this.X + x, this.Y + y, this.Z + z);
                }
            },
            
            /**
             * @function    Diff
             * @param       {Vector4}   vector
             * @param       {number}    w
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector4}
             */
            Diff:
            {
                value: function Diff(w, x, y, z)
                {
                    return new Vector4(w - this.W, x - this.X, y - this.Y, z - this.Z);
                }
            },
    
            /**
             * @function    Mult
             * @param       {Vector4}   vector
             * @param       {number}    w
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @param       {Vector4}
             */
            Mult:
            {
                value: function Mult(w, x, y, z)
                {
                    return new Vector4(this.W * w, this.X * x, this.Y * y, this.Z * z);
                }
            },
    
            /**
             * @function    Scale
             * @param       {Vector4}   vector
             * @param       {number}    scalar
             * @return      {Vector4}
             */
            Scale:
            {
                value: function Scale(scaler)
                {
                    return this.Mult(scaler, scaler, scaler, scaler);
                }
            },
            
            /**
             * @function    Dot
             * @param       {Vector4}   vector
             * @param       {number}    w
             * @param       {number}    x
             * @param       {number}    y
             * @param       {number}    z
             * @return      {Vector4}
             */
            Dot:
            {
                value: function Dot(w, x, y, z)
                {
                    return Vector4.Dot(this, w, x, y, z);
                }
            },
    
            /**
             * @function    Unit
             * @param       {Vector4}   vector
             * @return      {Vector4}
             */
            Unit:
            {
                value: function Unit(vector)
                {   
                    let length = vector.Length;
    
                    if (length !== 0)
                        length = 1;
    
                    return this.Scale(vector, 1 / length);
                }
            }
        });
        Object.seal(Vector4.prototype);
    
        return Vector4;
    })();
    Object.seal(Vector4);
    
    /**
     * @name        Particle
     * @module      FWGE.Game.ParticleSystem
     * @description Definition of a single particle.
     */
    
    window.Particle = (function()
    {
        /**
         * @param   {object}    request
         * @param   {string}    request.name
         */
        function Particle({before = new Transform(), after = new Transform(), length = 0})
        {
            KeyFrame.call(this, Transform, before, after, length);
    
            Object.seal(this);
        }
    
        Particle.prototype = Object.create(null);
        Object.seal(Particle.prototype);
    
        return Particle;
    })();
    Object.seal(Particle);
    
    /**
     * @name        ParticleSystem
     * @module      FWGE.Game
     * @description Definition of a particle system.
     */
    
    window.ParticleSystem = (function()
    {
        /**
         * @param   {Object}    request
         * @param   {string}    request.name
         * @param   {Particle}  request.particle
         */
        function ParticleSystem({name = 'Particle System', particle = {}} = {})
        {
            Item.call(this, name);
    
            Object.defineProperties(this,
            {
                /**
                 * @property    {Particle}
                 * @type        {Particle}
                 */
                Particle:  { value: new Particle(particle), configurable: false, enumerable: true, writable: true }
            });
    
            Object.seal(this);
        }
    
        ParticleSystem.prototype = Object.create(null);
        Object.seal(ParticleSystem.prototype);
    
        return ParticleSystem;
    })();
    Object.seal(ParticleSystem);
    
    /**
     * @name        Time
     * @module      FWGE.Game
     * @description This is the running clock that keeps track of elapsed time
     *              between render frames.
     */
    
    window.Time = (function()
    {
        function Time()
        {
            var _now = undefined;
            var _then = undefined;
    
            Object.defineProperties(this,
            {    
                /**
                 * @property    {Delta}
                 * @type        {number}
                 */
                Delta:
                {
                    get: function get()
                    {
                        if (_now && _then)
                            return (_now - _then) / 60;
                        return 0;
                    },
                    configurable: false, enumerable: true
                },
    
                /**
                 * @property    {DeltaTime}
                 * @type        {number}
                 */
                DeltaTime:
                {
                    get: function get()
                    {
                        if (_now && _then)
                            return _now - _then;
                        return 0;
                    },
                    configurable: false, enumerable: true
                },
    
                /**
                 * @property    {Now}
                 * @type        {Date}
                 */
                Now:
                {
                    get: function get()
                    {
                        return new Date(Date.now());
                    },
                    configurable: false, enumerable: true
                },
    
                /**
                 * @property    {TimeUpdate}
                 * @return      {undefined}
                 */
                Update:
                {
                    value: function Update()
                    {
                        if (!_now && !_then)
                            _now = _then = Date.now();
                        else
                        {
                            _then = _now;
                            _now = Date.now();
                        }
                    },
                    configurable: false, enumerable: false, writable: false
                },
    
                /**
                 * @property    {Reset}
                 * @return      {undefined}
                 */
                Reset:
                {
                    value: function Reset()
                    {
                        _now = _then = undefined;
                    },
                    configurable: false, enumerable: false, writable: false
                }
            });
            
            Object.seal(this);
        }
    
        Time.prototype = Object.create(null);
        Object.seal(Time.prototype);
    
        return new Time();
    })();
    Object.seal(Time);
    
    /**
     * @name        Transform
     * @module      FWGE.Game
     * @description This object contains all the transformations that 
     *              are to be applied to the parent gameobject.
     */
    
    window.Transform = (function()
    {
        /**
         * @param   {Object}    request
         * @param   {Array}     request.position
         * @param   {Array}     request.rotation
         * @param   {Array}     request.scale
         * @param   {Array}     request.shear
         */
        function Transform({position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], shear = [0, 0, 0]} = {})
        {
            Object.defineProperties(this,
            {        
                /**
                 * @property    {Position}
                 * @type        {Vector3}
                 */
                Position: { value: new Vector3(position[0], position[1], position[2]), configurable: false, enumerable: true, writable: false },
    
                /**
                 * @property    {Rotation}
                 * @type        {Vector3}
                 */           
                Rotation: { value: new Vector3(rotation[0], rotation[1], rotation[2]), configurable: false, enumerable: true, writable: false },
                
                /**
                 * @property    {Scale}
                 * @type        {Vector3}
                 */
                Scale: { value: new Vector3(scale[0], scale[1], scale[2]), configurable: false, enumerable: true, writable: false },
    
                /**
                 * @property    {Shear}
                 * @type        {Vector3}
                 */
                Shear: { value: new Vector3(shear[0], shear[1], shear[2]), configurable: false, enumerable: true, writable: false }
            });
    
            Object.seal(this);
        }
    
        Transform.prototype = Object.create(null);
        Object.defineProperties(Transform.prototype,
        {
            /**
             * @property    {UP}
             * @type        {Vector3}
             */
            UP: { value: new Vector3(0, 1, 0), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {FORWARD}
             * @type        {Vector3}
             */
            FORWARD: { value: new Vector3(0, 0, 1), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {RIGHT}
             * @type        {Vector3}
             */
            RIGHT: { value: new Vector3(1, 0, 0), configurable: false, enumerable: true, writable: false },
    
        });
        Object.seal(Transform.prototype);
    
        return Transform;
    })();
    Object.seal(Transform);
    
    /**
     * @name        BoxCollider
     * @module      FWGE.Physics
     * @description This is a cube-shaped collision object
     */
    
    window.BoxCollider = (function()
    {
        /**
         * @param   {Object}  request
         * @param   {string}  request.name
         * @param   {Array}   request.position
         * @param   {number}  request.height
         * @param   {number}  request.width
         * @param   {number}  request.breadth
         */
        function BoxCollider({name = 'Box Collider', position = Vector3.Zero, height = 2, width = 2, breadth = 2} = {})
        {
            Collider.call(this, name, position);
            
            Object.defineProperties(this,
            {
                /**
                 * @property    {Height}
                 * @type        {number}
                 */
                Height: { value: height, configurable: false, enumerable: true, writable: true },
                
                /**
                 * @property    {Width}
                 * @type        {number}
                 */
                Width: { value: width, configurable: false, enumerable: true, writable: true },
                
                /**
                 * @property    {Breadth}
                 * @type        {number}
                 */
                Breadth: { value: breadth, configurable: false, enumerable: true, writable: true }
            });    
    
            Object.seal(this);
        }
    
        BoxCollider.prototype = Object.create(null);
        Object.seal(BoxCollider.prototype);
    
        return BoxCollider;
    })();
    Object.seal(BoxCollider);
    
    /**
     * @name        Collider
     * @module      FWGE.Physics
     * @description This is the base object for collision objects
     */
    
    let Collider = (function()
    {
        /**
         * @param   {string}        name
         * @param   {Vector3}       position
         * @param   {PhysicsItem}   physicsitem
         */
        function Collider(name = 'Collider', position = Vector3.Zero, physicsitem = undefined)
        {
            Item.call(this, name);   
            
            Object.defineProperties(this,
            {
                /**
                 * @property    {Position}
                 * @type        {Vector3}
                 */
                Position: { value: position, configurable: false, enumerable: true, writable: false },
    
                /**
                 * @property    {PhysicsItem}
                 * @type        {PhysicsItem}
                 */
                PhysicsItem: { value: physicsitem, configurable: false, enumerable: true, writable: true }
            });
        }
    
        Collider.prototype = Object.create(null);
        Object.seal(Collider.prototype);
    
        return Collider;
    })();
    Object.seal(Collider);
    
    /**
     * @name        CollisionEvent
     * @module      FWGE.Physics
     * @description A collision event object
     */
    
    let CollisionEvent = (function()
    {
        /**
         * @param   {GameObject}    current
         * @param   {GameObject}    other
         * @param   {string}        type
         */
        function CollisionEvent(current, other, type)
        {
            Object.defineProperties(this,
            {
                /**
                 * @property    {Current}
                 * @type        {GameObject}
                 */
                Current: { value: current, configurable: false, enumerable: true, writable: false },
                
                /**
                 * @property    {Other}
                 * @type        {GameObject}
                 */
                Other: { value: other, configurable: false, enumerable: true, writable: false },
                
                /**
                 * @property    {Type}
                 * @type        {string}
                 */
                Type: { value: type, configurable: false, enumerable: true, writable: false },
                
                /**
                 * @property    {TimeStamp}
                 * @type        {string}
                 */
                TimeStamp: { value: new Date(Date.now()).toDateString(), configurable: false, enumerable: true, writable: false }
            });
    
            Object.seal(this);
        }
    
        CollisionEvent.prototype = Object.create(null);
        Object.seal(CollisionEvent.prototype);
    
        return CollisionEvent;
    })();
    Object.seal(CollisionEvent);
    
    /**
     * @name        SphereCollider
     * @module      FWGE.Physics
     * @description This is a sphere-shaped collision object
     */
    
    window.SphereCollider = (function()
    {
        /**
         * @param   {Object}    request
         * @param   {string}    request.name
         * @param   {Array}     request.position
         * @param   {number}    request.radius
         */
        function SphereCollider({name = 'Sphere Collider', position = Vector3.Zero, radius = 2} = {})
        {
            Collider.call(this, name, position);
    
            Object.defineProperties(this,
            {
                /**
                 * @property    {Radius}
                 * @type        {number}
                 */
                Radius:  { value: radius, configurable: false, enumerable: true, writable: true }
            });
    
            Object.seal(this);
        }
    
        SphereCollider.prototype = Object.create(null);
        Object.seal(SphereCollider.prototype);
    
        return SphereCollider;
    })();
    Object.seal(SphereCollider);
    
    /**
     * @name        PhysicsBody
     * @module      FWGE.Physics
     * @description This object provides the masic physical properties of an object.
     */
    
    window.PhysicsBody = (function()
    {
        /**
         * @param    {Object}   requext
         * @param    {string}   requext.name
         * @param    {number}   requext.mass
         * @param    {boolean}  requext.lockx
         * @param    {boolean}  requext.locky
         * @param    {boolean}  requext.lockz
         */
        function PhysicsBody({name = 'Physics Body', mass = 1, lockx = true, locky = true, lockz = true} = {})
        {
            Item.call(this, name);
    
            var _Grounded = true;
            var _Velocity = 0;
                
            Object.defineProperties(this,
            {
                /**
                 * @property    {Mass}
                 * @type        {Number}
                 */
                Mass: { value: mass, configurable: false, enumerable: true, writable: true },
    
                /**
                 * @property    {LockX}
                 * @type        {Boolean}
                 */
                LockX: { value: lockx, configurable: false, enumerable: true, writable: true },
    
                /**
                 * @property    {LockY} 
                 * @type        {Boolean}
                 */
                LockY: { value: locky, configurable: false, enumerable: true, writable: true },
    
                /**
                 * @property    {LockZ}
                 * @type        {Boolean}
                 */
                LockZ: { value: lockz, configurable: false, enumerable: true, writable: true },
    
                /**
                 * @property    {Grounded}
                 * @type        {Boolean}
                 */
                Grounded: { get: function get() { return _Grounded; } },
                
                /**
                 * @property    {Velocity}
                 * @type        {Number}
                 */
                Velocity: { get: function get() { return _Velocity; } }    
            });
    
            Object.seal(this);
        }
    
        PhysicsBody.prototype = Object.create(null);
        Object.seal(PhysicsBody.prototype);
    
        return PhysicsBody;
    })();
    Object.seal(PhysicsBody);
    
    /**
     * @name        PhysicsEngine
     * @module      FWGE
     * @description Something...
     */
    
    let PhysicsEngine = (function()
    {
        function PhysicsEngine()
        {
            Object.defineProperties(this,
            {        
                /**
                 * @property    {Gravity}
                 * @type        {Number}
                 * @description Gravity in m/s
                 */
                Gravity: { value: -9.8, configurable: false, enumerable: true, writable: false },
    
                /**
                 * @function    PhysicsUpdate
                 * @return      {undefined}
                 * @description Initializes the physics engine
                 */
                Update:
                { 
                    value: function Update()
                    {
                        var self = this;
                        GameObject.Objects.forEach(function(gameobject)
                        {
                            if (!!gameobject.Physics)
                            {
                                let body = gameobject.Physics.Body;
                                let material = gameobject.Physics.Material;
                                let collider = gameobject.Physics.Collider;
    
                                if (!body.Geounded && !body.LockY)
                                {
                                    let delta = (Time.Delta * self.Gravity) * 0.01;
                                    gameobject.Transform.Position.Y += delta;
                                }
                            }   
                        });
                    },
                    configurable: false, enumerable: false, writable: false },
            });
        }
        
        PhysicsEngine.prototype = Object.create(null);
        Object.seal(PhysicsEngine.prototype);
    
        return new PhysicsEngine()
    })();
    Object.seal(PhysicsEngine);
    
    /**
     * @name        PhysicsItem
     * @module      FWGE.Physics
     * @description Some random container
     */
    
    window.PhysicsItem = (function()
    {
        /**
         * @param   {Object}            request
         * @param   {string}            request.name
         * @param   {GameObject}        request.parent
         * @param   {PhysicsBody}       request.body
         * @param   {Collider}          request.collider
         * @param   {PhysicsMaterial}   request.material
         */
        function PhysicsItem({name = 'Physics Item', parent = undefined, body = undefined, collider = undefined, material = undefined} = {})
        {
            GameItem.call(this, name, parent);
    
            Object.defineProperties(this,
            {
                /**
                 * @property    {Collider}
                 * @type        {Collider}
                 */
                Collider: { value: collider, configurable: false, enumerable: true, writable: true },
    
                /**
                 * @property    {Material}
                 * @type        {PhysicsMaterial}
                 */
                Material: { value: material, configurable: false, enumerable: true, writable: true },
                
                /**
                 * @property    {Body}
                 * @type        {PhysicsBody}
                 */
                Body: { value: new PhysicsBody(body), configurable: false, enumerable: true, writable: true },
            });
    
            Object.seal(this);
        }
    
        PhysicsItem.prototype = Object.create(null);
        Object.seal(PhysicsItem.prototype);
    
        return PhysicsItem;
    })();
    Object.seal(PhysicsItem);
    
    /**
     * @name        PhysicsMaterial
     * @module      FWGE.Game
     * @description Some words of encouragement
     */
    
    window.PhysicsMaterial = (function()
    {
        /**
         * @param   {Object} request
         * @param   {string} request.name
         */
        function PhysicsMaterial({name = 'Physics Material'} = {})
        {
            Item.call(this, name);
    
            // TODO
    
            Object.seal(this);
        }
    
        PhysicsMaterial.prototype = Object.create(null);
        Object.seal(PhysicsMaterial.prototype);
    
        return PhysicsMaterial;
    })();
    Object.seal(PhysicsMaterial);
    
    /**
     * @name        Colour
     * @module      FWGE.Render
     * @description This module is used to create simple 3 valued arrays
     *              representing the rgb values of colours.
     */
    
    window.Colour = (function()
    {
        /**
         * @param   {number} red
         * @param   {number} green
         * @param   {number} blue
         * @param   {number} alpha
         */
        function Colour(red = 1, green = 1, blue = 1, alpha = 1)
        {
            BufferedArray.call(this, 4, Float32Array);
            this.Set(red, green, blue, alpha);
    
            Object.seal(this);
        }
        Object.defineProperties(Colour,
        {
            /**
             * @function    Clamp
             * @param       {number}    value
             * @return      {number}
             */
            Clamp: 
            {
                value: function Clamp(value)
                {
                    return value > 1 ? 1 : value < 0 ? 0 : value;
                },
                configurable: false, enumerable: false, writable: false
            },
    
            /**
             * @function    Set
             * @param       {Colour}    colour
             * @param       {number}    red
             * @param       {number}    green
             * @param       {number}    blue
             * @param       {number}    alpha
             * @return      {Colour}   
             */
            Set:
            {
                value: function Set(colour, red, green, blue, alpha)
                {
                    colour.R = red;
                    colour.G = green;
                    colour.B = blue;
                    colour.A = alpha;
    
                    return colour;
                }
            }
        });
    
        Colour.prototype = Object.create(null);
        Object.defineProperties(Colour.prototype,
        {
            constructor: { value: Colour },
    
            /**
             * @property    {R}
             * @type        {number}
             */
            R:
            { 
                get: function get() { return this.Buffer[0]; },
                set: function set(red) { this.Buffer[0] = Colour.Clamp(red); },
                configurable: false, enumerable: false
            },
            
            /**
             * @property    {G}
             * @type        {number}
             */
            G:
            { 
                get: function get() { return this.Buffer[1]; },
                set: function set(green) { this.Buffer[1] = Colour.Clamp(green); },
                configurable: false, enumerable: false
            },
            
            /**
             * @property    {B}
             * @type        {number}
             */
            B:
            { 
                get: function get() { return this.Buffer[2]; },
                set: function set(blue) { this.Buffer[2] = Colour.Clamp(blue); },
                configurable: false, enumerable: false
            },
            
            /**
             * @property    {A}
             * @type        {number}
             */
            A:
            { 
                get: function get() { return this.Buffer[3]; },
                set: function set(alpha) { this.Buffer[3] = Colour.Clamp(alpha); },
                configurable: false, enumerable: false
            },
    
            /**
             * @function    Set
             * @param       {number}    red
             * @param       {number}    green
             * @param       {number}    blue
             * @param       {number}    alpha
             * @return      {Colour}
             */
            Set:
            {
                value: function Set(red, green, blue, alpha)
                {
                    return Colour.Set(this, red, green, blue, alpha);
                }
            }
        });
        Object.seal(Colour.prototype);
    
        return Colour;
    })();
    Object.seal(Colour);
    
    /**
     * @name        Mesh
     * @module      FWGE.Render
     * @description The vertex array buffer containers
     */
    
    window.Mesh = (function()
    {
        /**
         * @param   {Object}    request
         * @param   {string}    request.name
         * @param   {Array}     request.position
         * @param   {Array}     request.uv
         * @param   {Array}     request.colouur
         * @param   {Array}     request.normal
         * @param   {Array}     request.index
         * @param   {Array}     request.wireframe
         */
        function Mesh({name = 'Mesh', position = undefined, uv = undefined, colour = undefined, normal = undefined, index = undefined, wireframe = undefined} = {})
        {
            Item.call(this, name);
    
            Object.defineProperties(this,
            {
                /**
                 * @constant    {PositionBuffer}
                 * @type        {WebGLBuffer}
                 */
                PositionBuffer: { value: FWGE.GL.createBuffer(), configurable: false, enumerable: true, writable: false },
    
                /**
                 * @constant    {UVBuffer}
                 * @type        {WebGLBuffer}
                 */
                UVBuffer: { value: !!uv ? FWGE.GL.createBuffer() : null, configurable: false, enumerable: true, writable: false },
    
                /**
                 * @constant    {ColourBuffer}
                 * @type        {WebGLBuffer}
                 */
                ColourBuffer: { value: FWGE.GL.createBuffer(), configurable: false, enumerable: true, writable: false },
    
                /**
                 * @constant    {NormalBuffer}
                 * @type        {WebGLBuffer}
                 */
                NormalBuffer: { value: !!normal ? FWGE.GL.createBuffer() : null, configurable: false, enumerable: true, writable: false },
                
                /**
                 * @constant    {IndexBuffer}
                 * @type        {WebGLBuffer}
                 */
                IndexBuffer: { value: FWGE.GL.createBuffer(), configurable: false, enumerable: true, writable: false },
                
                /**
                 * @constant    {IndexBuffer}
                 * @type        {WebGLBuffer}
                 */
                WireframeBuffer: { value: !!wireframe ? FWGE.GL.createBuffer() : null, configurable: false, enumerable: true, writable: false },
                
                /**
                 * @constant    {VertexCount}
                 * @type        {number}
                 */
                VertexCount: { value: !!index ? index.length : 0, configurable: false, enumerable: true, writable: false },
                
                /**
                 * @constant    {VertexCount}
                 * @type        {number}
                 */
                WireframeCount: { value: !!wireframe ? wireframe.length : 0, configurable: false, enumerable: true, writable: false },
    
                /**
                 * @property    {DrawWireframe}
                 * @type        {boolean}
                 */
                DrawWireframe: { value: false, configurable: false, enumerable: true, writable: true }
            });
    
            FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.PositionBuffer);
            FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(position), FWGE.GL.STATIC_DRAW);
            
            FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
            FWGE.GL.bufferData(FWGE.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), FWGE.GL.STATIC_DRAW);
            
            if (!colour || colour.length !== position.length)
                colour = position.map(function(){ return 1.0; });
    
            FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.ColourBuffer);
            FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(colour), FWGE.GL.STATIC_DRAW);
    
            if (!!this.WireframeBuffer)
            {
                FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, this.WireframeBuffer);
                FWGE.GL.bufferData(FWGE.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(wireframe), FWGE.GL.STATIC_DRAW);
            }
    
            if (!!this.UVBuffer)
            {
                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.UVBuffer);
                FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(uv), FWGE.GL.STATIC_DRAW);
            }
    
            if (!!this.NormalBuffer)
            {
                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.NormalBuffer);
                FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(normal), FWGE.GL.STATIC_DRAW);
            }
            
            Object.seal(this);
        }
    
        Mesh.prototype = Object.create(null);
        Object.seal(Mesh.prototype);
    
        return Mesh;
    })();
    Object.seal(Mesh);
    
    /**
     * @name        ModelView
     * @description This module handles the model view matrices of the
     *              objects within the scene by applying the appropriate
     *              transformations.
     */
    
    let ModelView = (function()
    {
        function ModelView()
        {
            var _Stack = new Array();
    
            Object.defineProperties(this,
            {
                /**
                 * @function    PushMatrix
                 * @return      {undefined}
                 */
                Push: 
                {
                    value: function Push()
                    {
                        _Stack.push(this.Peek());
                    }
                },
    
                /**
                 * @function    Peek
                 * @return      {Matrix4}
                 */
                Peek:
                {
                    value: function Peek()
                    {
                        if (_Stack.length === 0)
                            return Matrix4.Identity;
                        else
                            return _Stack[_Stack.length - 1];
                    }
                },
    
                /**
                 * @function    Pop
                 * @return      {Matrix4}
                 */
                Pop:
                {
                    value: function Pop()
                    {
                        if (_Stack.length === 0)
                            return Matrix4.Identity;
                        else
                            return _Stack.pop();
                    }
                },
    
                /**
                 * @function    Transform
                 * @param       {transform}
                 * @return      {undefined}
                 */
                Transform:
                {
                    value: function Transform(transform)
                    {
                        this.Peek().Set
                        (
                            this.Shear
                            (
                                this.Scale
                                (
                                    this.Rotate
                                    (
                                        this.Translate
                                        (
                                            this.Peek(),
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
                        return new Matrix4
                        (
                            matrix.M11, matrix.M12, matrix.M13, matrix.M14,
                            matrix.M21, matrix.M22, matrix.M23, matrix.M24,
                            matrix.M31, matrix.M32, matrix.M33, matrix.M34,
    
                            matrix.M11 * translation.X + matrix.M21 * translation.Y + matrix.M31 * translation.Z + matrix.M41,
                            matrix.M12 * translation.X + matrix.M22 * translation.Y + matrix.M32 * translation.Z + matrix.M42,
                            matrix.M13 * translation.X + matrix.M23 * translation.Y + matrix.M33 * translation.Z + matrix.M43,
                            matrix.M14 * translation.X + matrix.M24 * translation.Y + matrix.M34 * translation.Z + matrix.M44
                        );
                    }
                },
    
                /**
                 * @function    Rotate: {Float32Array}
                 * @description Returns a rotation matrix.
                 * @param       matrix:     {Float32Array}
                 * @param       rotation:   {Float32Array}
                 */
                Rotate:
                {
                    value: function Rotate(matrix, rotation)
                    {    
                        var rot = Matrix4.Identity;
                        let x = Maths.Radian(rotation.X);
                        let y = Maths.Radian(rotation.Y);
                        let z = Maths.Radian(rotation.Z);
    
                        return new Matrix4
                        (
                            Matrix4.Mult
                            (
                                Matrix4.Identity,
                                Math.cos(z), -Math.sin(z), 0.0, 0.0,
                                Math.sin(z),  Math.cos(z), 0.0, 0.0,
                                        0.0,          0.0, 1.0, 0.0,
                                        0.0,          0.0, 0.0, 1.0
                            ).Mult
                            (
                                Math.cos(y), 0.0, Math.sin(y), 0.0,
                                        0.0, 1.0,         0.0, 0.0,
                               -Math.sin(y), 0.0, Math.cos(y), 0.0,
                                        0.0, 0.0,         0.0, 1.0
    
                            ).Mult
                            (
                            
                                1.0,         0.0,          0.0, 0.0,
                                0.0, Math.cos(x), -Math.sin(x), 0.0,
                                0.0, Math.sin(x),  Math.cos(x), 0.0,
                                0.0,         0.0,          0.0, 1.0
                            ).Mult(matrix)
                        );
                    }
                },
    
                /**
                 * @function    Scale: {Float32Array}
                 * @description Returns a scaler matrix.
                 * @param       matrix:     {Float32Array}
                 * @param       scalers:    {Float32Array}
                 */
                Scale:
                {
                    value: function Scale(matrix, scalers)
                    {                    
                        return new Matrix4
                        (
                            matrix.M11 * scalers.X, matrix.M12 * scalers.X, matrix.M13 * scalers.X, matrix.M14 * scalers.X,
                            matrix.M21 * scalers.Y, matrix.M22 * scalers.Y, matrix.M23 * scalers.Y, matrix.M24 * scalers.Y,
                            matrix.M31 * scalers.Z, matrix.M32 * scalers.Z, matrix.M33 * scalers.Z, matrix.M34 * scalers.Z,
                                        matrix.M41,             matrix.M42,             matrix.M43,             matrix.M44
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
                        var phi   = Maths.Radian(angles.X);
                        var theta = Maths.Radian(angles.Y);
                        var rho   = Maths.Radian(angles.Z);
    
                        return new Matrix4
                        (
                                      1.0,             0.0, Math.tan(rho), 0.0,
                            Math.tan(phi),             1.0,           0.0, 0.0,
                                      0.0, Math.tan(theta),           1.0, 0.0,
                                      0.0,             0.0,           0.0, 1.0
                        ).Mult(matrix);
                    }
                }
            });
        }
        ModelView.prototype = Object.create(null);
    
        return new ModelView();
    })();
    Object.seal(ModelView);
    /**
     * @name Projection
     * @description This module handles the matrices regarding the camera's current
     *              view mode, and its orientation within the scene.
     * @module      FWGE.Render
     */
    
    let Projection = (function()
    {
        function Projection()
        {
            let self = this;
    
            function _Orthographic(left, right, top, bottom, near, far, theta, phi)
            {
                theta   = Maths.Cot(Maths.Radian(theta));
                phi     = Maths.Cot(Maths.Radian(phi));
    
                left    -= near * theta;
                right   -= near * theta;
                top     -= near * phi;
                bottom  -= near * phi;
    
                self.ViewerMatrix.Set
                (
    
                                2 / (right - left),                                0,                            0, 0,
                                                0,               2 / (top - bottom),                            0, 0,
                                            theta,                              phi,            -2 / (far - near), 0,
                    -(left + right) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
                );
                
            }
            
            function _Perspective(field_of_view, aspect_ratio, near, far)
            {
                var top     = near * Math.tan(Maths.Radian(field_of_view));
                var right   = top * aspect_ratio;
                
                var left    = -right;
                var bottom  = -top;
                var width   = right - left;
                var height  = top - bottom;
                var depth   = far - near;
    
                self.ViewerMatrix.Set
                (
    
                        2 * near / width,                       0,                         0,  0,
                                        0,       2 * near / height,                         0,  0,
                    (right + left) / width, (top + bottom) / height,     -(far + near) / depth, -1,
                                        0,                       0, -(2 * far * near) / depth,  1
                );
            }
            Object.defineProperties(this,
            {
                ViewerMatrix: { value: Matrix4.Identity, configurable: false, enumerable: true, writable: true },
                
                
                Update:
                {
                    value: function Update(mode, request)
                    {                            
                        switch (mode)
                        {
                            case CameraMode.PERSPECTIVE:
                                _Perspective
                                (
                                    request.FOV     ||  45,
                                    request.Aspect  ||  16 / 9,
                                    request.Near    ||  0.1,
                                    request.Far     ||  1000.1
                                );
                            break;
    
                            case CameraMode.ORTHOGRAPHIC:
                                _Orthographic
                                (
                                    request.Left    || -10,
                                    request.Right   ||  10,
                                    request.Top     ||  10,
                                    request.Bottom  || -10,
                                    request.Near    ||  0,
                                    request.Far     ||  20,
                                    request.Theta   ||  90,
                                    request.Phi     ||  90
                                );
                            break;
                        }
                    }
                }
            });
        }
    
        Projection.prototype = Object.create(null);
    
        return new Projection();
    })();
    Object.seal(Projection);
    /**
     * @name RenderEngine
     * @module      FWGE 
     * @description This module contains all the visual related aspects of the 
     *              game engine.
     */
    
    let RenderEngine = (function()
    {
        function RenderEngine()
        {
            Object.defineProperties(this,
            {
                /**
                 *  @function       RenderUpdate: {undefined}
                 *  @description    Updates the rendering to the screen
                 */
                Update:
                {
                    value: function Update()
                    {
                        Renderer.Render();
                        Projection.Update(Camera.Mode, Camera)
                    }
                }
            });
        }
    
        RenderEngine.prototype = Object.create(null);
        Object.seal(RenderEngine.prototype);
    
        return new RenderEngine();
    })();
    Object.seal(RenderEngine);
    
    /**
     * @name        Renderer
     * @module      FWGE.Render
     * @description This module handles the actual rendering of the scene to
     *              the screen.
     */
    
    let Renderer = (function()
    {
        function Renderer()
        {
            Object.defineProperties(this,
            {
                ProjectionMatrix: { value: Matrix4.Identity, configurable: false, enumerable: true, writable: true },
                ModelViewMatrix: { value: Matrix4.Identity, configurable: false, enumerable: true, writable: true },
                NormalMatrix: { value: Matrix3.Identity, configurable: false, enumerable: true, writable: true },
    
                WireframeShader:
                {
                    value:
                    {
                        name:           'Wireframe Shader',
                        height:         512,
                        width:          512,
                        vertexshader:   'attribute vec3 A_Position;struct Matrix{mat4 ModelView;mat4 Projection;};uniform Matrix U_Matrix;void main(void){gl_Position=U_Matrix.Projection*U_Matrix.ModelView*vec4(A_Position,1.0);gl_PointSize=10.0;}',
                        fragmentshader: 'precision mediump float;void main(void){gl_FragColor=vec4(0.0,1.0,0.0,1.0);}'
                    },
                    configurable: false, enumerable: true, writable: true
                },
                CombinedShader:
                {
                    value:
                    {
                        name:           'CombinedShader Shader',
                        height:         512,
                        width:          512,
                        vertexshader:   'attribute vec3 A_Position;struct Matrix{mat4 ModelView;mat4 Projection;};uniform Matrix U_Matrix;void main(void){gl_Position=U_Matrix.Projection*U_Matrix.ModelView*vec4(A_Position,1.0);gl_PointSize=10.0;}',
                        fragmentshader: 'precision mediump float;void main(void){gl_FragColor=vec4(0.0,1.0,0.0,1.0);}'
                    },
                    configurable: false, enumerable: true, writable: true
                },
    
                Render:
                {
                    value: function Render()
                    {
                        this.ClearBuffers();
    
                        for (var  i = 0, arr = GameObject.Objects; i < arr.length; ++i)
                        {
                            this.SetGlobalUniforms();
                            this.RenderObject(arr[i]);
                        }
    
                        //this.FinalDraw();
                    }
                },
    
                Init:
                {
                    value: function Init()
                    {
                        this.WireframeShader = new Shader(this.WireframeShader);    Shader.Shaders.pop();
                        this.CombinedShader = new Shader(this.CombinedShader);      Shader.Shaders.pop();
                
                        FWGE.GL.enable(FWGE.GL.DEPTH_TEST);
                        FWGE.GL.disable(FWGE.GL.BLEND);
                    }
                },
                
                ClearBuffers:
                {
                    value: function ClearBuffers()
                    {
                        var i = Shader.Shaders.length;
                        while (--i >= 0)
                        {
                            var shader = Shader.Shaders[i];
    
                            FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, shader.FrameBuffer);
                            FWGE.GL.viewport(0, 0, shader.Width, shader.Height);
                            FWGE.GL.clear(FWGE.GL.COLOR_BUFFER_BIT | FWGE.GL.DEPTH_BUFFER_BIT);
                        }
                        
                        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
                        FWGE.GL.viewport(0, 0, FWGE.GL.drawingBufferWidth, FWGE.GL.drawingBufferHeight);
                        FWGE.GL.clear(FWGE.GL.COLOR_BUFFER_BIT | FWGE.GL.DEPTH_BUFFER_BIT);
                    }
                },
                
                RenderObject:
                {
                    value: function RenderObject(gameObject)
                    {
                        ModelView.Push();
                        ModelView.Transform(gameObject.Transform);
                        var mv = new Float32Array(ModelView.Peek().Buffer);
    
                        for (var i = 0; i < gameObject.Children.length; ++i)
                            this.RenderObject(gameObject.Children[i]);
                        
                        if (!!gameObject.Mesh && !!gameObject.Material && !!gameObject.Material.Shader)
                        {
                            var shader = gameObject.Material.Shader;
    
                            FWGE.GL.useProgram(shader.Program);
                            
                            FWGE.GL.enableVertexAttribArray(shader.Attributes.Position);
                            if (shader.Attributes.Normal !== -1) FWGE.GL.enableVertexAttribArray(shader.Attributes.Normal);
                            if (shader.Attributes.Colour !== -1) FWGE.GL.enableVertexAttribArray(shader.Attributes.Colour);
                            if (shader.Attributes.UV !== -1) FWGE.GL.enableVertexAttribArray(shader.Attributes.UV);
    
                            if (gameObject.Material.Alpha !== 1.0)
                            {
                                FWGE.GL.enable(FWGE.GL.BLEND);
                                FWGE.GL.disable(FWGE.GL.DEPTH_TEST);
                                FWGE.GL.blendFunc(FWGE.GL.SRC_ALPHA, FWGE.GL.ONE);
                            }
                            
                            this.BindAttributes(gameObject.Mesh, shader.Attributes);
                            this.SetObjectUniforms(gameObject.Material, shader.Uniforms, mv);
                            this.Draw(gameObject.Mesh.VertexCount, shader.FrameBuffer);
                            if (!!gameObject.Mesh.WireframeBuffer && gameObject.Mesh.DrawWireframe) this.DrawWireframe(gameObject.Mesh, mv);
                            
                            if (gameObject.Material.Alpha !== 1.0)
                            {
                                FWGE.GL.enable(FWGE.GL.DEPTH_TEST);
                                FWGE.GL.disable(FWGE.GL.BLEND);
                            }
                    
                            FWGE.GL.disableVertexAttribArray(shader.Attributes.Position);
                            if (shader.Attributes.Normal !== -1) FWGE.GL.disableVertexAttribArray(shader.Attributes.Normal);
                            if (shader.Attributes.Colour !== -1) FWGE.GL.disableVertexAttribArray(shader.Attributes.Colour);
                            if (shader.Attributes.UV !== -1) FWGE.GL.disableVertexAttribArray(shader.Attributes.UV);
    
                            FWGE.GL.useProgram(null);
                        }
                            
                        ModelView.Pop();
                    }
                },
    
                BindAttributes:
                {
                    value: function BindAttributes(mesh, attributes)
                    {
                        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.PositionBuffer);
                        FWGE.GL.vertexAttribPointer(attributes.Position, 3, FWGE.GL.FLOAT, false, 0, 0);
                        
                        if (attributes.UV !== -1)
                        {
                            if (!!mesh.UVBuffer)
                            {
                                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.UVBuffer);
                                FWGE.GL.vertexAttribPointer(attributes.UV, 2, FWGE.GL.FLOAT, false, 0, 0);
                            }
                            else
                                FWGE.GL.disableVertexAttribArray(attributes.UV);
                        }
                        
                        if (attributes.Colour !== -1)
                        {
                            if (!!mesh.ColourBuffer)
                            {
                                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.ColourBuffer);
                                FWGE.GL.vertexAttribPointer(attributes.Colour, 3, FWGE.GL.FLOAT, false, 0, 0);                            
                            }
                            else
                                FWGE.GL.disableVertexAttribArray(attributes.Colour);
                        }
                        
                        if (attributes.Normal !== -1)
                        {
                            if (!!mesh.NormalBuffer)
                            {
                                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.NormalBuffer);
                                FWGE.GL.vertexAttribPointer(attributes.Normal, 3, FWGE.GL.FLOAT, false, 0, 0);
                            }
                            else
                                FWGE.GL.disableVertexAttribArray(attributes.Normal);
                        }
                        
                        FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);
                    }
                },
    
                SetObjectUniforms:
                {
                    value: function SetObjectUniforms(material, uniforms, mv)
                    {
                        FWGE.GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, mv);
                        FWGE.GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, this.CalculateNormalMatrix().Buffer);
    
                        FWGE.GL.uniform4fv(uniforms.Material.Ambient, material.Ambient.Buffer);
                        FWGE.GL.uniform4fv(uniforms.Material.Diffuse, material.Diffuse.Buffer);
                        FWGE.GL.uniform4fv(uniforms.Material.Specular, material.Specular.Buffer);
                        FWGE.GL.uniform1f(uniforms.Material.Shininess, material.Shininess);
                        FWGE.GL.uniform1f(uniforms.Material.Alpha, material.Alpha);
                    
                        if (!!material.ImageMap)
                        {
                            FWGE.GL.activeTexture(FWGE.GL.TEXTURE0);
                            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.ImageMap);
                            FWGE.GL.uniform1i(uniforms.Material.HasImage, 1);
                            FWGE.GL.uniform1i(uniforms.Sampler.Image, 0);
                        }
                        else
                        {
                            FWGE.GL.activeTexture(FWGE.GL.TEXTURE0);
                            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
                            FWGE.GL.uniform1i(uniforms.Material.HasImage, 0);
                        }
                        
                        if (!!material.BumpMap)
                        {
                            FWGE.GL.activeTexture(FWGE.GL.TEXTURE1);
                            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.BumpMap);
                            FWGE.GL.uniform1i(uniforms.Material.HasBump, 1);
                            FWGE.GL.uniform1i(uniforms.Sampler.Bump, 1);
                        }
                        else
                        {
                            FWGE.GL.activeTexture(FWGE.GL.TEXTURE1);
                            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
                            FWGE.GL.uniform1i(uniforms.Material.HasBump, 0);
                        }
                        
                        if (!!material.SpecularMap)
                        {
                            FWGE.GL.activeTexture(FWGE.GL.TEXTURE2);
                            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.SpecularMap);
                            FWGE.GL.uniform1i(uniforms.Material.HasSpecular, 1);
                            FWGE.GL.uniform1i(uniforms.Sampler.Specular, 2);
                        }
                        else
                        {
                            FWGE.GL.activeTexture(FWGE.GL.TEXTURE2);
                            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
                            FWGE.GL.uniform1i(uniforms.Material.HasBump, 0);
                        }
                    }
                },
    
                SetGlobalUniforms:
                {
                    value: function SetGlobalUniforms()
                    {            
                        var i = Shader.Shaders.length;
                        while (--i >= 0)
                        {
                            var point_count = 0;
                            
                            FWGE.GL.useProgram(Shader.Shaders[i].Program);
                            var uniforms = Shader.Shaders[i].Uniforms.Light;
                            
                            for (var j = 0; j < Lights.length; ++j)
                            {
                                var light = Lights[j];
                                
                                if (light instanceof AmbientLight)
                                {
                                    FWGE.GL.uniform4fv(uniforms.Ambient.Colour, light.Colour.Buffer);
                                    FWGE.GL.uniform1f(uniforms.Ambient.Intensity, light.Intensity);
                                }
                                else if (light instanceof DirectionalLight)
                                {
                                    FWGE.GL.uniform4fv(uniforms.Directional.Colour, light.Colour.Buffer);
                                    FWGE.GL.uniform1f(uniforms.Directional.Intensity, light.Intensity);
                                    FWGE.GL.uniform3fv(uniforms.Directional.Direction, light.Direction.Buffer);
                                }
                                else if (light instanceof PointLight)
                                {
                                    FWGE.GL.uniform4fv(uniforms.Point[point_count].Colour, light.Colour.Buffer);
                                    FWGE.GL.uniform1f(uniforms.Point[point_count].Intensity, light.Intensity);
                                    FWGE.GL.uniform3fv(uniforms.Point[point_count].Position, light.Position.Buffer);
                                    FWGE.GL.uniform1f(uniforms.Point[point_count].Radius, light.Radius);
                                    FWGE.GL.uniform1f(uniforms.Point[point_count].Angle, light.Angle);
    
                                    point_count++;
                                }
                            }
    
                            FWGE.GL.uniform1i(uniforms.PointCount, point_count);
                            
                            // SET UNIFORM FOR NUMBER OF POINT LIGHTS
                            FWGE.GL.uniformMatrix4fv(Shader.Shaders[i].Uniforms.Matrix.Projection, false, Projection.ViewerMatrix.Buffer);
                        }
                        
                        FWGE.GL.useProgram(null);
                    }
                },
    
                CalculateNormalMatrix:
                {
                    value: function CalculateNormalMatrix()
                    {
                        let mat = new Matrix4(ModelView.Peek());
                        mat.Inverse();
    
                        return new Matrix3
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
                        //FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, framebuffer);
                        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
                        FWGE.GL.drawElements(FWGE.GL.TRIANGLES, vertexCount, FWGE.GL.UNSIGNED_SHORT, 0);
                        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
                    }
                },
                    
                DrawWireframe:
                {
                    value: function DrawWireframe(mesh, mv)
                    {
                        FWGE.GL.useProgram(this.WireframeShader.Program);
                        
                        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.PositionBuffer);
                        FWGE.GL.vertexAttribPointer(this.WireframeShader.Attributes.Position, 3, FWGE.GL.FLOAT, false, 0, 0);
                        FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, mesh.WireframeBuffer);
                        
                        FWGE.GL.uniformMatrix4fv(this.WireframeShader.Uniforms.Matrix.ModelView, false, mv);
                        FWGE.GL.uniformMatrix4fv(this.WireframeShader.Uniforms.Matrix.Projection, false, Projection.ViewerMatrix.Buffer);
                        //FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, framebuffer);
                        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
                        FWGE.GL.drawElements(FWGE.GL.LINES, mesh.WireframeCount, FWGE.GL.UNSIGNED_SHORT, 0);
                        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
                        FWGE.GL.useProgram(null);
                    }
                }
                /*FinalDraw(): void
                {
                    FWGE.GL.useProgram(_Shader.Program);
                    FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
    
                    FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, _Shader.PositionBuffer);
                    FWGE.GL.vertexAttribPointer(_Shader.PositionPointer, 3, FWGE.GL.FLOAT, false, 0, 0);
    
                    FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, _Shader.UVBuffer);
                    FWGE.GL.vertexAttribPointer(_Shader.UVPointer, 2, FWGE.GL.FLOAT, false, 0, 0);
    
                    FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, _Shader.IndexBuffer);
    
                    FWGE.GL.uniformMatrix4fv(_Shader.ModelView, false, ModelView.Peek().Buffer);
                    FWGE.GL.uniformMatrix4fv(_Shader.Projection, false, Projection.GetViewer());
    
                    var i =Shader.Shaders.length;
                    FWGE.GL.uniform1i(_Shader.SamplerCount, 1);
                    FWGE.GL.activeTexture(FWGE.GL.TEXTURE0);
                    FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, Shader.Shaders[0].Texture);
                    FWGE.GL.uniform1i(_Shader.Samplers[0], 0);
    
                    while (--i >= 0)
                    {
                        FWGE.GL.activeTexture(FWGE.GL.TEXTURE0 + i);
                        FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, Shader.Shaders[i].Texture);
                        FWGE.GL.uniform1i(_Shader.Samplers[i], i);
                    }
                    
                    FWGE.GL.drawElements(FWGE.GL.TRIANGLES, 6, FWGE.GL.UNSIGNED_SHORT, 0);
                    
                    FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
                    FWGE.GL.useProgram(null);
                }*/
            });
        }
        Renderer.prototype = Object.create(null);
    
        return new Renderer();
    })();
    Object.seal(Renderer);
    /**
     * @name        Material
     * @module      FWGE.Render
     * @description This object defines how the mesh in a gameobject will look
     *              like when rendered to a screen.
     */
    
    window.RenderMaterial = (function()
    {
        /**
         * @param   {Object}    request
         * @param   {string}    request.name
         * @param   {Array}     request.ambient
         * @param   {Array}     request.diffuse
         * @param   {Array}     request.specular
         * @param   {number}    request.alpha
         * @param   {number}    request.shininess
         * @param   {Shader}    request.shader
         */
        function RenderMaterial({name = 'Render Material', ambient = [0.50, 0.50, 0.50, 1.00], diffuse = [0.75, 0.75, 0.75, 1.00], specular = [1.00, 1.00, 1.00, 1.00], alpha = 1, shininess = 5, shader = undefined, texture = undefined} = {})
        {
            Item.call(this, name);
    
            Object.defineProperties(this,
            {
                /**
                 * @property    {Ambient}
                 * @type        {Colour}
                 */
                Ambient: { value: new Colour(ambient[0], ambient[1], ambient[2], ambient[3]), configurable: false, enumerable: true, writable: false },
                
                /**
                 * @property    {Diffuse}
                 * @type        {Colour}
                 */
                Diffuse: { value: new Colour(diffuse[0], diffuse[1], diffuse[2], diffuse[3]), configurable: false, enumerable: true, writable: false },
                
                /**
                 * @property    {Specular}
                 * @type        {Colour}
                 */
                Specular: { value: new Colour(specular[0], specular[1], specular[2], specular[3]), configurable: false, enumerable: true, writable: false },
                
                /**
                 * @property    {Alpha}
                 * @type        {number}
                 */
                Alpha: { value: alpha, configurable: false, enumerable: true, writable: true },
                
                /**
                 * @property    {Shininess}
                 * @type        {number}
                 */
                Shininess: { value: shininess, configurable: false, enumerable: true, writable: true },
                
                /**
                 * @property    {Shader}
                 * @type        {Shader}
                 */
                Shader: { value: shader, configurable: false, enumerable: true, writable: true },
    
                
                /**
                 * @property    {ImageMap}
                 * @type        {WebGLTexture}
                 */
                ImageMap: { value: null, configurable: false, enumerable: true, writable: true },
                
                /**
                 * @property    {BumpMap}
                 * @type        {WebGLTexture}
                 */
                BumpMap: { value: null, configurable: false, enumerable: true, writable: true },
                
                /**
                 * @property    {SpecularMap}
                 * @type        {WebGLTexture}
                 */
                SpecularMap: { value: null, configurable: false, enumerable: true, writable: true },
            });
    
            Object.seal(this);
            this.SetTextures(texture);
        }
        Object.defineProperties(RenderMaterial,
        {
            /**
             * @function    IsPowerOf2
             * @param       {number}    value
             * @return      {boolean}
             */
            IsPowerOf2:
            {
                value: function IsPowerOf2(value)
                {
                    return (value & (value - 1)) == 0;
                }
            },
    
            /**
             * @function    ApplyImage
             * @param       {string}            src
             * @param       {RenderMaterial}    material
             * @param       {string}            type
             * @return      {undefined}
             */
            ApplyImage:
            {
                value: function ApplyImage(src, material, type)
                {
                    var img = new Image();
                    var texture = null;
    
                    switch(type)
                    {
                        case 'image':
                            material.ImageMap = FWGE.GL.createTexture();
                            texture = material.ImageMap;
                        break;
    
                        case 'bump':
                            material.BumpMap = FWGE.GL.createTexture();
                            texture = material.BumpMap;
                        break;
    
                        case 'specular':
                            material.SpecularMap = FWGE.GL.createTexture();
                            texture = material.SpecularMap;
                        break;
    
                        default: texture = null;
                    }
    
                    FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, texture);
                    FWGE.GL.texImage2D(FWGE.GL.TEXTURE_2D, 0, FWGE.GL.RGBA, 1, 1, 0, FWGE.GL.RGBA, FWGE.GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
    
                    img.onload = function()
                    {
                        FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, texture);
                        FWGE.GL.texImage2D(FWGE.GL.TEXTURE_2D, 0, FWGE.GL.RGBA, FWGE.GL.RGBA, FWGE.GL.UNSIGNED_BYTE, img);
    
                        // then either generate mips if the image uses power-of-2 dimensions or 
                        // set the filtering correctly for non-power-of-2 images.
                        if (RenderMaterial.IsPowerOf2(img.width) && RenderMaterial.IsPowerOf2(img.height))
                        {
                            FWGE.GL.generateMipmap(FWGE.GL.TEXTURE_2D);
                            FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_MAG_FILTER, FWGE.GL.LINEAR);
                            FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_MIN_FILTER, FWGE.GL.LINEAR_MIPMAP_NEAREST);
                        }
                        else
                        {
                            FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_WRAP_S, FWGE.GL.CLAMP_TO_EDGE);
                            FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_WRAP_T, FWGE.GL.CLAMP_TO_EDGE);
                            FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_MIN_FILTER, FWGE.GL.LINEAR);
                        }
    
                        //FWGE.GL.pixelStorei(FWGE.GL.UNPACK_FLIP_Y_WEBGL, true);                
                        FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
                    };
                    img.src = src;
                }
            }
        });
    
        RenderMaterial.prototype = Object.create(null);
        Object.defineProperties(RenderMaterial.prototype,
        {
            /**
             * @function    SetTextures
             * @param       {Object}    request
             * @param       {String}    request.imagemap
             * @param       {String}    request.bumpmap
             * @param       {String}    request.specularmap
             * @return      {undefined}
             */
            SetTextures: 
            { 
                value: function SetTextures({imagemap = undefined, bumpmap = undefined, specularmap = undefined} = {})
                {
                    if (!!imagemap)
                    {
                        if (!!this.ImageMap)
                            FWGE.GL.deleteTexture(this.ImageMap);
    
                        RenderMaterial.ApplyImage(imagemap, this, 'image');
                    }
                    if (!!bumpmap)
                    {
                        if (!!this.BumpMap)
                            FWGE.GL.deleteTexture(this.BumpMap);
    
                        RenderMaterial.ApplyImage(bumpmap, this, 'bump');
                    }
                    if (!!specularmap)
                    {
                        if (!!this.SpecularMap)
                            FWGE.GL.deleteTexture(this.SpecularMap);
    
                        RenderMaterial.ApplyImage(specularmap, this, 'specular');
                    }
                }
            }
        });
        Object.seal(RenderMaterial.prototype);
    
        return RenderMaterial;
    })();
    Object.seal(RenderMaterial);
    
    /**
     * @param {WebGLRenderingContext}   GL 
     * @param {WebGLProgram}            Program 
     */
    function ShaderAttributes(GL, Program)
    {
        Object.defineProperties(this,
        {
            /**
             * @property    {Position}
             * @type        {number}
             */
            Position:   { value: GL.getAttribLocation(Program, 'A_Position'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Colour}
             * @type        {number}
             */
            Colour:     { value: GL.getAttribLocation(Program, 'A_Colour'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {UV}
             * @type        {number}
             */
            UV:         { value: GL.getAttribLocation(Program, 'A_UV'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Normal}
             * @type        {number}
             */
            Normal:     { value: GL.getAttribLocation(Program, 'A_Normal'), configurable: false, enumerable: true, writable: false },
        });
    
        Object.seal(this);
    }
    Object.seal(ShaderAttributes);
    
    ShaderAttributes.prototype = Object.create(null);
    Object.seal(ShaderAttributes.prototype);
    
    /**
     * @param {WebGLRenderingContext}   GL
     * @param {WebGLProgram}            Program
     */
    function ShaderUniforms(GL, Program)
    {
        Object.defineProperties(this,
        {
            /**
             * @property    {Material}
             * @type        {WebGLUniformLocations}
             */
            Material:   { value:  new MaterialUniforms(GL,  Program), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Matrix}
             * @type        {WebGLUniformLocations}
             */
            Matrix: { value:  new MatrixUniforms(GL,    Program), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Light}
             * @type        {WebGLUniformLocations}
             */
            Light:  { value:  new LightUniforms(GL,     Program), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Sampler}
             * @type        {WebGLUniformLocations}
             */
            Sampler:    { value:  new SamplerUniforms(GL,   Program), configurable: false, enumerable: true, writable: false }
        });
     
        Object.seal(this);
    }
    Object.seal(ShaderUniforms);
    
    ShaderUniforms.prototype = Object.create(null);
    Object.seal(ShaderUniforms.prototype);
    
    /**
     * @param {WebGLRenderingContext}   GL
     * @param {WebGLProgram}            Program
     */
    function AmbientUniforms(GL, Program)
    {
        Object.defineProperties(this,
        {
            /**
             * @property    {Colour}
             * @type        {WebGLUniformLocations}
             */
            Colour: {value: GL.getUniformLocation(Program, 'U_Ambient.Colour'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Intensity}
             * @type        {WebGLUniformLocations}
             */
            Intensity: {value: GL.getUniformLocation(Program, 'U_Ambient.Intensity'), configurable: false, enumerable: true, writable: false }
        });
     
        Object.seal(this);
    }
    Object.seal(AmbientUniforms);
    
    AmbientUniforms.prototype = Object.create(null);
    Object.seal(AmbientUniforms.prototype);
    
    /**
     * @param {WebGLRenderingContext}   GL
     * @param {WebGLProgram}            Program
     */
    function DirectionalUniforms(GL, Program)
    {
        Object.defineProperties(this,
        {
            /**
             * @property    {Colour}
             * @type        {WebGLUniformLocations}
             */
            Colour: { value: GL.getUniformLocation(Program, 'U_Directional.Colour'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Intensity}
             * @type        {WebGLUniformLocations}
             */
            Intensity: { value: GL.getUniformLocation(Program, 'U_Directional.Intensity'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Direction}
             * @type        {WebGLUniformLocations}
             */
            Direction: { value: GL.getUniformLocation(Program, 'U_Directional.Direction'), configurable: false, enumerable: true, writable: false }
        });
     
        Object.seal(this);
    }
    Object.seal(DirectionalUniforms);
    
    DirectionalUniforms.prototype = Object.create(null);
    Object.seal(DirectionalUniforms.prototype);
    
    /**
     * @param {WebGLRenderingContext}   GL
     * @param {WebGLProgram}            Program
     */
    function LightUniforms(GL, Program)
    {
        Object.defineProperties(this,
        {
            /**
             * @property    {Ambient}
             * @type        {WebGLUniformLocations}s
             */
            Ambient: { value: new AmbientUniforms(GL, Program), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Directional}
             * @type        {WebGLUniformLocations}
             */
            Directional: { value: new DirectionalUniforms(GL, Program), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {PointCount}
             * @type        {WebGLUniformLocations}
             */
            PointCount: { value: GL.getUniformLocation(Program, `U_Point_Count`), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Point}
             * @type        {WebGLUniformLocations}
             */
            Point: { value: [], configurable: false, enumerable: true, writable: false }
    
        });
    
        for (var i = 0; i < 8; ++i)
            this.Point.push(new PointUniforms(GL, Program, i));
     
        Object.seal(this);
    }
    Object.seal(LightUniforms);
    
    LightUniforms.prototype = Object.create(null);
    Object.seal(LightUniforms.prototype);
    
    /**
     * @param {WebGLRenderingContext}   GL
     * @param {WebGLProgram}            Program
     * @param {number}                  index
     */
    function PointUniforms(GL, Program, index)
    {
        Object.defineProperties(this,
        {
            /**
             * @property    {Colour}
             * @type        {WebGLUniformLocations}
             */
            Colour: { value: GL.getUniformLocation(Program, `U_Point[${index}].Colour`), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Intensity}
             * @type        {WebGLUniformLocations}
             */
            Intensity:  { value: GL.getUniformLocation(Program, `U_Point[${index}].Intensity`), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Position}
             * @type        {WebGLUniformLocations}
             */
            Position:   { value: GL.getUniformLocation(Program, `U_Point[${index}].Position`), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Radius}
             * @type        {WebGLUniformLocations}
             */
            Radius: { value: GL.getUniformLocation(Program, `U_Point[${index}].Radius`), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Angle}
             * @type        {WebGLUniformLocations}
             */
            Angle:  { value: GL.getUniformLocation(Program, `U_Point[${index}].Angle`), configurable: false, enumerable: true, writable: false }
        });
     
        Object.seal(this);
    }
    Object.seal(PointUniforms);
    
    PointUniforms.prototype = Object.create(null);
    Object.seal(PointUniforms.prototype);
    
    /**
     * @param {WebGLRenderingContext}   GL 
     * @param {WebGLProgram}            Program 
     */
    function MaterialUniforms(GL, Program)
    {
        Object.defineProperties(this,
        {
            /**
             * @property    {Ambient}
             * @type        {WebGLUniformLocations}
             */
            Ambient:    { value: GL.getUniformLocation(Program, 'U_Material.Ambient'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Diffuse}
             * @type        {WebGLUniformLocations}
             */
            Diffuse:    { value: GL.getUniformLocation(Program, 'U_Material.Diffuse'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Specular}
             * @type        {WebGLUniformLocations}
             */
            Specular:   { value: GL.getUniformLocation(Program, 'U_Material.Specular'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Shininess}
             * @type        {WebGLUniformLocations}
             */
            Shininess:  { value: GL.getUniformLocation(Program, 'U_Material.Shininess'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Alpha}
             * @type        {WebGLUniformLocations}
             */
            Alpha:      { value: GL.getUniformLocation(Program, 'U_Material.Alpha'), configurable: false, enumerable: true, writable: false },
    
            
            /**
             * @property    {HasImage}
             * @type        {WebGLUniformLocations}
             */
            HasImage:    { value: GL.getUniformLocation(Program, 'U_Material.HasImage'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {HasBump}
             * @type        {WebGLUniformLocations}
             */
            HasBump:     { value: GL.getUniformLocation(Program, 'U_Material.HasBump'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {HasSpecular}
             * @type        {WebGLUniformLocations}
             */
            HasSpecular: { value: GL.getUniformLocation(Program, 'U_Material.HasSpecular'), configurable: false, enumerable: true, writable: false }
        });
        
        Object.seal(this);
    }
    Object.seal(MaterialUniforms);
    
    MaterialUniforms.prototype = Object.create(null);
    Object.seal(MaterialUniforms.prototype);
    
    /**
     * @param {WebGLRenderingContext}   GL 
     * @param {WebGLProgram}            Program 
     */
    function MatrixUniforms(GL, Program)
    {
        Object.defineProperties(this,
        {
            /**
             * @property    {ModelView}
             * @type        {WebGLUniformLocations}
             */
            ModelView:  { value: GL.getUniformLocation(Program, 'U_Matrix.ModelView'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Projection}
             * @type        {WebGLUniformLocations}
             */
            Projection: { value: GL.getUniformLocation(Program, 'U_Matrix.Projection'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Normal}
             * @type        {WebGLUniformLocations}
             */
            Normal:     { value: GL.getUniformLocation(Program, 'U_Matrix.Normal'), configurable: false, enumerable: true, writable: false },
    
            /**
             * @property    {Camera}
             * @type        {WebGLUniformLocations}
             */
            Camera:     { value: GL.getUniformLocation(Program, 'U_Matrix.Camera'), configurable: false, enumerable: true, writable: false }
        });
        
        Object.seal(this);
    }
    Object.seal(MatrixUniforms);
    
    MatrixUniforms.prototype = Object.create(null);
    Object.seal(MatrixUniforms.prototype);
    
    /**
     * @param {WebGLRenderingContext}   GL
     * @param {WebGLProgram}            Program
     */
    function SamplerUniforms(GL, Program)
    {
        Object.defineProperties(this,
        {
            /**
             * @property    {Image}
             * @type        {WebGLUniformLocations}
             */
            Image:  { value: GL.getUniformLocation(Program, 'U_Sampler.Image'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Bump}
             * @type        {WebGLUniformLocations}
             */
            Bump:   { value: GL.getUniformLocation(Program, 'U_Sampler.Bump'), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Specular}
             * @type        {WebGLUniformLocations}
             */
            Specular:   { value: GL.getUniformLocation(Program, 'U_Sampler.Specular'), configurable: false, enumerable: true, writable: false }
        });
     
        Object.seal(this);
    }
    Object.seal(SamplerUniforms);
    
    SamplerUniforms.prototype = Object.create(null);
    Object.seal(SamplerUniforms.prototype);
    
    /**
     * @name        Shader
     * @module      FWGE.Render
     * @description This object links with the vertex and fragment shaders
     */
    
    window.Shader = (function()
    {
        /**
         * @param       {Object}    request
         * @param       {string}    request.name
         * @param       {number}    request.height
         * @param       {number}    request.width
         * @param       {string}    request.vertexshader
         * @param       {string}    request.fragemntshader
         */
        function Shader({name = 'Shader', height = 1024, width = 1024, vertexshader = '', fragmentshader = ''} = {})
        {
            Item.call(this, name);
    
            Object.defineProperties(this,
            {
                /**
                 * @property    {Program}
                 * @type        {WebGLProgram}
                 */
                Program: { value: FWGE.GL.createProgram(), configurable: false, enumerable: true, writable: false },
                
                /**
                 * @property    {Texture}
                 * @type        {WebGLTexture}
                 */
                Texture: { value: FWGE.GL.createTexture(), configurable: false, enumerable: true, writable: false },
                
                /**
                 * @property    {FrameBuffer}
                 * @type        {WebGLFramebuffer}
                 */
                FrameBuffer: { value: FWGE.GL.createFramebuffer(), configurable: false, enumerable: true, writable: false },
                
                /**
                 * @property    {RenderBuffer}
                 * @type        {WebGLRenderbuffer}
                 */
                RenderBuffer: { value: FWGE.GL.createRenderbuffer(), configurable: false, enumerable: true, writable: false },
                
                /**
                 * @property    {Height}
                 * @type        {Number}
                 */
                Height: { value: height, configurable: false, enumerable: true, writable: false },
                
                /**
                 * @property    {Width}
                 * @type        {Number}
                 */
                Width: { value: width, configurable: false, enumerable: true, writable: false },
            });
    
            if (Shader.Init(this, FWGE.GL, vertexshader, fragmentshader))
            {
                FWGE.GL.useProgram(this.Program);
    
                Object.defineProperties(this,
                {
                    /**
                     * @property    {Attributes}
                     * @type        {ShaderAttributes}
                     */
                    Attributes: { value: new ShaderAttributes(FWGE.GL, this.Program), configurable: false, enumerable: true, writable: false },
    
                    /**
                     * @property    {Uniforms}
                     * @type        {ShaderUniforms}
                     */
                    Uniforms: { value: new ShaderUniforms(FWGE.GL, this.Program), configurable: false, enumerable: true, writable: false }
                });
    
                FWGE.GL.useProgram(null);
            }
    
            Shader.Shaders.push(this);
        
            Object.seal(this);
        };
        Object.defineProperties(Shader,
        {
            Shaders: { value: new Array(), configurable: false, enumerable: false, writable: false },
            
            /**
             * @function    Init
             * @param       {Shader}                shader
             * @param       {WebGLRenderingContext} GL
             * @param       {string}                vertexshader
             * @param       {string}                fragmentshader
             * @return      {boolean}
             */
            Init:
            {
                value: function Init(shader, GL, vertexShader, fragmentShader)
                {
                    GL.bindFramebuffer(GL.FRAMEBUFFER, shader.FrameBuffer); 
                    GL.bindRenderbuffer(GL.RENDERBUFFER, shader.RenderBuffer);
                    GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, shader.Width, shader.Height);
                    GL.bindTexture(GL.TEXTURE_2D, shader.Texture);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
                    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, shader.Width, shader.Height, 0, GL.RGBA, GL.UNSIGNED_BYTE, undefined);
                    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, shader.Texture, 0);
                    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, shader.RenderBuffer);  
                                
                    GL.bindTexture(GL.TEXTURE_2D, null);
                    GL.bindRenderbuffer(GL.RENDERBUFFER, null);
                    GL.bindFramebuffer(GL.FRAMEBUFFER, null);        
                    
                    var vs = GL.createShader(GL.VERTEX_SHADER);
                    GL.shaderSource(vs, vertexShader);
                    GL.compileShader(vs);
                    if (!GL.getShaderParameter(vs, GL.COMPILE_STATUS))
                    {
                        console.error(new Error('Vertex Shader: ' + GL.getShaderInfoLog(vs)));
                        return false;
                    }
                    
                    var fs = GL.createShader(GL.FRAGMENT_SHADER);
                    GL.shaderSource(fs, fragmentShader);
                    GL.compileShader(fs);
                    if (!GL.getShaderParameter(fs, GL.COMPILE_STATUS))
                    {
                        console.error(new Error('Fragment Shader: ' + GL.getShaderInfoLog(fs)));
                        return false;
                    }
                    
                    GL.attachShader(shader.Program, vs);
                    GL.attachShader(shader.Program, fs);
                    GL.linkProgram(shader.Program);
                    if (!GL.getProgramParameter(shader.Program, GL.LINK_STATUS))
                        return false;
    
                    return true;
                },
                configurable: false, enumerable: false, writable: false
            }
        });
    
        Shader.prototype = Object.create(null);
        Object.seal(Shader.prototype);
    
        return Shader;
    })();
    Object.seal(Shader);
    
    /**
     * @name        FWGE
     * @module      window
     * @description This is the main object used to handle the system.
     *              All control, of the game, rendering, and physcis engines are through
     *              this obejct.
     */
    
    window.FWGE = (function()
    {
        function FWGE()
        {
            let _GL = undefined;
    
            Object.defineProperties(this,
            {
                /**
                 * @property    {GL}
                 * @type        {WebGLRenderingContext}
                 */
                GL: { get: function get() { return _GL; }, configurable: false, enumerable: false },
    
                /**
                 * @function    Init
                 * @param       {Object}            request
                 * @param       {HTMLCanvasElement} request.canvas
                 * @param       {number}            request.height
                 * @param       {number}            request.width
                 * @param       {Array<number>}     request.clear
                 * @return      {undefined}
                 */
                Init:
                {
                    value: function Init({canvas = undefined, height = 480, width = 640, clear = [0, 0, 0, 1]} = {})
                    {
                        if (!canvas)
                            throw new Error('Field {canvas: HTMLCanvasElement} is required');
    
                        _GL = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
                        if (!_GL)
                            throw new Error('Webgl context could not be initialized.');
                        
                        Input.Init(canvas);
                        Renderer.Init();
                        _GL.clearColor(clear[0], clear[1], clear[2], clear[3]);
                    },
                    configurable: false, enumerable: true, writable: false
                },
    
                /**
                 * @function    Start
                 * @return      {undefined}
                 */
                Start:
                {
                    value: function Start()
                    {
                        GameEngine.Start();
                    },
                    configurable: false, enumerable: true, writable: false
                },
    
                /**
                 * @function    Pause
                 * @return      {undefined}
                 */
                Pause:
                {
                    value: function Pause()
                    {
                        GameEngine.Pause();
                    },
                    configurable: false, enumerable: true, writable: false
                },
    
                /**
                 * @function    Stop
                 * @return      {undefined}
                 */
                Stop:
                {
                    value: function Stop()
                    {
                        GameEngine.Stop();
                    },
                    configurable: false, enumerable: true, writable: false
                }        
            });
    
            Object.seal(this);
        }
    
        FWGE.prototype = Object.create(null);
        Object.seal(FWGE.prototype);
        
        return new FWGE();
    })();
    Object.seal(FWGE);
    

})(window);
