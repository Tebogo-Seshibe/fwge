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
const FWGE_1 = __importDefault(require("../../src/FWGE"));
const Control_1 = __importDefault(require("../../src/Utility/Control"));
const OBJConverter_1 = __importDefault(require("../../src/Utility/Converter/OBJConverter"));
let fwge = window;
fwge.Control = Control_1.default;
window.onload = () => {
    let canvas = document.getElementById('canvas');
    FWGE_1.default.Init({
        canvas,
        clear: [0, 0, 0, 0],
        physcisupdate: 30,
        renderupdate: 60
    });
    makeCube();
};
function makeCube() {
    return __awaiter(this, void 0, void 0, function* () {
        let obj = yield (yield fetch('/res/Objects/Cube/Cube.obj')).text();
        let mtl = yield (yield fetch('/res/Objects/Cube/Cube.mtl')).text();
        fwge.object = OBJConverter_1.default.Parse(obj, mtl);
    });
}

},{"../../src/FWGE":3,"../../src/Utility/Control":35,"../../src/Utility/Converter/OBJConverter":36}],2:[function(require,module,exports){
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
class Camera extends Item_1.default {
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
    }
    static get Main() {
        return Camera.Cameras[0];
    }
    static set Main(camera) {
        Camera.Cameras[0] = camera;
    }
    Update() {
        if (FWGE_1.default.GL.canvas.width !== FWGE_1.default.GL.canvas.clientWidth || FWGE_1.default.GL.canvas.height !== FWGE_1.default.GL.canvas.clientHeight) {
            FWGE_1.default.GL.canvas.width = FWGE_1.default.GL.canvas.clientWidth;
            FWGE_1.default.GL.canvas.height = FWGE_1.default.GL.canvas.clientHeight;
        }
        this.AspectRatio = FWGE_1.default.GL.drawingBufferWidth / FWGE_1.default.GL.drawingBufferHeight;
    }
}
Camera.Cameras = [new Camera('Main Camera')];
exports.default = Camera;

},{"../FWGE":3,"../Item":8}],3:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Control_1 = __importDefault(require("./Utility/Control"));
const MouseInput_1 = __importDefault(require("./Input/MouseInput"));
const KeyboardInput_1 = __importDefault(require("./Input/KeyboardInput"));
let GL;
class IFWGE {
}
exports.IFWGE = IFWGE;
class FWGE {
    static get GL() {
        return GL;
    }
    static Init({ canvas, renderupdate = 60, physcisupdate = 30, clear = [0, 0, 0, 1] }) {
        if (!canvas) {
            throw new Error('Field {canvas: HTMLCanvasElement} is required');
        }
        GL = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!GL) {
            throw new Error('Webgl context could not be initialized.');
        }
        GL.clearColor(clear[0], clear[1], clear[2], clear[3]);
        Control_1.default.Init(renderupdate, physcisupdate);
        MouseInput_1.default.SetElement(canvas);
        KeyboardInput_1.default.SetElement(canvas);
    }
}
exports.default = FWGE;

},{"./Input/KeyboardInput":6,"./Input/MouseInput":7,"./Utility/Control":35}],4:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("./Item"));
const Transform_1 = __importDefault(require("./Transform"));
exports.GameObjects = [];
class IGameObject {
    constructor() {
        this.transform = new Transform_1.default();
    }
}
exports.IGameObject = IGameObject;
class GameObject extends Item_1.default {
    constructor({ name, transform = new Transform_1.default, material, mesh, physics, animation, begin = () => undefined, update = () => undefined, end = () => undefined, children = [] } = new IGameObject) {
        super(name);
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
        exports.GameObjects.push(this);
    }
    Clone() {
        return GameObject.Clone(this);
    }
    static Clone(gameObject) {
        let children = gameObject.Children.map(child => child.Clone());
        return new GameObject({
            name: gameObject.Name,
            transform: new Transform_1.default({
                position: gameObject.Transform.Position,
                rotation: gameObject.Transform.Rotation,
                scale: gameObject.Transform.Scale,
                shear: gameObject.Transform.Shear
            }),
            mesh: gameObject.Mesh,
            material: gameObject.Material,
            physics: gameObject.Physics,
            begin: gameObject.Begin,
            update: gameObject.Update,
            end: gameObject.End,
            children
        });
    }
}
exports.default = GameObject;

},{"./Item":8,"./Transform":34}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InputState;
(function (InputState) {
    InputState[InputState["UP"] = 0] = "UP";
    InputState[InputState["PRESSED"] = 1] = "PRESSED";
    InputState[InputState["CLICKED"] = 2] = "CLICKED";
    InputState[InputState["DOWN"] = 3] = "DOWN";
})(InputState = exports.InputState || (exports.InputState = {}));

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InputState_1 = require("./InputState");
class KeyboardInput {
    static get KeyA() {
        return KeyboardInput.Keys[65];
    }
    static get Key0() {
        return KeyboardInput.Keys[48];
    }
    static get Numpad0() {
        return KeyboardInput.Keys[96];
    }
    static SetElement(element) {
        element.onkeyup = (e) => {
            KeyboardInput.Keys[e.keyCode] = InputState_1.InputState.UP;
        };
        element.onkeydown = (e) => {
            if (KeyboardInput.Keys[e.keyCode] == InputState_1.InputState.CLICKED) {
                KeyboardInput.Keys[e.keyCode] = InputState_1.InputState.DOWN;
            }
            else {
                KeyboardInput.Keys[e.keyCode] = InputState_1.InputState.PRESSED;
            }
        };
    }
}
KeyboardInput.Keys = new Array(128);
exports.default = KeyboardInput;

},{"./InputState":5}],7:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InputState_1 = require("./InputState");
const Vector2_1 = __importDefault(require("../Maths/Vector2"));
class MouseInput {
    static SetElement(element) {
        element.onmouseup = (e) => {
            MouseInput.Buttons[e.button] = InputState_1.InputState.UP;
        };
        element.onmousedown = (e) => {
            MouseInput.Buttons[e.button] = InputState_1.InputState.DOWN;
        };
        element.onmousemove = (e) => {
            MouseInput.Delta.Set(e.clientX - MouseInput.Axes.X, e.clientY - MouseInput.Axes.Y);
            MouseInput.Axes.Set(e.clientX, e.clientY);
        };
    }
}
MouseInput.Buttons = new Array(20);
MouseInput.Axes = new Vector2_1.default();
MouseInput.Delta = new Vector2_1.default();
exports.default = MouseInput;

},{"../Maths/Vector2":18,"./InputState":5}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const LightItem_1 = __importStar(require("./LightItem"));
class IAmbientLight extends LightItem_1.ILightItem {
}
class AmbientLight extends LightItem_1.default {
    constructor({ name = 'Ambient Light', colour, intensity } = new IAmbientLight) {
        super(name, colour, intensity);
    }
}
exports.default = AmbientLight;

},{"./LightItem":12}],10:[function(require,module,exports){
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
class IDirectionalLight extends LightItem_1.ILightItem {
}
exports.IDirectionalLight = IDirectionalLight;
class DirectionalLight extends LightItem_1.default {
    constructor({ name = 'Directional Light', colour, intensity, direction = Vector3_1.default.ZERO } = new IDirectionalLight) {
        super(name, colour, intensity);
        this.Direction = new Vector3_1.default(direction);
    }
}
exports.default = DirectionalLight;

},{"../Maths/Vector3":19,"./LightItem":12}],11:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AmbientLight_1 = __importDefault(require("./AmbientLight"));
const DirectionalLight_1 = __importDefault(require("./DirectionalLight"));
const List_1 = __importDefault(require("../Utility/List"));
const PointLight_1 = __importDefault(require("./PointLight"));
class Light {
    static Add(light) {
        if (Light.Lights.Add(light)) {
            if (light instanceof AmbientLight_1.default) {
                ++Light.AmbientCount;
            }
            if (light instanceof DirectionalLight_1.default) {
                ++Light.DirectionalCount;
            }
            if (light instanceof PointLight_1.default) {
                ++Light.PointCount;
            }
        }
    }
    static Remove(light) {
        let node = Light.Lights.Remove(light);
        if (node) {
            if (light instanceof AmbientLight_1.default) {
                --Light.AmbientCount;
            }
            if (light instanceof DirectionalLight_1.default) {
                --Light.DirectionalCount;
            }
            if (light instanceof PointLight_1.default) {
                --Light.PointCount;
            }
        }
    }
}
Light.AmbientCount = 0;
Light.DirectionalCount = 0;
Light.PointCount = 0;
Light.MAX_AMBIENT = 1;
Light.MAX_DIRECTIONAL = 3;
Light.MAX_POINT = 8;
Light.MAX_LIGHTS = 12;
Light.Lights = new List_1.default(12);
exports.default = Light;

},{"../Utility/List":37,"./AmbientLight":9,"./DirectionalLight":10,"./PointLight":13}],12:[function(require,module,exports){
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

},{"../Item":8,"../Render/Colour4":20}],13:[function(require,module,exports){
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
    }
}
exports.default = PointLight;

},{"..//Maths/Vector3":19,"./LightItem":12}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SIGNIFICANT_FIGURES = Math.pow(10, 6);
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

},{}],15:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
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
        this[0] = m11;
    }
    get M12() {
        return this[1];
    }
    set M12(m12) {
        this[1] = m12;
    }
    get M21() {
        return this[2];
    }
    set M21(m21) {
        this[2] = m21;
    }
    get M22() {
        return this[3];
    }
    set M22(m22) {
        this[3] = m22;
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
        if (m11 instanceof Matrix2 || m11 instanceof Float32Array || m11 instanceof List_1.default || m11 instanceof Array) {
            [
                m11, m12,
                m21, m22
            ] = m11;
        }
        return m11 * m22 - m21 * m12;
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
        if (m11 instanceof Matrix2 || m11 instanceof Float32Array || m11 instanceof List_1.default || m11 instanceof Array) {
            [
                m11, m12,
                m21, m22
            ] = m11;
        }
        return Matrix2.Set(matrix, matrix.M11 + m11, matrix.M12 + m12, matrix.M21 + m21, matrix.M22 + m22);
    }
    Mult(m11, m12, m21, m22) {
        return Matrix2.Mult(this, m11, m12, m21, m22);
    }
    static Mult(matrix, m11, m12, m21, m22) {
        if (m11 instanceof Matrix2 || m11 instanceof Float32Array || m11 instanceof List_1.default || m11 instanceof Array) {
            [
                m11, m12,
                m21, m22
            ] = m11;
        }
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
}
exports.default = Matrix2;

},{"../Utility/List":37,"./Matrix3":16,"./Matrix4":17}],16:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
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
        this[0] = m11;
    }
    get M12() {
        return this[1];
    }
    set M12(m12) {
        this[1] = m12;
    }
    get M13() {
        return this[2];
    }
    set M13(m12) {
        this[2] = m12;
    }
    get M21() {
        return this[3];
    }
    set M21(m11) {
        this[3] = m11;
    }
    get M22() {
        return this[4];
    }
    set M22(m12) {
        this[4] = m12;
    }
    get M23() {
        return this[5];
    }
    set M23(m12) {
        this[5] = m12;
    }
    get M31() {
        return this[6];
    }
    set M31(m11) {
        this[6] = m11;
    }
    get M32() {
        return this[7];
    }
    set M32(m12) {
        this[7] = m12;
    }
    get M33() {
        return this[8];
    }
    set M33(m12) {
        this[8] = m12;
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
        if (m11 instanceof Matrix2_1.default) {
            [
                m11, m12, m33,
                m21, m22, m33,
                m31, m32, m33
            ] = [
                m11.M11, m11.M12, 0,
                m11.M21, m11.M22, 0,
                0, 0, 0
            ];
        }
        else if (m11 instanceof Matrix3 || m11 instanceof Matrix4_1.default) {
            [
                m11, m12, m33,
                m21, m22, m33,
                m31, m32, m33
            ] = [
                m11.M11, m11.M12, m11.M13,
                m11.M21, m11.M22, m11.M23,
                m11.M31, m11.M32, m11.M33
            ];
        }
        else if (m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_1.default) {
            [
                m11, m12, m33,
                m21, m22, m33,
                m31, m32, m33
            ] = m11;
        }
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
        if (m11 instanceof Matrix3 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_1.default) {
            [
                m11, m12, m33,
                m21, m22, m33,
                m31, m32, m33
            ] = m11;
        }
        return m11 * (m22 * m33 - m23 * m32) -
            m12 * (m21 * m33 - m23 * m31) +
            m13 * (m21 * m32 - m22 * m31);
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
        if (m11 instanceof Matrix3 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_1.default) {
            [
                m11, m12, m33,
                m21, m22, m33,
                m31, m32, m33
            ] = m11;
        }
        return Matrix3.Set(matrix, matrix.M11 + m11, matrix.M12 + m12, matrix.M13 + m13, matrix.M21 + m21, matrix.M22 + m22, matrix.M23 + m23, matrix.M31 + m31, matrix.M32 + m32, matrix.M33 + m33);
    }
    Mult(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        return Matrix3.Mult(this, m11, m12, m13, m21, m22, m23, m31, m32, m33);
    }
    static Mult(matrix, m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        if (m11 instanceof Matrix3 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_1.default) {
            [
                m11, m12, m33,
                m21, m22, m33,
                m31, m32, m33
            ] = m11;
        }
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
}
exports.default = Matrix3;

},{"../Utility/List":37,"./Matrix2":15,"./Matrix4":17}],17:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
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
        this[0] = m11;
    }
    get M12() {
        return this[1];
    }
    set M12(m12) {
        this[1] = m12;
    }
    get M13() {
        return this[2];
    }
    set M13(m13) {
        this[2] = m13;
    }
    get M14() {
        return this[3];
    }
    set M14(m14) {
        this[3] = m14;
    }
    get M21() {
        return this[4];
    }
    set M21(m21) {
        this[4] = m21;
    }
    get M22() {
        return this[5];
    }
    set M22(m22) {
        this[5] = m22;
    }
    get M23() {
        return this[6];
    }
    set M23(m23) {
        this[6] = m23;
    }
    get M24() {
        return this[7];
    }
    set M24(m24) {
        this[7] = m24;
    }
    get M31() {
        return this[8];
    }
    set M31(m31) {
        this[8] = m31;
    }
    get M32() {
        return this[9];
    }
    set M32(m32) {
        this[9] = m32;
    }
    get M33() {
        return this[10];
    }
    set M33(m33) {
        this[10] = m33;
    }
    get M34() {
        return this[11];
    }
    set M34(m34) {
        this[11] = m34;
    }
    get M41() {
        return this[12];
    }
    set M41(m41) {
        this[12] = m41;
    }
    get M42() {
        return this[13];
    }
    set M42(m42) {
        this[13] = m42;
    }
    get M43() {
        return this[14];
    }
    set M43(m43) {
        this[14] = m43;
    }
    get M44() {
        return this[15];
    }
    set M44(m44) {
        this[15] = m44;
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
        if (m11 instanceof Matrix4 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_1.default) {
            [
                m11, m12, m13, m14,
                m21, m22, m23, m24,
                m31, m32, m33, m34,
                m41, m42, m43, m44
            ] = m11;
        }
        return m11 * m22 * m33 * m44 +
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
            m14 * m23 * m31 * m42;
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
        if (m11 instanceof Matrix4 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_1.default) {
            [
                m11, m12, m13, m14,
                m21, m22, m23, m24,
                m31, m32, m33, m34,
                m41, m42, m43, m44
            ] = m11;
        }
        return Matrix4.Set(matrix, matrix.M11 + m11, matrix.M12 + m12, matrix.M13 + m13, matrix.M14 + m14, matrix.M21 + m21, matrix.M22 + m22, matrix.M23 + m23, matrix.M24 + m24, matrix.M31 + m31, matrix.M32 + m32, matrix.M33 + m33, matrix.M34 + m34, matrix.M41 + m41, matrix.M42 + m42, matrix.M43 + m43, matrix.M44 + m44);
    }
    Mult(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        return Matrix4.Mult(this, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
    }
    static Mult(matrix, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        if (m11 instanceof Matrix4 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_1.default) {
            [
                m11, m12, m13, m14,
                m21, m22, m23, m24,
                m31, m32, m33, m34,
                m41, m42, m43, m44
            ] = m11;
        }
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
}
exports.default = Matrix4;

},{"../Utility/List":37,"./Matrix2":15,"./Matrix3":16}],18:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Maths_1 = __importDefault(require("./Maths"));
class Vector2 extends Float32Array {
    constructor(x, y) {
        super(2);
        this.Set(x, y);
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
        if (x instanceof Float32Array || x instanceof Array) {
            [x, y] = [x[0], x[1]];
        }
        return Maths_1.default.CleanFloat(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    }
    Set(x, y) {
        return Vector2.Set(this, x, y);
    }
    static Set(vector, x, y) {
        if (x instanceof Vector2 || x instanceof Float32Array || x instanceof Array) {
            [x, y] = [x[0], x[1]];
        }
        vector.X = x;
        vector.Y = y;
        return vector;
    }
    Sum(x, y) {
        return Vector2.Sum(this, x, y);
    }
    static Sum(vector, x, y) {
        if (x instanceof Float32Array || x instanceof Array) {
            [x, y] = [x[0], x[1]];
        }
        return Vector2.Set(vector, vector.X + x, vector.Y + y);
    }
    Diff(x, y) {
        return Vector2.Diff(this, x, y);
    }
    static Diff(vector, x, y) {
        if (x instanceof Float32Array || x instanceof Array) {
            [x, y] = [x[0], x[1]];
        }
        return Vector2.Set(vector, vector.X - x, vector.Y - y);
    }
    Mult(x, y) {
        return Vector2.Mult(this, x, y);
    }
    static Mult(vector, x, y) {
        if (x instanceof Float32Array || x instanceof Array) {
            [x, y] = [x[0], x[1]];
        }
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
        if (x instanceof Float32Array || x instanceof Array) {
            [x, y] = [x[0], x[1]];
        }
        return Maths_1.default.CleanFloat(vector.X * x + vector.Y * y);
    }
    Unit() {
        return Vector2.Unit(this);
    }
    static Unit(vector) {
        let length = vector.Length;
        if (length !== 0) {
            Vector2.Scale(vector, Maths_1.default.CleanFloat(1 / length));
        }
        return vector;
    }
    toString() {
        return `<${this.X}, ${this.Y}>`;
    }
    toLocaleString() {
        return toString();
    }
    Clone() {
        return new Vector2(this);
    }
}
exports.default = Vector2;

},{"./Maths":14}],19:[function(require,module,exports){
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

},{"../Maths/Maths":14}],20:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Maths_1 = __importDefault(require("../Maths/Maths"));
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
        let str = 'o';
        this.forEach(i => str += Math.round(i * 255).toString(10));
        return str;
    }
    get HEX() {
        let str = '#';
        this.forEach(i => str += Math.round(i * 255).toString(16));
        return str;
    }
    constructor(r, g, b, a) {
        super(4);
        this.Set(r, g, b, a);
        Object.seal(this);
    }
    Set(r, g, b, a) {
        return Colour4.Set(this, r, b, g, a);
    }
    static Set(colour, r, g, b, a) {
        if (r instanceof Colour4 || r instanceof Float32Array || r instanceof Array) {
            [r, g, b, a] = [r[0], r[1], r[2], r[3]];
        }
        else if (typeof (r) === 'string') {
            if (r.match(/#([0-9A-F]{3}){1,2}/i)) {
                [r, b, g, a] = r.substring(1)
                    .toUpperCase()
                    .split('')
                    .map(c => parseInt(c, 16));
            }
            else if (r.match(/#[0-9A-F]{6}/i)) {
                [r, b, g, a] = r.substring(1)
                    .toUpperCase()
                    .split(/(?=(?:..)*$)/)
                    .map(c => parseInt(c, 16));
            }
            else {
                r = 0;
            }
        }
        colour.R = r;
        colour.G = g;
        colour.B = b;
        colour.A = a;
        return colour;
    }
    static FromBin(bin) {
        return null;
    }
    static ToBin(bin) {
        return '';
    }
    static FromOct(oct) {
        return null;
    }
    static ToOct(oct) {
        return '';
    }
    static FromHex(hex) {
        return null;
    }
    static ToHex(hex) {
        return '';
    }
}
exports.default = Colour4;

},{"../Maths/Maths":14}],21:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Maths_1 = __importDefault(require("../Maths/Maths"));
const Matrix4_1 = __importDefault(require("../Maths/Matrix4"));
class ModelView {
    static Push(transform) {
        ModelView.Stack.push(this.Transform(transform));
        return ModelView.Peek();
    }
    static Peek() {
        if (ModelView.Stack.length === 0) {
            return Matrix4_1.default.IDENTITY;
        }
        else {
            return ModelView.Stack[ModelView.Stack.length - 1];
        }
    }
    static Pop() {
        if (ModelView.Stack.length === 0) {
            return Matrix4_1.default.IDENTITY;
        }
        else {
            return ModelView.Stack.pop();
        }
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
ModelView.Stack = new Array();
exports.default = ModelView;

},{"../Maths/Maths":14,"../Maths/Matrix4":17}],22:[function(require,module,exports){
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

},{"../Maths/Maths":14,"../Maths/Matrix4":17}],23:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AmbientLight_1 = __importDefault(require("../Light/AmbientLight"));
const DirectionalLight_1 = __importDefault(require("../Light/DirectionalLight"));
const FWGE_1 = __importDefault(require("../FWGE"));
const GameObject_1 = require("../GameObject");
const Light_1 = __importDefault(require("../Light/Light"));
const ModelView_1 = __importDefault(require("./ModelView"));
const Matrix3_1 = __importDefault(require("../Maths/Matrix3"));
const PointLight_1 = __importDefault(require("../Light/PointLight"));
const Projection_1 = __importDefault(require("./Projection"));
const Shader_1 = require("../Shader/Shader");
const Camera_1 = __importDefault(require("../Camera/Camera"));
class Renderer {
    static Init() {
        FWGE_1.default.GL.enable(FWGE_1.default.GL.DEPTH_TEST);
        FWGE_1.default.GL.disable(FWGE_1.default.GL.BLEND);
    }
    static Update() {
        Renderer.ClearBuffers();
        Renderer.SetGlobalUniforms();
        for (let gameObject of GameObject_1.GameObjects) {
            Renderer.RenderObject(gameObject);
        }
    }
    static ClearBuffers() {
        for (let shader of Shader_1.Shaders) {
            FWGE_1.default.GL.bindFramebuffer(FWGE_1.default.GL.FRAMEBUFFER, shader.FrameBuffer);
            FWGE_1.default.GL.viewport(0, 0, shader.Width, shader.Height);
            FWGE_1.default.GL.clear(FWGE_1.default.GL.COLOR_BUFFER_BIT | FWGE_1.default.GL.DEPTH_BUFFER_BIT);
        }
        FWGE_1.default.GL.bindFramebuffer(FWGE_1.default.GL.FRAMEBUFFER, null);
        FWGE_1.default.GL.viewport(0, 0, FWGE_1.default.GL.drawingBufferWidth, FWGE_1.default.GL.drawingBufferHeight);
        FWGE_1.default.GL.clear(FWGE_1.default.GL.COLOR_BUFFER_BIT | FWGE_1.default.GL.DEPTH_BUFFER_BIT);
    }
    static RenderObject({ Children, Mesh, Material, Transform }) {
        let mv = ModelView_1.default.Push(Transform);
        for (let child of Children) {
            Renderer.RenderObject(child);
        }
        if (Mesh && Material && Material.Shader) {
            var shader = Material.Shader;
            FWGE_1.default.GL.useProgram(shader.Program);
            FWGE_1.default.GL.enableVertexAttribArray(shader.Attributes.Position);
            if (shader.Attributes.Normal !== -1)
                FWGE_1.default.GL.enableVertexAttribArray(shader.Attributes.Normal);
            if (shader.Attributes.Colour !== -1)
                FWGE_1.default.GL.enableVertexAttribArray(shader.Attributes.Colour);
            if (shader.Attributes.UV !== -1)
                FWGE_1.default.GL.enableVertexAttribArray(shader.Attributes.UV);
            if (Material.Alpha !== 1.0) {
                FWGE_1.default.GL.enable(FWGE_1.default.GL.BLEND);
                FWGE_1.default.GL.disable(FWGE_1.default.GL.DEPTH_TEST);
                FWGE_1.default.GL.blendFunc(FWGE_1.default.GL.SRC_ALPHA, FWGE_1.default.GL.ONE);
            }
            Renderer.BindAttributes(Mesh, shader.Attributes);
            Renderer.SetObjectUniforms(Material, shader.Uniforms, mv);
            Renderer.Draw(Mesh.VertexCount, shader.FrameBuffer);
            if (Material.Alpha !== 1.0) {
                FWGE_1.default.GL.enable(FWGE_1.default.GL.DEPTH_TEST);
                FWGE_1.default.GL.disable(FWGE_1.default.GL.BLEND);
            }
            FWGE_1.default.GL.disableVertexAttribArray(shader.Attributes.Position);
            if (shader.Attributes.Normal !== -1) {
                FWGE_1.default.GL.disableVertexAttribArray(shader.Attributes.Normal);
            }
            if (shader.Attributes.Colour !== -1) {
                FWGE_1.default.GL.disableVertexAttribArray(shader.Attributes.Colour);
            }
            if (shader.Attributes.UV !== -1) {
                FWGE_1.default.GL.disableVertexAttribArray(shader.Attributes.UV);
            }
            FWGE_1.default.GL.useProgram(null);
        }
        ModelView_1.default.Pop();
    }
    static BindAttributes(mesh, attributes) {
        FWGE_1.default.GL.bindBuffer(FWGE_1.default.GL.ARRAY_BUFFER, mesh.PositionBuffer);
        FWGE_1.default.GL.vertexAttribPointer(attributes.Position, 3, FWGE_1.default.GL.FLOAT, false, 0, 0);
        if (attributes.UV !== -1) {
            if (mesh.UVBuffer) {
                FWGE_1.default.GL.bindBuffer(FWGE_1.default.GL.ARRAY_BUFFER, mesh.UVBuffer);
                FWGE_1.default.GL.vertexAttribPointer(attributes.UV, 2, FWGE_1.default.GL.FLOAT, false, 0, 0);
            }
            else
                FWGE_1.default.GL.disableVertexAttribArray(attributes.UV);
        }
        if (attributes.Colour !== -1) {
            if (mesh.ColourBuffer) {
                FWGE_1.default.GL.bindBuffer(FWGE_1.default.GL.ARRAY_BUFFER, mesh.ColourBuffer);
                FWGE_1.default.GL.vertexAttribPointer(attributes.Colour, 3, FWGE_1.default.GL.FLOAT, false, 0, 0);
            }
            else
                FWGE_1.default.GL.disableVertexAttribArray(attributes.Colour);
        }
        if (attributes.Normal !== -1) {
            if (!!mesh.NormalBuffer) {
                FWGE_1.default.GL.bindBuffer(FWGE_1.default.GL.ARRAY_BUFFER, mesh.NormalBuffer);
                FWGE_1.default.GL.vertexAttribPointer(attributes.Normal, 3, FWGE_1.default.GL.FLOAT, false, 0, 0);
            }
            else
                FWGE_1.default.GL.disableVertexAttribArray(attributes.Normal);
        }
        FWGE_1.default.GL.bindBuffer(FWGE_1.default.GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);
    }
    static SetObjectUniforms(material, uniforms, mv) {
        FWGE_1.default.GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, mv);
        FWGE_1.default.GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, new Matrix3_1.default(mv.Clone().Inverse()));
        FWGE_1.default.GL.uniform4fv(uniforms.Material.Ambient, material.Ambient);
        FWGE_1.default.GL.uniform4fv(uniforms.Material.Diffuse, material.Diffuse);
        FWGE_1.default.GL.uniform4fv(uniforms.Material.Specular, material.Specular);
        FWGE_1.default.GL.uniform1f(uniforms.Material.Shininess, material.Shininess);
        FWGE_1.default.GL.uniform1f(uniforms.Material.Alpha, material.Alpha);
        if (material.ImageMap) {
            FWGE_1.default.GL.activeTexture(FWGE_1.default.GL.TEXTURE0);
            FWGE_1.default.GL.bindTexture(FWGE_1.default.GL.TEXTURE_2D, material.ImageMap);
            FWGE_1.default.GL.uniform1i(uniforms.Material.HasImage, 1);
            FWGE_1.default.GL.uniform1i(uniforms.Sampler.Image, 0);
        }
        else {
            FWGE_1.default.GL.activeTexture(FWGE_1.default.GL.TEXTURE0);
            FWGE_1.default.GL.bindTexture(FWGE_1.default.GL.TEXTURE_2D, null);
            FWGE_1.default.GL.uniform1i(uniforms.Material.HasImage, 0);
        }
        if (material.BumpMap) {
            FWGE_1.default.GL.activeTexture(FWGE_1.default.GL.TEXTURE1);
            FWGE_1.default.GL.bindTexture(FWGE_1.default.GL.TEXTURE_2D, material.BumpMap);
            FWGE_1.default.GL.uniform1i(uniforms.Material.HasBump, 1);
            FWGE_1.default.GL.uniform1i(uniforms.Sampler.Bump, 1);
        }
        else {
            FWGE_1.default.GL.activeTexture(FWGE_1.default.GL.TEXTURE1);
            FWGE_1.default.GL.bindTexture(FWGE_1.default.GL.TEXTURE_2D, null);
            FWGE_1.default.GL.uniform1i(uniforms.Material.HasBump, 0);
        }
        if (material.SpecularMap) {
            FWGE_1.default.GL.activeTexture(FWGE_1.default.GL.TEXTURE2);
            FWGE_1.default.GL.bindTexture(FWGE_1.default.GL.TEXTURE_2D, material.SpecularMap);
            FWGE_1.default.GL.uniform1i(uniforms.Material.HasSpecular, 1);
            FWGE_1.default.GL.uniform1i(uniforms.Sampler.Specular, 2);
        }
        else {
            FWGE_1.default.GL.activeTexture(FWGE_1.default.GL.TEXTURE2);
            FWGE_1.default.GL.bindTexture(FWGE_1.default.GL.TEXTURE_2D, null);
            FWGE_1.default.GL.uniform1i(uniforms.Material.HasBump, 0);
        }
    }
    static SetGlobalUniforms() {
        var i = Shader_1.Shaders.length;
        for (let shader of Shader_1.Shaders) {
            FWGE_1.default.GL.useProgram(shader.Program);
            let point_count = 0;
            let matrix = shader.Uniforms.Matrix;
            let uniforms = shader.Uniforms.Light;
            for (let light of Light_1.default.Lights) {
                if (light instanceof AmbientLight_1.default) {
                    FWGE_1.default.GL.uniform4fv(uniforms.Ambient.Colour, light.Colour);
                    FWGE_1.default.GL.uniform1f(uniforms.Ambient.Intensity, light.Intensity);
                }
                else if (light instanceof DirectionalLight_1.default) {
                    FWGE_1.default.GL.uniform4fv(uniforms.Directional.Colour, light.Colour);
                    FWGE_1.default.GL.uniform1f(uniforms.Directional.Intensity, light.Intensity);
                    FWGE_1.default.GL.uniform3fv(uniforms.Directional.Direction, light.Direction);
                }
                else if (light instanceof PointLight_1.default) {
                    FWGE_1.default.GL.uniform4fv(uniforms.Point[point_count].Colour, light.Colour);
                    FWGE_1.default.GL.uniform1f(uniforms.Point[point_count].Intensity, light.Intensity);
                    FWGE_1.default.GL.uniform3fv(uniforms.Point[point_count].Position, light.Position);
                    FWGE_1.default.GL.uniform1f(uniforms.Point[point_count].Radius, light.Radius);
                    FWGE_1.default.GL.uniform1f(uniforms.Point[point_count].Angle, light.Angle);
                    point_count++;
                }
            }
            let main = Camera_1.default.Main;
            FWGE_1.default.GL.uniform1i(uniforms.PointCount, point_count);
            FWGE_1.default.GL.uniformMatrix4fv(matrix.Projection, false, Projection_1.default.Perspective(main.FieldOfView, main.AspectRatio, main.NearClipping, main.FarClipping));
        }
        FWGE_1.default.GL.useProgram(null);
    }
    static Draw(vertexCount, framebuffer) {
        FWGE_1.default.GL.bindFramebuffer(FWGE_1.default.GL.FRAMEBUFFER, null);
        FWGE_1.default.GL.drawElements(FWGE_1.default.GL.TRIANGLES, vertexCount, FWGE_1.default.GL.UNSIGNED_BYTE, 0);
        FWGE_1.default.GL.bindFramebuffer(FWGE_1.default.GL.FRAMEBUFFER, null);
    }
}
exports.default = Renderer;

},{"../Camera/Camera":2,"../FWGE":3,"../GameObject":4,"../Light/AmbientLight":9,"../Light/DirectionalLight":10,"../Light/Light":11,"../Light/PointLight":13,"../Maths/Matrix3":16,"../Shader/Shader":31,"./ModelView":21,"./Projection":22}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AmbientUniforms {
    constructor(gl, program) {
        this.Colour = gl.getUniformLocation(program, 'U_Ambient.Colour');
        this.Intensity = gl.getUniformLocation(program, 'U_Ambient.Intensity');
    }
}
exports.default = AmbientUniforms;

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DirectionalUniforms {
    constructor(gl, program) {
        this.Colour = gl.getUniformLocation(program, 'U_Directional.Colour');
        this.Intensity = gl.getUniformLocation(program, 'U_Directional.Intensity');
        this.Direction = gl.getUniformLocation(program, 'U_Directional.Direction');
    }
}
exports.default = DirectionalUniforms;

},{}],26:[function(require,module,exports){
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
        this.Point = new Array(LightUniforms.MAX_LIGHT);
        for (var i = 0; i < LightUniforms.MAX_LIGHT; ++i) {
            this.Point.push(new PointUniform_1.default(gl, program, i));
        }
    }
}
LightUniforms.MAX_LIGHT = 8;
exports.default = LightUniforms;

},{"./AmbientUniforms":24,"./DirectionalUniforms":25,"./PointUniform":29}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MaterialUniforms {
    constructor(gl, program) {
        this.Ambient = gl.getUniformLocation(program, 'U_Material.Ambient');
        this.Diffuse = gl.getUniformLocation(program, 'U_Material.Diffuse');
        this.Specular = gl.getUniformLocation(program, 'U_Material.Specular');
        this.Shininess = gl.getUniformLocation(program, 'U_Material.Shininess');
        this.Alpha = gl.getUniformLocation(program, 'U_Material.Alpha');
        this.HasImage = gl.getUniformLocation(program, 'U_Material.HasImage');
        this.HasBump = gl.getUniformLocation(program, 'U_Material.HasBump');
        this.HasSpecular = gl.getUniformLocation(program, 'U_Material.HasSpecular');
    }
}
exports.default = MaterialUniforms;

},{}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MatrixUniforms {
    constructor(gl, program) {
        this.ModelView = gl.getUniformLocation(program, 'U_Matrix.ModelView');
        this.Projection = gl.getUniformLocation(program, 'U_Matrix.Projection');
        this.Normal = gl.getUniformLocation(program, 'U_Matrix.Normal');
        this.Camera = gl.getUniformLocation(program, 'U_Matrix.Camera');
    }
}
exports.default = MatrixUniforms;

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SamplerUniforms {
    constructor(gl, program) {
        this.Image = gl.getUniformLocation(program, 'U_Sampler.Image');
        this.Bump = gl.getUniformLocation(program, 'U_Sampler.Bump');
        this.Specular = gl.getUniformLocation(program, 'U_Sampler.Specular');
    }
}
exports.default = SamplerUniforms;

},{}],31:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../Item"));
const ShaderAttributes_1 = __importDefault(require("./ShaderAttributes"));
const ShaderUniforms_1 = __importDefault(require("./ShaderUniforms"));
const FWGE_1 = __importDefault(require("../FWGE"));
class IShader {
}
exports.Shaders = [];
class Shader extends Item_1.default {
    constructor({ name = 'Shader', height = 1024, width = 1024, vertexshader, fragmentshader }) {
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

},{"../FWGE":3,"../Item":8,"./ShaderAttributes":32,"./ShaderUniforms":33}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{"./LightUniforms":26,"./MaterialUniforms":27,"./MatrixUniforms":28,"./SamplerUniforms":30}],34:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector3_1 = __importDefault(require("./Maths/Vector3"));
class ITransform {
}
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

},{"./Maths/Vector3":19}],35:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Time_1 = __importDefault(require("./Time"));
const GameObject_1 = require("../GameObject");
const Renderer_1 = __importDefault(require("../Render/Renderer"));
class Control {
    static Init(renderUpdate, physicsUpdate) {
        Time_1.default.Init(renderUpdate, physicsUpdate);
        Renderer_1.default.Init();
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
        for (let gameObject of GameObject_1.GameObjects) {
            gameObject.Update();
        }
        if (Time_1.default.Render.Ready) {
            Renderer_1.default.Update();
        }
    }
}
Control.Running = false;
Control.AnimationFrame = -1;
exports.default = Control;

},{"../GameObject":4,"../Render/Renderer":23,"./Time":38}],36:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector2_1 = __importDefault(require("../../Maths/Vector2"));
const Vector3_1 = __importDefault(require("../../Maths/Vector3"));
class IObjMesh {
    constructor() {
        this.v = [];
        this.vn = [];
        this.vt = [];
        this.f = [];
    }
}
class IObjectMesh extends IObjMesh {
}
class IGroupMesh extends IObjMesh {
}
class IObj {
}
class OBJConverter {
    static Parse(obj, mtl) {
        OBJConverter.ParseObj(obj);
    }
    static ObjNext(text, start) {
        debugger;
        let index = 0;
        let kind = undefined;
        let curr;
        while (start !== -1 && !kind) {
            text = text.substring(start);
            start = text.search(/[a-z]+/);
            curr = text.substring(start, text.search(/\s/));
            if (['mtllib', 'g', 'o', 'v', 'vn', 'vt', 'usemtl', 'f', '#'].includes(curr)) {
                kind = curr;
                index = start + curr.length;
            }
        }
        console.table([index, kind]);
        return [index, kind];
    }
    static ParseObj(input) {
        console.log(OBJConverter.obj(input));
    }
    static obj(input) {
        let result = new IObj;
        let index = 0;
        let kind;
        do {
            [index, kind] = OBJConverter.ObjNext(input, index);
            switch (kind) {
                case 'mtllib':
                    [index, result.mtllib] = OBJConverter.mtllib(input, index);
                    break;
                case 'g':
                    [index, result.g] = OBJConverter.g(input, index);
                    break;
                case 'o':
                    [index, result.o] = OBJConverter.o(input, index);
                    break;
            }
        } while (index !== -1);
        return result;
    }
    static mtllib(input, index) {
        let mtllib = '';
        for (let char = ''; char !== '\n' && (index + 1) < input.length; char = input[++index]) {
            mtllib += char;
        }
        return [index, mtllib.trim()];
    }
    static g(input, index) {
        return null;
    }
    static o(input, index) {
        let result = new IObjectMesh;
        let kind;
        let o = '';
        let v;
        let vn;
        let vt;
        let usemtl;
        let f;
        for (let char = ''; char !== '\n'; char = input[++index]) {
            o += char;
        }
        result.o = o.trim();
        do {
            [index, kind] = OBJConverter.ObjNext(input, index);
            switch (kind) {
                case 'v':
                    [index, v] = OBJConverter.v(input, index);
                    result.v.push(v);
                    break;
                case 'vn':
                    [index, vn] = OBJConverter.vn(input, index);
                    result.vn.push(vn);
                    break;
                case 'vt':
                    [index, vt] = OBJConverter.vt(input, index);
                    result.vt.push(vt);
                    break;
                case 'usemtl':
                    [index, usemtl] = OBJConverter.usemtl(input, index);
                    break;
                case 'f':
                    [index, f] = OBJConverter.f(input, index);
                    result.f.push(f);
                    break;
            }
        } while (index !== -1);
        if (usemtl) {
            result.usemtl = usemtl.trim();
        }
        return [index, result];
    }
    static v(input, index) {
        let v = '';
        for (let float = ''; float !== '\n' && (index + 1) < input.length; float = input[++index]) {
            v += float;
        }
        return [index, new Vector3_1.default(v.split('\s+').map(val => +(val.trim())))];
    }
    static vn(input, index) {
        let vn = '';
        for (let float = ''; float !== '\n' && (index + 1) < input.length; float = input[++index]) {
            vn += float;
        }
        return [index, new Vector3_1.default(vn.split('\s+').map(val => +(val.trim())))];
    }
    static vt(input, index) {
        let vt = '';
        for (let float = ''; float !== '\n' && (index + 1) < input.length; float = input[++index]) {
            vt += float;
        }
        return [index, new Vector2_1.default(vt.split('\s+').map(val => +(val.trim())))];
    }
    static usemtl(input, index) {
        let usemtl = '';
        for (let char = ''; char !== '\n' && (index + 1) < input.length; char = input[++index]) {
            usemtl += char;
        }
        return [index, usemtl.trim()];
    }
    static f(input, index) {
        let f = '';
        for (let float = ''; float !== '\n' && (index + 1) < input.length; float = input[++index]) {
            f += float;
        }
        return [index, f.split('\s+').map(val => +(val.trim()))];
    }
}
exports.default = OBJConverter;

},{"../../Maths/Vector2":18,"../../Maths/Vector3":19}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ListNode {
    constructor(value, next, previous) {
        this.Value = value;
        this.Next = next;
        this.Previous = previous;
    }
}
class ListIterator {
    [Symbol.iterator]() {
        throw new Error('Method not implemented.');
    }
    next(value) {
        return {
            done: !value,
            value
        };
    }
    return(value) {
        return {
            done: !value,
            value
        };
    }
    throw(e) {
        throw new Error(e);
    }
}
class List {
    constructor(size = Number.MAX_SAFE_INTEGER, buffer) {
        this.Size = size;
        if (buffer) {
            this.AddAll(buffer);
        }
    }
    get Length() {
        let node = this.head;
        let count = 0;
        while (node) {
            node = node.Next;
            count++;
        }
        return count;
    }
    Add(value, index) {
        if (this.Length == this.Size) {
            return false;
        }
        if (value instanceof ListNode) {
            value = value.Value;
        }
        if (!Number.isSafeInteger(index) || index < 0 || index > this.Length) {
            index = this.Length;
        }
        let parent = this.Get(index - 1);
        let node = new ListNode(value, parent, parent.Next);
        parent.Next = node;
        return true;
    }
    AddMany(...values) {
        for (let value of values) {
            this.Add(value);
        }
    }
    AddAll(values) {
        for (let value of values) {
            this.Add(value);
        }
    }
    Get(index) {
        if (index < 0 || index > this.Length) {
            return null;
        }
        let node = this.head;
        while (--index > 0) {
            node = node.Next;
        }
        return node;
    }
    Find(value) {
        let node = null;
        for (let curr = this.head; curr && !node; curr = curr.Next) {
            if (curr.Value === value) {
                node = curr;
            }
        }
        return node;
    }
    IndexOf(value) {
        let index = 0;
        for (let curr = this.head; curr && curr.Value != value; curr = curr.Next) {
            ++index;
        }
        return index === this.Length ? -1 : index;
    }
    Remove(value) {
        let node = null;
        if (typeof value === 'number') {
            node = this.Get(value);
        }
        else {
            node = this.head;
            while (node && node.Value != value) {
                node = node.Next;
            }
        }
        if (node) {
            node.Previous.Next = node.Next;
            node.Previous = null;
            node.Next = null;
            return node.Value;
        }
        else {
            return null;
        }
    }
    ToArray() {
        let array = new Array(this.Length);
        for (let curr = this.head; curr; curr = curr.Next) {
            array.push(curr.Value);
        }
        return array;
    }
    [Symbol.iterator]() {
        return new ListIterator();
    }
}
exports.default = List;

},{}],38:[function(require,module,exports){
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
