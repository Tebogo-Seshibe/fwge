(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
class Item {
    constructor(name = 'Item') {
        this.ID = Hashcode(ID_COUNTER++);
        this.Name = name;
    }
}
exports.default = Item;

},{}],2:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../Item"));
const Transform_1 = __importDefault(require("./Transform"));
exports.GameObjects = [];
class IGameObject {
}
exports.IGameObject = IGameObject;
class GameObject extends Item_1.default {
    constructor({ name = 'GameObject', transform = new Transform_1.default(), material, mesh, physics, animation, begin = function () { }, update = function () { }, end = function () { }, children = [], visible = true } = new IGameObject) {
        super(name);
        if (transform) {
            this.Transform = transform;
        }
        this.Mesh = mesh;
        this.Material = material;
        this.Physics = physics;
        this.Animation = animation;
        if (begin) {
            this.Begin = begin.bind(this);
        }
        if (update) {
            this.Update = update.bind(this);
        }
        if (end) {
            this.End = end.bind(this);
        }
        for (let child of children) {
            this.Children.push(child);
        }
        if (visible !== undefined) {
            this.Visible = visible;
        }
        exports.GameObjects.push(this);
    }
    Destroy(delay = 0) {
        setTimeout(() => exports.GameObjects = exports.GameObjects.slice(exports.GameObjects.indexOf(this), 1), delay);
    }
    Clone() {
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
            children: this.Children.map(child => child.Clone())
        });
    }
}
exports.default = GameObject;

},{"../Item":1,"./Transform":20}],3:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
const KeyboardInput_1 = __importDefault(require("./KeyboardInput"));
const MouseInput_1 = __importDefault(require("./MouseInput"));
class Input {
    static Init(canvas) {
        Input.Keyboard = new KeyboardInput_1.default();
        Input.Mouse = new MouseInput_1.default(canvas);
    }
}
Input.Controllers = new List_1.default();
exports.default = Input;

},{"../Utility/List":25,"./KeyboardInput":5,"./MouseInput":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KeyboardState;
(function (KeyboardState) {
    KeyboardState[KeyboardState["UP"] = 0] = "UP";
    KeyboardState[KeyboardState["PRESSED"] = 1] = "PRESSED";
    KeyboardState[KeyboardState["DOWN"] = 2] = "DOWN";
})(KeyboardState = exports.KeyboardState || (exports.KeyboardState = {}));
var ButtonState;
(function (ButtonState) {
    ButtonState[ButtonState["RAISED"] = 0] = "RAISED";
    ButtonState[ButtonState["PRESSED"] = 1] = "PRESSED";
})(ButtonState = exports.ButtonState || (exports.ButtonState = {}));
var WheelState;
(function (WheelState) {
    WheelState[WheelState["CENTERED"] = 0] = "CENTERED";
    WheelState[WheelState["UP"] = 1] = "UP";
    WheelState[WheelState["DOWN"] = 2] = "DOWN";
})(WheelState = exports.WheelState || (exports.WheelState = {}));

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InputState_1 = require("./InputState");
class KeyboardInput {
    constructor() {
        this.TOTAL_KEYS = 128;
        this.keys = [];
        for (var i = 0; i < this.TOTAL_KEYS; ++i) {
            this.keys.push(InputState_1.KeyboardState.UP);
        }
        window.onkeyup = (e) => {
            this.keys[e.keyCode] = InputState_1.KeyboardState.UP;
            e.cancelBubble = true;
        };
        window.onkeydown = (e) => {
            if (this.keys[e.keyCode] == InputState_1.KeyboardState.PRESSED) {
                this.keys[e.keyCode] = InputState_1.KeyboardState.DOWN;
            }
            else {
                this.keys[e.keyCode] = InputState_1.KeyboardState.PRESSED;
            }
            e.cancelBubble = true;
        };
    }
    get Keys() {
        return [...this.keys];
    }
    get KeyTilde() {
        return this.keys[192];
    }
    get Key0() {
        return this.keys[48];
    }
    get Key1() {
        return this.keys[49];
    }
    get Key2() {
        return this.keys[50];
    }
    get Key3() {
        return this.keys[51];
    }
    get Key4() {
        return this.keys[52];
    }
    get Key5() {
        return this.keys[53];
    }
    get Key6() {
        return this.keys[54];
    }
    get Key7() {
        return this.keys[55];
    }
    get Key8() {
        return this.keys[56];
    }
    get Key9() {
        return this.keys[57];
    }
    get KeyHyphen() {
        return this.keys[189];
    }
    get KeyEquals() {
        return this.keys[187];
    }
    get KeyA() {
        return this.keys[65];
    }
    get KeyB() {
        return this.keys[66];
    }
    get KeyC() {
        return this.keys[67];
    }
    get KeyD() {
        return this.keys[68];
    }
    get KeyE() {
        return this.keys[69];
    }
    get KeyF() {
        return this.keys[70];
    }
    get KeyG() {
        return this.keys[71];
    }
    get KeyH() {
        return this.keys[72];
    }
    get KeyI() {
        return this.keys[73];
    }
    get KeyJ() {
        return this.keys[74];
    }
    get KeyK() {
        return this.keys[75];
    }
    get KeyL() {
        return this.keys[76];
    }
    get KeyM() {
        return this.keys[77];
    }
    get KeyN() {
        return this.keys[78];
    }
    get KeyO() {
        return this.keys[79];
    }
    get KeyP() {
        return this.keys[80];
    }
    get KeyQ() {
        return this.keys[81];
    }
    get KeyR() {
        return this.keys[82];
    }
    get KeyS() {
        return this.keys[83];
    }
    get KeyT() {
        return this.keys[84];
    }
    get KeyU() {
        return this.keys[85];
    }
    get KeyV() {
        return this.keys[86];
    }
    get KeyW() {
        return this.keys[87];
    }
    get KeyX() {
        return this.keys[88];
    }
    get KeyY() {
        return this.keys[89];
    }
    get KeyZ() {
        return this.keys[90];
    }
    get KeyComma() {
        return this.keys[188];
    }
    get KeyPeriod() {
        return this.keys[190];
    }
    get KeySlash() {
        return this.keys[191];
    }
    get KeySpace() {
        return this.keys[32];
    }
    get KeyBackspace() {
        return this.keys[8];
    }
    get KeyEnter() {
        return this.keys[13];
    }
    get KeyInsert() {
        return this.keys[45];
    }
    get KeyDelete() {
        return this.keys[46];
    }
    get KeyTab() {
        return this.keys[9];
    }
    get KeyHome() {
        return this.keys[36];
    }
    get KeyEnd() {
        return this.keys[35];
    }
    get KeyPgUp() {
        return this.keys[33];
    }
    get KeyPgDown() {
        return this.keys[34];
    }
    get KeyUp() {
        return this.keys[38];
    }
    get KeyDown() {
        return this.keys[40];
    }
    get KeyLeft() {
        return this.keys[37];
    }
    get KeyRight() {
        return this.keys[39];
    }
    get Numpad0() {
        return this.keys[96];
    }
    get Numpad1() {
        return this.keys[97];
    }
    get Numpad2() {
        return this.keys[98];
    }
    get Numpad3() {
        return this.keys[99];
    }
    get Numpad4() {
        return this.keys[100];
    }
    get Numpad5() {
        return this.keys[101];
    }
    get Numpad6() {
        return this.keys[102];
    }
    get Numpad7() {
        return this.keys[103];
    }
    get Numpad8() {
        return this.keys[104];
    }
    get Numpad9() {
        return this.keys[105];
    }
    get KeyShift() {
        return this.keys[16];
    }
    get KeyCtrl() {
        return this.keys[17];
    }
    get KeyAlt() {
        return this.keys[18];
    }
    get KeyPauseBreak() {
        return this.keys[19];
    }
    get KeyEsc() {
        return this.keys[27];
    }
    get KeyStart() {
        return this.keys[91];
    }
    get KeyContextMenu() {
        return this.keys[93];
    }
    get KeyF1() {
        return this.keys[112];
    }
    get KeyF2() {
        return this.keys[113];
    }
    get KeyF3() {
        return this.keys[114];
    }
    get KeyF4() {
        return this.keys[115];
    }
    get KeyF5() {
        return this.keys[116];
    }
    get KeyF6() {
        return this.keys[117];
    }
    get KeyF7() {
        return this.keys[118];
    }
    get KeyF8() {
        return this.keys[119];
    }
    get KeyF9() {
        return this.keys[120];
    }
    get KeyF10() {
        return this.keys[121];
    }
    get KeyF11() {
        return this.keys[122];
    }
    get KeyF12() {
        return this.keys[123];
    }
    get KeyCapsLock() {
        return this.keys[20];
    }
    get KeyNumLock() {
        return this.keys[144];
    }
    get KeyScrollLock() {
        return this.keys[145];
    }
}
exports.default = KeyboardInput;

},{"./InputState":4}],6:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector2_1 = __importDefault(require("../Maths/Vector2"));
const InputState_1 = require("./InputState");
class MouseInput {
    constructor(element) {
        this.TOTAL_BUTTONS = 20;
        this.buttons = [];
        this.position = new Vector2_1.default();
        this.delta = new Vector2_1.default();
        this.offset = new Vector2_1.default();
        this.wheel = InputState_1.WheelState.CENTERED;
        this.offset.Set(element.clientWidth, element.clientHeight).Scale(0.5);
        for (var i = 0; i < this.TOTAL_BUTTONS; ++i) {
            this.buttons.push(InputState_1.ButtonState.RAISED);
        }
        element.onclick = element.ondblclick
            = element.oncontextmenu
                = undefined;
        element.onmouseup = (e) => {
            this.buttons[e.button] = InputState_1.ButtonState.RAISED;
            e.cancelBubble = true;
        };
        element.onmousedown = (e) => {
            this.buttons[e.button] = InputState_1.ButtonState.PRESSED;
            e.cancelBubble = true;
        };
        element.onmousemove = (e) => {
            this.delta.Set(e.movementX, e.movementY);
            this.position.Set(e.clientX, e.clientY);
            e.cancelBubble = true;
        };
        element.onwheel = (e) => {
            this.wheel = e.detail > 0
                ? InputState_1.WheelState.DOWN
                : e.detail < 0
                    ? InputState_1.WheelState.UP
                    : InputState_1.WheelState.CENTERED;
            e.cancelBubble = true;
        };
    }
    get Left() {
        return this.buttons[0];
    }
    get Middle() {
        return this.buttons[1];
    }
    get Right() {
        return this.buttons[2];
    }
    get Thumb1() {
        return this.buttons[3];
    }
    get Thumb2() {
        return this.buttons[4];
    }
    get Buttons() {
        return [...this.buttons];
    }
    get Delta() {
        return this.delta.Clone();
    }
    get Position() {
        return this.position.Clone().Diff(this.offset).Mult(1, -1);
    }
    get RawPosition() {
        return this.position.Clone();
    }
    get Wheel() {
        return this.wheel;
    }
}
exports.default = MouseInput;

},{"../Maths/Vector2":16,"./InputState":4}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],8:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],9:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],10:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],11:[function(require,module,exports){
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
            return undefined;
    }
}
exports.Binary = Binary;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SIGNIFICANT_FIGURES = Math.pow(10, 6);
Math.radian = (degree) => {
    return Math.PI / 180 * degree;
};
Math.cot = (angle) => {
    return 1 / Math.tan(angle);
};
Math.clamp = (value, min, max) => {
    return Math.max(Math.min(value, max), min);
};
Math.randBetween = (min, max) => {
    return (Math.random() * max) + min;
};
Math.clean = (value) => {
    return Math.round(value * SIGNIFICANT_FIGURES) / SIGNIFICANT_FIGURES;
};
Math.isPowerOf2 = (value) => {
    return (value & (value - 1)) === 0;
};
Math.lerp = (from, to, time) => {
    return from * (1 - time) + to * time;
};

},{}],13:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
require("./Maths");
const Matrix3_1 = __importDefault(require("./Matrix3"));
const Matrix4_1 = __importDefault(require("./Matrix4"));
class Matrix2 extends Float32Array {
    get M11() {
        return this[0];
    }
    set M11(m11) {
        this[0] = Math.clean(m11);
    }
    get M12() {
        return this[1];
    }
    set M12(m12) {
        this[1] = Math.clean(m12);
    }
    get M21() {
        return this[2];
    }
    set M21(m21) {
        this[2] = Math.clean(m21);
    }
    get M22() {
        return this[3];
    }
    set M22(m22) {
        this[3] = Math.clean(m22);
    }
    get Determinant() {
        return Matrix2.Determinant(this);
    }
    constructor(m11, m12, m21, m22) {
        super(4);
        if (m11) {
            Matrix2.Set(this, m11, m12, m21, m22);
        }
    }
    Set(m11, m12, m21, m22) {
        return Matrix2.Set(this, m11, m12, m21, m22);
    }
    Sum(m11, m12, m21, m22) {
        return Matrix2.Sum(this, m11, m12, m21, m22);
    }
    Mult(m11, m12, m21, m22) {
        return Matrix2.Mult(this, m11, m12, m21, m22);
    }
    Scale(scaler) {
        return Matrix2.Scale(this, scaler);
    }
    Transpose() {
        return Matrix2.Transpose(this);
    }
    Inverse() {
        return Matrix2.Inverse(this);
    }
    Identity() {
        return Matrix2.Identity(this);
    }
    Clone() {
        return new Matrix2(this);
    }
    static get ZERO() {
        return new Matrix2(0, 0, 0, 0);
    }
    static get IDENTITY() {
        return new Matrix2(1, 0, 0, 1);
    }
    static Set(matrix, m11, m12, m21, m22) {
        [
            m11, m12,
            m21, m22
        ] = Matrix2.Destructure(m11, m12, m21, m22);
        matrix.M11 = m11;
        matrix.M12 = m12;
        matrix.M21 = m21;
        matrix.M22 = m22;
        return matrix;
    }
    static Transpose(matrix) {
        return Matrix2.Set(matrix, matrix.M11, matrix.M21, matrix.M12, matrix.M22);
    }
    static Determinant(m11, m12, m21, m22) {
        [
            m11, m12,
            m21, m22
        ] = Matrix2.Destructure(m11, m12, m21, m22);
        return Math.clean(m11 * m22 - m21 * m12);
    }
    static Inverse(matrix) {
        let det = matrix.Determinant;
        if (det !== 0) {
            Matrix2.Set(matrix, matrix.M22 / det, -matrix.M12 / det, -matrix.M21 / det, matrix.M11 / det);
        }
        return matrix;
    }
    static Sum(matrix, m11, m12, m21, m22) {
        [
            m11, m12,
            m21, m22
        ] = Matrix2.Destructure(m11, m12, m21, m22);
        return Matrix2.Set(matrix, matrix.M11 + m11, matrix.M12 + m12, matrix.M21 + m21, matrix.M22 + m22);
    }
    static Mult(matrix, m11, m12, m21, m22) {
        [
            m11, m12,
            m21, m22
        ] = Matrix2.Destructure(m11, m12, m21, m22);
        return Matrix2.Set(matrix, matrix.M11 * m11 + matrix.M12 * m21, matrix.M11 * m12 + matrix.M12 * m22, matrix.M21 * m11 + matrix.M22 * m21, matrix.M21 * m12 + matrix.M22 * m22);
    }
    static Scale(matrix, scaler) {
        return Matrix2.Set(matrix, matrix.M11 * scaler, matrix.M12 * scaler, matrix.M21 * scaler, matrix.M22 * scaler);
    }
    static Identity(matrix) {
        return Matrix2.Set(matrix, 1, 0, 0, 1);
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

},{"../Utility/List":25,"./Maths":12,"./Matrix3":14,"./Matrix4":15}],14:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
require("./Maths");
const Matrix2_1 = __importDefault(require("./Matrix2"));
const Matrix4_1 = __importDefault(require("./Matrix4"));
class Matrix3 extends Float32Array {
    get M11() {
        return this[0];
    }
    set M11(m11) {
        this[0] = Math.clean(m11);
    }
    get M12() {
        return this[1];
    }
    set M12(m12) {
        this[1] = Math.clean(m12);
    }
    get M13() {
        return this[2];
    }
    set M13(m13) {
        this[2] = Math.clean(m13);
    }
    get M21() {
        return this[3];
    }
    set M21(m21) {
        this[3] = Math.clean(m21);
    }
    get M22() {
        return this[4];
    }
    set M22(m22) {
        this[4] = Math.clean(m22);
    }
    get M23() {
        return this[5];
    }
    set M23(m23) {
        this[5] = Math.clean(m23);
    }
    get M31() {
        return this[6];
    }
    set M31(m31) {
        this[6] = Math.clean(m31);
    }
    get M32() {
        return this[7];
    }
    set M32(m32) {
        this[7] = Math.clean(m32);
    }
    get M33() {
        return this[8];
    }
    set M33(m33) {
        this[8] = Math.clean(m33);
    }
    get Determinant() {
        return Matrix3.Determinant(this);
    }
    constructor(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        super(9);
        if (m11) {
            Matrix3.Set(this, m11, m12, m13, m21, m22, m23, m31, m32, m33);
        }
    }
    Set(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        return Matrix3.Set(this, m11, m12, m13, m21, m22, m23, m31, m32, m33);
    }
    Sum(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        return Matrix3.Sum(this, m11, m12, m13, m21, m22, m23, m31, m32, m33);
    }
    Mult(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        return Matrix3.Mult(this, m11, m12, m13, m21, m22, m23, m31, m32, m33);
    }
    Scale(scaler) {
        return Matrix3.Scale(this, scaler);
    }
    Transpose() {
        return Matrix3.Transpose(this);
    }
    Inverse() {
        return Matrix3.Inverse(this);
    }
    Identity() {
        return Matrix3.Identity(this);
    }
    Clone() {
        return new Matrix3(this);
    }
    static get ZERO() {
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static get IDENTITY() {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }
    static Set(matrix, m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ] = Matrix3.Destructure(m11, m12, m13, m21, m22, m23, m31, m32, m33);
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
    static Transpose(matrix) {
        return Matrix3.Set(matrix, matrix.M11, matrix.M21, matrix.M31, matrix.M12, matrix.M22, matrix.M32, matrix.M13, matrix.M23, matrix.M33);
    }
    static Determinant(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ] = Matrix3.Destructure(m11, m12, m13, m21, m22, m23, m31, m32, m33);
        return Math.clean(m11 * (m22 * m33 - m23 * m32) -
            m12 * (m21 * m33 - m23 * m31) +
            m13 * (m21 * m32 - m22 * m31));
    }
    static Inverse(matrix) {
        let det = matrix.Determinant;
        if (det !== 0) {
            Matrix3.Set(matrix, (matrix.M22 * matrix.M33 - matrix.M32 * matrix.M23) / det, (matrix.M32 * matrix.M13 - matrix.M12 * matrix.M33) / det, (matrix.M12 * matrix.M23 - matrix.M22 * matrix.M13) / det, (matrix.M31 * matrix.M23 - matrix.M21 * matrix.M33) / det, (matrix.M11 * matrix.M33 - matrix.M31 * matrix.M13) / det, (matrix.M21 * matrix.M13 - matrix.M11 * matrix.M23) / det, (matrix.M21 * matrix.M32 - matrix.M31 * matrix.M22) / det, (matrix.M31 * matrix.M12 - matrix.M11 * matrix.M32) / det, (matrix.M11 * matrix.M22 - matrix.M21 * matrix.M12) / det);
        }
        return matrix;
    }
    static Sum(matrix, m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ] = Matrix3.Destructure(m11, m12, m13, m21, m22, m23, m31, m32, m33);
        return Matrix3.Set(matrix, matrix.M11 + m11, matrix.M12 + m12, matrix.M13 + m13, matrix.M21 + m21, matrix.M22 + m22, matrix.M23 + m23, matrix.M31 + m31, matrix.M32 + m32, matrix.M33 + m33);
    }
    static Mult(matrix, m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ] = Matrix3.Destructure(m11, m12, m13, m21, m22, m23, m31, m32, m33);
        return Matrix3.Set(matrix, matrix.M11 * m11 + matrix.M12 * m21 + matrix.M13 * m31, matrix.M11 * m12 + matrix.M12 * m22 + matrix.M13 * m32, matrix.M11 * m13 + matrix.M12 * m23 + matrix.M13 * m33, matrix.M21 * m11 + matrix.M22 * m21 + matrix.M23 * m31, matrix.M21 * m12 + matrix.M22 * m22 + matrix.M23 * m32, matrix.M21 * m13 + matrix.M22 * m23 + matrix.M23 * m33, matrix.M31 * m11 + matrix.M32 * m21 + matrix.M33 * m31, matrix.M31 * m12 + matrix.M32 * m22 + matrix.M33 * m32, matrix.M31 * m13 + matrix.M32 * m23 + matrix.M33 * m33);
    }
    static Scale(matrix, scaler) {
        return Matrix3.Set(matrix, matrix.M11 * scaler, matrix.M12 * scaler, matrix.M13 * scaler, matrix.M21 * scaler, matrix.M22 * scaler, matrix.M23 * scaler, matrix.M31 * scaler, matrix.M32 * scaler, matrix.M33 * scaler);
    }
    static Identity(matrix) {
        return Matrix3.Set(matrix, 1, 0, 0, 0, 1, 0, 0, 0, 1);
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

},{"../Utility/List":25,"./Maths":12,"./Matrix2":13,"./Matrix4":15}],15:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
require("./Maths");
const Matrix2_1 = __importDefault(require("./Matrix2"));
const Matrix3_1 = __importDefault(require("./Matrix3"));
class Matrix4 extends Float32Array {
    get M11() {
        return this[0];
    }
    set M11(m11) {
        this[0] = Math.clean(m11);
    }
    get M12() {
        return this[1];
    }
    set M12(m12) {
        this[1] = Math.clean(m12);
    }
    get M13() {
        return this[2];
    }
    set M13(m13) {
        this[2] = Math.clean(m13);
    }
    get M14() {
        return this[3];
    }
    set M14(m14) {
        this[3] = Math.clean(m14);
    }
    get M21() {
        return this[4];
    }
    set M21(m21) {
        this[4] = Math.clean(m21);
    }
    get M22() {
        return this[5];
    }
    set M22(m22) {
        this[5] = Math.clean(m22);
    }
    get M23() {
        return this[6];
    }
    set M23(m23) {
        this[6] = Math.clean(m23);
    }
    get M24() {
        return this[7];
    }
    set M24(m24) {
        this[7] = Math.clean(m24);
    }
    get M31() {
        return this[8];
    }
    set M31(m31) {
        this[8] = Math.clean(m31);
    }
    get M32() {
        return this[9];
    }
    set M32(m32) {
        this[9] = Math.clean(m32);
    }
    get M33() {
        return this[10];
    }
    set M33(m33) {
        this[10] = Math.clean(m33);
    }
    get M34() {
        return this[11];
    }
    set M34(m34) {
        this[11] = Math.clean(m34);
    }
    get M41() {
        return this[12];
    }
    set M41(m41) {
        this[12] = Math.clean(m41);
    }
    get M42() {
        return this[13];
    }
    set M42(m42) {
        this[13] = Math.clean(m42);
    }
    get M43() {
        return this[14];
    }
    set M43(m43) {
        this[14] = Math.clean(m43);
    }
    get M44() {
        return this[15];
    }
    set M44(m44) {
        this[15] = Math.clean(m44);
    }
    get Determinant() {
        return Matrix4.Determinant(this);
    }
    constructor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        super(16);
        if (m11) {
            Matrix4.Set(this, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
        }
    }
    Set(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        return Matrix4.Set(this, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
    }
    Sum(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        return Matrix4.Set(this, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
    }
    Mult(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        return Matrix4.Mult(this, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
    }
    Scale(scaler) {
        return Matrix4.Scale(this, scaler);
    }
    Transpose() {
        return Matrix4.Transpose(this);
    }
    Inverse() {
        return Matrix4.Inverse(this);
    }
    Identity() {
        return Matrix4.Identity(this);
    }
    Clone() {
        return new Matrix4(this);
    }
    static get ZERO() {
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static get IDENTITY() {
        return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    static Set(matrix, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        [
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] = Matrix4.Destructure(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
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
    static Transpose(matrix) {
        return Matrix4.Set(matrix, matrix.M11, matrix.M21, matrix.M31, matrix.M41, matrix.M12, matrix.M22, matrix.M32, matrix.M42, matrix.M13, matrix.M23, matrix.M33, matrix.M43, matrix.M14, matrix.M24, matrix.M34, matrix.M44);
    }
    static Determinant(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        [
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] = Matrix4.Destructure(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
        return Math.clean(m11 * m22 * m33 * m44 +
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
    static Sum(matrix, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44] = Matrix4.Destructure(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
        return Matrix4.Set(matrix, matrix.M11 + m11, matrix.M12 + m12, matrix.M13 + m13, matrix.M14 + m14, matrix.M21 + m21, matrix.M22 + m22, matrix.M23 + m23, matrix.M24 + m24, matrix.M31 + m31, matrix.M32 + m32, matrix.M33 + m33, matrix.M34 + m34, matrix.M41 + m41, matrix.M42 + m42, matrix.M43 + m43, matrix.M44 + m44);
    }
    static Mult(matrix, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44] = Matrix4.Destructure(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
        return Matrix4.Set(matrix, matrix.M11 * m11 + matrix.M12 * m21 + matrix.M13 * m31 + matrix.M14 * m41, matrix.M11 * m12 + matrix.M12 * m22 + matrix.M13 * m32 + matrix.M14 * m42, matrix.M11 * m13 + matrix.M12 * m23 + matrix.M13 * m33 + matrix.M14 * m43, matrix.M11 * m14 + matrix.M12 * m24 + matrix.M13 * m34 + matrix.M14 * m44, matrix.M21 * m11 + matrix.M22 * m21 + matrix.M23 * m31 + matrix.M24 * m41, matrix.M21 * m12 + matrix.M22 * m22 + matrix.M23 * m32 + matrix.M24 * m42, matrix.M21 * m13 + matrix.M22 * m23 + matrix.M23 * m33 + matrix.M24 * m43, matrix.M21 * m14 + matrix.M22 * m24 + matrix.M23 * m34 + matrix.M24 * m44, matrix.M31 * m11 + matrix.M32 * m21 + matrix.M33 * m31 + matrix.M34 * m41, matrix.M31 * m12 + matrix.M32 * m22 + matrix.M33 * m32 + matrix.M34 * m42, matrix.M31 * m13 + matrix.M32 * m23 + matrix.M33 * m33 + matrix.M34 * m43, matrix.M31 * m14 + matrix.M32 * m24 + matrix.M33 * m34 + matrix.M34 * m44, matrix.M41 * m11 + matrix.M42 * m21 + matrix.M43 * m31 + matrix.M44 * m41, matrix.M41 * m12 + matrix.M42 * m22 + matrix.M43 * m32 + matrix.M44 * m42, matrix.M41 * m13 + matrix.M42 * m23 + matrix.M43 * m33 + matrix.M44 * m43, matrix.M41 * m14 + matrix.M42 * m24 + matrix.M43 * m34 + matrix.M44 * m44);
    }
    static Scale(matrix, scaler) {
        return Matrix4.Set(matrix, matrix.M11 * scaler, matrix.M12 * scaler, matrix.M13 * scaler, matrix.M14 * scaler, matrix.M21 * scaler, matrix.M22 * scaler, matrix.M23 * scaler, matrix.M24 * scaler, matrix.M31 * scaler, matrix.M32 * scaler, matrix.M33 * scaler, matrix.M34 * scaler, matrix.M41 * scaler, matrix.M42 * scaler, matrix.M43 * scaler, matrix.M44 * scaler);
    }
    static Identity(matrix) {
        return Matrix4.Set(matrix, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
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

},{"../Utility/List":25,"./Maths":12,"./Matrix2":13,"./Matrix3":14}],16:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
require("./Maths");
const Vector3_1 = __importDefault(require("./Vector3"));
const Vector4_1 = __importDefault(require("./Vector4"));
class Vector2 extends Float32Array {
    get X() {
        return this[0];
    }
    set X(x) {
        this[0] = Math.clean(x);
    }
    get Y() {
        return this[1];
    }
    set Y(y) {
        this[1] = Math.clean(y);
    }
    get Length() {
        return Vector2.Length(this);
    }
    constructor(x, y) {
        super(2);
        if (x) {
            Vector2.Set(this, x, y);
        }
    }
    Set(x, y) {
        return Vector2.Set(this, x, y);
    }
    Sum(x, y) {
        return Vector2.Sum(this, x, y);
    }
    Diff(x, y) {
        return Vector2.Diff(this, x, y);
    }
    Mult(x, y) {
        return Vector2.Mult(this, x, y);
    }
    Scale(scalar) {
        return Vector2.Scale(this, scalar);
    }
    Dot(x, y) {
        return Vector2.Dot(this, x, y);
    }
    Lerp(time, x, y) {
        let to = new Vector2(Vector2.Destructure(x, y));
        return Vector2.Lerp(this, to, time);
    }
    Unit() {
        return Vector2.Unit(this);
    }
    toString() {
        return `<${this.X}, ${this.Y}>`;
    }
    Clone() {
        return new Vector2(this);
    }
    static Set(vector, x, y) {
        [x, y] = Vector2.Destructure(x, y);
        vector.X = x;
        vector.Y = y;
        return vector;
    }
    static Sum(vector, x, y) {
        [x, y] = Vector2.Destructure(x, y);
        return Vector2.Set(vector, vector.X + x, vector.Y + y);
    }
    static Diff(vector, x, y) {
        [x, y] = Vector2.Destructure(x, y);
        return Vector2.Set(vector, vector.X - x, vector.Y - y);
    }
    static Mult(vector, x, y) {
        [x, y] = Vector2.Destructure(x, y);
        return Vector2.Set(vector, vector.X * x, vector.Y * y);
    }
    static Scale(vector, scalar) {
        return Vector2.Mult(vector, scalar, scalar);
    }
    static Dot(vector, x, y) {
        [x, y] = Vector2.Destructure(x, y);
        return Math.clean(vector.X * x + vector.Y * y);
    }
    static Unit(vector) {
        let length = vector.Length;
        if (length !== 0) {
            Vector2.Scale(vector, 1 / length);
        }
        return vector;
    }
    static Lerp(from, to, time) {
        return new Vector2(Math.lerp(from.X, to.X, time), Math.lerp(from.Y, to.Y, time));
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
    static Length(x, y) {
        [x, y] = Vector2.Destructure(x, y);
        return Math.clean(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    }
    static Destructure(x, y) {
        if (x instanceof Vector2 || x instanceof Vector3_1.default || x instanceof Vector4_1.default) {
            [x, y] = [x.X, x.Y];
        }
        else if (x instanceof Float32Array || x instanceof List_1.default || x instanceof Array) {
            [x, y] = x;
        }
        return [x, y];
    }
}
exports.default = Vector2;

},{"../Utility/List":25,"./Maths":12,"./Vector3":17,"./Vector4":18}],17:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./Maths");
const List_1 = __importDefault(require("../Utility/List"));
const Vector2_1 = __importDefault(require("./Vector2"));
const Vector4_1 = __importDefault(require("./Vector4"));
class Vector3 extends Float32Array {
    get X() {
        return this[0];
    }
    set X(x) {
        this[0] = Math.clean(x);
    }
    get Y() {
        return this[1];
    }
    set Y(y) {
        this[1] = Math.clean(y);
    }
    get Z() {
        return this[2];
    }
    set Z(z) {
        this[2] = Math.clean(z);
    }
    get Length() {
        return Vector3.Length(this);
    }
    constructor(x, y, z) {
        super(3);
        if (x) {
            Vector3.Set(this, x, y, z);
        }
    }
    Set(x, y, z) {
        return Vector3.Set(this, x, y, z);
    }
    Sum(x, y, z) {
        return Vector3.Sum(this, x, y, z);
    }
    Diff(x, y, z) {
        if (x instanceof Float32Array || x instanceof Array) {
            [x, y, z] = x;
        }
        return Vector3.Diff(this, x, y, z);
    }
    Mult(x, y, z) {
        return Vector3.Mult(this, x, y, z);
    }
    Scale(scalar) {
        return Vector3.Scale(this, scalar);
    }
    Dot(x, y, z) {
        return Vector3.Dot(this, x, y, z);
    }
    Lerp(time, x, y, z) {
        let to = new Vector3(Vector3.Destructure(x, y, z));
        return Vector3.Lerp(this, to, time);
    }
    Cross(x, y, z) {
        return Vector3.Cross(this, x, y, z);
    }
    Unit() {
        return Vector3.Unit(this);
    }
    toString() {
        return `<${this.X}, ${this.Y}, ${this.Z}>`;
    }
    Clone() {
        return new Vector3(this);
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
    static Length(x, y, z) {
        if (x instanceof Float32Array || x instanceof Array) {
            [x, y, z] = x;
        }
        return Math.clean(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)));
    }
    static Set(vector, x, y, z) {
        [x, y, z] = Vector3.Destructure(x, y, z);
        vector.X = x;
        vector.Y = y;
        vector.Z = z;
        return vector;
    }
    static Sum(vector, x, y, z) {
        [x, y, z] = Vector3.Destructure(x, y, z);
        return Vector3.Set(vector, vector.X + x, vector.Y + y, vector.Z + z);
    }
    static Diff(vector, x, y, z) {
        [x, y, z] = Vector3.Destructure(x, y, z);
        return Vector3.Set(vector, vector.X - x, vector.Y - y, vector.Z - z);
    }
    static Mult(vector, x, y, z) {
        [x, y, z] = Vector3.Destructure(x, y, z);
        return Vector3.Set(vector, vector.X * x, vector.Y * y, vector.Z * z);
    }
    static Cross(vector, x, y, z) {
        [x, y, z] = Vector3.Destructure(x, y, z);
        return Vector3.Set(vector, vector.Y * z - vector.Z * y, vector.Z * x - vector.X * z, vector.X * y - vector.Y * x);
    }
    static Scale(vector, scalar) {
        return Vector3.Mult(vector, scalar, scalar, scalar);
    }
    static Dot(vector, x, y, z) {
        [x, y, z] = Vector3.Destructure(x, y, z);
        return Math.clean(vector.X * x + vector.Y * y + vector.Z * z);
    }
    static Unit(vector) {
        var length = vector.Length;
        if (length !== 0) {
            Vector3.Scale(vector, 1 / length);
        }
        return vector;
    }
    static Lerp(from, to, time) {
        return new Vector3(Math.lerp(from.X, to.X, time), Math.lerp(from.Y, to.Y, time), Math.lerp(from.Z, to.Z, time));
    }
    static Destructure(x, y, z) {
        if (x instanceof Vector2_1.default) {
            [x, y, z] = [x.X, x.Y, 0];
        }
        else if (x instanceof Vector3 || x instanceof Vector4_1.default) {
            [x, y, z] = [x.X, x.Y, x.Z];
        }
        else if (x instanceof Float32Array || x instanceof Array || x instanceof List_1.default) {
            [x, y, z] = x;
        }
        return [x, y, z];
    }
}
exports.default = Vector3;

},{"../Utility/List":25,"./Maths":12,"./Vector2":16,"./Vector4":18}],18:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
require("./Maths");
const Vector2_1 = __importDefault(require("./Vector2"));
const Vector3_1 = __importDefault(require("./Vector3"));
class Vector4 extends Float32Array {
    get X() {
        return this[0];
    }
    set X(x) {
        this[0] = Math.clean(x);
    }
    get Y() {
        return this[1];
    }
    set Y(y) {
        this[1] = Math.clean(y);
    }
    get Z() {
        return this[2];
    }
    set Z(z) {
        this[2] = Math.clean(z);
    }
    get W() {
        return this[3];
    }
    set W(w) {
        this[3] = Math.clean(w);
    }
    get Length() {
        return Vector4.Length(this);
    }
    constructor(x, y, z, w) {
        super(4);
        if (x) {
            Vector4.Set(this, x, y, z, w);
        }
    }
    Set(x, y, z, w) {
        return Vector4.Set(this, x, y, z, w);
    }
    Sum(x, y, z, w) {
        return Vector4.Sum(this, x, y, z, w);
    }
    Diff(x, y, z, w) {
        return Vector4.Diff(this, x, y, z, w);
    }
    Mult(x, y, z, w) {
        return Vector4.Mult(this, x, y, z, w);
    }
    Dot(x, y, z, w) {
        return Vector4.Dot(this, x, y, z, w);
    }
    Lerp(time, x, y, z, w) {
        let to = new Vector4(Vector4.Destructure(x, y, z, w));
        return Vector4.Lerp(this, to, time);
    }
    Unit() {
        return Vector4.Unit(this);
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
    static Set(vector, x, y, z, w) {
        [x, y, z, w] = Vector4.Destructure(x, y, z, w);
        vector.X = x;
        vector.Y = y;
        vector.Z = z;
        vector.W = w;
        return vector;
    }
    static Sum(vector, x, y, z, w) {
        [x, y, z, w] = Vector4.Destructure(x, y, z, w);
        return Vector4.Set(vector, vector.W + w, vector.X + x, vector.Y + y, vector.Z + z);
    }
    static Diff(vector, x, y, z, w) {
        [x, y, z, w] = Vector4.Destructure(x, y, z, w);
        return Vector4.Set(vector, vector.W - w, vector.X - x, vector.Y - y, vector.Z - z);
    }
    static Mult(vector, x, y, z, w) {
        [x, y, z, w] = Vector4.Destructure(x, y, z, w);
        return Vector4.Set(vector, vector.W * w, vector.X * x, vector.Y * y, vector.Z * z);
    }
    static Scale(vector, scaler) {
        return Vector4.Mult(vector, scaler, scaler, scaler, scaler);
    }
    static Dot(vector, x, y, z, w) {
        [x, y, z, w] = Vector4.Destructure(x, y, z, w);
        return vector.W * w + vector.X * x + vector.Y * y + vector.Z * z;
    }
    static Unit(vector) {
        let length = vector.Length;
        if (length !== 0) {
            Vector4.Scale(vector, 1 / length);
        }
        return vector;
    }
    static Length(w, x, y, z) {
        if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array || w instanceof List_1.default) {
            [w, x, y, z] = w;
        }
        return Math.clean(Math.sqrt(Math.pow(w, 2) + Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)));
    }
    static Lerp(from, to, time, out = new Vector4) {
        return out.Set(Math.lerp(from.X, to.X, time), Math.lerp(from.Y, to.Y, time), Math.lerp(from.Z, to.Z, time), Math.lerp(from.W, to.W, time));
    }
    static get ZERO() {
        return new Vector4(0, 0, 0, 0);
    }
    static get ONE() {
        return new Vector4(1, 1, 1, 1);
    }
    static get UNIT() {
        return new Vector4(0.5, 0.5, 0.5, 0.5);
    }
    static Destructure(x, y, z, w) {
        if (x instanceof Vector2_1.default) {
            [x, y, z, w] = [x.X, x.Y, 0, 0];
        }
        else if (x instanceof Vector3_1.default) {
            [x, y, z, w] = [x.X, x.Y, x.Z, 0];
        }
        else if (x instanceof Vector4) {
            [x, y, z, w] = [x.X, x.Y, x.Z, x.W];
        }
        else if (x instanceof Float32Array || x instanceof Array || x instanceof List_1.default) {
            [x, y, z, w] = x;
        }
        return [x, y, z, w];
    }
}
exports.default = Vector4;

},{"../Utility/List":25,"./Maths":12,"./Vector2":16,"./Vector3":17}],19:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../Item"));
const ArrayUtils_1 = __importDefault(require("./Utility/ArrayUtils"));
const Control_1 = require("./Utility/Control");
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
        this.PositionBuffer = this.Bind(Control_1.GL, BufferType.POSITION, position);
        this.UVBuffer = this.Bind(Control_1.GL, BufferType.POSITION, uv);
        this.ColourBuffer = this.Bind(Control_1.GL, BufferType.POSITION, colour);
        this.NormalBuffer = this.Bind(Control_1.GL, BufferType.POSITION, normal);
        this.IndexBuffer = this.Bind(Control_1.GL, BufferType.INDEX, index);
        this.WireframeBuffer = this.Bind(Control_1.GL, BufferType.INDEX, wireframe);
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

},{"../Item":1,"./Utility/ArrayUtils":21,"./Utility/Control":23}],20:[function(require,module,exports){
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
    constructor({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], shear = [0, 0, 0] } = new ITransform) {
        this.Position = new Vector3_1.default(position);
        this.Rotation = new Vector3_1.default(rotation);
        this.Scale = new Vector3_1.default(scale);
        this.Shear = new Vector3_1.default(shear);
    }
    static get UP() {
        return new Vector3_1.default(0, 1, 0);
    }
    static get DOWN() {
        return new Vector3_1.default(0, -1, 0);
    }
    static get FORWARD() {
        return new Vector3_1.default(0, 0, 1);
    }
    static get BACKWARD() {
        return new Vector3_1.default(0, 0, -1);
    }
    static get RIGHT() {
        return new Vector3_1.default(1, 0, 0);
    }
    static get LEFT() {
        return new Vector3_1.default(-1, 0, 0);
    }
}
exports.default = Transform;

},{"./Maths/Vector3":17}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArrayUtiils {
    static Flatten(data) {
        let flattened = new Array();
        for (let list_item of data) {
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

},{}],22:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tree_1 = __importDefault(require("./Tree"));
class BinaryTree extends Tree_1.default {
    constructor() {
        super(2);
    }
}
exports.default = BinaryTree;

},{"./Tree":29}],23:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Animation_1 = require("../../Render/Animation/Animation");
const ParticleSystem_1 = require("../../Render/Particle System/ParticleSystem");
const Renderer_1 = require("../../Render/Renderer");
const GameObject_1 = require("../GameObject");
const Input_1 = __importDefault(require("../Input/Input"));
const Time_1 = __importDefault(require("./Time"));
class IFWGE {
}
exports.IFWGE = IFWGE;
class Control {
    static Init({ canvas, renderUpdate = 60, physicsUpdate = 30, clear = [0, 0, 0, 1] }) {
        if (!canvas) {
            throw new Error('Field {canvas: HTMLCanvasElement} is required');
        }
        exports.GL = canvas.getContext('webgl');
        if (!exports.GL) {
            throw new Error('Webgl context could not be initialized.');
        }
        exports.GL.clearColor(clear[0], clear[1], clear[2], clear[3]);
        Input_1.default.Init(canvas);
        Time_1.default.Init(renderUpdate, physicsUpdate);
        Renderer_1.InitRender();
    }
    static Start() {
        if (Control.animationFrame !== -1) {
            window.cancelAnimationFrame(Control.animationFrame);
        }
        Time_1.default.Render.Reset();
        Time_1.default.Physics.Reset();
        Control.Run();
    }
    static Stop() {
        if (Control.animationFrame !== -1) {
            window.cancelAnimationFrame(Control.animationFrame);
        }
    }
    static Run() {
        Control.animationFrame = window.requestAnimationFrame(Control.Run);
        Time_1.default.Update();
        for (let gameObject of GameObject_1.GameObjects) {
            gameObject.Update();
        }
        for (let particleSystem of ParticleSystem_1.ParticleSystems) {
            particleSystem.Update();
        }
        for (let animation of Animation_1.Animations) {
            animation.Update();
        }
        if (Time_1.default.Render.Ready) {
            Renderer_1.UpdateRender();
        }
    }
}
Control.Running = false;
Control.animationFrame = -1;
exports.default = Control;

},{"../../Render/Animation/Animation":36,"../../Render/Particle System/ParticleSystem":47,"../../Render/Renderer":49,"../GameObject":2,"../Input/Input":3,"./Time":28}],24:[function(require,module,exports){
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
const GameObject_1 = __importDefault(require("../../GameObject"));
const Vector2_1 = __importDefault(require("../../Maths/Vector2"));
const Vector3_1 = __importDefault(require("../../Maths/Vector3"));
const Colour4_1 = __importDefault(require("../../../Render/Colour/Colour4"));
const Mesh_1 = __importDefault(require("../../Mesh"));
const RenderMaterial_1 = __importStar(require("../../../Render/RenderMaterial"));
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
        return new RenderMaterial_1.default({ name, shininess, ambient, diffuse, specular, alpha, imagemap, shader: null });
    }
}
exports.default = OBJConverter;

},{"../../../Render/Colour/Colour4":41,"../../../Render/RenderMaterial":48,"../../GameObject":2,"../../Maths/Vector2":16,"../../Maths/Vector3":17,"../../Mesh":19}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ListNode {
    constructor(value, previous, next) {
        this.Previous = previous;
        this.Next = next;
        this.Value = value;
    }
}
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

},{}],26:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("./List"));
class ListUtiils {
    static FlattenVector(list) {
        let flattened = new List_1.default();
        for (let list_item of list) {
            flattened.AddMany(...list_item);
        }
        return flattened;
    }
}
exports.default = ListUtiils;

},{"./List":25}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StackNode {
    constructor(value, predecessor) {
        this.Value = value;
        this.Predecessor = predecessor;
    }
}
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
    Height() {
        let height = 0;
        let curr = this.head;
        while (curr) {
            ++height;
            curr = curr.Predecessor;
        }
        return height;
    }
    toString() {
        if (!this.head) {
            return '[]';
        }
        let curr = this.head.Predecessor;
        let str = '[' + this.head.Value;
        while (curr) {
            str += ', ' + curr.Value;
            curr = curr.Predecessor;
        }
        str += ']';
        return str;
    }
}
exports.default = Stack;

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("./List"));
class TreeNode {
    constructor(children, value) {
        this.Value = value;
        this.Children = new List_1.default(children);
    }
}
class Tree {
    constructor(size = 0) {
        this.size = size;
        this.root = undefined;
    }
}
exports.default = Tree;

},{"./List":25}],30:[function(require,module,exports){
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Collider_1 = __importStar(require("./Collider"));
class IBoxCollider extends Collider_1.ICollider {
}
exports.IBoxCollider = IBoxCollider;
class BoxCollider extends Collider_1.default {
    constructor({ name = 'BoxCollider', position, height = 1.0, width = 1.0, breadth = 1.0 } = new IBoxCollider) {
        super({ name, position });
        this.Height = height;
        this.Width = width;
        this.Breadth = breadth;
    }
}
exports.default = BoxCollider;

},{"./Collider":31}],31:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../../Item"));
const Vector3_1 = __importDefault(require("../../Logic/Maths/Vector3"));
class ICollider {
}
exports.ICollider = ICollider;
class Collider extends Item_1.default {
    constructor({ name = 'Collider', position = [0, 0, 0] } = new ICollider) {
        super(name);
        this.Position = new Vector3_1.default(position);
    }
}
exports.default = Collider;

},{"../../Item":1,"../../Logic/Maths/Vector3":17}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CollisionEvent {
    constructor() {
    }
}
exports.default = CollisionEvent;

},{}],33:[function(require,module,exports){
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Collider_1 = __importStar(require("./Collider"));
class ISphereCollider extends Collider_1.ICollider {
}
exports.ISphereCollider = ISphereCollider;
class SphereCollider extends Collider_1.default {
    constructor({ name = 'Sphere Collider', position, radius = 1.0 } = new ISphereCollider) {
        super({ name, position });
        this.Radius = radius;
    }
}
exports.default = SphereCollider;

},{"./Collider":31}],34:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../Item"));
class IRigidBody {
}
exports.IRigidBody = IRigidBody;
class RigidBody extends Item_1.default {
    get Velocity() {
        return 0;
    }
    get Speed() {
        return this.speed;
    }
    constructor({ name = 'Physics Body', mass = 1.0, lockx = true, locky = false, lockz = false } = new IRigidBody) {
        super(name);
        this.Mass = mass;
        this.LockX = lockx;
        this.LockY = locky;
        this.LockZ = lockz;
    }
}
exports.default = RigidBody;

},{"../Item":1}],35:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../Item"));
class IPhysicsMaterial {
}
exports.IPhysicsMaterial = IPhysicsMaterial;
class PhysicsMaterial extends Item_1.default {
    constructor({ name = 'Physics Material' } = new IPhysicsMaterial) {
        super(name);
    }
}
exports.default = PhysicsMaterial;

},{"../Item":1}],36:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../../Item"));
const Vector3_1 = __importDefault(require("../../Logic/Maths/Vector3"));
const List_1 = __importDefault(require("../../Logic/Utility/List"));
const Time_1 = __importDefault(require("../../Logic/Utility/Time"));
const AnimationFrame_1 = __importDefault(require("./AnimationFrame"));
exports.Animations = [];
class IAnimation {
}
exports.IAnimation = IAnimation;
class Animation extends Item_1.default {
    constructor({ name = 'Animation', gameObject, frames, loop } = new IAnimation) {
        super(name);
        this.Loop = false;
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

},{"../../Item":1,"../../Logic/Maths/Vector3":17,"../../Logic/Utility/List":25,"../../Logic/Utility/Time":28,"./AnimationFrame":37}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
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
const Matrix4_1 = __importDefault(require("../../Logic/Maths/Matrix4"));
const Vector3_1 = __importDefault(require("../../Logic/Maths/Vector3"));
const Viewer_1 = __importStar(require("./Viewer"));
exports.Cameras = [];
class ICamera {
}
exports.ICamera = ICamera;
class Camera extends Viewer_1.default {
    get ProjectionMatrix() {
        switch (this.Mode) {
            case Viewer_1.ViewMode.PERSPECTIVE:
                return this.Perspective;
            case Viewer_1.ViewMode.ORTHOGRAPHIC:
                return this.Orthographic;
            case Viewer_1.ViewMode.LOOKAT:
                return this.LookAt;
        }
    }
    get LookAt() {
        return Camera.LookAt(this.Position, this.Target, this.Up);
    }
    get Orthographic() {
        return Camera.Orthographic(this.Left, this.Right, this.Top, this.Bottom, this.NearClipping, this.FarClipping, this.HorizontalTilt, this.VericalTilt);
    }
    get Perspective() {
        return Camera.Perspective(this.NearClipping, this.FarClipping, this.FieldOfView, this.AspectRatio);
    }
    static get Main() {
        return exports.Cameras[0];
    }
    constructor({ name = 'Viewer', position = [0, 0, -10], target = [0, 0, 0], up = [0, 1, 0] } = new ICamera) {
        super(name);
        this.Position = new Vector3_1.default(position);
        this.Target = new Vector3_1.default(target);
        this.Up = new Vector3_1.default(up);
        exports.Cameras.push(this);
    }
    static LookAt(position, target, up = new Vector3_1.default(0, 1, 0)) {
        let n = Vector3_1.default.Diff(position, target).Unit();
        let u = Vector3_1.default.Cross(up, n).Unit();
        let v = Vector3_1.default.Cross(n, u).Unit();
        let p = position;
        return new Matrix4_1.default(v.X, v.Y, v.Z, 0.0, u.X, u.Y, u.Z, 0.0, n.X, n.Y, n.Z, 0.0, 0.0, 0.0, 0.0, 1.0).Mult(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, p.X, p.Y, p.Z, 1.0);
    }
    static Orthographic(left, right, top, bottom, near, far, theta, phi) {
        theta = Math.cot(Math.radian(theta));
        phi = Math.cot(Math.radian(phi));
        left -= near * theta;
        right -= near * theta;
        top -= near * phi;
        bottom -= near * phi;
        return new Matrix4_1.default(2 / (right - left), 0, 0, 0, 0, 2 / (top - bottom), 0, 0, theta, phi, -2 / (far - near), 0, -(left + right) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1);
    }
    static Perspective(near, far, fieldOfView, aspectRatio) {
        let top = near * Math.tan(Math.radian(fieldOfView));
        let right = top * aspectRatio;
        let left = -right;
        let bottom = -top;
        let width = right - left;
        let height = top - bottom;
        let depth = far - near;
        return new Matrix4_1.default(2 * near / width, 0, 0, 0, 0, 2 * near / height, 0, 0, (right + left) / width, (top + bottom) / height, -(far + near) / depth, -1, 0, 0, -(2 * far * near) / depth, 1);
    }
}
exports.default = Camera;
new Camera();

},{"../../Logic/Maths/Matrix4":15,"../../Logic/Maths/Vector3":17,"./Viewer":39}],39:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../../Item"));
var ViewMode;
(function (ViewMode) {
    ViewMode[ViewMode["PERSPECTIVE"] = 0] = "PERSPECTIVE";
    ViewMode[ViewMode["ORTHOGRAPHIC"] = 1] = "ORTHOGRAPHIC";
    ViewMode[ViewMode["LOOKAT"] = 2] = "LOOKAT";
})(ViewMode = exports.ViewMode || (exports.ViewMode = {}));
class Viewer extends Item_1.default {
    constructor() {
        super(...arguments);
        this.Mode = ViewMode.PERSPECTIVE;
        this.FieldOfView = 35;
        this.AspectRatio = 16 / 9;
        this.NearClipping = 0.1;
        this.FarClipping = 900;
        this.Left = -10;
        this.Right = 10;
        this.Top = 10;
        this.Bottom = -10;
        this.HorizontalTilt = 0;
        this.VericalTilt = 0;
    }
}
exports.default = Viewer;

},{"../../Item":1}],40:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../../Logic/Maths/Maths");
const Colour4_1 = __importDefault(require("./Colour4"));
class Colour3 extends Float32Array {
    get R() {
        return this[0];
    }
    set R(red) {
        this[0] = Math.clean(Math.clamp(red, 0, 1));
    }
    get G() {
        return this[1];
    }
    set G(green) {
        this[1] = Math.clean(Math.clamp(green, 0, 1));
    }
    get B() {
        return this[2];
    }
    set B(blue) {
        this[2] = Math.clean(Math.clamp(blue, 0, 1));
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
        this.forEach(i => str += Math.round(i * 255).toString(10) + ',');
        return str.substring(0, str.length - 1);
    }
    get HEX() {
        let str = '#';
        this.forEach(i => str += Math.round(i * 255).toString(16));
        return str;
    }
    constructor(r, g, b) {
        super(3);
        if (r) {
            Colour3.Set(this, r, g, b);
        }
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
    static Deconstruct(r, g, b) {
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

},{"../../Logic/Maths/Maths":12,"./Colour4":41}],41:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../../Logic/Maths/Maths");
const Colour3_1 = __importDefault(require("./Colour3"));
class Colour4 extends Float32Array {
    get R() {
        return this[0];
    }
    set R(red) {
        this[0] = Math.clean(Math.clamp(red, 0, 1));
    }
    get G() {
        return this[1];
    }
    set G(green) {
        this[1] = Math.clean(Math.clamp(green, 0, 1));
    }
    get B() {
        return this[2];
    }
    set B(blue) {
        this[2] = Math.clean(Math.clamp(blue, 0, 1));
    }
    get A() {
        return this[3];
    }
    set A(alpha) {
        this[3] = Math.clean(Math.clamp(alpha, 0, 1));
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
        this.forEach(i => str += Math.round(i * 255).toString(10) + ',');
        return str.substring(0, str.length - 1);
    }
    get HEX() {
        let str = '#';
        this.forEach(i => str += Math.round(i * 255).toString(16));
        return str;
    }
    constructor(r, g, b, a) {
        super(4);
        if (r) {
            Colour4.Set(this, r, g, b, a);
        }
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
            [r = 0, g = 0, b = 0, a = 0] = r;
        }
        return [r, g, b, a];
    }
}
exports.default = Colour4;

},{"../../Logic/Maths/Maths":12,"./Colour3":40}],42:[function(require,module,exports){
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
const List_1 = __importDefault(require("../../Logic/Utility/List"));
const LightItem_1 = __importStar(require("./LightItem"));
exports.AmbientLights = new List_1.default(1);
class IAmbientLight extends LightItem_1.ILightItem {
}
exports.IAmbientLight = IAmbientLight;
class AmbientLight extends LightItem_1.default {
    constructor({ name = 'Ambient Light', colour, intensity } = new IAmbientLight) {
        super({ name, colour, intensity });
        exports.AmbientLights.Add(this);
    }
}
exports.default = AmbientLight;

},{"../../Logic/Utility/List":25,"./LightItem":44}],43:[function(require,module,exports){
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
const Vector3_1 = __importDefault(require("../../Logic/Maths/Vector3"));
const List_1 = __importDefault(require("../../Logic/Utility/List"));
const LightItem_1 = __importStar(require("./LightItem"));
exports.DirectionalLights = new List_1.default(3);
class IDirectionalLight extends LightItem_1.ILightItem {
}
exports.IDirectionalLight = IDirectionalLight;
class DirectionalLight extends LightItem_1.default {
    constructor({ name = 'Directional Light', colour, intensity, direction = [0, 0, 1], shadows = false } = new IDirectionalLight) {
        super({ name, colour, intensity });
        this.Direction = Vector3_1.default.ZERO;
        if (direction) {
            direction = new Vector3_1.default(direction);
        }
        this.Shadows = shadows;
        exports.DirectionalLights.Add(this);
    }
}
exports.default = DirectionalLight;

},{"../../Logic/Maths/Vector3":17,"../../Logic/Utility/List":25,"./LightItem":44}],44:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../../Item"));
const Colour4_1 = __importDefault(require("../Colour/Colour4"));
class ILightItem {
}
exports.ILightItem = ILightItem;
class LightItem extends Item_1.default {
    constructor({ name, colour = [255, 255, 255, 255], intensity = 1.0 } = new ILightItem) {
        super(name);
        this.Colour = new Colour4_1.default(colour);
        this.Intensity = intensity;
    }
}
exports.default = LightItem;

},{"../../Item":1,"../Colour/Colour4":41}],45:[function(require,module,exports){
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
const Vector3_1 = __importDefault(require("../../Logic/Maths/Vector3"));
const List_1 = __importDefault(require("../../Logic/Utility/List"));
const LightItem_1 = __importStar(require("./LightItem"));
exports.PointLights = new List_1.default(12);
class IPointLight extends LightItem_1.ILightItem {
}
exports.IPointLight = IPointLight;
class PointLight extends LightItem_1.default {
    constructor({ name = 'Point Light', colour, intensity, position, radius = 5, angle = 180, shininess = 32, shadows = false } = new IPointLight) {
        super({ name, colour, intensity });
        this.Position = new Vector3_1.default(position);
        this.Radius = radius;
        this.Angle = angle;
        this.Shininess = shininess;
        this.Shadows = shadows;
        exports.PointLights.Add(this);
    }
}
exports.default = PointLight;

},{"../../Logic/Maths/Vector3":17,"../../Logic/Utility/List":25,"./LightItem":44}],46:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../Logic/Maths/Maths");
const Matrix4_1 = __importDefault(require("../Logic/Maths/Matrix4"));
const Stack_1 = __importDefault(require("../Logic/Utility/Stack"));
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
        let x = Math.radian(rotation.X);
        let y = Math.radian(rotation.Y);
        let z = Math.radian(rotation.Z);
        return new Matrix4_1.default(Math.cos(z), -Math.sin(z), 0.0, 0.0, Math.sin(z), Math.cos(z), 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0).Mult(Math.cos(y), 0.0, Math.sin(y), 0.0, 0.0, 1.0, 0.0, 0.0, -Math.sin(y), 0.0, Math.cos(y), 0.0, 0.0, 0.0, 0.0, 1.0).Mult(1.0, 0.0, 0.0, 0.0, 0.0, Math.cos(x), -Math.sin(x), 0.0, 0.0, Math.sin(x), Math.cos(x), 0.0, 0.0, 0.0, 0.0, 1.0).Mult(matrix);
    }
    static Scale(matrix, scalers) {
        return new Matrix4_1.default(matrix.M11 * scalers.X, matrix.M12 * scalers.X, matrix.M13 * scalers.X, matrix.M14 * scalers.X, matrix.M21 * scalers.Y, matrix.M22 * scalers.Y, matrix.M23 * scalers.Y, matrix.M24 * scalers.Y, matrix.M31 * scalers.Z, matrix.M32 * scalers.Z, matrix.M33 * scalers.Z, matrix.M34 * scalers.Z, matrix.M41, matrix.M42, matrix.M43, matrix.M44);
    }
    static Shear(matrix, angles) {
        var phi = Math.radian(angles.X);
        var theta = Math.radian(angles.Y);
        var rho = Math.radian(angles.Z);
        return new Matrix4_1.default(1.0, 0.0, Math.tan(rho), 0.0, Math.tan(phi), 1.0, 0.0, 0.0, 0.0, Math.tan(theta), 1.0, 0.0, 0.0, 0.0, 0.0, 1.0).Mult(matrix);
    }
}
exports.default = ModelView;

},{"../Logic/Maths/Maths":12,"../Logic/Maths/Matrix4":15,"../Logic/Utility/Stack":27}],47:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../../Item"));
const Equation_1 = require("../../Logic/Maths/Equation");
const Vector3_1 = __importDefault(require("../../Logic/Maths/Vector3"));
const Transform_1 = __importDefault(require("../../Logic/Transform"));
const Time_1 = __importDefault(require("../../Logic/Utility/Time"));
exports.ParticleSystems = [];
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
        for (let i = 0; i < this.Particles.length; ++i) {
            let remaining = this.CurrentTime - this.Delay(this.CurrentTime, i);
            if (this.CurrentTime >= this.MaxTime && remaining >= this.MaxTime) {
                if (!this.Loop) {
                    return;
                }
            }
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

},{"../../Item":1,"../../Logic/Maths/Equation":11,"../../Logic/Maths/Vector3":17,"../../Logic/Transform":20,"../../Logic/Utility/Time":28}],48:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../Item"));
require("../Logic/Maths/Maths");
const Control_1 = require("../Logic/Utility/Control");
const Colour4_1 = __importDefault(require("./Colour/Colour4"));
var ImageMapType;
(function (ImageMapType) {
    ImageMapType[ImageMapType["TEXTURE"] = 0] = "TEXTURE";
    ImageMapType[ImageMapType["NORMAL"] = 1] = "NORMAL";
    ImageMapType[ImageMapType["SPECULAR"] = 2] = "SPECULAR";
})(ImageMapType = exports.ImageMapType || (exports.ImageMapType = {}));
class IRenderMaterial {
}
exports.IRenderMaterial = IRenderMaterial;
class RenderMaterial extends Item_1.default {
    constructor({ name = 'Render Material', ambient = [0.5, 0.5, 0.5, 1.0], diffuse = [0.5, 0.5, 0.5, 1.0], specular = [0.5, 0.5, 0.5, 1.0], alpha = 1.0, shininess = 32.0, shader, imagemap, normalmap, specularmap } = new IRenderMaterial) {
        super(name);
        this.Ambient = new Colour4_1.default(ambient);
        this.Diffuse = new Colour4_1.default(diffuse);
        this.Specular = new Colour4_1.default(specular);
        this.Alpha = alpha;
        this.Shininess = shininess;
        this.Shader = shader;
        if (imagemap)
            RenderMaterial.ApplyImage(this, imagemap, ImageMapType.TEXTURE);
        if (normalmap)
            RenderMaterial.ApplyImage(this, normalmap, ImageMapType.NORMAL);
        if (specularmap)
            RenderMaterial.ApplyImage(this, specularmap, ImageMapType.SPECULAR);
    }
    static ApplyImage(material, src, type) {
        let img = new Image();
        let texture = null;
        switch (type) {
            case ImageMapType.TEXTURE:
                material.ImageMap = Control_1.GL.createTexture();
                texture = material.ImageMap;
                break;
            case ImageMapType.NORMAL:
                material.BumpMap = Control_1.GL.createTexture();
                texture = material.BumpMap;
                break;
            case ImageMapType.SPECULAR:
                material.SpecularMap = Control_1.GL.createTexture();
                texture = material.SpecularMap;
                break;
            default: texture = null;
        }
        Control_1.GL.bindTexture(Control_1.GL.TEXTURE_2D, texture);
        Control_1.GL.texImage2D(Control_1.GL.TEXTURE_2D, 0, Control_1.GL.RGBA, 1, 1, 0, Control_1.GL.RGBA, Control_1.GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
        img.onload = function () {
            Control_1.GL.bindTexture(Control_1.GL.TEXTURE_2D, texture);
            Control_1.GL.texImage2D(Control_1.GL.TEXTURE_2D, 0, Control_1.GL.RGBA, Control_1.GL.RGBA, Control_1.GL.UNSIGNED_BYTE, img);
            if (Math.isPowerOf2(img.width) && Math.isPowerOf2(img.height)) {
                Control_1.GL.generateMipmap(Control_1.GL.TEXTURE_2D);
                Control_1.GL.texParameteri(Control_1.GL.TEXTURE_2D, Control_1.GL.TEXTURE_MAG_FILTER, Control_1.GL.LINEAR);
                Control_1.GL.texParameteri(Control_1.GL.TEXTURE_2D, Control_1.GL.TEXTURE_MIN_FILTER, Control_1.GL.LINEAR_MIPMAP_NEAREST);
            }
            else {
                Control_1.GL.texParameteri(Control_1.GL.TEXTURE_2D, Control_1.GL.TEXTURE_WRAP_S, Control_1.GL.CLAMP_TO_EDGE);
                Control_1.GL.texParameteri(Control_1.GL.TEXTURE_2D, Control_1.GL.TEXTURE_WRAP_T, Control_1.GL.CLAMP_TO_EDGE);
                Control_1.GL.texParameteri(Control_1.GL.TEXTURE_2D, Control_1.GL.TEXTURE_MIN_FILTER, Control_1.GL.LINEAR);
            }
            Control_1.GL.bindTexture(Control_1.GL.TEXTURE_2D, null);
        };
        img.src = src;
    }
}
exports.default = RenderMaterial;

},{"../Item":1,"../Logic/Maths/Maths":12,"../Logic/Utility/Control":23,"./Colour/Colour4":41}],49:[function(require,module,exports){
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
const GameObject_1 = __importStar(require("../Logic/GameObject"));
const Matrix3_1 = __importDefault(require("../Logic/Maths/Matrix3"));
const Control_1 = require("../Logic/Utility/Control");
const List_1 = __importDefault(require("../Logic/Utility/List"));
const Camera_1 = __importDefault(require("./Camera/Camera"));
const AmbientLight_1 = __importStar(require("./Light/AmbientLight"));
const DirectionalLight_1 = __importStar(require("./Light/DirectionalLight"));
const PointLight_1 = __importStar(require("./Light/PointLight"));
const ModelView_1 = __importDefault(require("./ModelView"));
const ParticleSystem_1 = __importStar(require("./Particle System/ParticleSystem"));
const Shader_1 = require("./Shader/Shader");
function InitRender() {
    Control_1.GL.enable(Control_1.GL.DEPTH_TEST);
    Control_1.GL.disable(Control_1.GL.BLEND);
    Control_1.GL.blendFunc(Control_1.GL.SRC_ALPHA, Control_1.GL.ONE);
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
        Control_1.GL.bindFramebuffer(Control_1.GL.FRAMEBUFFER, shader.FrameBuffer);
        Control_1.GL.viewport(0, 0, shader.Width, shader.Height);
        Control_1.GL.clear(Control_1.GL.COLOR_BUFFER_BIT | Control_1.GL.DEPTH_BUFFER_BIT);
    }
    Control_1.GL.bindFramebuffer(Control_1.GL.FRAMEBUFFER, null);
    Control_1.GL.viewport(0, 0, Control_1.GL.drawingBufferWidth, Control_1.GL.drawingBufferHeight);
    Control_1.GL.clear(Control_1.GL.COLOR_BUFFER_BIT | Control_1.GL.DEPTH_BUFFER_BIT);
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
    Control_1.GL.useProgram(shader.Program);
    Control_1.GL.enableVertexAttribArray(shader.Attributes.Position);
    if (shader.Attributes.Normal !== -1) {
        Control_1.GL.enableVertexAttribArray(shader.Attributes.Normal);
    }
    if (shader.Attributes.Colour !== -1) {
        Control_1.GL.enableVertexAttribArray(shader.Attributes.Colour);
    }
    if (shader.Attributes.UV !== -1) {
        Control_1.GL.enableVertexAttribArray(shader.Attributes.UV);
    }
    if (material.Alpha !== 1.0) {
        Control_1.GL.enable(Control_1.GL.BLEND);
        Control_1.GL.disable(Control_1.GL.DEPTH_TEST);
    }
    BindAttributes(mesh, shader.Attributes);
    SetObjectUniforms(material, shader.Uniforms, modelView);
    Draw(mesh.VertexCount, shader.FrameBuffer);
    if (material.Alpha !== 1.0) {
        Control_1.GL.enable(Control_1.GL.DEPTH_TEST);
        Control_1.GL.disable(Control_1.GL.BLEND);
    }
    Control_1.GL.disableVertexAttribArray(shader.Attributes.Position);
    if (shader.Attributes.Normal !== -1) {
        Control_1.GL.disableVertexAttribArray(shader.Attributes.Normal);
    }
    if (shader.Attributes.Colour !== -1) {
        Control_1.GL.disableVertexAttribArray(shader.Attributes.Colour);
    }
    if (shader.Attributes.UV !== -1) {
        Control_1.GL.disableVertexAttribArray(shader.Attributes.UV);
    }
    Control_1.GL.useProgram(null);
}
function BindAttributes(mesh, attributes) {
    Control_1.GL.bindBuffer(Control_1.GL.ARRAY_BUFFER, mesh.PositionBuffer);
    Control_1.GL.vertexAttribPointer(attributes.Position, 3, Control_1.GL.FLOAT, false, 0, 0);
    if (attributes.UV !== -1) {
        if (mesh.UVBuffer) {
            Control_1.GL.bindBuffer(Control_1.GL.ARRAY_BUFFER, mesh.UVBuffer);
            Control_1.GL.vertexAttribPointer(attributes.UV, 2, Control_1.GL.FLOAT, false, 0, 0);
        }
        else {
            Control_1.GL.disableVertexAttribArray(attributes.UV);
        }
    }
    if (attributes.Colour !== -1) {
        if (mesh.ColourBuffer) {
            Control_1.GL.bindBuffer(Control_1.GL.ARRAY_BUFFER, mesh.ColourBuffer);
            Control_1.GL.vertexAttribPointer(attributes.Colour, 3, Control_1.GL.FLOAT, false, 0, 0);
        }
        else {
            Control_1.GL.disableVertexAttribArray(attributes.Colour);
        }
    }
    if (attributes.Normal !== -1) {
        if (!!mesh.NormalBuffer) {
            Control_1.GL.bindBuffer(Control_1.GL.ARRAY_BUFFER, mesh.NormalBuffer);
            Control_1.GL.vertexAttribPointer(attributes.Normal, 3, Control_1.GL.FLOAT, false, 0, 0);
        }
        else {
            Control_1.GL.disableVertexAttribArray(attributes.Normal);
        }
    }
    Control_1.GL.bindBuffer(Control_1.GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);
}
function SetObjectUniforms(material, uniforms, mv) {
    Control_1.GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, mv);
    Control_1.GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, new Matrix3_1.default(mv.Clone().Inverse()));
    Control_1.GL.uniform4fv(uniforms.Material.Ambient, material.Ambient);
    Control_1.GL.uniform4fv(uniforms.Material.Diffuse, material.Diffuse);
    Control_1.GL.uniform4fv(uniforms.Material.Specular, material.Specular);
    Control_1.GL.uniform1f(uniforms.Material.Shininess, material.Shininess);
    Control_1.GL.uniform1f(uniforms.Material.Alpha, material.Alpha);
    if (material.ImageMap) {
        Control_1.GL.activeTexture(Control_1.GL.TEXTURE0);
        Control_1.GL.bindTexture(Control_1.GL.TEXTURE_2D, material.ImageMap);
        Control_1.GL.uniform1i(uniforms.Material.HasImage, 1);
        Control_1.GL.uniform1i(uniforms.Sampler.Image, 0);
    }
    else {
        Control_1.GL.activeTexture(Control_1.GL.TEXTURE0);
        Control_1.GL.bindTexture(Control_1.GL.TEXTURE_2D, null);
        Control_1.GL.uniform1i(uniforms.Material.HasImage, 0);
    }
    if (material.BumpMap) {
        Control_1.GL.activeTexture(Control_1.GL.TEXTURE1);
        Control_1.GL.bindTexture(Control_1.GL.TEXTURE_2D, material.BumpMap);
        Control_1.GL.uniform1i(uniforms.Material.HasBump, 1);
        Control_1.GL.uniform1i(uniforms.Sampler.Bump, 1);
    }
    else {
        Control_1.GL.activeTexture(Control_1.GL.TEXTURE1);
        Control_1.GL.bindTexture(Control_1.GL.TEXTURE_2D, null);
        Control_1.GL.uniform1i(uniforms.Material.HasBump, 0);
    }
    if (material.SpecularMap) {
        Control_1.GL.activeTexture(Control_1.GL.TEXTURE2);
        Control_1.GL.bindTexture(Control_1.GL.TEXTURE_2D, material.SpecularMap);
        Control_1.GL.uniform1i(uniforms.Material.HasSpecular, 1);
        Control_1.GL.uniform1i(uniforms.Sampler.Specular, 2);
    }
    else {
        Control_1.GL.activeTexture(Control_1.GL.TEXTURE2);
        Control_1.GL.bindTexture(Control_1.GL.TEXTURE_2D, null);
        Control_1.GL.uniform1i(uniforms.Material.HasBump, 0);
    }
}
function SetGlobalUniforms() {
    var i = Shader_1.Shaders.length;
    let Lights = new List_1.default([].concat(AmbientLight_1.AmbientLights.ToArray(), DirectionalLight_1.DirectionalLights.ToArray(), PointLight_1.PointLights.ToArray()));
    for (let shader of Shader_1.Shaders) {
        Control_1.GL.useProgram(shader.Program);
        let point_count = 0;
        let matrix = shader.Uniforms.Matrix;
        let uniforms = shader.Uniforms.Light;
        for (let light of Lights) {
            if (light instanceof AmbientLight_1.default) {
                Control_1.GL.uniform4fv(uniforms.Ambient.Colour, light.Colour);
                Control_1.GL.uniform1f(uniforms.Ambient.Intensity, light.Intensity);
            }
            else if (light instanceof DirectionalLight_1.default) {
                Control_1.GL.uniform4fv(uniforms.Directional.Colour, light.Colour);
                Control_1.GL.uniform1f(uniforms.Directional.Intensity, light.Intensity);
                Control_1.GL.uniform3fv(uniforms.Directional.Direction, light.Direction);
            }
            else if (light instanceof PointLight_1.default) {
                Control_1.GL.uniform4fv(uniforms.Point[point_count].Colour, light.Colour);
                Control_1.GL.uniform1f(uniforms.Point[point_count].Intensity, light.Intensity);
                Control_1.GL.uniform3fv(uniforms.Point[point_count].Position, light.Position);
                Control_1.GL.uniform1f(uniforms.Point[point_count].Radius, light.Radius);
                Control_1.GL.uniform1f(uniforms.Point[point_count].Angle, light.Angle);
                ++point_count;
            }
        }
        let main = Camera_1.default.Main;
        Control_1.GL.uniform1i(uniforms.PointCount, point_count);
        Control_1.GL.uniformMatrix4fv(matrix.Projection, false, main.ProjectionMatrix);
    }
    Control_1.GL.useProgram(null);
}
function Draw(vertexCount, framebuffer) {
    Control_1.GL.bindFramebuffer(Control_1.GL.FRAMEBUFFER, null);
    Control_1.GL.drawElements(Control_1.GL.TRIANGLES, vertexCount, Control_1.GL.UNSIGNED_BYTE, 0);
    Control_1.GL.bindFramebuffer(Control_1.GL.FRAMEBUFFER, null);
}
function SetAttributes(shader, fields) {
    for (const [name, [size, field]] of fields) {
        let index = shader.Attribute.get(name);
        if (index !== -1) {
            Control_1.GL.bindBuffer(Control_1.GL.ARRAY_BUFFER, field);
            Control_1.GL.vertexAttribPointer(index, size, Control_1.GL.FLOAT, false, 0, 0);
        }
    }
}
function SetUniforms(shader, fields) {
    for (const [name, field] of fields) {
        let { type, index } = shader.Uniform.get(name);
        switch (type) {
            case 'bool':
            case 'int':
            case 'uint':
                Control_1.GL.uniform1i(index, field);
            case 'float':
                Control_1.GL.uniform1f(index, field);
            case 'bvec2':
            case 'ivec2':
            case 'uvec2':
                Control_1.GL.uniform2iv(index, field);
            case 'bvec3':
            case 'ivec3':
            case 'uvec3':
                Control_1.GL.uniform3iv(index, field);
            case 'bvec4':
            case 'ivec4':
            case 'uvec4':
                Control_1.GL.uniform4iv(index, field);
            case 'vec2':
                Control_1.GL.uniform2fv(index, field);
            case 'vec3':
                Control_1.GL.uniform3fv(index, field);
            case 'vec4':
                Control_1.GL.uniform4fv(index, field);
            case 'mat2':
                Control_1.GL.uniformMatrix2fv(index, false, field);
            case 'mat3':
                Control_1.GL.uniformMatrix3fv(index, false, field);
            case 'mat4':
                Control_1.GL.uniformMatrix4fv(index, false, field);
        }
    }
}

},{"../Logic/GameObject":2,"../Logic/Maths/Matrix3":14,"../Logic/Utility/Control":23,"../Logic/Utility/List":25,"./Camera/Camera":38,"./Light/AmbientLight":42,"./Light/DirectionalLight":43,"./Light/PointLight":45,"./ModelView":46,"./Particle System/ParticleSystem":47,"./Shader/Shader":59}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AmbientUniforms {
    constructor(gl, program) {
        this.Colour = gl.getUniformLocation(program, 'U_AmbientColour');
        this.Intensity = gl.getUniformLocation(program, 'U_AmbientIntensity');
    }
}
exports.default = AmbientUniforms;

},{}],51:[function(require,module,exports){
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

},{}],52:[function(require,module,exports){
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

},{"./AmbientUniforms":50,"./DirectionalUniforms":51,"./PointUniform":55}],53:[function(require,module,exports){
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

},{}],54:[function(require,module,exports){
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

},{}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
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

},{}],57:[function(require,module,exports){
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

},{}],58:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LightUniforms_1 = __importDefault(require("./LightUniforms"));
const MaterialUniforms_1 = __importDefault(require("./MaterialUniforms"));
const MatrixUniforms_1 = __importDefault(require("./MatrixUniforms"));
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

},{"./LightUniforms":52,"./MaterialUniforms":53,"./MatrixUniforms":54,"./SamplerUniforms":56}],59:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../../Item"));
const Control_1 = require("../../Logic/Utility/Control");
const ShaderAttributes_1 = __importDefault(require("./Instance/ShaderAttributes"));
const ShaderUniforms_1 = __importDefault(require("./Instance/ShaderUniforms"));
exports.Shaders = [];
class IShader {
}
exports.IShader = IShader;
class Shader extends Item_1.default {
    get VertexShader() {
        return this.vertexShader;
    }
    set VertexShader(vertexShader) {
        this.vertexShader = vertexShader;
        this.Build();
    }
    get FragmentShader() {
        return this.fragmentShader;
    }
    set FragmentShader(fragmentShader) {
        this.fragmentShader = fragmentShader;
        this.Build();
    }
    constructor({ name = 'Shader', height = 1024, width = 1024, vertex, fragment } = new IShader) {
        super(name);
        this.Program = Control_1.GL.createProgram();
        this.Texture = Control_1.GL.createTexture();
        this.FrameBuffer = Control_1.GL.createFramebuffer();
        this.RenderBuffer = Control_1.GL.createRenderbuffer();
        this.Height = height;
        this.Width = width;
        this.vertexShader = vertex;
        this.fragmentShader = fragment;
        this.Attribute = new Map;
        this.Uniform = new Map;
        this.Attributes = new ShaderAttributes_1.default(Control_1.GL, this.Program);
        this.Uniforms = new ShaderUniforms_1.default(Control_1.GL, this.Program);
        this.Build();
        exports.Shaders.push(this);
    }
    Build() {
        this.CreateBuffers();
        this.BuildShaders();
        this.ParseProperties();
    }
    ParseProperties() {
        const regex = /uniform\s+(?<type>bool|int|float|([biu]?vec|mat)[2-4])\s+(?<name>\w+);/;
        const regexGroup = /uniform\s+(bool|int|float|([biu]?vec|mat)[2-4])\s+(\w+);/g;
        let text = this.VertexShader + "\n" + this.FragmentShader;
        let matches = text.match(regexGroup);
        for (const match of matches) {
            let groups = match.match(regex);
            let type = groups.groups.type;
            let name = groups.groups.name;
            let index = Control_1.GL.getUniformLocation(this.Program, name);
            if (!this.Uniform.has(name)) {
                this.Uniform.set(name, { index, type });
            }
        }
    }
    CreateBuffers() {
        Control_1.GL.bindFramebuffer(Control_1.GL.FRAMEBUFFER, this.FrameBuffer);
        Control_1.GL.bindRenderbuffer(Control_1.GL.RENDERBUFFER, this.RenderBuffer);
        Control_1.GL.renderbufferStorage(Control_1.GL.RENDERBUFFER, Control_1.GL.DEPTH_COMPONENT16, this.Width, this.Height);
        Control_1.GL.bindTexture(Control_1.GL.TEXTURE_2D, this.Texture);
        Control_1.GL.texParameteri(Control_1.GL.TEXTURE_2D, Control_1.GL.TEXTURE_MAG_FILTER, Control_1.GL.LINEAR);
        Control_1.GL.texParameteri(Control_1.GL.TEXTURE_2D, Control_1.GL.TEXTURE_MIN_FILTER, Control_1.GL.LINEAR);
        Control_1.GL.texParameteri(Control_1.GL.TEXTURE_2D, Control_1.GL.TEXTURE_WRAP_S, Control_1.GL.CLAMP_TO_EDGE);
        Control_1.GL.texParameteri(Control_1.GL.TEXTURE_2D, Control_1.GL.TEXTURE_WRAP_T, Control_1.GL.CLAMP_TO_EDGE);
        Control_1.GL.texImage2D(Control_1.GL.TEXTURE_2D, 0, Control_1.GL.RGBA, this.Width, this.Height, 0, Control_1.GL.RGBA, Control_1.GL.UNSIGNED_BYTE, undefined);
        Control_1.GL.framebufferTexture2D(Control_1.GL.FRAMEBUFFER, Control_1.GL.COLOR_ATTACHMENT0, Control_1.GL.TEXTURE_2D, this.Texture, 0);
        Control_1.GL.framebufferRenderbuffer(Control_1.GL.FRAMEBUFFER, Control_1.GL.DEPTH_ATTACHMENT, Control_1.GL.RENDERBUFFER, this.RenderBuffer);
        Control_1.GL.bindTexture(Control_1.GL.TEXTURE_2D, null);
        Control_1.GL.bindRenderbuffer(Control_1.GL.RENDERBUFFER, null);
        Control_1.GL.bindFramebuffer(Control_1.GL.FRAMEBUFFER, null);
    }
    BuildShaders() {
        let errorLog = [];
        const vs = Control_1.GL.createShader(Control_1.GL.VERTEX_SHADER);
        Control_1.GL.shaderSource(vs, this.VertexShader);
        Control_1.GL.compileShader(vs);
        if (!Control_1.GL.getShaderParameter(vs, Control_1.GL.COMPILE_STATUS)) {
            errorLog.push('Vertex Shader: ' + Control_1.GL.getShaderInfoLog(vs));
        }
        const fs = Control_1.GL.createShader(Control_1.GL.FRAGMENT_SHADER);
        Control_1.GL.shaderSource(fs, this.FragmentShader);
        Control_1.GL.compileShader(fs);
        if (!Control_1.GL.getShaderParameter(fs, Control_1.GL.COMPILE_STATUS)) {
            errorLog.push('Fragment Shader: ' + Control_1.GL.getShaderInfoLog(fs));
        }
        Control_1.GL.attachShader(this.Program, vs);
        Control_1.GL.attachShader(this.Program, fs);
        Control_1.GL.linkProgram(this.Program);
        if (!Control_1.GL.getProgramParameter(this.Program, Control_1.GL.LINK_STATUS)) {
            errorLog.push(Control_1.GL.getProgramInfoLog(this.Program));
        }
        if (errorLog.length > 0) {
            throw errorLog;
        }
    }
}
exports.default = Shader;

},{"../../Item":1,"../../Logic/Utility/Control":23,"./Instance/ShaderAttributes":57,"./Instance/ShaderUniforms":58}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
window.FWGE = {};
window.FWGE.GameObject = require('./Logic/GameObject').default;
window.FWGE.Transform = require('./Logic/Transform').default;
window.FWGE.Mesh = require('./Logic/Mesh').default;
window.FWGE.Input = require('./Logic/Input/Input').default;
window.FWGE.KeyboardInput = require('./Logic/Input/KeyboardInput').default;
window.FWGE.KeyboardState = require('./Logic/Input/InputState').KeyboardState;
window.FWGE.ButtonState = require('./Logic/Input/InputState').ButtonState;
window.FWGE.WheelState = require('./Logic/Input/InputState').WheelState;
window.FWGE.Attachable = require('./Logic/Interfaces/Attachable').default;
window.FWGE.Cloneable = require('./Logic/Interfaces/Cloneable').default;
window.FWGE.Destroyable = require('./Logic/Interfaces/Destroyable').default;
window.FWGE.Updateable = require('./Logic/Interfaces/Updateable').default;
window.FWGE.Maths = require('./Logic/Maths/Maths').default;
window.FWGE.Vector2 = require('./Logic/Maths/Vector2').default;
window.FWGE.Vector3 = require('./Logic/Maths/Vector3').default;
window.FWGE.Vector4 = require('./Logic/Maths/Vector4').default;
window.FWGE.Matrix2 = require('./Logic/Maths/Matrix2').default;
window.FWGE.Matrix3 = require('./Logic/Maths/Matrix3').default;
window.FWGE.Matrix4 = require('./Logic/Maths/Matrix4').default;
window.FWGE.OBJConverter = require('./Logic/Utility/Converter/OBJConverter').default;
window.FWGE.ArrayUtils = require('./Logic/Utility/ArrayUtils').default;
window.FWGE.BinaryTree = require('./Logic/Utility/BinaryTree').default;
window.FWGE.Control = require('./Logic/Utility/Control').default;
window.FWGE.List = require('./Logic/Utility/List').default;
window.FWGE.ListUtils = require('./Logic/Utility/ListUtils').default;
window.FWGE.Stack = require('./Logic/Utility/Stack').default;
window.FWGE.Time = require('./Logic/Utility/Time').default;
window.FWGE.Tree = require('./Logic/Utility/Tree').default;
window.FWGE.BoxCollider = require('./Physics/Collision/BoxCollider').default;
window.FWGE.Collider = require('./Physics/Collision/Collider').default;
window.FWGE.SphereCollider = require('./Physics/Collision/SphereCollider').default;
window.FWGE.CollisionEvent = require('./Physics/Collision/CollisionEvent').default;
window.FWGE.PhysicsBody = require('./Physics/PhysicsBody').default;
window.FWGE.PhysicsMaterial = require('./Physics/PhysicsMaterial').default;
window.FWGE.Animation = require('./Render/Animation/Animation').default;
window.FWGE.IAnimation = require('./Render/Animation/Animation').IAnimation;
window.FWGE.Camera = require('./Render/Camera/Camera').default;
window.FWGE.ICamera = require('./Render/Camera/Camera').ICamera;
window.FWGE.Viewer = require('./Render/Camera/Viewer').default;
window.FWGE.ViewMode = require('./Render/Camera/Viewer').ViewMode;
window.FWGE.Colour4 = require('./Render/Colour/Colour3').default;
window.FWGE.Colour4 = require('./Render/Colour/Colour4').default;
window.FWGE.AmbientLight = require('./Render/Light/AmbientLight').default;
window.FWGE.IAmbientLight = require('./Render/Light/AmbientLight').IAmbientLight;
window.FWGE.DirectionalLight = require('./Render/Light/DirectionalLight').default;
window.FWGE.IDirectionalLight = require('./Render/Light/DirectionalLight').IDirectionalLight;
window.FWGE.ILightItem = require('./Render/Light/LightItem').ILightItem;
window.FWGE.PointLight = require('./Render/Light/PointLight').default;
window.FWGE.IPointLight = require('./Render/Light/PointLight').IPointLight;
window.FWGE.ParticleSystem = require('./Render/Particle System/ParticleSystem').default;
window.FWGE.Shader = require('./Render/Shader/Shader').default;
window.FWGE.IShader = require('./Render/Shader/Shader').IShader;
window.FWGE.ModelView = require('./Render/ModelView').default;
window.FWGE.RenderMaterial = require('./Render/RenderMaterial').default;

},{"./Logic/GameObject":2,"./Logic/Input/Input":3,"./Logic/Input/InputState":4,"./Logic/Input/KeyboardInput":5,"./Logic/Interfaces/Attachable":7,"./Logic/Interfaces/Cloneable":8,"./Logic/Interfaces/Destroyable":9,"./Logic/Interfaces/Updateable":10,"./Logic/Maths/Maths":12,"./Logic/Maths/Matrix2":13,"./Logic/Maths/Matrix3":14,"./Logic/Maths/Matrix4":15,"./Logic/Maths/Vector2":16,"./Logic/Maths/Vector3":17,"./Logic/Maths/Vector4":18,"./Logic/Mesh":19,"./Logic/Transform":20,"./Logic/Utility/ArrayUtils":21,"./Logic/Utility/BinaryTree":22,"./Logic/Utility/Control":23,"./Logic/Utility/Converter/OBJConverter":24,"./Logic/Utility/List":25,"./Logic/Utility/ListUtils":26,"./Logic/Utility/Stack":27,"./Logic/Utility/Time":28,"./Logic/Utility/Tree":29,"./Physics/Collision/BoxCollider":30,"./Physics/Collision/Collider":31,"./Physics/Collision/CollisionEvent":32,"./Physics/Collision/SphereCollider":33,"./Physics/PhysicsBody":34,"./Physics/PhysicsMaterial":35,"./Render/Animation/Animation":36,"./Render/Camera/Camera":38,"./Render/Camera/Viewer":39,"./Render/Colour/Colour3":40,"./Render/Colour/Colour4":41,"./Render/Light/AmbientLight":42,"./Render/Light/DirectionalLight":43,"./Render/Light/LightItem":44,"./Render/Light/PointLight":45,"./Render/ModelView":46,"./Render/Particle System/ParticleSystem":47,"./Render/RenderMaterial":48,"./Render/Shader/Shader":59}]},{},[60]);
