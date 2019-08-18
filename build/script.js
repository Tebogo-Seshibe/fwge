(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Camera_1 = __importDefault(require("../../src/Camera/Camera"));
const FWGE_1 = __importDefault(require("../../src/FWGE"));
const Equation_1 = require("../../src/Maths/Equation");
const ParticleSystem_1 = __importDefault(require("../../src/ParticleSystem"));
const Shader_1 = __importDefault(require("../../src/Shader/Shader"));
const Control_1 = __importDefault(require("../../src/Utility/Control"));
const OBJConverter_1 = __importDefault(require("../../src/Utility/Converter/OBJConverter"));
const List_1 = __importDefault(require("../../src/Utility/List"));
const Colour4_1 = __importDefault(require("../../src/Render/Colour4"));
const FragmentShader_1 = __importDefault(require("../../src/Shader/Definition/FragmentShader"));
const VertexShader_1 = __importDefault(require("../../src/Shader/Definition/VertexShader"));
const Time_1 = __importDefault(require("../../src/Utility/Time"));
const ShaderTypes_1 = require("../../src/Shader/Definition/ShaderTypes");
let fwge = window;
fwge.Control = Control_1.default;
fwge.Camera = Camera_1.default;
fwge.FWGE = FWGE_1.default;
fwge.List = List_1.default;
fwge.lights = {};
fwge.object = undefined;
fwge.VertexShader = VertexShader_1.default;
fwge.FragmentShader = FragmentShader_1.default;
fwge.Var = Equation_1.Var;
fwge.Unary = Equation_1.Unary;
fwge.Binary = Equation_1.Binary;
window.onload = () => {
    let canvas = document.getElementById('canvas');
    FWGE_1.default.Init({
        canvas,
        clear: [0, 0, 0, 0],
        physcisupdate: 30,
        renderupdate: 75
    });
    makeShader();
};
function makeCube() {
    return __awaiter(this, void 0, void 0, function* () {
        let obj = yield (yield fetch('/res/Objects/Cube/Cube.obj')).text();
        let mtl = yield (yield fetch('/res/Objects/Cube/Cube.mtl')).text();
        let shader = new Shader_1.default({
            name: 'Just another shader',
            vertexshader: `#version 300 es
            in vec3 A_Position;
            in vec2 A_UV;
            in vec4 A_Colour;
            in vec3 A_Normal;
            
            uniform mat3 U_MatrixNormal;
            uniform mat4 U_MatrixModelView;
            uniform mat4 U_MatrixProjection;
            
            out vec4 V_Position;
            out vec2 V_UV;
            out vec3 V_Normal;
            out vec4 V_Colour;
            out vec4 V_Shadow;
            
            void main(void)
            {
                V_Colour = A_Colour;
                V_UV = A_UV;
                
                V_Position = U_MatrixModelView * vec4(A_Position, 1.0);
                V_Normal = U_MatrixNormal * A_Normal;
                
                V_Shadow = mat4(0.5, 0.0, 0.0, 0.0,
                                0.0, 0.5, 0.0, 0.0,
                                0.0, 0.0, 0.5, 0.0,
                                0.5, 0.5, 0.5, 1.0) * vec4(A_Position, 1.0);
                
                gl_Position = U_MatrixProjection * V_Position;
            }`,
            fragmentshader: `#version 300 es
            precision mediump float;
            const int MAX_LIGHTS = 8;
            
            uniform vec4 U_MaterialAmbient;
            uniform vec4 U_MaterialDiffuse;
            uniform vec4 U_MaterialSpecular;
            uniform float U_MaterialShininess;
            uniform float U_MaterialAlpha;
            uniform bool U_MaterialHasImage;
            uniform bool U_MaterialHasBump;
            uniform bool U_MaterialHasSpecular;
            
            uniform vec4 U_AmbientColour;
            uniform float U_AmbientIntensity;
            
            uniform vec3 U_DirectionalDirection;
            uniform vec4 U_DirectionalColour;
            uniform float U_DirectionalIntensity;
            
            struct PointLight
            { 
                vec3 Position;
                vec4 Colour;
                float Intensity;
                float Radius;
                float Angle;
            };
            uniform PointLight U_Point[MAX_LIGHTS];
            uniform int U_Point_Count;
            
            /*uniform gsampler2D U_SamplerImage;
            uniform gsampler2D U_SamplerBump;
            uniform gsampler2D U_SamplerShadow;*/
            
            in vec4 V_Colour;
            in vec2 V_UV;
            in vec3 V_Normal;
            in vec4 V_Position;
            in vec4 V_Shadow;

            out vec4 FragColour;
            
            vec4 Ambient()
            {
                return U_MaterialAmbient * U_AmbientColour * U_AmbientIntensity;
            }
            
            vec4 Directional(in vec3 normal) 
            { 
                float weight = max(dot(normal, normalize(U_DirectionalDirection)), 0.0);
                vec4 diffuse = U_DirectionalColour * weight;
                
                return U_MaterialDiffuse * diffuse * U_DirectionalIntensity;
            } 
            
            vec4 Point(in vec3 normal)
            {
                vec4 points = vec4(0.0);
            
                for (int i = 0; i < MAX_LIGHTS; ++i)
                {
                    if (i < U_Point_Count)
                    {
                        PointLight point = U_Point[i];
                        float distance = length(point.Position - V_Position.xyz);
            
                        if (distance <= point.Radius)
                        {
                            vec4 colour = vec4(0.0);
                            vec3 direction = normalize(point.Position - V_Position.xyz);
                            vec3 eyeVector = normalize(-normal.xyz);
                            vec3 reflection = reflect(direction, normal);
                            
                            float diffuse_weight = max(dot(normal, direction), 0.0);
                            float specular_weight = pow(max(dot(reflection, eyeVector), 0.0), U_MaterialShininess);
            
                            colour = U_MaterialDiffuse * point.Colour * diffuse_weight + U_MaterialSpecular * specular_weight;
                            colour = colour * (1.0 - (distance / point.Radius));
                            colour = colour * point.Intensity;
                            points += colour;
                        } 
                    } 
                    else break;
                } 
                
                return points;
            }
            
            vec4 Light()
            {
                vec3 normal = /*normalize(U_MaterialHasBump
                                        ? texture2D(U_SamplerBump, V_UV).xyz * V_Normal
                                        :*/ (V_Normal);
            
                return Ambient() + Directional(normal) + Point(normal);
            }
            
            vec4 Shadow()
            {                
                return vec4(1.0);
            }
            
            vec4 Colour()
            {
                vec4 colour = Shadow();
                
                /*if (U_MaterialHasImage)
                {
                    colour = texture2D(U_SamplerImage, V_UV);
                }*/
                
                return colour;
            }
            
            void main(void)
            { 
                vec4 colour = Colour() * Light();
                colour.a *= U_MaterialAlpha;
                
                FragColour = colour;
            }`,
            height: 1920,
            width: 1080
        });
        let object = fwge.object;
        object = OBJConverter_1.default.Parse(obj, mtl);
        object.Material.Shader = shader;
        object.Material.Ambient = new Colour4_1.default(1, 1, 1, 1);
        object.Transform.Position.Z = -15;
        object.Update = function () {
            this.Transform.Rotation.Y += Time_1.default.Render.Delta * 0.1;
        };
        fwge.mesh = OBJConverter_1.default.ParseMesh(obj);
        fwge.material = OBJConverter_1.default.ParseRenderMaterial(mtl);
        fwge.material.Alpha = 0.2;
        fwge.system = new ParticleSystem_1.default({
            delay: (time, index) => index * 1000,
            length: 5000,
            material: fwge.material,
            mesh: fwge.mesh,
            name: "example particle system",
            count: 1,
            transform: {
                position: [0, 0, -5],
                scale: [0.1, 0.1, 0.1]
            },
            position: [
                (time, index) => 0,
                (time, index) => time * 0.01,
                (time, index) => -15
            ]
        });
        Control_1.default.Start();
    });
}
function makeShader() {
    return __awaiter(this, void 0, void 0, function* () {
        let fields = new ShaderTypes_1.ShaderNode([
            new ShaderTypes_1.ShaderFloat('red', 1),
            new ShaderTypes_1.ShaderFloat('green', 1),
            new ShaderTypes_1.ShaderFloat('blue', 1)
        ]);
        var offset = new ShaderTypes_1.ShaderNode([
            new ShaderTypes_1.ShaderVec3('offset', [0, 0, 0])
        ]);
        var colour = new ShaderTypes_1.ShaderNode([
            new ShaderTypes_1.ShaderVec4('colour', [0, 0, 0, 0])
        ], [
            fields,
            offset
        ]);
        console.log(colour);
    });
}

},{"../../src/Camera/Camera":4,"../../src/FWGE":5,"../../src/Maths/Equation":16,"../../src/ParticleSystem":24,"../../src/Render/Colour4":26,"../../src/Shader/Definition/FragmentShader":32,"../../src/Shader/Definition/ShaderTypes":33,"../../src/Shader/Definition/VertexShader":34,"../../src/Shader/Shader":44,"../../src/Utility/Control":47,"../../src/Utility/Converter/OBJConverter":48,"../../src/Utility/List":49,"../../src/Utility/Time":51}],2:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../Item"));
const Vector3_1 = __importDefault(require("../Maths/Vector3"));
const List_1 = __importDefault(require("../Utility/List"));
const Time_1 = __importDefault(require("../Utility/Time"));
const AnimationFrame_1 = __importDefault(require("./AnimationFrame"));
exports.Animations = new Array();
class IAnimation {
}
exports.IAnimation = IAnimation;
class Animation extends Item_1.default {
    constructor({ name = 'Animation', gameObject, frames, loop = false } = new IAnimation) {
        super(name);
        if (frames instanceof List_1.default) {
            frames = frames.ToArray();
        }
        this.Frames = new Array();
        this.GameObject = gameObject;
        this.Length = 0;
        this.Loop = loop;
        let start = 0;
        frames.forEach((current, index, array) => {
            let next = index === array.length - 1
                ? array[0]
                : array[index + 1];
            let offset = current.time * 1000;
            let colour = [
                (next.colour[0] - current.colour[0]) / offset,
                (next.colour[1] - current.colour[1]) / offset,
                (next.colour[2] - current.colour[2]) / offset,
                (next.colour[3] - current.colour[3]) / offset
            ];
            let position = [
                (next.position[0] - current.position[0]) / offset,
                (next.position[1] - current.position[1]) / offset,
                (next.position[2] - current.position[2]) / offset
            ];
            let rotation = [
                (next.rotation[0] - current.rotation[0]) / offset,
                (next.rotation[1] - current.rotation[1]) / offset,
                (next.rotation[2] - current.rotation[2]) / offset
            ];
            let scale = [
                (next.scale[0] - current.scale[0]) / offset,
                (next.scale[1] - current.scale[1]) / offset,
                (next.scale[2] - current.scale[2]) / offset
            ];
            this.Length += current.time;
            this.Frames.push(new AnimationFrame_1.default(start, start + offset, colour, position, rotation, scale));
            start += offset;
        });
        this.FrameTime = 0;
        this.MaxFrameTime = this.Length * 1000;
        this.CurrentFrame = 0;
        exports.Animations.push(this);
    }
    Update() {
        if (this.FrameTime >= this.MaxFrameTime) {
            if (!this.Loop) {
                return;
            }
            else {
                this.FrameTime = 0;
                this.CurrentFrame = 0;
            }
        }
        let currentFrame = this.Frames[this.CurrentFrame];
        let offset = Time_1.default.Render.Delta;
        if (this.FrameTime + offset > currentFrame.End) {
            let offset = currentFrame.End - this.FrameTime;
            this.FrameTime += offset;
            this.UpdateObject(currentFrame, offset);
            if (this.FrameTime + offset >= this.MaxFrameTime) {
                if (this.Loop) {
                    this.FrameTime = 0;
                    this.CurrentFrame = 0;
                }
            }
            else {
                ++this.CurrentFrame;
            }
            currentFrame = this.Frames[this.CurrentFrame];
            offset = Time_1.default.Render.Delta - offset;
        }
        this.FrameTime += offset;
        this.UpdateObject(currentFrame, offset);
    }
    UpdateObject(frame, length) {
        this.GameObject.Transform.Position.Sum(new Vector3_1.default(frame.Position).Scale(length));
        this.GameObject.Transform.Rotation.Sum(new Vector3_1.default(frame.Rotation).Scale(length));
        this.GameObject.Transform.Scale.Sum(new Vector3_1.default(frame.Scale).Scale(length));
        this.GameObject.Material.Ambient.R += frame.Colour[0] * length;
        this.GameObject.Material.Ambient.G += frame.Colour[1] * length;
        this.GameObject.Material.Ambient.B += frame.Colour[2] * length;
        this.GameObject.Material.Ambient.A += frame.Colour[3] * length;
    }
}
exports.default = Animation;

},{"../Item":11,"../Maths/Vector3":22,"../Utility/List":49,"../Utility/Time":51,"./AnimationFrame":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IAnimationFrame {
}
exports.IAnimationFrame = IAnimationFrame;
class AnimationFrame {
    constructor(start, end, colour, position, rotation, scale) {
        this.Start = start;
        this.End = end;
        this.Colour = colour;
        this.Position = position;
        this.Rotation = rotation;
        this.Scale = scale;
    }
}
exports.default = AnimationFrame;

},{}],4:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FWGE_1 = __importDefault(require("../FWGE"));
const Item_1 = __importDefault(require("../Item"));
var ViewMode;
(function (ViewMode) {
    ViewMode[ViewMode["PERSPECTIVE"] = 0] = "PERSPECTIVE";
    ViewMode[ViewMode["ORTHOGRAPHIC"] = 1] = "ORTHOGRAPHIC";
})(ViewMode = exports.ViewMode || (exports.ViewMode = {}));
class ICamera {
}
exports.ICamera = ICamera;
exports.Cameras = new Array();
class Camera extends Item_1.default {
    static get Main() {
        return exports.Cameras[0];
    }
    static set Main(camera) {
        exports.Cameras[0] = camera;
    }
    constructor(name, mode = ViewMode.PERSPECTIVE, fieldOfView = 35, aspectRatio = 16 / 9, nearClipping = 0.001, farClipping = 10000, left = -10, right = 10, top = 10, bottom = -10, horizontalTilt = 90, vericalTilt = 90) {
        super(name);
        this.Mode = mode;
        this.FieldOfView = fieldOfView;
        this.AspectRatio = aspectRatio;
        this.NearClipping = nearClipping;
        this.FarClipping = farClipping;
        this.Left = left;
        this.Right = right;
        this.Top = top;
        this.Bottom = bottom;
        this.HorizontalTilt = horizontalTilt;
        this.VericalTilt = vericalTilt;
        exports.Cameras.push(this);
    }
    Update() {
        this.AspectRatio = FWGE_1.default.GL.canvas.clientWidth / FWGE_1.default.GL.canvas.clientHeight;
    }
}
exports.default = Camera;
new Camera('Main Camera');

},{"../FWGE":5,"../Item":11}],5:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Control_1 = __importDefault(require("./Utility/Control"));
const Input_1 = __importDefault(require("./Input/Input"));
class IFWGE {
}
exports.IFWGE = IFWGE;
class FWGE {
    static get GL() {
        return exports.GL;
    }
    static Init({ canvas, renderupdate = 60, physcisupdate = 30, clear = [0, 0, 0, 1] }) {
        if (!canvas) {
            throw new Error('Field {canvas: HTMLCanvasElement} is required');
        }
        exports.GL = canvas.getContext('webgl2');
        if (!exports.GL) {
            throw new Error('Webgl context could not be initialized.');
        }
        exports.GL.clearColor(clear[0], clear[1], clear[2], clear[3]);
        Control_1.default.Init(renderupdate, physcisupdate);
        Input_1.default.Init(canvas);
    }
}
exports.default = FWGE;

},{"./Input/Input":7,"./Utility/Control":47}],6:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("./Item"));
const Transform_1 = __importDefault(require("./Transform"));
exports.GameObjects = new Array();
class IGameObject {
    constructor() {
        this.transform = new Transform_1.default();
    }
}
exports.IGameObject = IGameObject;
class GameObject extends Item_1.default {
    constructor({ name, transform = new Transform_1.default, material, mesh, physics, animation, begin = function () { }, update = function () { }, end = function () { }, children = [], visible = true } = new IGameObject) {
        super(name);
        this.Visible = true;
        this.Begin = begin.bind(this);
        this.Update = update.bind(this);
        this.End = end.bind(this);
        this.Transform = transform;
        this.Mesh = mesh;
        this.Material = material;
        this.Physics = physics;
        this.Animation = animation;
        this.Children = [];
        for (let child of children) {
            this.Children.push(child);
        }
        this.Visible = visible;
        exports.GameObjects.push(this);
    }
    Destroy() {
    }
    Clone() {
        let children = this.Children.map(child => child.Clone());
        return new GameObject({
            name: this.Name + " Clone",
            transform: new Transform_1.default({
                position: this.Transform.Position,
                rotation: this.Transform.Rotation,
                scale: this.Transform.Scale,
                shear: this.Transform.Shear
            }),
            mesh: this.Mesh,
            material: this.Material,
            physics: this.Physics,
            begin: this.Begin,
            update: this.Update,
            end: this.End,
            children: children
        });
    }
}
exports.default = GameObject;

},{"./Item":11,"./Transform":45}],7:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const KeyboardInput_1 = __importDefault(require("./KeyboardInput"));
const MouseInput_1 = __importDefault(require("./MouseInput"));
const List_1 = __importDefault(require("../Utility/List"));
class Input {
    static Init(canvas) {
        Input.Keyboard = new KeyboardInput_1.default(canvas);
        Input.Mouse = new MouseInput_1.default(canvas);
    }
    static Update() {
    }
}
Input.Controllers = new List_1.default();
exports.default = Input;

},{"../Utility/List":49,"./KeyboardInput":9,"./MouseInput":10}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InputState;
(function (InputState) {
    InputState[InputState["UP"] = 0] = "UP";
    InputState[InputState["PRESSED"] = 1] = "PRESSED";
    InputState[InputState["CLICKED"] = 2] = "CLICKED";
    InputState[InputState["DOWN"] = 3] = "DOWN";
})(InputState = exports.InputState || (exports.InputState = {}));

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InputState_1 = require("./InputState");
class KeyboardInput {
    constructor(element) {
        this.Keys = new Array(128);
        this.Keys.forEach((_, index) => this.Keys[index] = InputState_1.InputState.UP);
        element.onkeyup = (e) => {
            this.Keys[e.keyCode] = InputState_1.InputState.UP;
        };
        element.onkeydown = (e) => {
            if (this.Keys[e.keyCode] == InputState_1.InputState.CLICKED) {
                this.Keys[e.keyCode] = InputState_1.InputState.DOWN;
            }
            else {
                this.Keys[e.keyCode] = InputState_1.InputState.PRESSED;
            }
        };
    }
    get KeyA() {
        return this.Keys[65];
    }
    get Key0() {
        return this.Keys[48];
    }
    get Numpad0() {
        return this.Keys[96];
    }
}
exports.default = KeyboardInput;

},{"./InputState":8}],10:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InputState_1 = require("./InputState");
const Vector2_1 = __importDefault(require("../Maths/Vector2"));
class MouseInput {
    constructor(element) {
        this.Buttons = new Array(20);
        this.Axes = new Vector2_1.default();
        this.Delta = new Vector2_1.default();
        this.Buttons.forEach((_, index) => this.Buttons[index] = InputState_1.InputState.UP);
        element.onmouseup = (e) => {
            this.Buttons[e.button] = InputState_1.InputState.UP;
        };
        element.onmousedown = (e) => {
            this.Buttons[e.button] = InputState_1.InputState.DOWN;
        };
        element.onmousemove = (e) => {
            this.Delta.Set(e.clientX - this.Axes.X, e.clientY - this.Axes.Y);
            this.Axes.Set(e.clientX, e.clientY);
        };
    }
}
exports.default = MouseInput;

},{"../Maths/Vector2":21,"./InputState":8}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Item {
    constructor(name = 'Item') {
        this.ID = Hashcode(ID_COUNTER++);
        this.Name = name;
    }
}
exports.default = Item;
let ID_COUNTER = 0;
function Hashcode(number) {
    var i = 0;
    var hash = 0;
    var chr = 0;
    var string = number + '';
    for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}

},{}],12:[function(require,module,exports){
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LightItem_1 = __importStar(require("./LightItem"));
const List_1 = __importDefault(require("../Utility/List"));
exports.AmbientLights = new List_1.default(1);
class IAmbientLight extends LightItem_1.ILightItem {
}
exports.IAmbientLight = IAmbientLight;
class AmbientLight extends LightItem_1.default {
    constructor({ name = 'Ambient Light', colour, intensity } = new IAmbientLight) {
        super(name, colour, intensity);
        exports.AmbientLights.Add(this);
    }
}
exports.default = AmbientLight;

},{"../Utility/List":49,"./LightItem":14}],13:[function(require,module,exports){
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LightItem_1 = __importStar(require("./LightItem"));
const Vector3_1 = __importDefault(require("../Maths/Vector3"));
const List_1 = __importDefault(require("../Utility/List"));
exports.DirectionalLights = new List_1.default(3);
class IDirectionalLight extends LightItem_1.ILightItem {
}
exports.IDirectionalLight = IDirectionalLight;
class DirectionalLight extends LightItem_1.default {
    constructor({ name = 'Directional Light', colour, intensity, direction = Vector3_1.default.ZERO } = new IDirectionalLight) {
        super(name, colour, intensity);
        this.Direction = new Vector3_1.default(direction);
        exports.DirectionalLights.Add(this);
    }
}
exports.default = DirectionalLight;

},{"../Maths/Vector3":22,"../Utility/List":49,"./LightItem":14}],14:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Colour4_1 = __importDefault(require("../Render/Colour4"));
const Item_1 = __importDefault(require("../Item"));
class ILightItem {
}
exports.ILightItem = ILightItem;
class LightItem extends Item_1.default {
    constructor(name, colour = [255, 255, 255, 255], intensity = 1) {
        super(name);
        this.Colour = new Colour4_1.default(colour);
        this.Intensity = intensity;
    }
}
exports.default = LightItem;

},{"../Item":11,"../Render/Colour4":26}],15:[function(require,module,exports){
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LightItem_1 = __importStar(require("./LightItem"));
const Vector3_1 = __importDefault(require("..//Maths/Vector3"));
const List_1 = __importDefault(require("../Utility/List"));
exports.PointLights = new List_1.default(12);
class IPointLight extends LightItem_1.ILightItem {
}
exports.IPointLight = IPointLight;
class PointLight extends LightItem_1.default {
    constructor({ name = 'Point Light', colour, intensity, position = Vector3_1.default.ZERO, radius = 5, angle = 180, shininess = 32 } = new IPointLight) {
        super(name, colour, intensity);
        this.Position = new Vector3_1.default(position);
        this.Radius = radius;
        this.Angle = angle;
        this.Shininess = shininess;
        exports.PointLights.Add(this);
    }
}
exports.default = PointLight;

},{"..//Maths/Vector3":22,"../Utility/List":49,"./LightItem":14}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UnaryExpressionType;
(function (UnaryExpressionType) {
    UnaryExpressionType[UnaryExpressionType["NONE"] = 0] = "NONE";
    UnaryExpressionType[UnaryExpressionType["INVERSE"] = 1] = "INVERSE";
    UnaryExpressionType[UnaryExpressionType["NEGATION"] = 2] = "NEGATION";
    UnaryExpressionType[UnaryExpressionType["SIN"] = 3] = "SIN";
    UnaryExpressionType[UnaryExpressionType["COSINE"] = 4] = "COSINE";
    UnaryExpressionType[UnaryExpressionType["TANGENT"] = 5] = "TANGENT";
})(UnaryExpressionType = exports.UnaryExpressionType || (exports.UnaryExpressionType = {}));
var BinaryExpressionType;
(function (BinaryExpressionType) {
    BinaryExpressionType[BinaryExpressionType["ADDITION"] = 0] = "ADDITION";
    BinaryExpressionType[BinaryExpressionType["SUBTRACTION"] = 1] = "SUBTRACTION";
    BinaryExpressionType[BinaryExpressionType["DIVISION"] = 2] = "DIVISION";
    BinaryExpressionType[BinaryExpressionType["MULTIPLICATION"] = 3] = "MULTIPLICATION";
    BinaryExpressionType[BinaryExpressionType["POWER"] = 4] = "POWER";
    BinaryExpressionType[BinaryExpressionType["ROOT"] = 5] = "ROOT";
    BinaryExpressionType[BinaryExpressionType["LOGARITHMIC"] = 6] = "LOGARITHMIC";
})(BinaryExpressionType = exports.BinaryExpressionType || (exports.BinaryExpressionType = {}));
function Var(variable) {
    return (...x) => x[variable];
}
exports.Var = Var;
function Unary(type, arg) {
    switch (type) {
        case UnaryExpressionType.NONE:
            return (...x) => typeof arg === 'number' ? arg : arg(...x);
        case UnaryExpressionType.INVERSE:
            return (...x) => 1 / (typeof arg === 'number' ? arg : arg(...x));
        case UnaryExpressionType.NEGATION:
            return (...x) => -(typeof arg === 'number' ? arg : arg(...x));
        case UnaryExpressionType.SIN:
            return (...x) => Math.sin(typeof arg === 'number' ? arg : arg(...x));
        case UnaryExpressionType.COSINE:
            return (...x) => Math.cos(typeof arg === 'number' ? arg : arg(...x));
        case UnaryExpressionType.TANGENT:
            return (...x) => Math.tan(typeof arg === 'number' ? arg : arg(...x));
        default:
            return undefined;
    }
}
exports.Unary = Unary;
function Binary(type, left, right) {
    switch (type) {
        case BinaryExpressionType.ADDITION:
            return (...x) => (typeof left === 'number' ? left : left(...x)) + (typeof right === 'number' ? right : right(...x));
        case BinaryExpressionType.SUBTRACTION:
            return (...x) => (typeof left === 'number' ? left : left(...x)) - (typeof right === 'number' ? right : right(...x));
        case BinaryExpressionType.MULTIPLICATION:
            return (...x) => (typeof left === 'number' ? left : left(...x)) * (typeof right === 'number' ? right : right(...x));
        case BinaryExpressionType.DIVISION:
            return (...x) => (typeof left === 'number' ? left : left(...x)) / (typeof right === 'number' ? right : right(...x));
        case BinaryExpressionType.POWER:
            return (...x) => Math.pow((typeof left === 'number' ? left : left(...x)), (typeof right === 'number' ? right : right(...x)));
        case BinaryExpressionType.ROOT:
            return (...x) => Math.pow((typeof left === 'number' ? left : left(...x)), (1 / (typeof right === 'number' ? right : right(...x))));
        default:
            return null;
    }
}
exports.Binary = Binary;

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SIGNIFICANT_FIGURES = Math.pow(10, 6);
function Sigfigs(value) {
    return (Math.round(value * SIGNIFICANT_FIGURES) / SIGNIFICANT_FIGURES);
}
exports.Sigfigs = Sigfigs;
class Maths {
    static Radian(degree) {
        return Math.PI / 180 * degree;
    }
    static Cot(angle) {
        return 1 / Math.tan(angle);
    }
    static Clamp(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }
    static CleanFloat(value) {
        return (Math.round(value * SIGNIFICANT_FIGURES) / SIGNIFICANT_FIGURES);
    }
    static IsPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }
}
exports.default = Maths;

},{}],18:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
const Maths_1 = require("./Maths");
const Matrix3_1 = __importDefault(require("./Matrix3"));
const Matrix4_1 = __importDefault(require("./Matrix4"));
class Matrix2 extends Float32Array {
    constructor(m11, m12, m21, m22) {
        super(4);
        if (m11) {
            Matrix2.Set(this, m11, m12, m21, m22);
        }
    }
    get M11() {
        return this[0];
    }
    set M11(m11) {
        this[0] = Maths_1.Sigfigs(m11);
    }
    get M12() {
        return this[1];
    }
    set M12(m12) {
        this[1] = Maths_1.Sigfigs(m12);
    }
    get M21() {
        return this[2];
    }
    set M21(m21) {
        this[2] = Maths_1.Sigfigs(m21);
    }
    get M22() {
        return this[3];
    }
    set M22(m22) {
        this[3] = Maths_1.Sigfigs(m22);
    }
    static get ZERO() {
        return new Matrix2(0, 0, 0, 0);
    }
    static get IDENTITY() {
        return new Matrix2(1, 0, 0, 1);
    }
    Set(m11, m12, m21, m22) {
        return Matrix2.Set(this, m11, m12, m21, m22);
    }
    static Set(matrix, m11, m12, m21, m22) {
        [m11, m12, m21, m22] = Matrix2.Destructure(m11, m12, m21, m22);
        matrix.M11 = m11;
        matrix.M12 = m12;
        matrix.M21 = m21;
        matrix.M22 = m22;
        return matrix;
    }
    Transpose() {
        return Matrix2.Transpose(this);
    }
    static Transpose(matrix) {
        return Matrix2.Set(matrix, matrix.M11, matrix.M21, matrix.M12, matrix.M22);
    }
    get Determinant() {
        return Matrix2.Determinant(this);
    }
    static Determinant(m11, m12, m21, m22) {
        [m11, m12, m21, m22] = Matrix2.Destructure(m11, m12, m21, m22);
        return Maths_1.Sigfigs(m11 * m22 - m21 * m12);
    }
    Inverse() {
        return Matrix2.Inverse(this);
    }
    static Inverse(matrix) {
        let det = matrix.Determinant;
        if (det !== 0) {
            Matrix2.Set(matrix, matrix.M22 / det, -matrix.M12 / det, -matrix.M21 / det, matrix.M11 / det);
        }
        return matrix;
    }
    Sum(m11, m12, m21, m22) {
        return Matrix2.Sum(this, m11, m12, m21, m22);
    }
    static Sum(matrix, m11, m12, m21, m22) {
        [m11, m12, m21, m22] = Matrix2.Destructure(m11, m12, m21, m22);
        return Matrix2.Set(matrix, matrix.M11 + m11, matrix.M12 + m12, matrix.M21 + m21, matrix.M22 + m22);
    }
    Mult(m11, m12, m21, m22) {
        return Matrix2.Mult(this, m11, m12, m21, m22);
    }
    static Mult(matrix, m11, m12, m21, m22) {
        [m11, m12, m21, m22] = Matrix2.Destructure(m11, m12, m21, m22);
        return Matrix2.Set(matrix, matrix.M11 * m11 + matrix.M12 * m21, matrix.M11 * m12 + matrix.M12 * m22, matrix.M21 * m11 + matrix.M22 * m21, matrix.M21 * m12 + matrix.M22 * m22);
    }
    Scale(scaler) {
        return Matrix2.Scale(this, scaler);
    }
    static Scale(matrix, scaler) {
        return Matrix2.Set(matrix, matrix.M11 * scaler, matrix.M12 * scaler, matrix.M21 * scaler, matrix.M22 * scaler);
    }
    Identity() {
        return Matrix2.Identity(this);
    }
    static Identity(matrix) {
        return Matrix2.Set(matrix, 1, 0, 0, 1);
    }
    Clone() {
        return new Matrix2(this);
    }
    static Destructure(m11, m12, m21, m22) {
        if (m11 instanceof Matrix2 || m11 instanceof Matrix3_1.default || m11 instanceof Matrix4_1.default) {
            [
                m11, m12,
                m21, m22
            ] = [
                m11.M11, m11.M12,
                m11.M21, m11.M22
            ];
        }
        else if (m11 instanceof Float32Array || m11 instanceof List_1.default || m11 instanceof Array) {
            [
                m11, m12,
                m21, m22
            ] = m11;
        }
        return [
            m11, m12,
            m21, m22
        ];
    }
}
exports.default = Matrix2;

},{"../Utility/List":49,"./Maths":17,"./Matrix3":19,"./Matrix4":20}],19:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
const Maths_1 = require("./Maths");
const Matrix2_1 = __importDefault(require("./Matrix2"));
const Matrix4_1 = __importDefault(require("./Matrix4"));
class Matrix3 extends Float32Array {
    constructor(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        super(9);
        if (m11) {
            Matrix3.Set(this, m11, m12, m13, m21, m22, m23, m31, m32, m33);
        }
    }
    get M11() {
        return this[0];
    }
    set M11(m11) {
        this[0] = Maths_1.Sigfigs(m11);
    }
    get M12() {
        return this[1];
    }
    set M12(m12) {
        this[1] = Maths_1.Sigfigs(m12);
    }
    get M13() {
        return this[2];
    }
    set M13(m13) {
        this[2] = Maths_1.Sigfigs(m13);
    }
    get M21() {
        return this[3];
    }
    set M21(m21) {
        this[3] = Maths_1.Sigfigs(m21);
    }
    get M22() {
        return this[4];
    }
    set M22(m22) {
        this[4] = Maths_1.Sigfigs(m22);
    }
    get M23() {
        return this[5];
    }
    set M23(m23) {
        this[5] = Maths_1.Sigfigs(m23);
    }
    get M31() {
        return this[6];
    }
    set M31(m31) {
        this[6] = Maths_1.Sigfigs(m31);
    }
    get M32() {
        return this[7];
    }
    set M32(m32) {
        this[7] = Maths_1.Sigfigs(m32);
    }
    get M33() {
        return this[8];
    }
    set M33(m33) {
        this[8] = Maths_1.Sigfigs(m33);
    }
    static get ZERO() {
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static get IDENTITY() {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }
    Set(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        return Matrix3.Set(this, m11, m12, m13, m21, m22, m23, m31, m32, m33);
    }
    static Set(matrix, m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        [m11, m12, m13, m21, m22, m23, m31, m32, m33] = Matrix3.Destructure(m11, m12, m13, m21, m22, m23, m31, m32, m33);
        matrix.M11 = m11;
        matrix.M12 = m12;
        matrix.M13 = m13;
        matrix.M21 = m21;
        matrix.M22 = m22;
        matrix.M23 = m23;
        matrix.M31 = m31;
        matrix.M32 = m32;
        matrix.M33 = m33;
        return matrix;
    }
    Transpose() {
        return Matrix3.Transpose(this);
    }
    static Transpose(matrix) {
        return Matrix3.Set(matrix, matrix.M11, matrix.M21, matrix.M31, matrix.M12, matrix.M22, matrix.M32, matrix.M13, matrix.M23, matrix.M33);
    }
    get Determinant() {
        return Matrix3.Determinant(this);
    }
    static Determinant(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        [m11, m12, m13, m21, m22, m23, m31, m32, m33] = Matrix3.Destructure(m11, m12, m13, m21, m22, m23, m31, m32, m33);
        return Maths_1.Sigfigs(m11 * (m22 * m33 - m23 * m32) -
            m12 * (m21 * m33 - m23 * m31) +
            m13 * (m21 * m32 - m22 * m31));
    }
    Inverse() {
        return Matrix3.Inverse(this);
    }
    static Inverse(matrix) {
        let det = matrix.Determinant;
        if (det !== 0) {
            Matrix3.Set(matrix, (matrix.M22 * matrix.M33 - matrix.M32 * matrix.M23) / det, (matrix.M32 * matrix.M13 - matrix.M12 * matrix.M33) / det, (matrix.M12 * matrix.M23 - matrix.M22 * matrix.M13) / det, (matrix.M31 * matrix.M23 - matrix.M21 * matrix.M33) / det, (matrix.M11 * matrix.M33 - matrix.M31 * matrix.M13) / det, (matrix.M21 * matrix.M13 - matrix.M11 * matrix.M23) / det, (matrix.M21 * matrix.M32 - matrix.M31 * matrix.M22) / det, (matrix.M31 * matrix.M12 - matrix.M11 * matrix.M32) / det, (matrix.M11 * matrix.M22 - matrix.M21 * matrix.M12) / det);
        }
        return matrix;
    }
    Sum(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        return Matrix3.Sum(this, m11, m12, m13, m21, m22, m23, m31, m32, m33);
    }
    static Sum(matrix, m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        [m11, m12, m13, m21, m22, m23, m31, m32, m33] = Matrix3.Destructure(m11, m12, m13, m21, m22, m23, m31, m32, m33);
        return Matrix3.Set(matrix, matrix.M11 + m11, matrix.M12 + m12, matrix.M13 + m13, matrix.M21 + m21, matrix.M22 + m22, matrix.M23 + m23, matrix.M31 + m31, matrix.M32 + m32, matrix.M33 + m33);
    }
    Mult(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        return Matrix3.Mult(this, m11, m12, m13, m21, m22, m23, m31, m32, m33);
    }
    static Mult(matrix, m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        [m11, m12, m13, m21, m22, m23, m31, m32, m33] = Matrix3.Destructure(m11, m12, m13, m21, m22, m23, m31, m32, m33);
        return Matrix3.Set(matrix, matrix.M11 * m11 + matrix.M12 * m21 + matrix.M13 * m31, matrix.M11 * m12 + matrix.M12 * m22 + matrix.M13 * m32, matrix.M11 * m13 + matrix.M12 * m23 + matrix.M13 * m33, matrix.M21 * m11 + matrix.M22 * m21 + matrix.M23 * m31, matrix.M21 * m12 + matrix.M22 * m22 + matrix.M23 * m32, matrix.M21 * m13 + matrix.M22 * m23 + matrix.M23 * m33, matrix.M31 * m11 + matrix.M32 * m21 + matrix.M33 * m31, matrix.M31 * m12 + matrix.M32 * m22 + matrix.M33 * m32, matrix.M31 * m13 + matrix.M32 * m23 + matrix.M33 * m33);
    }
    Scale(scaler) {
        return Matrix3.Scale(this, scaler);
    }
    static Scale(matrix, scaler) {
        return Matrix3.Set(matrix, matrix.M11 * scaler, matrix.M12 * scaler, matrix.M13 * scaler, matrix.M21 * scaler, matrix.M22 * scaler, matrix.M23 * scaler, matrix.M31 * scaler, matrix.M32 * scaler, matrix.M33 * scaler);
    }
    Identity() {
        return Matrix3.Identity(this);
    }
    static Identity(matrix) {
        return Matrix3.Set(matrix, 1, 0, 0, 0, 1, 0, 0, 0, 1);
    }
    Clone() {
        return new Matrix3(this);
    }
    static Destructure(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        if (m11 instanceof Matrix2_1.default) {
            [
                m11, m12, m13,
                m21, m22, m23,
                m31, m32, m33
            ] = [
                m11.M11, m11.M12, 0,
                m11.M21, m11.M22, 0,
                0, 0, 0
            ];
        }
        else if (m11 instanceof Matrix3 || m11 instanceof Matrix4_1.default) {
            [
                m11, m12, m13,
                m21, m22, m23,
                m31, m32, m33
            ] = [
                m11.M11, m11.M12, m11.M13,
                m11.M21, m11.M22, m11.M23,
                m11.M31, m11.M32, m11.M33
            ];
        }
        else if (m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_1.default) {
            [
                m11, m12, m13,
                m21, m22, m23,
                m31, m32, m33
            ] = m11;
        }
        return [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ];
    }
}
exports.default = Matrix3;

},{"../Utility/List":49,"./Maths":17,"./Matrix2":18,"./Matrix4":20}],20:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
const Maths_1 = require("./Maths");
const Matrix2_1 = __importDefault(require("./Matrix2"));
const Matrix3_1 = __importDefault(require("./Matrix3"));
class Matrix4 extends Float32Array {
    constructor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        super(16);
        if (m11) {
            Matrix4.Set(this, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
        }
    }
    get M11() {
        return this[0];
    }
    set M11(m11) {
        this[0] = Maths_1.Sigfigs(m11);
    }
    get M12() {
        return this[1];
    }
    set M12(m12) {
        this[1] = Maths_1.Sigfigs(m12);
    }
    get M13() {
        return this[2];
    }
    set M13(m13) {
        this[2] = Maths_1.Sigfigs(m13);
    }
    get M14() {
        return this[3];
    }
    set M14(m14) {
        this[3] = Maths_1.Sigfigs(m14);
    }
    get M21() {
        return this[4];
    }
    set M21(m21) {
        this[4] = Maths_1.Sigfigs(m21);
    }
    get M22() {
        return this[5];
    }
    set M22(m22) {
        this[5] = Maths_1.Sigfigs(m22);
    }
    get M23() {
        return this[6];
    }
    set M23(m23) {
        this[6] = Maths_1.Sigfigs(m23);
    }
    get M24() {
        return this[7];
    }
    set M24(m24) {
        this[7] = Maths_1.Sigfigs(m24);
    }
    get M31() {
        return this[8];
    }
    set M31(m31) {
        this[8] = Maths_1.Sigfigs(m31);
    }
    get M32() {
        return this[9];
    }
    set M32(m32) {
        this[9] = Maths_1.Sigfigs(m32);
    }
    get M33() {
        return this[10];
    }
    set M33(m33) {
        this[10] = Maths_1.Sigfigs(m33);
    }
    get M34() {
        return this[11];
    }
    set M34(m34) {
        this[11] = Maths_1.Sigfigs(m34);
    }
    get M41() {
        return this[12];
    }
    set M41(m41) {
        this[12] = Maths_1.Sigfigs(m41);
    }
    get M42() {
        return this[13];
    }
    set M42(m42) {
        this[13] = Maths_1.Sigfigs(m42);
    }
    get M43() {
        return this[14];
    }
    set M43(m43) {
        this[14] = Maths_1.Sigfigs(m43);
    }
    get M44() {
        return this[15];
    }
    set M44(m44) {
        this[15] = Maths_1.Sigfigs(m44);
    }
    static get ZERO() {
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static get IDENTITY() {
        return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    Set(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        return Matrix4.Set(this, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
    }
    static Set(matrix, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44] = Matrix4.Destructure(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
        matrix.M11 = m11;
        matrix.M12 = m12;
        matrix.M13 = m13;
        matrix.M14 = m14;
        matrix.M21 = m21;
        matrix.M22 = m22;
        matrix.M23 = m23;
        matrix.M24 = m24;
        matrix.M31 = m31;
        matrix.M32 = m32;
        matrix.M33 = m33;
        matrix.M34 = m34;
        matrix.M41 = m41;
        matrix.M42 = m42;
        matrix.M43 = m43;
        matrix.M44 = m44;
        return matrix;
    }
    Transpose() {
        return Matrix4.Transpose(this);
    }
    static Transpose(matrix) {
        return Matrix4.Set(matrix, matrix.M11, matrix.M21, matrix.M31, matrix.M41, matrix.M12, matrix.M22, matrix.M32, matrix.M42, matrix.M13, matrix.M23, matrix.M33, matrix.M43, matrix.M14, matrix.M24, matrix.M34, matrix.M44);
    }
    get Determinant() {
        return Matrix4.Determinant(this);
    }
    static Determinant(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44] = Matrix4.Destructure(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
        return Maths_1.Sigfigs(m11 * m22 * m33 * m44 +
            m11 * m23 * m34 * m42 +
            m11 * m24 * m32 * m43 +
            m12 * m21 * m34 * m43 +
            m12 * m23 * m31 * m44 +
            m12 * m24 * m33 * m41 +
            m13 * m21 * m32 * m44 +
            m13 * m22 * m34 * m41 +
            m13 * m24 * m31 * m42 +
            m14 * m21 * m33 * m42 +
            m14 * m22 * m31 * m43 +
            m14 * m23 * m32 * m41 -
            m11 * m22 * m34 * m43 -
            m11 * m23 * m32 * m44 -
            m11 * m24 * m33 * m42 -
            m12 * m21 * m33 * m44 -
            m12 * m23 * m34 * m41 -
            m12 * m24 * m31 * m43 -
            m13 * m21 * m34 * m42 -
            m13 * m22 * m31 * m44 -
            m13 * m24 * m32 * m41 -
            m14 * m21 * m32 * m43 -
            m14 * m22 * m33 * m41 -
            m14 * m23 * m31 * m42);
    }
    Inverse() {
        return Matrix4.Inverse(this);
    }
    static Inverse(matrix) {
        var det = matrix.Determinant;
        if (det !== 0) {
            Matrix4.Set(matrix, (matrix.M22 * matrix.M33 * matrix.M44 +
                matrix.M23 * matrix.M34 * matrix.M42 +
                matrix.M24 * matrix.M32 * matrix.M43 -
                matrix.M22 * matrix.M34 * matrix.M43 -
                matrix.M23 * matrix.M32 * matrix.M44 -
                matrix.M24 * matrix.M33 * matrix.M42) / det, (matrix.M12 * matrix.M34 * matrix.M43 +
                matrix.M13 * matrix.M32 * matrix.M44 +
                matrix.M14 * matrix.M33 * matrix.M42 -
                matrix.M12 * matrix.M33 * matrix.M44 -
                matrix.M13 * matrix.M34 * matrix.M42 -
                matrix.M14 * matrix.M32 * matrix.M43) / det, (matrix.M12 * matrix.M23 * matrix.M44 +
                matrix.M13 * matrix.M24 * matrix.M42 +
                matrix.M14 * matrix.M22 * matrix.M43 -
                matrix.M12 * matrix.M24 * matrix.M43 -
                matrix.M13 * matrix.M22 * matrix.M44 -
                matrix.M14 * matrix.M23 * matrix.M42) / det, (matrix.M12 * matrix.M24 * matrix.M33 +
                matrix.M13 * matrix.M22 * matrix.M34 +
                matrix.M14 * matrix.M23 * matrix.M32 -
                matrix.M12 * matrix.M23 * matrix.M34 -
                matrix.M13 * matrix.M24 * matrix.M32 -
                matrix.M14 * matrix.M22 * matrix.M33) / det, (matrix.M21 * matrix.M34 * matrix.M43 +
                matrix.M23 * matrix.M31 * matrix.M44 +
                matrix.M24 * matrix.M33 * matrix.M41 -
                matrix.M21 * matrix.M33 * matrix.M44 -
                matrix.M23 * matrix.M34 * matrix.M41 -
                matrix.M24 * matrix.M31 * matrix.M43) / det, (matrix.M11 * matrix.M33 * matrix.M44 +
                matrix.M13 * matrix.M34 * matrix.M41 +
                matrix.M14 * matrix.M31 * matrix.M43 -
                matrix.M11 * matrix.M34 * matrix.M43 -
                matrix.M13 * matrix.M31 * matrix.M44 -
                matrix.M14 * matrix.M33 * matrix.M41) / det, (matrix.M11 * matrix.M24 * matrix.M43 +
                matrix.M13 * matrix.M21 * matrix.M44 +
                matrix.M14 * matrix.M23 * matrix.M41 -
                matrix.M11 * matrix.M23 * matrix.M44 -
                matrix.M13 * matrix.M24 * matrix.M41 -
                matrix.M14 * matrix.M21 * matrix.M43) / det, (matrix.M11 * matrix.M23 * matrix.M34 +
                matrix.M13 * matrix.M24 * matrix.M31 +
                matrix.M14 * matrix.M21 * matrix.M33 -
                matrix.M11 * matrix.M24 * matrix.M33 -
                matrix.M13 * matrix.M21 * matrix.M34 -
                matrix.M14 * matrix.M23 * matrix.M31) / det, (matrix.M21 * matrix.M32 * matrix.M44 +
                matrix.M22 * matrix.M34 * matrix.M41 +
                matrix.M24 * matrix.M31 * matrix.M42 -
                matrix.M21 * matrix.M34 * matrix.M42 -
                matrix.M22 * matrix.M31 * matrix.M44 -
                matrix.M24 * matrix.M32 * matrix.M41) / det, (matrix.M11 * matrix.M34 * matrix.M42 +
                matrix.M12 * matrix.M31 * matrix.M44 +
                matrix.M14 * matrix.M32 * matrix.M41 -
                matrix.M11 * matrix.M32 * matrix.M44 -
                matrix.M12 * matrix.M34 * matrix.M41 -
                matrix.M14 * matrix.M31 * matrix.M42) / det, (matrix.M11 * matrix.M22 * matrix.M44 +
                matrix.M12 * matrix.M24 * matrix.M41 +
                matrix.M14 * matrix.M21 * matrix.M42 -
                matrix.M11 * matrix.M24 * matrix.M42 -
                matrix.M12 * matrix.M21 * matrix.M44 -
                matrix.M14 * matrix.M22 * matrix.M41) / det, (matrix.M11 * matrix.M24 * matrix.M32 +
                matrix.M12 * matrix.M21 * matrix.M34 +
                matrix.M14 * matrix.M22 * matrix.M31 -
                matrix.M11 * matrix.M22 * matrix.M34 -
                matrix.M12 * matrix.M24 * matrix.M31 -
                matrix.M14 * matrix.M21 * matrix.M32) / det, (matrix.M21 * matrix.M33 * matrix.M42 +
                matrix.M22 * matrix.M31 * matrix.M43 +
                matrix.M23 * matrix.M32 * matrix.M41 -
                matrix.M21 * matrix.M32 * matrix.M43 -
                matrix.M22 * matrix.M33 * matrix.M41 -
                matrix.M23 * matrix.M31 * matrix.M42) / det, (matrix.M11 * matrix.M32 * matrix.M43 +
                matrix.M12 * matrix.M33 * matrix.M41 +
                matrix.M13 * matrix.M31 * matrix.M42 -
                matrix.M11 * matrix.M33 * matrix.M42 -
                matrix.M12 * matrix.M31 * matrix.M43 -
                matrix.M13 * matrix.M32 * matrix.M41) / det, (matrix.M11 * matrix.M23 * matrix.M42 +
                matrix.M12 * matrix.M21 * matrix.M43 +
                matrix.M13 * matrix.M22 * matrix.M41 -
                matrix.M11 * matrix.M22 * matrix.M43 -
                matrix.M12 * matrix.M23 * matrix.M41 -
                matrix.M13 * matrix.M21 * matrix.M42) / det, (matrix.M11 * matrix.M22 * matrix.M33 +
                matrix.M12 * matrix.M23 * matrix.M31 +
                matrix.M13 * matrix.M21 * matrix.M32 -
                matrix.M11 * matrix.M23 * matrix.M32 -
                matrix.M12 * matrix.M21 * matrix.M33 -
                matrix.M13 * matrix.M22 * matrix.M31) / det);
        }
        return matrix;
    }
    Sum(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        return Matrix4.Set(this, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
    }
    static Sum(matrix, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44] = Matrix4.Destructure(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
        return Matrix4.Set(matrix, matrix.M11 + m11, matrix.M12 + m12, matrix.M13 + m13, matrix.M14 + m14, matrix.M21 + m21, matrix.M22 + m22, matrix.M23 + m23, matrix.M24 + m24, matrix.M31 + m31, matrix.M32 + m32, matrix.M33 + m33, matrix.M34 + m34, matrix.M41 + m41, matrix.M42 + m42, matrix.M43 + m43, matrix.M44 + m44);
    }
    Mult(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        return Matrix4.Mult(this, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
    }
    static Mult(matrix, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44] = Matrix4.Destructure(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
        return Matrix4.Set(matrix, matrix.M11 * m11 + matrix.M12 * m21 + matrix.M13 * m31 + matrix.M14 * m41, matrix.M11 * m12 + matrix.M12 * m22 + matrix.M13 * m32 + matrix.M14 * m42, matrix.M11 * m13 + matrix.M12 * m23 + matrix.M13 * m33 + matrix.M14 * m43, matrix.M11 * m14 + matrix.M12 * m24 + matrix.M13 * m34 + matrix.M14 * m44, matrix.M21 * m11 + matrix.M22 * m21 + matrix.M23 * m31 + matrix.M24 * m41, matrix.M21 * m12 + matrix.M22 * m22 + matrix.M23 * m32 + matrix.M24 * m42, matrix.M21 * m13 + matrix.M22 * m23 + matrix.M23 * m33 + matrix.M24 * m43, matrix.M21 * m14 + matrix.M22 * m24 + matrix.M23 * m34 + matrix.M24 * m44, matrix.M31 * m11 + matrix.M32 * m21 + matrix.M33 * m31 + matrix.M34 * m41, matrix.M31 * m12 + matrix.M32 * m22 + matrix.M33 * m32 + matrix.M34 * m42, matrix.M31 * m13 + matrix.M32 * m23 + matrix.M33 * m33 + matrix.M34 * m43, matrix.M31 * m14 + matrix.M32 * m24 + matrix.M33 * m34 + matrix.M34 * m44, matrix.M41 * m11 + matrix.M42 * m21 + matrix.M43 * m31 + matrix.M44 * m41, matrix.M41 * m12 + matrix.M42 * m22 + matrix.M43 * m32 + matrix.M44 * m42, matrix.M41 * m13 + matrix.M42 * m23 + matrix.M43 * m33 + matrix.M44 * m43, matrix.M41 * m14 + matrix.M42 * m24 + matrix.M43 * m34 + matrix.M44 * m44);
    }
    Scale(scaler) {
        return Matrix4.Scale(this, scaler);
    }
    static Scale(matrix, scaler) {
        return Matrix4.Set(matrix, matrix.M11 * scaler, matrix.M12 * scaler, matrix.M13 * scaler, matrix.M14 * scaler, matrix.M21 * scaler, matrix.M22 * scaler, matrix.M23 * scaler, matrix.M24 * scaler, matrix.M31 * scaler, matrix.M32 * scaler, matrix.M33 * scaler, matrix.M34 * scaler, matrix.M41 * scaler, matrix.M42 * scaler, matrix.M43 * scaler, matrix.M44 * scaler);
    }
    Identity() {
        return Matrix4.Identity(this);
    }
    static Identity(matrix) {
        return Matrix4.Set(matrix, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    Clone() {
        return new Matrix4(this);
    }
    static Destructure(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        if (m11 instanceof Matrix2_1.default) {
            [
                m11, m12, m13, m14,
                m21, m22, m23, m24,
                m31, m32, m33, m34,
                m41, m42, m43, m44
            ] = [
                m11.M11, m11.M12, 0, 0,
                m11.M21, m11.M22, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ];
        }
        else if (m11 instanceof Matrix3_1.default) {
            [
                m11, m12, m13, m14,
                m21, m22, m23, m24,
                m31, m32, m33, m34,
                m41, m42, m43, m44
            ] = [
                m11.M11, m11.M12, m11.M13, 0,
                m11.M21, m11.M22, m11.M23, 0,
                m11.M31, m11.M32, m11.M33, 0,
                0, 0, 0, 0
            ];
        }
        else if (m11 instanceof Matrix4 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_1.default) {
            [
                m11, m12, m13, m14,
                m21, m22, m23, m24,
                m31, m32, m33, m34,
                m41, m42, m43, m44
            ] = m11;
        }
        return [
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ];
    }
}
exports.default = Matrix4;

},{"../Utility/List":49,"./Maths":17,"./Matrix2":18,"./Matrix3":19}],21:[function(require,module,exports){
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Maths_1 = __importStar(require("./Maths"));
const List_1 = __importDefault(require("../Utility/List"));
const Vector3_1 = __importDefault(require("./Vector3"));
const Vector4_1 = __importDefault(require("./Vector4"));
class Vector2 extends Float32Array {
    constructor(x, y) {
        super(2);
        if (x) {
            Vector2.Set(this, x, y);
        }
    }
    get X() {
        return this[0];
    }
    set X(x) {
        this[0] = Maths_1.Sigfigs(x);
    }
    get Y() {
        return this[1];
    }
    set Y(y) {
        this[1] = Maths_1.Sigfigs(y);
    }
    static get ZERO() {
        return new Vector2(0, 0);
    }
    static get ONE() {
        return new Vector2(1, 1);
    }
    static get UNIT() {
        return new Vector2(Math.sqrt(1 / 2), Math.sqrt(1 / 2));
    }
    get Length() {
        return Vector2.Length(this);
    }
    static Length(x, y) {
        [x, y] = Vector2.Destructure(x, y);
        return Maths_1.default.CleanFloat(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    }
    Set(x, y) {
        return Vector2.Set(this, x, y);
    }
    static Set(vector, x, y) {
        [x, y] = Vector2.Destructure(x, y);
        vector.X = x;
        vector.Y = y;
        return vector;
    }
    Sum(x, y) {
        return Vector2.Sum(this, x, y);
    }
    static Sum(vector, x, y) {
        [x, y] = Vector2.Destructure(x, y);
        return Vector2.Set(vector, vector.X + x, vector.Y + y);
    }
    Diff(x, y) {
        return Vector2.Diff(this, x, y);
    }
    static Diff(vector, x, y) {
        [x, y] = Vector2.Destructure(x, y);
        return Vector2.Set(vector, vector.X - x, vector.Y - y);
    }
    Mult(x, y) {
        return Vector2.Mult(this, x, y);
    }
    static Mult(vector, x, y) {
        [x, y] = Vector2.Destructure(x, y);
        return Vector2.Set(vector, vector.X * x, vector.Y * y);
    }
    Scale(scalar) {
        return Vector2.Scale(this, scalar);
    }
    static Scale(vector, scalar) {
        return Vector2.Mult(vector, scalar, scalar);
    }
    Dot(x, y) {
        return Vector2.Dot(this, x, y);
    }
    static Dot(vector, x, y) {
        [x, y] = Vector2.Destructure(x, y);
        return Maths_1.Sigfigs(vector.X * x + vector.Y * y);
    }
    Unit() {
        return Vector2.Unit(this);
    }
    static Unit(vector) {
        let length = vector.Length;
        if (length !== 0) {
            Vector2.Scale(vector, 1 / length);
        }
        return vector;
    }
    toString() {
        return `<${this.X}, ${this.Y}>`;
    }
    Clone() {
        return new Vector2(this);
    }
    static Destructure(x, y) {
        if (x instanceof Vector2 || x instanceof Vector3_1.default || x instanceof Vector4_1.default) {
            [x, y] = [x.X, x.Y];
        }
        else if (x instanceof Float32Array || x instanceof List_1.default || x instanceof Array) {
            [
                x, y
            ] = x;
        }
        return [x, y];
    }
}
exports.default = Vector2;

},{"../Utility/List":49,"./Maths":17,"./Vector3":22,"./Vector4":23}],22:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Maths_1 = __importDefault(require("../Maths/Maths"));
class Vector3 extends Float32Array {
    constructor(x, y, z) {
        super(3);
        this.Set(x, y, z);
    }
    get X() {
        return this[0];
    }
    set X(x) {
        this[0] = Maths_1.default.CleanFloat(x);
    }
    get Y() {
        return this[1];
    }
    set Y(y) {
        this[1] = Maths_1.default.CleanFloat(y);
    }
    get Z() {
        return this[2];
    }
    set Z(z) {
        this[2] = Maths_1.default.CleanFloat(z);
    }
    static get ZERO() {
        return new Vector3(0, 0, 0);
    }
    static get ONE() {
        return new Vector3(1, 1, 1);
    }
    static get UNIT() {
        return new Vector3(Math.sqrt(1 / 3), Math.sqrt(1 / 3), Math.sqrt(1 / 3));
    }
    get Length() {
        return Vector3.Length(this);
    }
    static Length(x, y, z) {
        if (x instanceof Float32Array || x instanceof Array) {
            [x, y, z] = x;
        }
        return Maths_1.default.CleanFloat(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)));
    }
    Set(x, y, z) {
        return Vector3.Set(this, x, y, z);
    }
    static Set(vector, x, y, z) {
        if (x instanceof Float32Array || x instanceof Array) {
            [x, y, z] = x;
        }
        vector.X = x;
        vector.Y = y;
        vector.Z = z;
        return vector;
    }
    Sum(x, y, z) {
        return Vector3.Sum(this, x, y, z);
    }
    static Sum(vector, x, y, z) {
        if (x instanceof Float32Array || x instanceof Array) {
            [x, y, z] = x;
        }
        return Vector3.Set(vector, vector.X + x, vector.Y + y, vector.Z + z);
    }
    Diff(x, y, z) {
        if (x instanceof Float32Array || x instanceof Array) {
            [x, y, z] = x;
        }
        return Vector3.Diff(this, x, y, z);
    }
    static Diff(vector, x, y, z) {
        if (x instanceof Float32Array || x instanceof Array) {
            [x, y, z] = x;
        }
        return Vector3.Set(vector, vector.X - x, vector.Y - y, vector.Z - z);
    }
    Mult(x, y, z) {
        return Vector3.Mult(this, x, y, z);
    }
    static Mult(vector, x, y, z) {
        if (x instanceof Float32Array || x instanceof Array) {
            [x, y, z] = x;
        }
        return Vector3.Set(vector, vector.X * x, vector.Y * y, vector.Z * z);
    }
    Scale(scalar) {
        return Vector3.Scale(this, scalar);
    }
    static Scale(vector, scalar) {
        return Vector3.Mult(vector, scalar, scalar, scalar);
    }
    Dot(x, y, z) {
        return Vector3.Dot(this, x, y, z);
    }
    static Dot(vector, x, y, z) {
        if (x instanceof Float32Array || x instanceof Array) {
            [x, y, z] = x;
        }
        return Maths_1.default.CleanFloat(vector.X * x + vector.Y * y + vector.Z * z);
    }
    Cross(x, y, z) {
        return Vector3.Cross(this, x, y, z);
    }
    static Cross(vector, x, y, z) {
        if (x instanceof Float32Array || x instanceof Array) {
            [x, y, z] = x;
        }
        return Vector3.Set(vector, vector.Y * z - vector.Z * y, vector.Z * x - vector.X * z, vector.X * y - vector.Y * x);
    }
    Unit() {
        return Vector3.Unit(this);
    }
    static Unit(vector) {
        var length = vector.Length;
        if (length !== 0) {
            Vector3.Scale(vector, 1 / length);
        }
        return vector;
    }
    toString() {
        return `<${this.X}, ${this.Y}, ${this.Z}>`;
    }
    toLocaleString() {
        return this.toString();
    }
    Clone() {
        return new Vector3(this);
    }
}
exports.default = Vector3;

},{"../Maths/Maths":17}],23:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
const Maths_1 = __importDefault(require("./Maths"));
const Vector2_1 = __importDefault(require("./Vector2"));
const Vector3_1 = __importDefault(require("./Vector3"));
class Vector4 extends Float32Array {
    constructor(w, x, y, z) {
        super(4);
        if (w) {
            Vector4.Set(this, w, x, y, z);
        }
    }
    get W() {
        return this[0];
    }
    set W(w) {
        this[0] = Maths_1.default.CleanFloat(w);
    }
    get X() {
        return this[1];
    }
    set X(x) {
        this[1] = Maths_1.default.CleanFloat(x);
    }
    get Y() {
        return this[2];
    }
    set Y(y) {
        this[2] = Maths_1.default.CleanFloat(y);
    }
    get Z() {
        return this[3];
    }
    set Z(z) {
        this[3] = Maths_1.default.CleanFloat(z);
    }
    get Length() {
        return Vector4.Length(this);
    }
    static Length(w, x, y, z) {
        if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array || w instanceof List_1.default) {
            [w, x, y, z] = w;
        }
        return Maths_1.default.CleanFloat(Math.sqrt(Math.pow(w, 2) + Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)));
    }
    get ZERO() {
        return new Vector4(0, 0, 0, 0);
    }
    get ONE() {
        return new Vector4(1, 1, 1, 1);
    }
    get UNIT() {
        return new Vector4(0.5, 0.5, 0.5, 0.5);
    }
    Set(w, x, y, z) {
        return Vector4.Set(this, w, x, y, z);
    }
    static Set(vector, w, x, y, z) {
        if (w instanceof Vector2_1.default) {
            [w, x, y, z] = [0, w.X, w.Y, 0];
        }
        else if (w instanceof Vector3_1.default) {
            [w, x, y, z] = [0, w.X, w.Y, w.Z];
        }
        else if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array || w instanceof List_1.default) {
            [w, x, y, z] = w;
        }
        vector.W = Maths_1.default.CleanFloat(w);
        vector.X = Maths_1.default.CleanFloat(x);
        vector.Y = Maths_1.default.CleanFloat(y);
        vector.Z = Maths_1.default.CleanFloat(z);
        return vector;
    }
    Sum(w, x, y, z) {
        return Vector4.Sum(this, w, x, y, z);
    }
    static Sum(vector, w, x, y, z) {
        if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array) {
            [w, x, y, z] = [w[0], w[1], w[2], w[3]];
        }
        return Vector4.Set(vector, vector.W + w, vector.X + x, vector.Y + y, vector.Z + z);
    }
    Diff(w, x, y, z) {
        return Vector4.Diff(this, w, x, y, z);
    }
    static Diff(vector, w, x, y, z) {
        if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array) {
            [w, x, y, z] = [w[0], w[1], w[2], w[3]];
        }
        return Vector4.Set(vector, vector.W - w, vector.X - x, vector.Y - y, vector.Z - z);
    }
    Mult(w, x, y, z) {
        return Vector4.Mult(this, w, x, y, z);
    }
    static Mult(vector, w, x, y, z) {
        if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array) {
            [w, x, y, z] = [w[0], w[1], w[2], w[3]];
        }
        return Vector4.Set(vector, vector.W * w, vector.X * x, vector.Y * y, vector.Z * z);
    }
    static Scale(vector, scaler) {
        return Vector4.Mult(vector, scaler, scaler, scaler, scaler);
    }
    Dot(w, x, y, z) {
        return Vector4.Dot(this, w, x, y, z);
    }
    static Dot(vector, w, x, y, z) {
        if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array) {
            [w, x, y, z] = [w[0], w[1], w[2], w[3]];
        }
        return vector.W * w + vector.X * x + vector.Y * y + vector.Z * z;
    }
    Unit() {
        return Vector4.Unit(this);
    }
    static Unit(vector) {
        let length = vector.Length;
        if (length !== 0) {
            Vector4.Scale(vector, 1 / length);
        }
        return vector;
    }
    toString() {
        return `<${this.W}, ${this.X}, ${this.Y}, ${this.Z}>`;
    }
    toLocaleString() {
        return this.toString();
    }
    Clone() {
        return new Vector4(this);
    }
}
exports.default = Vector4;

},{"../Utility/List":49,"./Maths":17,"./Vector2":21,"./Vector3":22}],24:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("./Item"));
const Equation_1 = require("./Maths/Equation");
const Vector3_1 = __importDefault(require("./Maths/Vector3"));
const Transform_1 = __importDefault(require("./Transform"));
const Time_1 = __importDefault(require("./Utility/Time"));
exports.ParticleSystems = new Array();
class IParticleSystem {
}
exports.IParticleSystem = IParticleSystem;
let df0 = Equation_1.Unary(Equation_1.UnaryExpressionType.NONE, 0);
let df1 = Equation_1.Unary(Equation_1.UnaryExpressionType.NONE, 1);
class ParticleSystem extends Item_1.default {
    constructor({ name = 'Particle System', mesh, length = 0, material, transform, position = [df0, df0, df0], rotation = [df0, df0, df0], scale = [df1, df1, df1], colour = [df0, df0, df0, df0], loop = true, delay, count } = new IParticleSystem) {
        super(name);
        this.Mesh = mesh;
        this.Material = material;
        this.Delay = delay;
        this.MaxTime = length + this.Delay(null, count - 1);
        this.CurrentTime = 0;
        this.Loop = loop;
        if (transform instanceof Transform_1.default) {
            transform = {
                position: transform.Position,
                rotation: transform.Rotation,
                scale: transform.Scale,
                shear: transform.Shear
            };
        }
        this.Transform = new Transform_1.default(transform);
        this.Particles = new Array();
        for (let i = 0; i < count; ++i) {
            this.Particles.push(new Transform_1.default({
                position: new Vector3_1.default(this.Transform.Position),
                rotation: new Vector3_1.default(this.Transform.Rotation),
                scale: new Vector3_1.default(this.Transform.Scale),
                shear: new Vector3_1.default(this.Transform.Position)
            }));
        }
        this.Position = position;
        this.Rotation = rotation;
        this.Scale = scale;
        this.Colour = colour;
        exports.ParticleSystems.push(this);
    }
    Update() {
        if (this.CurrentTime >= this.MaxTime) {
            if (!this.Loop) {
                return;
            }
            else {
                this.CurrentTime -= this.MaxTime;
            }
        }
        for (let i = 0; i < this.Particles.length; ++i) {
            let particle = this.Particles[i];
            let currentTime = this.CurrentTime - this.Delay(this.CurrentTime, i);
            if (currentTime < 0) {
                continue;
            }
            let offset = Time_1.default.Render.Delta;
            if (currentTime + offset > this.MaxTime) {
                if (this.Loop) {
                    this.UpdateParticle(particle, this.MaxTime, i);
                    currentTime = 0;
                    offset = Time_1.default.Render.Delta - offset;
                }
                else {
                    offset = this.MaxTime - currentTime;
                }
            }
            this.UpdateParticle(particle, currentTime, i);
        }
        this.CurrentTime += Time_1.default.Render.Delta;
    }
    UpdateParticle(particle, time, index) {
        particle.Position.Set(this.Transform.Position).Sum(this.Position[0](time, index), this.Position[1](time, index), this.Position[2](time, index));
        particle.Rotation.Set(this.Transform.Rotation).Sum(this.Rotation[0](time, index), this.Rotation[1](time, index), this.Rotation[2](time, index));
        particle.Scale.Set(this.Transform.Scale).Sum(this.Scale[0](time, index), this.Scale[1](time, index), this.Scale[2](time, index));
    }
}
exports.default = ParticleSystem;

},{"./Item":11,"./Maths/Equation":16,"./Maths/Vector3":22,"./Transform":45,"./Utility/Time":51}],25:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Maths_1 = __importDefault(require("../Maths/Maths"));
const Colour4_1 = __importDefault(require("./Colour4"));
class Colour3 extends Float32Array {
    get R() {
        return this[0];
    }
    set R(red) {
        this[0] = Maths_1.default.CleanFloat(Maths_1.default.Clamp(red, 0, 1));
    }
    get G() {
        return this[1];
    }
    set G(green) {
        this[1] = Maths_1.default.CleanFloat(Maths_1.default.Clamp(green, 0, 1));
    }
    get B() {
        return this[2];
    }
    set B(blue) {
        this[2] = Maths_1.default.CleanFloat(Maths_1.default.Clamp(blue, 0, 1));
    }
    get BIN() {
        let str = 'b';
        this.forEach(i => str += Math.round(i * 255).toString(2));
        return str;
    }
    get OCT() {
        let str = 'o';
        this.forEach(i => str += Math.round(i * 255).toString(8));
        return str;
    }
    get DEC() {
        let str = '';
        this.forEach(i => str += i.toString(10) + ',');
        return str.substring(0, str.length - 1);
    }
    get HEX() {
        let str = '#';
        this.forEach(i => str += Math.round(i * 255).toString(16));
        return str;
    }
    constructor(r, g, b) {
        super(3);
        this.Set(r, g, b);
    }
    Set(r, g, b) {
        return Colour3.Set(this, r, b, g);
    }
    static Set(colour, r, g, b) {
        [r, g, b] = Colour3.Deconstruct(r, g, b);
        colour.R = r;
        colour.G = g;
        colour.B = b;
        return colour;
    }
    static Deconstruct(r, g, b, a) {
        if (typeof r === 'string') {
            if (r.match(/#([0-9A-F]{3}){1,2}/i)) {
                [r, g, b] = r.substring(1)
                    .toUpperCase()
                    .split('')
                    .map(c => parseInt(c, 16));
            }
            else if (r.match(/#[0-9A-F]{6}/i)) {
                [r, g, b] = r.substring(1)
                    .toUpperCase()
                    .split(/(?=(?:..)*$)/)
                    .map(c => parseInt(c, 16));
            }
            else {
                [r, g, b] = [0, 0, 0, 0];
            }
        }
        else if (r instanceof Colour3 || r instanceof Colour4_1.default || r instanceof Float32Array || r instanceof Array) {
            [r, g, b] = r;
        }
        return [r, g, b];
    }
}
exports.default = Colour3;

},{"../Maths/Maths":17,"./Colour4":26}],26:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Maths_1 = __importDefault(require("../Maths/Maths"));
const Colour3_1 = __importDefault(require("./Colour3"));
class Colour4 extends Float32Array {
    get R() {
        return this[0];
    }
    set R(red) {
        this[0] = Maths_1.default.CleanFloat(Maths_1.default.Clamp(red, 0, 1));
    }
    get G() {
        return this[1];
    }
    set G(green) {
        this[1] = Maths_1.default.CleanFloat(Maths_1.default.Clamp(green, 0, 1));
    }
    get B() {
        return this[2];
    }
    set B(blue) {
        this[2] = Maths_1.default.CleanFloat(Maths_1.default.Clamp(blue, 0, 1));
    }
    get A() {
        return this[3];
    }
    set A(alpha) {
        this[3] = Maths_1.default.CleanFloat(Maths_1.default.Clamp(alpha, 0, 1));
    }
    get BIN() {
        let str = 'b';
        this.forEach(i => str += Math.round(i * 255).toString(2));
        return str;
    }
    get OCT() {
        let str = 'o';
        this.forEach(i => str += Math.round(i * 255).toString(8));
        return str;
    }
    get DEC() {
        let str = '';
        this.forEach(i => str += i.toString(10) + ',');
        return str.substring(0, str.length - 1);
    }
    get HEX() {
        let str = '#';
        this.forEach(i => str += Math.round(i * 255).toString(16));
        return str;
    }
    constructor(r, g, b, a) {
        super(4);
        this.Set(r, g, b, a);
    }
    Set(r, g, b, a) {
        return Colour4.Set(this, r, b, g, a);
    }
    static Set(colour, r, g, b, a) {
        [r, g, b, a] = Colour4.Deconstruct(r, g, b, a);
        colour.R = r;
        colour.G = g;
        colour.B = b;
        colour.A = a;
        return colour;
    }
    static Deconstruct(r, g, b, a) {
        if (typeof r === 'string') {
            if (r.match(/#([0-9A-F]{3}){1,2}/i)) {
                [r, g, b, a] = r.substring(1)
                    .toUpperCase()
                    .split('')
                    .map(c => parseInt(c, 16));
            }
            else if (r.match(/#[0-9A-F]{6}/i)) {
                [r, g, b, a] = r.substring(1)
                    .toUpperCase()
                    .split(/(?=(?:..)*$)/)
                    .map(c => parseInt(c, 16));
            }
            else {
                [r, g, b, a] = [0, 0, 0, 0];
            }
        }
        else if (r instanceof Colour3_1.default || r instanceof Colour4 || r instanceof Float32Array || r instanceof Array) {
            [r, g, b, a] = r;
        }
        return [r, g, b, a];
    }
}
exports.default = Colour4;

},{"../Maths/Maths":17,"./Colour3":25}],27:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayUtils_1 = __importDefault(require("../Utility/ArrayUtils"));
const FWGE_1 = __importDefault(require("../FWGE"));
const Item_1 = __importDefault(require("../Item"));
var BufferType;
(function (BufferType) {
    BufferType[BufferType["INDEX"] = 0] = "INDEX";
    BufferType[BufferType["POSITION"] = 1] = "POSITION";
})(BufferType = exports.BufferType || (exports.BufferType = {}));
class IMesh {
}
exports.IMesh = IMesh;
class Mesh extends Item_1.default {
    constructor({ name = 'Mesh', position, uv, colour, normal, index, wireframe } = new IMesh) {
        super(name);
        if (colour && colour.length === 0) {
            colour = undefined;
        }
        if (uv && uv.length === 0) {
            uv = undefined;
        }
        if (wireframe && wireframe.length === 0) {
            wireframe = undefined;
        }
        this.PositionBuffer = this.Bind(FWGE_1.default.GL, BufferType.POSITION, position);
        this.UVBuffer = this.Bind(FWGE_1.default.GL, BufferType.POSITION, uv);
        this.ColourBuffer = this.Bind(FWGE_1.default.GL, BufferType.POSITION, colour);
        this.NormalBuffer = this.Bind(FWGE_1.default.GL, BufferType.POSITION, normal);
        this.IndexBuffer = this.Bind(FWGE_1.default.GL, BufferType.INDEX, index);
        this.WireframeBuffer = this.Bind(FWGE_1.default.GL, BufferType.INDEX, wireframe);
        this.VertexCount = index.length;
    }
    Bind(gl, type, data) {
        if (!data) {
            return null;
        }
        let buffer = gl.createBuffer();
        data = ArrayUtils_1.default.Flatten(data);
        switch (type) {
            case BufferType.INDEX:
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(data), gl.STATIC_DRAW);
                break;
            case BufferType.POSITION:
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
                break;
        }
        return buffer;
    }
    Unbind(gl, buffer) {
        gl.deleteBuffer(buffer);
    }
}
exports.default = Mesh;

},{"../FWGE":5,"../Item":11,"../Utility/ArrayUtils":46}],28:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Maths_1 = __importDefault(require("../Maths/Maths"));
const Matrix4_1 = __importDefault(require("../Maths/Matrix4"));
const Stack_1 = __importDefault(require("../Utility/Stack"));
let MVStack = new Stack_1.default();
class ModelView {
    static Push(transform) {
        MVStack.Push(this.Transform(transform));
        return ModelView.Peek();
    }
    static Peek() {
        let mat = MVStack.Peek();
        if (!mat) {
            return Matrix4_1.default.IDENTITY;
        }
        return mat;
    }
    static Pop() {
        let mat = MVStack.Pop();
        if (!mat) {
            return Matrix4_1.default.IDENTITY;
        }
        return mat;
    }
    static Transform({ Position, Rotation, Scale, Shear }) {
        return this.Shear(this.Scale(this.Rotate(this.Translate(this.Peek(), Position), Rotation), Scale), Shear);
    }
    static Translate(matrix, translation) {
        return new Matrix4_1.default(matrix.M11, matrix.M12, matrix.M13, matrix.M14, matrix.M21, matrix.M22, matrix.M23, matrix.M24, matrix.M31, matrix.M32, matrix.M33, matrix.M34, matrix.M11 * translation.X + matrix.M21 * translation.Y + matrix.M31 * translation.Z + matrix.M41, matrix.M12 * translation.X + matrix.M22 * translation.Y + matrix.M32 * translation.Z + matrix.M42, matrix.M13 * translation.X + matrix.M23 * translation.Y + matrix.M33 * translation.Z + matrix.M43, matrix.M14 * translation.X + matrix.M24 * translation.Y + matrix.M34 * translation.Z + matrix.M44);
    }
    static Rotate(matrix, rotation) {
        let x = Maths_1.default.Radian(rotation.X);
        let y = Maths_1.default.Radian(rotation.Y);
        let z = Maths_1.default.Radian(rotation.Z);
        return new Matrix4_1.default(Math.cos(z), -Math.sin(z), 0.0, 0.0, Math.sin(z), Math.cos(z), 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0).Mult(Math.cos(y), 0.0, Math.sin(y), 0.0, 0.0, 1.0, 0.0, 0.0, -Math.sin(y), 0.0, Math.cos(y), 0.0, 0.0, 0.0, 0.0, 1.0).Mult(1.0, 0.0, 0.0, 0.0, 0.0, Math.cos(x), -Math.sin(x), 0.0, 0.0, Math.sin(x), Math.cos(x), 0.0, 0.0, 0.0, 0.0, 1.0).Mult(matrix);
    }
    static Scale(matrix, scalers) {
        return new Matrix4_1.default(matrix.M11 * scalers.X, matrix.M12 * scalers.X, matrix.M13 * scalers.X, matrix.M14 * scalers.X, matrix.M21 * scalers.Y, matrix.M22 * scalers.Y, matrix.M23 * scalers.Y, matrix.M24 * scalers.Y, matrix.M31 * scalers.Z, matrix.M32 * scalers.Z, matrix.M33 * scalers.Z, matrix.M34 * scalers.Z, matrix.M41, matrix.M42, matrix.M43, matrix.M44);
    }
    static Shear(matrix, angles) {
        var phi = Maths_1.default.Radian(angles.X);
        var theta = Maths_1.default.Radian(angles.Y);
        var rho = Maths_1.default.Radian(angles.Z);
        return new Matrix4_1.default(1.0, 0.0, Math.tan(rho), 0.0, Math.tan(phi), 1.0, 0.0, 0.0, 0.0, Math.tan(theta), 1.0, 0.0, 0.0, 0.0, 0.0, 1.0).Mult(matrix);
    }
}
exports.default = ModelView;

},{"../Maths/Maths":17,"../Maths/Matrix4":20,"../Utility/Stack":50}],29:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Maths_1 = __importDefault(require("../Maths/Maths"));
const Matrix4_1 = __importDefault(require("../Maths/Matrix4"));
class Projection {
    static Orthographic(left, right, top, bottom, near, far, theta, phi) {
        theta = Maths_1.default.Cot(Maths_1.default.Radian(theta));
        phi = Maths_1.default.Cot(Maths_1.default.Radian(phi));
        left -= near * theta;
        right -= near * theta;
        top -= near * phi;
        bottom -= near * phi;
        return new Matrix4_1.default(2 / (right - left), 0, 0, 0, 0, 2 / (top - bottom), 0, 0, theta, phi, -2 / (far - near), 0, -(left + right) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1);
    }
    static Perspective(field_of_view, aspect_ratio, near, far) {
        let top = near * Math.tan(Maths_1.default.Radian(field_of_view));
        let right = top * aspect_ratio;
        let left = -right;
        let bottom = -top;
        let width = right - left;
        let height = top - bottom;
        let depth = far - near;
        return new Matrix4_1.default(2 * near / width, 0, 0, 0, 0, 2 * near / height, 0, 0, (right + left) / width, (top + bottom) / height, -(far + near) / depth, -1, 0, 0, -(2 * far * near) / depth, 1);
    }
}
exports.default = Projection;

},{"../Maths/Maths":17,"../Maths/Matrix4":20}],30:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Colour4_1 = __importDefault(require("./Colour4"));
const FWGE_1 = __importDefault(require("../FWGE"));
const Item_1 = __importDefault(require("../Item"));
const Maths_1 = __importDefault(require("../Maths/Maths"));
class IRenderMaterial {
}
exports.IRenderMaterial = IRenderMaterial;
class RenderMaterial extends Item_1.default {
    constructor({ name = 'Render Material', ambient = [0.50, 0.50, 0.50, 1.00], diffuse = [0.75, 0.75, 0.75, 1.00], specular = [1.00, 1.00, 1.00, 1.00], alpha = 1, shininess = 5, shader, imagemap } = new IRenderMaterial) {
        super(name);
        this.Ambient = new Colour4_1.default(ambient);
        this.Diffuse = new Colour4_1.default(diffuse);
        this.Specular = new Colour4_1.default(specular);
        this.Alpha = alpha;
        this.Shininess = shininess;
        this.Shader = shader;
        if (imagemap) {
            RenderMaterial.ApplyImage(this, imagemap, 'image');
        }
    }
    static ApplyImage(material, src, type) {
        let img = new Image();
        let texture = null;
        switch (type) {
            case 'image':
                material.ImageMap = FWGE_1.default.GL.createTexture();
                texture = material.ImageMap;
                break;
            case 'bump':
                material.BumpMap = FWGE_1.default.GL.createTexture();
                texture = material.BumpMap;
                break;
            case 'specular':
                material.SpecularMap = FWGE_1.default.GL.createTexture();
                texture = material.SpecularMap;
                break;
            default: texture = null;
        }
        FWGE_1.default.GL.bindTexture(FWGE_1.default.GL.TEXTURE_2D, texture);
        FWGE_1.default.GL.texImage2D(FWGE_1.default.GL.TEXTURE_2D, 0, FWGE_1.default.GL.RGBA, 1, 1, 0, FWGE_1.default.GL.RGBA, FWGE_1.default.GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
        img.onload = function () {
            FWGE_1.default.GL.bindTexture(FWGE_1.default.GL.TEXTURE_2D, texture);
            FWGE_1.default.GL.texImage2D(FWGE_1.default.GL.TEXTURE_2D, 0, FWGE_1.default.GL.RGBA, FWGE_1.default.GL.RGBA, FWGE_1.default.GL.UNSIGNED_BYTE, img);
            if (Maths_1.default.IsPowerOf2(img.width) && Maths_1.default.IsPowerOf2(img.height)) {
                FWGE_1.default.GL.generateMipmap(FWGE_1.default.GL.TEXTURE_2D);
                FWGE_1.default.GL.texParameteri(FWGE_1.default.GL.TEXTURE_2D, FWGE_1.default.GL.TEXTURE_MAG_FILTER, FWGE_1.default.GL.LINEAR);
                FWGE_1.default.GL.texParameteri(FWGE_1.default.GL.TEXTURE_2D, FWGE_1.default.GL.TEXTURE_MIN_FILTER, FWGE_1.default.GL.LINEAR_MIPMAP_NEAREST);
            }
            else {
                FWGE_1.default.GL.texParameteri(FWGE_1.default.GL.TEXTURE_2D, FWGE_1.default.GL.TEXTURE_WRAP_S, FWGE_1.default.GL.CLAMP_TO_EDGE);
                FWGE_1.default.GL.texParameteri(FWGE_1.default.GL.TEXTURE_2D, FWGE_1.default.GL.TEXTURE_WRAP_T, FWGE_1.default.GL.CLAMP_TO_EDGE);
                FWGE_1.default.GL.texParameteri(FWGE_1.default.GL.TEXTURE_2D, FWGE_1.default.GL.TEXTURE_MIN_FILTER, FWGE_1.default.GL.LINEAR);
            }
            FWGE_1.default.GL.bindTexture(FWGE_1.default.GL.TEXTURE_2D, null);
        };
        img.src = src;
    }
}
exports.default = RenderMaterial;

},{"../FWGE":5,"../Item":11,"../Maths/Maths":17,"./Colour4":26}],31:[function(require,module,exports){
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AmbientLight_1 = __importStar(require("../Light/AmbientLight"));
const DirectionalLight_1 = __importStar(require("../Light/DirectionalLight"));
const FWGE_1 = require("../FWGE");
const GameObject_1 = __importStar(require("../GameObject"));
const ModelView_1 = __importDefault(require("./ModelView"));
const Matrix3_1 = __importDefault(require("../Maths/Matrix3"));
const PointLight_1 = __importStar(require("../Light/PointLight"));
const Projection_1 = __importDefault(require("./Projection"));
const Shader_1 = require("../Shader/Shader");
const Camera_1 = __importDefault(require("../Camera/Camera"));
const ParticleSystem_1 = __importStar(require("../ParticleSystem"));
const List_1 = __importDefault(require("../Utility/List"));
function InitRender() {
    FWGE_1.GL.enable(FWGE_1.GL.DEPTH_TEST);
    FWGE_1.GL.disable(FWGE_1.GL.BLEND);
    FWGE_1.GL.blendFunc(FWGE_1.GL.SRC_ALPHA, FWGE_1.GL.ONE);
}
exports.InitRender = InitRender;
function UpdateRender() {
    ClearBuffers();
    SetGlobalUniforms();
    for (let gameObject of GameObject_1.GameObjects) {
        Render(gameObject);
    }
    for (let particleSystem of ParticleSystem_1.ParticleSystems) {
        Render(particleSystem);
    }
}
exports.UpdateRender = UpdateRender;
function ClearBuffers() {
    for (let shader of Shader_1.Shaders) {
        FWGE_1.GL.bindFramebuffer(FWGE_1.GL.FRAMEBUFFER, shader.FrameBuffer);
        FWGE_1.GL.viewport(0, 0, shader.Width, shader.Height);
        FWGE_1.GL.clear(FWGE_1.GL.COLOR_BUFFER_BIT | FWGE_1.GL.DEPTH_BUFFER_BIT);
    }
    FWGE_1.GL.bindFramebuffer(FWGE_1.GL.FRAMEBUFFER, null);
    FWGE_1.GL.viewport(0, 0, FWGE_1.GL.drawingBufferWidth, FWGE_1.GL.drawingBufferHeight);
    FWGE_1.GL.clear(FWGE_1.GL.COLOR_BUFFER_BIT | FWGE_1.GL.DEPTH_BUFFER_BIT);
}
function Render(item) {
    if (item instanceof ParticleSystem_1.default) {
        for (var particle of item.Particles) {
            ModelView_1.default.Push(particle);
            RenderObject({
                material: item.Material,
                mesh: item.Mesh,
                shader: item.Material.Shader,
                modelView: ModelView_1.default.Pop()
            });
        }
    }
    else if (item instanceof GameObject_1.default) {
        if (item.Children.length > 0) {
            ModelView_1.default.Push(item.Transform);
            item.Children.forEach(child => Render(child));
        }
        if (item.Visible) {
            ModelView_1.default.Push(item.Transform);
            RenderObject({
                material: item.Material,
                mesh: item.Mesh,
                shader: item.Material.Shader,
                modelView: ModelView_1.default.Pop()
            });
        }
    }
}
function RenderObject({ mesh, material, shader, modelView }) {
    FWGE_1.GL.useProgram(shader.Program);
    FWGE_1.GL.enableVertexAttribArray(shader.Attributes.Position);
    if (shader.Attributes.Normal !== -1) {
        FWGE_1.GL.enableVertexAttribArray(shader.Attributes.Normal);
    }
    if (shader.Attributes.Colour !== -1) {
        FWGE_1.GL.enableVertexAttribArray(shader.Attributes.Colour);
    }
    if (shader.Attributes.UV !== -1) {
        FWGE_1.GL.enableVertexAttribArray(shader.Attributes.UV);
    }
    if (material.Alpha !== 1.0) {
        FWGE_1.GL.enable(FWGE_1.GL.BLEND);
        FWGE_1.GL.disable(FWGE_1.GL.DEPTH_TEST);
    }
    BindAttributes(mesh, shader.Attributes);
    SetObjectUniforms(material, shader.Uniforms, modelView);
    Draw(mesh.VertexCount, shader.FrameBuffer);
    if (material.Alpha !== 1.0) {
        FWGE_1.GL.enable(FWGE_1.GL.DEPTH_TEST);
        FWGE_1.GL.disable(FWGE_1.GL.BLEND);
    }
    FWGE_1.GL.disableVertexAttribArray(shader.Attributes.Position);
    if (shader.Attributes.Normal !== -1) {
        FWGE_1.GL.disableVertexAttribArray(shader.Attributes.Normal);
    }
    if (shader.Attributes.Colour !== -1) {
        FWGE_1.GL.disableVertexAttribArray(shader.Attributes.Colour);
    }
    if (shader.Attributes.UV !== -1) {
        FWGE_1.GL.disableVertexAttribArray(shader.Attributes.UV);
    }
    FWGE_1.GL.useProgram(null);
}
function BindAttributes(mesh, attributes) {
    FWGE_1.GL.bindBuffer(FWGE_1.GL.ARRAY_BUFFER, mesh.PositionBuffer);
    FWGE_1.GL.vertexAttribPointer(attributes.Position, 3, FWGE_1.GL.FLOAT, false, 0, 0);
    if (attributes.UV !== -1) {
        if (mesh.UVBuffer) {
            FWGE_1.GL.bindBuffer(FWGE_1.GL.ARRAY_BUFFER, mesh.UVBuffer);
            FWGE_1.GL.vertexAttribPointer(attributes.UV, 2, FWGE_1.GL.FLOAT, false, 0, 0);
        }
        else {
            FWGE_1.GL.disableVertexAttribArray(attributes.UV);
        }
    }
    if (attributes.Colour !== -1) {
        if (mesh.ColourBuffer) {
            FWGE_1.GL.bindBuffer(FWGE_1.GL.ARRAY_BUFFER, mesh.ColourBuffer);
            FWGE_1.GL.vertexAttribPointer(attributes.Colour, 3, FWGE_1.GL.FLOAT, false, 0, 0);
        }
        else {
            FWGE_1.GL.disableVertexAttribArray(attributes.Colour);
        }
    }
    if (attributes.Normal !== -1) {
        if (!!mesh.NormalBuffer) {
            FWGE_1.GL.bindBuffer(FWGE_1.GL.ARRAY_BUFFER, mesh.NormalBuffer);
            FWGE_1.GL.vertexAttribPointer(attributes.Normal, 3, FWGE_1.GL.FLOAT, false, 0, 0);
        }
        else {
            FWGE_1.GL.disableVertexAttribArray(attributes.Normal);
        }
    }
    FWGE_1.GL.bindBuffer(FWGE_1.GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);
}
function SetObjectUniforms(material, uniforms, mv) {
    FWGE_1.GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, mv);
    FWGE_1.GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, new Matrix3_1.default(mv.Clone().Inverse()));
    FWGE_1.GL.uniform4fv(uniforms.Material.Ambient, material.Ambient);
    FWGE_1.GL.uniform4fv(uniforms.Material.Diffuse, material.Diffuse);
    FWGE_1.GL.uniform4fv(uniforms.Material.Specular, material.Specular);
    FWGE_1.GL.uniform1f(uniforms.Material.Shininess, material.Shininess);
    FWGE_1.GL.uniform1f(uniforms.Material.Alpha, material.Alpha);
    if (material.ImageMap) {
        FWGE_1.GL.activeTexture(FWGE_1.GL.TEXTURE0);
        FWGE_1.GL.bindTexture(FWGE_1.GL.TEXTURE_2D, material.ImageMap);
        FWGE_1.GL.uniform1i(uniforms.Material.HasImage, 1);
        FWGE_1.GL.uniform1i(uniforms.Sampler.Image, 0);
    }
    else {
        FWGE_1.GL.activeTexture(FWGE_1.GL.TEXTURE0);
        FWGE_1.GL.bindTexture(FWGE_1.GL.TEXTURE_2D, null);
        FWGE_1.GL.uniform1i(uniforms.Material.HasImage, 0);
    }
    if (material.BumpMap) {
        FWGE_1.GL.activeTexture(FWGE_1.GL.TEXTURE1);
        FWGE_1.GL.bindTexture(FWGE_1.GL.TEXTURE_2D, material.BumpMap);
        FWGE_1.GL.uniform1i(uniforms.Material.HasBump, 1);
        FWGE_1.GL.uniform1i(uniforms.Sampler.Bump, 1);
    }
    else {
        FWGE_1.GL.activeTexture(FWGE_1.GL.TEXTURE1);
        FWGE_1.GL.bindTexture(FWGE_1.GL.TEXTURE_2D, null);
        FWGE_1.GL.uniform1i(uniforms.Material.HasBump, 0);
    }
    if (material.SpecularMap) {
        FWGE_1.GL.activeTexture(FWGE_1.GL.TEXTURE2);
        FWGE_1.GL.bindTexture(FWGE_1.GL.TEXTURE_2D, material.SpecularMap);
        FWGE_1.GL.uniform1i(uniforms.Material.HasSpecular, 1);
        FWGE_1.GL.uniform1i(uniforms.Sampler.Specular, 2);
    }
    else {
        FWGE_1.GL.activeTexture(FWGE_1.GL.TEXTURE2);
        FWGE_1.GL.bindTexture(FWGE_1.GL.TEXTURE_2D, null);
        FWGE_1.GL.uniform1i(uniforms.Material.HasBump, 0);
    }
}
function SetGlobalUniforms() {
    var i = Shader_1.Shaders.length;
    let Lights = new List_1.default([].concat(AmbientLight_1.AmbientLights.ToArray(), DirectionalLight_1.DirectionalLights.ToArray(), PointLight_1.PointLights.ToArray()));
    for (let shader of Shader_1.Shaders) {
        FWGE_1.GL.useProgram(shader.Program);
        let point_count = 0;
        let matrix = shader.Uniforms.Matrix;
        let uniforms = shader.Uniforms.Light;
        for (let light of Lights) {
            if (light instanceof AmbientLight_1.default) {
                FWGE_1.GL.uniform4fv(uniforms.Ambient.Colour, light.Colour);
                FWGE_1.GL.uniform1f(uniforms.Ambient.Intensity, light.Intensity);
            }
            else if (light instanceof DirectionalLight_1.default) {
                FWGE_1.GL.uniform4fv(uniforms.Directional.Colour, light.Colour);
                FWGE_1.GL.uniform1f(uniforms.Directional.Intensity, light.Intensity);
                FWGE_1.GL.uniform3fv(uniforms.Directional.Direction, light.Direction);
            }
            else if (light instanceof PointLight_1.default) {
                FWGE_1.GL.uniform4fv(uniforms.Point[point_count].Colour, light.Colour);
                FWGE_1.GL.uniform1f(uniforms.Point[point_count].Intensity, light.Intensity);
                FWGE_1.GL.uniform3fv(uniforms.Point[point_count].Position, light.Position);
                FWGE_1.GL.uniform1f(uniforms.Point[point_count].Radius, light.Radius);
                FWGE_1.GL.uniform1f(uniforms.Point[point_count].Angle, light.Angle);
                ++point_count;
            }
        }
        let main = Camera_1.default.Main;
        FWGE_1.GL.uniform1i(uniforms.PointCount, point_count);
        FWGE_1.GL.uniformMatrix4fv(matrix.Projection, false, Projection_1.default.Perspective(main.FieldOfView, main.AspectRatio, main.NearClipping, main.FarClipping));
    }
    FWGE_1.GL.useProgram(null);
}
function Draw(vertexCount, framebuffer) {
    FWGE_1.GL.bindFramebuffer(FWGE_1.GL.FRAMEBUFFER, null);
    FWGE_1.GL.drawElements(FWGE_1.GL.TRIANGLES, vertexCount, FWGE_1.GL.UNSIGNED_BYTE, 0);
    FWGE_1.GL.bindFramebuffer(FWGE_1.GL.FRAMEBUFFER, null);
}

},{"../Camera/Camera":4,"../FWGE":5,"../GameObject":6,"../Light/AmbientLight":12,"../Light/DirectionalLight":13,"../Light/PointLight":15,"../Maths/Matrix3":19,"../ParticleSystem":24,"../Shader/Shader":44,"../Utility/List":49,"./ModelView":28,"./Projection":29}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IFragmentShader {
}
exports.IFragmentShader = IFragmentShader;
function FragmentShader(fs) {
    let shader = '#Fragment Stuffs\n';
    if (fs.uniform.material) {
        shader += '\nstruct Matrix\n{\n';
        if (fs.uniform.material.ambient)
            shader += '\tvec4 Ambient;\n';
        if (fs.uniform.material.diffuse)
            shader += '\tvec4 Diffuse;\n';
        if (fs.uniform.material.specular)
            shader += '\tvec4 Specular;\n';
        shader += '\n};\n';
    }
    return shader;
}
exports.default = FragmentShader;

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ShaderFieldType {
    constructor(name, value, type) {
        this.name = name;
        this.value = value;
        this.type = type;
    }
}
class ShaderBool extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'bool');
    }
}
exports.ShaderBool = ShaderBool;
class ShaderInt extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'int');
    }
}
exports.ShaderInt = ShaderInt;
class ShaderUInt extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'uint');
    }
}
exports.ShaderUInt = ShaderUInt;
class ShaderFloat extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'float');
    }
}
exports.ShaderFloat = ShaderFloat;
class ShaderBVec2 extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'bvec2');
    }
}
exports.ShaderBVec2 = ShaderBVec2;
class ShaderBVec3 extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'bvec3');
    }
}
exports.ShaderBVec3 = ShaderBVec3;
class ShaderBVec4 extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'bvec4');
    }
}
exports.ShaderBVec4 = ShaderBVec4;
class ShaderIVec2 extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'ivec2');
    }
}
exports.ShaderIVec2 = ShaderIVec2;
class ShaderIVec3 extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'ivec3');
    }
}
exports.ShaderIVec3 = ShaderIVec3;
class ShaderIVec4 extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'ivec4');
    }
}
exports.ShaderIVec4 = ShaderIVec4;
class ShaderUVec2 extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'uvec2');
    }
}
exports.ShaderUVec2 = ShaderUVec2;
class ShaderUVec3 extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'uvec3');
    }
}
exports.ShaderUVec3 = ShaderUVec3;
class ShaderUVec4 extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'uvec4');
    }
}
exports.ShaderUVec4 = ShaderUVec4;
class ShaderVec2 extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'vec2');
    }
}
exports.ShaderVec2 = ShaderVec2;
class ShaderVec3 extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'vec3');
    }
}
exports.ShaderVec3 = ShaderVec3;
class ShaderVec4 extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'vec4');
    }
}
exports.ShaderVec4 = ShaderVec4;
class ShaderMat2 extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'mat2');
    }
}
exports.ShaderMat2 = ShaderMat2;
class ShaderMat3 extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'mat3');
    }
}
exports.ShaderMat3 = ShaderMat3;
class ShaderMat4 extends ShaderFieldType {
    constructor(name, value) {
        super(name, value, 'mat4');
    }
}
exports.ShaderMat4 = ShaderMat4;
var ShaderFieldScale;
(function (ShaderFieldScale) {
    ShaderFieldScale[ShaderFieldScale["Self"] = 0] = "Self";
})(ShaderFieldScale = exports.ShaderFieldScale || (exports.ShaderFieldScale = {}));
class ShaderNode {
    constructor(content, inputs) {
        this.Content = content;
        this.Inputs = inputs;
    }
}
exports.ShaderNode = ShaderNode;

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IShaderField {
}
exports.IShaderField = IShaderField;
class IVertexAttribute {
}
exports.IVertexAttribute = IVertexAttribute;
class IVertexUniform {
}
exports.IVertexUniform = IVertexUniform;
class IVertexShader {
}
exports.IVertexShader = IVertexShader;
function VertexShader(vs) {
    let shader = '#Vertex Stuffs\n';
    if (vs.attribute) {
        shader += '\n';
        if (vs.attribute.position)
            shader += 'attribute vec3 A_Position;';
        if (vs.attribute.uv)
            shader += 'attribute vec3 A_UV;';
        if (vs.attribute.colour)
            shader += 'attribute vec3 A_Colour;';
        if (vs.attribute.normal)
            shader += 'attribute vec3 A_Normal;';
        shader += '\n';
    }
    if (vs.uniform) {
        shader += '\n';
        if (vs.uniform.modelview)
            shader += 'mat4 ModelView;\n';
        if (vs.uniform.normal)
            shader += 'mat4 Normal;\n';
        if (vs.uniform.projection)
            shader += 'mat3 Projection;\n';
        shader += '\n';
    }
    return shader;
}
exports.default = VertexShader;

},{}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AmbientUniforms {
    constructor(gl, program) {
        this.Colour = gl.getUniformLocation(program, 'U_AmbientColour');
        this.Intensity = gl.getUniformLocation(program, 'U_AmbientIntensity');
    }
}
exports.default = AmbientUniforms;

},{}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DirectionalUniforms {
    constructor(gl, program) {
        this.Colour = gl.getUniformLocation(program, 'U_DirectionalColour');
        this.Intensity = gl.getUniformLocation(program, 'U_DirectionalIntensity');
        this.Direction = gl.getUniformLocation(program, 'U_DirectionalDirection');
    }
}
exports.default = DirectionalUniforms;

},{}],37:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AmbientUniforms_1 = __importDefault(require("./AmbientUniforms"));
const DirectionalUniforms_1 = __importDefault(require("./DirectionalUniforms"));
const PointUniform_1 = __importDefault(require("./PointUniform"));
class LightUniforms {
    constructor(gl, program) {
        this.Ambient = new AmbientUniforms_1.default(gl, program);
        this.Directional = new DirectionalUniforms_1.default(gl, program);
        this.PointCount = gl.getUniformLocation(program, `U_Point_Count`);
        this.Point = new Array();
        for (var i = 0; i < LightUniforms.MAX_LIGHT; ++i) {
            this.Point.push(new PointUniform_1.default(gl, program, i));
        }
    }
}
LightUniforms.MAX_LIGHT = 8;
exports.default = LightUniforms;

},{"./AmbientUniforms":35,"./DirectionalUniforms":36,"./PointUniform":40}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MaterialUniforms {
    constructor(gl, program) {
        this.Ambient = gl.getUniformLocation(program, 'U_MaterialAmbient');
        this.Diffuse = gl.getUniformLocation(program, 'U_MaterialDiffuse');
        this.Specular = gl.getUniformLocation(program, 'U_MaterialSpecular');
        this.Shininess = gl.getUniformLocation(program, 'U_MaterialShininess');
        this.Alpha = gl.getUniformLocation(program, 'U_MaterialAlpha');
        this.HasImage = gl.getUniformLocation(program, 'U_MaterialHasImage');
        this.HasBump = gl.getUniformLocation(program, 'U_MaterialHasBump');
        this.HasSpecular = gl.getUniformLocation(program, 'U_MaterialHasSpecular');
    }
}
exports.default = MaterialUniforms;

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MatrixUniforms {
    constructor(gl, program) {
        this.ModelView = gl.getUniformLocation(program, 'U_MatrixModelView');
        this.Projection = gl.getUniformLocation(program, 'U_MatrixProjection');
        this.Normal = gl.getUniformLocation(program, 'U_MatrixNormal');
        this.Camera = gl.getUniformLocation(program, 'U_MatrixCamera');
    }
}
exports.default = MatrixUniforms;

},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PointUniform {
    constructor(gl, program, index) {
        this.Colour = gl.getUniformLocation(program, `U_Point[${index}].Colour`);
        this.Intensity = gl.getUniformLocation(program, `U_Point[${index}].Intensity`);
        this.Position = gl.getUniformLocation(program, `U_Point[${index}].Position`);
        this.Radius = gl.getUniformLocation(program, `U_Point[${index}].Radius`);
        this.Angle = gl.getUniformLocation(program, `U_Point[${index}].Angle`);
    }
}
exports.default = PointUniform;

},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SamplerUniforms {
    constructor(gl, program) {
        this.Image = gl.getUniformLocation(program, 'U_SamplerImage');
        this.Bump = gl.getUniformLocation(program, 'U_SamplerBump');
        this.Specular = gl.getUniformLocation(program, 'U_SamplerSpecular');
    }
}
exports.default = SamplerUniforms;

},{}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ShaderAttributes {
    constructor(gl, program) {
        this.Position = gl.getAttribLocation(program, 'A_Position');
        this.Colour = gl.getAttribLocation(program, 'A_Colour');
        this.UV = gl.getAttribLocation(program, 'A_UV');
        this.Normal = gl.getAttribLocation(program, 'A_Normal');
    }
}
exports.default = ShaderAttributes;

},{}],43:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MaterialUniforms_1 = __importDefault(require("./MaterialUniforms"));
const MatrixUniforms_1 = __importDefault(require("./MatrixUniforms"));
const LightUniforms_1 = __importDefault(require("./LightUniforms"));
const SamplerUniforms_1 = __importDefault(require("./SamplerUniforms"));
class ShaderUniforms {
    constructor(gl, program) {
        this.Material = new MaterialUniforms_1.default(gl, program);
        this.Matrix = new MatrixUniforms_1.default(gl, program);
        this.Light = new LightUniforms_1.default(gl, program);
        this.Sampler = new SamplerUniforms_1.default(gl, program);
    }
}
exports.default = ShaderUniforms;

},{"./LightUniforms":37,"./MaterialUniforms":38,"./MatrixUniforms":39,"./SamplerUniforms":41}],44:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../Item"));
const ShaderAttributes_1 = __importDefault(require("./Instance/ShaderAttributes"));
const ShaderUniforms_1 = __importDefault(require("./Instance/ShaderUniforms"));
const FWGE_1 = __importDefault(require("../FWGE"));
class IShader {
}
exports.IShader = IShader;
exports.Shaders = new Array();
class Shader extends Item_1.default {
    constructor({ name = 'Shader', height = 1024, width = 1024, vertexshader, fragmentshader } = new IShader) {
        super(name);
        let gl = FWGE_1.default.GL;
        this.Program = gl.createProgram();
        this.Texture = gl.createTexture();
        this.FrameBuffer = gl.createFramebuffer();
        this.RenderBuffer = gl.createRenderbuffer();
        this.Height = height;
        this.Width = width;
        Shader.Init(this, gl, vertexshader, fragmentshader);
        this.Attributes = new ShaderAttributes_1.default(gl, this.Program);
        this.Uniforms = new ShaderUniforms_1.default(gl, this.Program);
        exports.Shaders.push(this);
    }
    static Init(shader, gl, vertexshader, fragmentshader) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, shader.FrameBuffer);
        gl.bindRenderbuffer(gl.RENDERBUFFER, shader.RenderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, shader.Width, shader.Height);
        gl.bindTexture(gl.TEXTURE_2D, shader.Texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, shader.Width, shader.Height, 0, gl.RGBA, gl.UNSIGNED_BYTE, undefined);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, shader.Texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, shader.RenderBuffer);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        let errorLog = [];
        let vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vertexshader);
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            errorLog.push('Vertex Shader: ' + gl.getShaderInfoLog(vs));
        }
        let fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fragmentshader);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            errorLog.push('Fragment Shader: ' + gl.getShaderInfoLog(fs));
        }
        gl.attachShader(shader.Program, vs);
        gl.attachShader(shader.Program, fs);
        gl.linkProgram(shader.Program);
        if (!gl.getProgramParameter(shader.Program, gl.LINK_STATUS)) {
            errorLog.push(gl.getProgramInfoLog(shader.Program));
        }
        if (errorLog.length > 0) {
            throw errorLog;
        }
    }
}
exports.default = Shader;

},{"../FWGE":5,"../Item":11,"./Instance/ShaderAttributes":42,"./Instance/ShaderUniforms":43}],45:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector3_1 = __importDefault(require("./Maths/Vector3"));
class ITransform {
}
exports.ITransform = ITransform;
class Transform {
    constructor({ position = Vector3_1.default.ZERO, rotation = Vector3_1.default.ZERO, scale = Vector3_1.default.ONE, shear = Vector3_1.default.ZERO } = new ITransform) {
        this.Position = new Vector3_1.default(position);
        this.Rotation = new Vector3_1.default(rotation);
        this.Scale = new Vector3_1.default(scale);
        this.Shear = new Vector3_1.default(shear);
    }
    static get UP() {
        return new Vector3_1.default(0, 1, 0);
    }
    static get FORWARD() {
        return new Vector3_1.default(0, 0, 1);
    }
    static get RIGHT() {
        return new Vector3_1.default(1, 0, 0);
    }
}
exports.default = Transform;

},{"./Maths/Vector3":22}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArrayUtiils {
    static Flatten(list) {
        let flattened = new Array();
        for (let list_item of list) {
            if (typeof list_item === 'number') {
                flattened.push(list_item);
            }
            else {
                flattened.unshift(...list_item);
            }
        }
        return flattened;
    }
}
exports.default = ArrayUtiils;

},{}],47:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Time_1 = __importDefault(require("./Time"));
const GameObject_1 = require("../GameObject");
const Renderer_1 = require("../Render/Renderer");
const Camera_1 = require("../Camera/Camera");
const Animation_1 = require("../Animation/Animation");
const ParticleSystem_1 = require("../ParticleSystem");
class Control {
    static Init(renderUpdate, physicsUpdate) {
        Time_1.default.Init(renderUpdate, physicsUpdate);
        Renderer_1.InitRender();
    }
    static Start() {
        if (Control.AnimationFrame !== -1) {
            window.cancelAnimationFrame(Control.AnimationFrame);
        }
        Time_1.default.Render.Reset();
        Time_1.default.Physics.Reset();
        Control.Run();
    }
    static Stop() {
        if (Control.AnimationFrame !== -1) {
            window.cancelAnimationFrame(Control.AnimationFrame);
        }
    }
    static Run() {
        Control.AnimationFrame = window.requestAnimationFrame(Control.Run);
        Time_1.default.Update();
        for (let particleSystem of ParticleSystem_1.ParticleSystems) {
            particleSystem.Update();
        }
        for (let gameObject of GameObject_1.GameObjects) {
            gameObject.Update();
        }
        for (let animation of Animation_1.Animations) {
            animation.Update();
        }
        for (let camera of Camera_1.Cameras) {
            camera.Update();
        }
        if (Time_1.default.Render.Ready) {
            Renderer_1.UpdateRender();
        }
    }
}
Control.Running = false;
Control.AnimationFrame = -1;
exports.default = Control;

},{"../Animation/Animation":2,"../Camera/Camera":4,"../GameObject":6,"../ParticleSystem":24,"../Render/Renderer":31,"./Time":51}],48:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector2_1 = __importDefault(require("../../Maths/Vector2"));
const Vector3_1 = __importDefault(require("../../Maths/Vector3"));
const Mesh_1 = __importDefault(require("../../Render/Mesh"));
const GameObject_1 = __importDefault(require("../../GameObject"));
const Colour4_1 = __importDefault(require("../../Render/Colour4"));
const RenderMaterial_1 = __importStar(require("../../Render/RenderMaterial"));
class OBJConverter {
    static Parse(obj, mtl) {
        return new GameObject_1.default({
            mesh: OBJConverter.ParseMesh(obj),
            material: OBJConverter.ParseRenderMaterial(mtl)
        });
    }
    static ParseMesh(obj) {
        let lines = obj.split('\n');
        let vertices = [];
        let normals = [];
        let uvs = [];
        let face_offset = 0;
        let wireframe_offset = 0;
        let { name, position, normal, uv, colour, index, wireframe } = {
            position: new Array(),
            normal: new Array(),
            uv: new Array(),
            colour: new Array(),
            index: new Array(),
            wireframe: new Array()
        };
        for (let line of lines) {
            line = line.trim();
            let key = line.split(' ')[0];
            let value = line.substring(key.length).trim();
            let values = value.split(' ');
            switch (key) {
                case 'o':
                    name = value;
                    break;
                case 'v':
                    vertices.push(new Vector3_1.default(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])));
                    break;
                case 'vn':
                    normals.push(new Vector3_1.default(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])));
                    break;
                case 'vt':
                    uvs.push(new Vector2_1.default(parseFloat(values[0]), parseFloat(values[1])));
                    break;
                case 'f':
                    for (var i = 0; i < values.length; ++i) {
                        let faces = values[i].split('/').map(val => parseInt(val) - 1);
                        if (!isNaN(faces[0])) {
                            position.push(vertices[faces[0]]);
                        }
                        if (!isNaN(faces[1])) {
                            uv.push(uvs[faces[1]]);
                        }
                        if (!isNaN(faces[2])) {
                            normal.push(normals[faces[2]]);
                        }
                        if (i >= 2) {
                            index.push(face_offset, face_offset + i - 1, face_offset + i);
                        }
                    }
                    for (var i = 0; i < values.length; ++i) {
                        if (i === values.length - 1) {
                            wireframe.concat(wireframe_offset + i, wireframe_offset);
                        }
                        else {
                            wireframe.concat(wireframe_offset + i, wireframe_offset + i + 1);
                        }
                    }
                    wireframe_offset += values.length;
                    face_offset += values.length;
                    break;
            }
        }
        return new Mesh_1.default({ name, position, normal, uv, colour, index, wireframe });
    }
    static ParseRenderMaterial(mtl) {
        let lines = mtl.split('\n');
        let { name, shininess, ambient, diffuse, specular, alpha, imagemap } = new RenderMaterial_1.IRenderMaterial;
        for (let line of lines) {
            line = line.trim();
            var key = line.split(' ')[0];
            var value = line.substring(key.length).trim();
            var values = value.split(' ');
            switch (key) {
                case 'newmtl':
                    name = value;
                    break;
                case 'Ns':
                    shininess = parseFloat(value);
                    break;
                case 'Ka':
                    ambient = new Colour4_1.default(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                    break;
                case 'Kd':
                    diffuse = new Colour4_1.default(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                    break;
                case 'Ks':
                    specular = new Colour4_1.default(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                    break;
                case 'd':
                    alpha = parseFloat(value);
                    break;
                case 'Tr':
                    alpha = 1 - parseFloat(value);
                    break;
                case 'map_Kd':
                    imagemap = value;
                    break;
            }
        }
        return new RenderMaterial_1.default({ name, shininess, ambient, diffuse, specular, alpha, imagemap });
    }
}
exports.default = OBJConverter;

},{"../../GameObject":6,"../../Maths/Vector2":21,"../../Maths/Vector3":22,"../../Render/Colour4":26,"../../Render/Mesh":27,"../../Render/RenderMaterial":30}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ListNode {
    constructor(value, previous, next) {
        this.Previous = previous;
        this.Next = next;
        this.Value = value;
    }
}
exports.ListNode = ListNode;
class ListIterator {
    constructor(root) {
        this.curr = root;
    }
    [Symbol.iterator]() {
        return this;
    }
    next(value) {
        let result = {
            done: !this.curr,
            value: undefined
        };
        if (this.curr) {
            result.value = this.curr.Value;
            this.curr = this.curr.Next;
        }
        return result;
    }
    return(value) {
        return this.next(value);
    }
    throw(e) {
        throw new Error(e);
    }
}
exports.ListIterator = ListIterator;
class List {
    constructor(arg) {
        if (arg !== undefined) {
            if (typeof arg === 'number') {
                this.Size = arg;
            }
            else {
                this.Size = arg.length;
                this.AddMany(...arg);
            }
        }
        else {
            this.Size = Number.MAX_SAFE_INTEGER;
        }
    }
    get Count() {
        let node = this.head;
        let count = 0;
        while (node) {
            node = node.Next;
            count++;
        }
        return count;
    }
    Add(value, index) {
        if (!this.head) {
            this.head = new ListNode(value, undefined, undefined);
        }
        else {
            if (!Number.isSafeInteger(index) || index < 0 || index > this.Count) {
                index = this.Count;
            }
            let previous = this.head;
            while (previous && --index > 0) {
                previous = previous.Next;
            }
            if (!previous) {
                return false;
            }
            let node = new ListNode(value, previous, previous.Next);
            previous.Next = node;
        }
        return true;
    }
    AddMany(...values) {
        for (let value of values) {
            this.Add(value);
        }
    }
    AddRange(values) {
        this.AddMany(...values);
    }
    Get(index) {
        if (index < 0 || index > this.Count) {
            return undefined;
        }
        let node = this.head;
        while (node && --index >= 0) {
            node = node.Next;
        }
        return !node ? undefined : node.Value;
    }
    Contains(value) {
        return this.IndexOf(value) !== -1;
    }
    IndexOf(value) {
        let index = 0;
        for (let curr = this.head; curr && curr.Value != value; curr = curr.Next) {
            ++index;
        }
        return index === this.Count ? -1 : index;
    }
    Remove(value, index) {
        let node = this.head;
        let found = false;
        let count = 0;
        while (node && !found) {
            node = node.Next;
            ++count;
            if (node.Value == value) {
                if (index === undefined || index >= count) {
                    found = true;
                }
            }
        }
        if (node === undefined) {
            return false;
        }
        node.Previous.Next = node.Next;
        node.Next.Previous = node.Previous;
        return true;
    }
    RemoveMany(...values) {
        for (let value of values) {
            this.Remove(value);
        }
    }
    RemoveRange(values) {
        this.RemoveMany(...values);
    }
    ToArray() {
        let array = new Array();
        for (let value of this) {
            array.push(value);
        }
        return array;
    }
    toString() {
        let count = this.Count;
        if (count === 0) {
            return "()";
        }
        let node = this.head.Next;
        let str = "(" + this.head.Value;
        while (node) {
            str += "," + node.Value;
            node = node.Next;
        }
        str += ")";
        return str;
    }
    [Symbol.iterator]() {
        return new ListIterator(this.head);
    }
}
exports.default = List;

},{}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StackNode {
    constructor(value, predecessor) {
        this.Value = value;
        this.Predecessor = predecessor;
    }
}
exports.StackNode = StackNode;
class Stack {
    constructor() {
        this.head = undefined;
    }
    Push(value) {
        if (!this.head) {
            this.head = new StackNode(value);
        }
        else {
            let newHead = new StackNode(value, this.head);
            this.head = newHead;
        }
    }
    Peek() {
        if (!this.head) {
            return undefined;
        }
        return this.head.Value;
    }
    Pop() {
        if (!this.head) {
            return undefined;
        }
        let oldHead = this.head;
        this.head = this.head.Predecessor;
        return oldHead.Value;
    }
}
exports.default = Stack;

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimeKeep {
    constructor(period) {
        this.Period = 1000 / period;
        this.Reset();
    }
    Reset() {
        this.Ready = false;
        this.Then = this.Now = Date.now();
        this.Delta = 0;
    }
    Update() {
        this.Then = this.Now;
        this.Now = Date.now();
        if (this.Ready) {
            this.Delta = this.Now - this.Then;
        }
        else {
            this.Delta += this.Now - this.Then;
        }
        if (this.Delta > this.Period) {
            this.Ready = true;
        }
        else {
            this.Ready = false;
        }
    }
}
class Time {
    static Init(render, physics) {
        Time.Render = new TimeKeep(render);
        Time.Physics = new TimeKeep(physics);
    }
    static Update() {
        Time.Render.Update();
        Time.Physics.Update();
    }
}
exports.default = Time;

},{}]},{},[1]);
