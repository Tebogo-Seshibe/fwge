(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../Audio/Audio");
const Item_1 = __importDefault(require("../Logic/Object/Item"));
const Vector3_1 = __importDefault(require("../Logic/Maths/Vector3"));
const List_1 = __importDefault(require("../Logic/Utility/List"));
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
        let offset = 0;
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
            offset = 0;
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

},{"../Audio/Audio":4,"../Logic/Maths/Vector3":26,"../Logic/Object/Item":30,"../Logic/Utility/List":36,"./AnimationFrame":2}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Animation_1 = __importDefault(require("./Animation"));
exports.Animation = Animation_1.default;
const AnimationFrame_1 = __importDefault(require("./AnimationFrame"));
exports.AnimationFrame = AnimationFrame_1.default;

},{"./Animation":1,"./AnimationFrame":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Audio {
    Init() {
        throw new Error("Method not implemented.");
    }
    Update() {
        throw new Error("Method not implemented.");
    }
    Reset() {
        throw new Error("Method not implemented.");
    }
}
exports.default = Audio;

},{}],5:[function(require,module,exports){
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
const Vector3_1 = __importDefault(require("../Maths/Vector3"));
const Viewer_1 = __importStar(require("./Viewer"));
exports.Cameras = [];
class ICamera {
}
exports.ICamera = ICamera;
class Camera extends Viewer_1.default {
    constructor({ name = 'Viewer', mode = Viewer_1.ViewMode.PERSPECTIVE, position = [0, 0, 0], rotation = [0, 0, 0], target = [0, 0, -1], up = [0, 1, 0] } = new ICamera) {
        super(name);
        this.Mode = mode;
        this.Target = new Vector3_1.default(position);
        this.Rotation = new Vector3_1.default(rotation);
        this.Target = new Vector3_1.default(target);
        this.Up = new Vector3_1.default(up);
        exports.Cameras.push(this);
    }
}
exports.default = Camera;

},{"../Maths/Vector3":26,"./Viewer":6}],6:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../Object/Item"));
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

},{"../Object/Item":30}],7:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Camera_1 = __importDefault(require("./Camera"));
exports.Camera = Camera_1.default;
const Viewer_1 = require("./Viewer");
exports.ViewMode = Viewer_1.ViewMode;

},{"./Camera":5,"./Viewer":6}],8:[function(require,module,exports){
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
const Colour4_1 = __importDefault(require("../../Render/Colour/Colour4"));
const GameObject_1 = __importDefault(require("../Object/GameObject"));
const Material_1 = __importStar(require("../Object/Material"));
const Vector2_1 = __importDefault(require("../Maths/Vector2"));
const Vector3_1 = __importDefault(require("../Maths/Vector3"));
const Mesh_1 = __importDefault(require("../Object/Mesh"));
class OBJConverter {
    Parse(obj, mtl) {
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
        let { name, shininess, ambient, diffuse, specular, alpha, imagemap } = new Material_1.IMaterial;
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
        return new Material_1.default({ name, shininess, ambient, diffuse, specular, alpha, imagemap, shader: null });
    }
}
exports.default = OBJConverter;

},{"../../Render/Colour/Colour4":46,"../Maths/Vector2":25,"../Maths/Vector3":26,"../Object/GameObject":29,"../Object/Material":31,"../Object/Mesh":32}],9:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OBJConverter_1 = __importDefault(require("./OBJConverter"));
exports.OBJConverter = OBJConverter_1.default;

},{"./OBJConverter":8}],10:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const KeyboardInput_1 = __importDefault(require("./KeyboardInput"));
const MouseInput_1 = __importDefault(require("./MouseInput"));
class Input {
    Init(canvas) {
        this.Keyboard = new KeyboardInput_1.default();
        this.Mouse = new MouseInput_1.default(canvas);
        this.Controllers = new Map();
    }
    Update() {
    }
    Reset() {
        this.Mouse.Reset();
    }
}
exports.default = Input;

},{"./KeyboardInput":12,"./MouseInput":13}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./InputState":11}],13:[function(require,module,exports){
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
            this.wheel = e.deltaY > 0
                ? InputState_1.WheelState.DOWN
                : e.deltaY < 0
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
    get Buttons() {
        return this.buttons.slice(3);
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
    Reset() {
        this.wheel = InputState_1.WheelState.CENTERED;
    }
}
exports.default = MouseInput;

},{"../Maths/Vector2":25,"./InputState":11}],14:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Input_1 = __importDefault(require("./Input"));
exports.Input = Input_1.default;
const InputState_1 = require("./InputState");
exports.ButtonState = InputState_1.ButtonState;
exports.KeyboardState = InputState_1.KeyboardState;
exports.WheelState = InputState_1.WheelState;

},{"./Input":10,"./InputState":11}],15:[function(require,module,exports){
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
const Colour4_1 = __importDefault(require("../../Render/Colour/Colour4"));
const List_1 = __importDefault(require("../Utility/List"));
const Light_1 = __importStar(require("./Light"));
exports.AmbientLights = new List_1.default(1);
class IAmbientLight {
}
exports.IAmbientLight = IAmbientLight;
class AmbientLight extends Light_1.default {
    constructor({ name = 'Directional Light', colour = [1, 1, 1], intensity = 1 } = new IAmbientLight) {
        super(name);
        this.Colour = new Colour4_1.default([...colour]);
        this.Intensity = intensity;
        this.Shadows = Light_1.ShadowQuality.NONE;
        exports.AmbientLights.Add(this);
    }
}
exports.default = AmbientLight;

},{"../../Render/Colour/Colour4":46,"../Utility/List":36,"./Light":17}],16:[function(require,module,exports){
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
const Vector3_1 = __importDefault(require("../Maths/Vector3"));
const List_1 = __importDefault(require("../Utility/List"));
const Light_1 = __importStar(require("./Light"));
const Colour4_1 = __importDefault(require("../../Render/Colour/Colour4"));
exports.MAX_DIRECTIONAL_LIGHTS = 3;
exports.DirectionalLights = new List_1.default(exports.MAX_DIRECTIONAL_LIGHTS);
class IDirectionalLight {
}
exports.IDirectionalLight = IDirectionalLight;
class DirectionalLight extends Light_1.default {
    constructor({ name = 'Ambient Light', colour = [1, 1, 1], intensity = 1, direction = [0, 0, 1], shadows = Light_1.ShadowQuality.NONE } = new IDirectionalLight) {
        super(name);
        this.Colour = new Colour4_1.default([...colour]);
        this.Intensity = intensity;
        this.Direction = new Vector3_1.default([...direction]);
        this.Shadows = shadows;
        exports.DirectionalLights.Add(this);
    }
}
exports.default = DirectionalLight;

},{"../../Render/Colour/Colour4":46,"../Maths/Vector3":26,"../Utility/List":36,"./Light":17}],17:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../Object/Item"));
var ShadowQuality;
(function (ShadowQuality) {
    ShadowQuality[ShadowQuality["NONE"] = 0] = "NONE";
    ShadowQuality[ShadowQuality["LOW"] = 1] = "LOW";
    ShadowQuality[ShadowQuality["HIGH"] = 2] = "HIGH";
})(ShadowQuality = exports.ShadowQuality || (exports.ShadowQuality = {}));
class Light extends Item_1.default {
    constructor(name) {
        super(name);
    }
}
exports.default = Light;

},{"../Object/Item":30}],18:[function(require,module,exports){
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
const Colour4_1 = __importDefault(require("../../Render/Colour/Colour4"));
const Vector3_1 = __importDefault(require("../Maths/Vector3"));
const List_1 = __importDefault(require("../Utility/List"));
const Light_1 = __importStar(require("./Light"));
exports.MAX_POINT_LIGHT = 12;
exports.PointLights = new List_1.default(exports.MAX_POINT_LIGHT);
class IPointLight {
}
exports.IPointLight = IPointLight;
class PointLight extends Light_1.default {
    constructor({ name = 'Point Light', colour = [1, 1, 1, 1], intensity = 1, position = [0, 0, 0], radius = 5, angle = 180, shadows = Light_1.ShadowQuality.NONE } = new IPointLight) {
        super(name);
        this.Colour = new Colour4_1.default([...colour]);
        this.Intensity = intensity;
        this.Position = new Vector3_1.default([...position]);
        this.Radius = radius;
        this.Angle = angle;
        this.Shadows = shadows;
        exports.PointLights.Add(this);
    }
}
exports.default = PointLight;

},{"../../Render/Colour/Colour4":46,"../Maths/Vector3":26,"../Utility/List":36,"./Light":17}],19:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AmbientLight_1 = __importDefault(require("./AmbientLight"));
exports.AmbientLight = AmbientLight_1.default;
const DirectionalLight_1 = __importDefault(require("./DirectionalLight"));
exports.DirectionalLight = DirectionalLight_1.default;
const PointLight_1 = __importDefault(require("./PointLight"));
exports.PointLight = PointLight_1.default;
const Light_1 = require("./Light");
exports.ShadowQuality = Light_1.ShadowQuality;

},{"./AmbientLight":15,"./DirectionalLight":16,"./Light":17,"./PointLight":18}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SIGNIFICANT_FIGURES = Math.pow(10, 5);
Math.radian = (degree) => {
    return Math.PI / 180 * degree;
};
Math.cot = (radian) => {
    return 1 / Math.tan(radian);
};
Math.clamp = (value, min, max) => {
    return Math.min(max, Math.max(min, value));
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

},{}],22:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
require("./Math");
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
        return Math.clean(this.M11 * this.M22 - this.M21 * this.M12);
    }
    constructor(m11, m12, m21, m22) {
        super(4);
        if (m11 !== undefined) {
            if (typeof m11 === 'number') {
                this.Set(m11, m12, m21, m22);
            }
            else {
                this.Set([...m11]);
            }
        }
    }
    Set(m11, m12, m21, m22) {
        [
            m11, m12,
            m21, m22
        ] = Matrix2.Destructure(m11, m12, m21, m22);
        this.M11 = m11;
        this.M12 = m12;
        this.M21 = m21;
        this.M22 = m22;
        return this;
    }
    Sum(m11, m12, m21, m22) {
        [
            m11, m12,
            m21, m22
        ] = Matrix2.Destructure(m11, m12, m21, m22);
        this.M11 += m11;
        this.M12 += m12;
        this.M21 += m21;
        this.M22 += m22;
        return this;
    }
    Mult(m11, m12, m21, m22) {
        [
            m11, m12,
            m21, m22
        ] = Matrix2.Destructure(m11, m12, m21, m22);
        return this.Set(this.M11 * m11 + this.M12 * m21, this.M11 * m12 + this.M12 * m22, this.M21 * m11 + this.M22 * m21, this.M21 * m12 + this.M22 * m22);
    }
    Scale(scaler) {
        this.M11 *= scaler;
        this.M12 *= scaler;
        this.M21 *= scaler;
        this.M22 *= scaler;
        return this;
    }
    Transpose() {
        return this.Set(this.M11, this.M21, this.M12, this.M22);
    }
    Inverse() {
        let det = this.Determinant;
        if (det !== 0) {
            this.Set(this.M22 / det, -this.M12 / det, -this.M21 / det, this.M11 / det);
        }
        return this;
    }
    Identity() {
        return this.Set(1, 0, 0, 1);
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
    static Destructure(m11, m12, m21, m22) {
        if (m11 instanceof Float32Array || m11 instanceof List_1.default || m11 instanceof Array) {
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

},{"../Utility/List":36,"./Math":21}],23:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
require("./Math");
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
        return Math.clean(this.M11 * (this.M22 * this.M33 - this.M23 * this.M32) -
            this.M12 * (this.M21 * this.M33 - this.M23 * this.M31) +
            this.M13 * (this.M21 * this.M32 - this.M22 * this.M31));
    }
    constructor(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        super(9);
        if (m11 !== undefined) {
            if (typeof m11 === 'number') {
                this.Set(m11, m12, m13, m21, m22, m23, m31, m32, m33);
            }
            else {
                this.Set([...m11]);
            }
        }
    }
    Set(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ] = Matrix3.Destructure(m11, m12, m13, m21, m22, m23, m31, m32, m33);
        this.M11 = m11;
        this.M12 = m12;
        this.M13 = m13;
        this.M21 = m21;
        this.M22 = m22;
        this.M23 = m23;
        this.M31 = m31;
        this.M32 = m32;
        this.M33 = m33;
        return this;
    }
    Sum(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ] = Matrix3.Destructure(m11, m12, m13, m21, m22, m23, m31, m32, m33);
        this.M11 += m11;
        this.M12 += m12;
        this.M13 += m13;
        this.M21 += m21;
        this.M22 += m22;
        this.M23 += m23;
        this.M31 += m31;
        this.M32 += m32;
        this.M33 += m33;
        return this;
    }
    Mult(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        [
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ] = Matrix3.Destructure(m11, m12, m13, m21, m22, m23, m31, m32, m33);
        return this.Set(this.M11 * m11 + this.M12 * m21 + this.M13 * m31, this.M11 * m12 + this.M12 * m22 + this.M13 * m32, this.M11 * m13 + this.M12 * m23 + this.M13 * m33, this.M21 * m11 + this.M22 * m21 + this.M23 * m31, this.M21 * m12 + this.M22 * m22 + this.M23 * m32, this.M21 * m13 + this.M22 * m23 + this.M23 * m33, this.M31 * m11 + this.M32 * m21 + this.M33 * m31, this.M31 * m12 + this.M32 * m22 + this.M33 * m32, this.M31 * m13 + this.M32 * m23 + this.M33 * m33);
    }
    Scale(scaler) {
        this.M11 *= scaler;
        this.M12 *= scaler;
        this.M13 *= scaler;
        this.M21 *= scaler;
        this.M22 *= scaler;
        this.M23 *= scaler;
        this.M31 *= scaler;
        this.M32 *= scaler;
        this.M33 *= scaler;
        return this;
    }
    Transpose() {
        return this.Set(this.M11, this.M21, this.M31, this.M12, this.M22, this.M32, this.M13, this.M23, this.M33);
    }
    Inverse() {
        let det = this.Determinant;
        if (det !== 0) {
            this.Set((this.M22 * this.M33 - this.M32 * this.M23) / det, (this.M32 * this.M13 - this.M12 * this.M33) / det, (this.M12 * this.M23 - this.M22 * this.M13) / det, (this.M31 * this.M23 - this.M21 * this.M33) / det, (this.M11 * this.M33 - this.M31 * this.M13) / det, (this.M21 * this.M13 - this.M11 * this.M23) / det, (this.M21 * this.M32 - this.M31 * this.M22) / det, (this.M31 * this.M12 - this.M11 * this.M32) / det, (this.M11 * this.M22 - this.M21 * this.M12) / det);
        }
        return this;
    }
    Identity() {
        return this.Set(1, 0, 0, 0, 1, 0, 0, 0, 1);
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
    static Destructure(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        if (m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_1.default) {
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

},{"../Utility/List":36,"./Math":21}],24:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
require("./Math");
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
        return Math.clean(this.M11 * this.M22 * this.M33 * this.M44 +
            this.M11 * this.M23 * this.M34 * this.M42 +
            this.M11 * this.M24 * this.M32 * this.M43 +
            this.M12 * this.M21 * this.M34 * this.M43 +
            this.M12 * this.M23 * this.M31 * this.M44 +
            this.M12 * this.M24 * this.M33 * this.M41 +
            this.M13 * this.M21 * this.M32 * this.M44 +
            this.M13 * this.M22 * this.M34 * this.M41 +
            this.M13 * this.M24 * this.M31 * this.M42 +
            this.M14 * this.M21 * this.M33 * this.M42 +
            this.M14 * this.M22 * this.M31 * this.M43 +
            this.M14 * this.M23 * this.M32 * this.M41 -
            this.M11 * this.M22 * this.M34 * this.M43 -
            this.M11 * this.M23 * this.M32 * this.M44 -
            this.M11 * this.M24 * this.M33 * this.M42 -
            this.M12 * this.M21 * this.M33 * this.M44 -
            this.M12 * this.M23 * this.M34 * this.M41 -
            this.M12 * this.M24 * this.M31 * this.M43 -
            this.M13 * this.M21 * this.M34 * this.M42 -
            this.M13 * this.M22 * this.M31 * this.M44 -
            this.M13 * this.M24 * this.M32 * this.M41 -
            this.M14 * this.M21 * this.M32 * this.M43 -
            this.M14 * this.M22 * this.M33 * this.M41 -
            this.M14 * this.M23 * this.M31 * this.M42);
    }
    constructor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        super(16);
        if (m11 !== undefined) {
            if (typeof m11 === 'number') {
                this.Set(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
            }
            else {
                this.Set([...m11]);
            }
        }
    }
    Set(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        [
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] = Matrix4.Destructure(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
        this.M11 = m11;
        this.M12 = m12;
        this.M13 = m13;
        this.M14 = m14;
        this.M21 = m21;
        this.M22 = m22;
        this.M23 = m23;
        this.M24 = m24;
        this.M31 = m31;
        this.M32 = m32;
        this.M33 = m33;
        this.M34 = m34;
        this.M41 = m41;
        this.M42 = m42;
        this.M43 = m43;
        this.M44 = m44;
        return this;
    }
    Sum(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        [
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] = Matrix4.Destructure(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
        this.M11 += m11;
        this.M12 += m12;
        this.M13 += m13;
        this.M14 += m14;
        this.M21 += m21;
        this.M22 += m22;
        this.M23 += m23;
        this.M24 += m24;
        this.M31 += m31;
        this.M32 += m32;
        this.M33 += m33;
        this.M34 += m34;
        this.M41 += m41;
        this.M42 += m42;
        this.M43 += m43;
        this.M44 += m44;
        return this;
    }
    Mult(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        [
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] = Matrix4.Destructure(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
        return this.Set(this.M11 * m11 + this.M12 * m21 + this.M13 * m31 + this.M14 * m41, this.M11 * m12 + this.M12 * m22 + this.M13 * m32 + this.M14 * m42, this.M11 * m13 + this.M12 * m23 + this.M13 * m33 + this.M14 * m43, this.M11 * m14 + this.M12 * m24 + this.M13 * m34 + this.M14 * m44, this.M21 * m11 + this.M22 * m21 + this.M23 * m31 + this.M24 * m41, this.M21 * m12 + this.M22 * m22 + this.M23 * m32 + this.M24 * m42, this.M21 * m13 + this.M22 * m23 + this.M23 * m33 + this.M24 * m43, this.M21 * m14 + this.M22 * m24 + this.M23 * m34 + this.M24 * m44, this.M31 * m11 + this.M32 * m21 + this.M33 * m31 + this.M34 * m41, this.M31 * m12 + this.M32 * m22 + this.M33 * m32 + this.M34 * m42, this.M31 * m13 + this.M32 * m23 + this.M33 * m33 + this.M34 * m43, this.M31 * m14 + this.M32 * m24 + this.M33 * m34 + this.M34 * m44, this.M41 * m11 + this.M42 * m21 + this.M43 * m31 + this.M44 * m41, this.M41 * m12 + this.M42 * m22 + this.M43 * m32 + this.M44 * m42, this.M41 * m13 + this.M42 * m23 + this.M43 * m33 + this.M44 * m43, this.M41 * m14 + this.M42 * m24 + this.M43 * m34 + this.M44 * m44);
    }
    Scale(scaler) {
        this.M11 *= scaler;
        this.M12 *= scaler;
        this.M13 *= scaler;
        this.M14 *= scaler;
        this.M21 *= scaler;
        this.M22 *= scaler;
        this.M23 *= scaler;
        this.M24 *= scaler;
        this.M31 *= scaler;
        this.M32 *= scaler;
        this.M33 *= scaler;
        this.M34 *= scaler;
        this.M41 *= scaler;
        this.M42 *= scaler;
        this.M43 *= scaler;
        this.M44 *= scaler;
        return this;
    }
    Transpose() {
        return this.Set(this.M11, this.M21, this.M31, this.M41, this.M12, this.M22, this.M32, this.M42, this.M13, this.M23, this.M33, this.M43, this.M14, this.M24, this.M34, this.M44);
    }
    Inverse() {
        var det = this.Determinant;
        if (det !== 0) {
            this.Set((this.M22 * this.M33 * this.M44 +
                this.M23 * this.M34 * this.M42 +
                this.M24 * this.M32 * this.M43 -
                this.M22 * this.M34 * this.M43 -
                this.M23 * this.M32 * this.M44 -
                this.M24 * this.M33 * this.M42) / det, (this.M12 * this.M34 * this.M43 +
                this.M13 * this.M32 * this.M44 +
                this.M14 * this.M33 * this.M42 -
                this.M12 * this.M33 * this.M44 -
                this.M13 * this.M34 * this.M42 -
                this.M14 * this.M32 * this.M43) / det, (this.M12 * this.M23 * this.M44 +
                this.M13 * this.M24 * this.M42 +
                this.M14 * this.M22 * this.M43 -
                this.M12 * this.M24 * this.M43 -
                this.M13 * this.M22 * this.M44 -
                this.M14 * this.M23 * this.M42) / det, (this.M12 * this.M24 * this.M33 +
                this.M13 * this.M22 * this.M34 +
                this.M14 * this.M23 * this.M32 -
                this.M12 * this.M23 * this.M34 -
                this.M13 * this.M24 * this.M32 -
                this.M14 * this.M22 * this.M33) / det, (this.M21 * this.M34 * this.M43 +
                this.M23 * this.M31 * this.M44 +
                this.M24 * this.M33 * this.M41 -
                this.M21 * this.M33 * this.M44 -
                this.M23 * this.M34 * this.M41 -
                this.M24 * this.M31 * this.M43) / det, (this.M11 * this.M33 * this.M44 +
                this.M13 * this.M34 * this.M41 +
                this.M14 * this.M31 * this.M43 -
                this.M11 * this.M34 * this.M43 -
                this.M13 * this.M31 * this.M44 -
                this.M14 * this.M33 * this.M41) / det, (this.M11 * this.M24 * this.M43 +
                this.M13 * this.M21 * this.M44 +
                this.M14 * this.M23 * this.M41 -
                this.M11 * this.M23 * this.M44 -
                this.M13 * this.M24 * this.M41 -
                this.M14 * this.M21 * this.M43) / det, (this.M11 * this.M23 * this.M34 +
                this.M13 * this.M24 * this.M31 +
                this.M14 * this.M21 * this.M33 -
                this.M11 * this.M24 * this.M33 -
                this.M13 * this.M21 * this.M34 -
                this.M14 * this.M23 * this.M31) / det, (this.M21 * this.M32 * this.M44 +
                this.M22 * this.M34 * this.M41 +
                this.M24 * this.M31 * this.M42 -
                this.M21 * this.M34 * this.M42 -
                this.M22 * this.M31 * this.M44 -
                this.M24 * this.M32 * this.M41) / det, (this.M11 * this.M34 * this.M42 +
                this.M12 * this.M31 * this.M44 +
                this.M14 * this.M32 * this.M41 -
                this.M11 * this.M32 * this.M44 -
                this.M12 * this.M34 * this.M41 -
                this.M14 * this.M31 * this.M42) / det, (this.M11 * this.M22 * this.M44 +
                this.M12 * this.M24 * this.M41 +
                this.M14 * this.M21 * this.M42 -
                this.M11 * this.M24 * this.M42 -
                this.M12 * this.M21 * this.M44 -
                this.M14 * this.M22 * this.M41) / det, (this.M11 * this.M24 * this.M32 +
                this.M12 * this.M21 * this.M34 +
                this.M14 * this.M22 * this.M31 -
                this.M11 * this.M22 * this.M34 -
                this.M12 * this.M24 * this.M31 -
                this.M14 * this.M21 * this.M32) / det, (this.M21 * this.M33 * this.M42 +
                this.M22 * this.M31 * this.M43 +
                this.M23 * this.M32 * this.M41 -
                this.M21 * this.M32 * this.M43 -
                this.M22 * this.M33 * this.M41 -
                this.M23 * this.M31 * this.M42) / det, (this.M11 * this.M32 * this.M43 +
                this.M12 * this.M33 * this.M41 +
                this.M13 * this.M31 * this.M42 -
                this.M11 * this.M33 * this.M42 -
                this.M12 * this.M31 * this.M43 -
                this.M13 * this.M32 * this.M41) / det, (this.M11 * this.M23 * this.M42 +
                this.M12 * this.M21 * this.M43 +
                this.M13 * this.M22 * this.M41 -
                this.M11 * this.M22 * this.M43 -
                this.M12 * this.M23 * this.M41 -
                this.M13 * this.M21 * this.M42) / det, (this.M11 * this.M22 * this.M33 +
                this.M12 * this.M23 * this.M31 +
                this.M13 * this.M21 * this.M32 -
                this.M11 * this.M23 * this.M32 -
                this.M12 * this.M21 * this.M33 -
                this.M13 * this.M22 * this.M31) / det);
        }
        return this;
    }
    Identity() {
        return this.Set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
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
    static Destructure(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        if (m11 instanceof Matrix4 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_1.default) {
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

},{"../Utility/List":36,"./Math":21}],25:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
require("./Math");
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
        return Math.clean(Math.sqrt(Math.pow(this.X, 2) + Math.pow(this.Y, 2)));
    }
    constructor(x, y) {
        super(2);
        if (x !== undefined) {
            if (typeof x === 'number') {
                this.Set(x, y);
            }
            else {
                this.Set([...x]);
            }
        }
    }
    Set(x, y) {
        [x, y] = Vector2.Destructure(x, y);
        this.X = x;
        this.Y = y;
        return this;
    }
    Sum(x, y) {
        [x, y] = Vector2.Destructure(x, y);
        this.X += x;
        this.Y += y;
        return this;
    }
    Diff(x, y) {
        [x, y] = Vector2.Destructure(x, y);
        this.X -= x;
        this.Y -= y;
        return this;
    }
    Mult(x, y) {
        [x, y] = Vector2.Destructure(x, y);
        return this.Set(this.X * x, this.Y * y);
    }
    Scale(scalar) {
        return this.Mult(scalar, scalar);
    }
    Dot(x, y) {
        [x, y] = Vector2.Destructure(x, y);
        return Math.clean(this.X * x + this.Y * y);
    }
    Lerp(time, x, y) {
        [x, y] = Vector2.Destructure(x, y);
        return this.Set(Math.lerp(this.X, x, time), Math.lerp(this.Y, y, time));
    }
    Unit() {
        let length = this.Length;
        if (length !== 0) {
            this.Scale(1 / length);
        }
        return this;
    }
    Clone() {
        return new Vector2(this);
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
    static Destructure(x, y) {
        if (x instanceof Float32Array || x instanceof List_1.default || x instanceof Array) {
            [x, y] = x;
        }
        return [x, y];
    }
}
exports.default = Vector2;

},{"../Utility/List":36,"./Math":21}],26:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
require("./Math");
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
        return Math.clean(Math.sqrt(Math.pow(this.X, 2) + Math.pow(this.Y, 2) + Math.pow(this.Z, 2)));
    }
    constructor(x, y, z) {
        super(3);
        if (x !== undefined) {
            if (typeof x === 'number') {
                this.Set(x, y, z);
            }
            else {
                this.Set([...x]);
            }
        }
    }
    Set(x, y, z) {
        [x, y, z] = Vector3.Destructure(x, y, z);
        this.X = x;
        this.Y = y;
        this.Z = z;
        return this;
    }
    Sum(x, y, z) {
        [x, y, z] = Vector3.Destructure(x, y, z);
        this.X += x;
        this.Y += y;
        this.Z += z;
        return this;
    }
    Diff(x, y, z) {
        [x, y, z] = Vector3.Destructure(x, y, z);
        this.X -= x;
        this.Y -= y;
        this.Z -= z;
        return this;
    }
    Mult(x, y, z) {
        [x, y, z] = Vector3.Destructure(x, y, z);
        return this.Set(this.X * x, this.Y * y, this.Z * z);
    }
    Scale(scalar) {
        return this.Mult(scalar, scalar, scalar);
    }
    Dot(x, y, z) {
        [x, y, z] = Vector3.Destructure(x, y, z);
        return Math.clean(this.X * x + this.Y * y + this.Z * z);
    }
    Lerp(time, x, y, z) {
        [x, y, z] = Vector3.Destructure(x, y, z);
        return this.Set(Math.lerp(this.X, x, time), Math.lerp(this.Y, y, time), Math.lerp(this.Z, z, time));
    }
    Cross(x, y, z) {
        [x, y, z] = Vector3.Destructure(x, y, z);
        return this.Set(this.Y * z - this.Z * y, this.Z * x - this.X * z, this.X * y - this.Y * x);
    }
    Unit() {
        let length = this.Length;
        if (length !== 0) {
            this.Scale(1 / length);
        }
        return this;
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
    static Destructure(x, y, z) {
        if (x instanceof Float32Array || x instanceof Array || x instanceof List_1.default) {
            [x, y, z] = x;
        }
        return [x, y, z];
    }
}
exports.default = Vector3;

},{"../Utility/List":36,"./Math":21}],27:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = __importDefault(require("../Utility/List"));
require("./Math");
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
        return Math.clean(Math.sqrt(Math.pow(this.X, 2) + Math.pow(this.Y, 2) + Math.pow(this.Z, 2) + Math.pow(this.W, 2)));
    }
    constructor(x, y, z, w) {
        super(4);
        if (x !== undefined) {
            if (typeof x === 'number') {
                this.Set(x, y, z, w);
            }
            else {
                this.Set([...x]);
            }
        }
    }
    Set(x, y, z, w) {
        [x, y, z, w] = Vector4.Destructure(x, y, z, w);
        this.X = x;
        this.Y = y;
        this.Z = z;
        this.W = w;
        return this;
    }
    Sum(x, y, z, w) {
        [x, y, z, w] = Vector4.Destructure(x, y, z, w);
        this.X += x;
        this.Y += y;
        this.Z += z;
        this.W += w;
        return this;
    }
    Diff(x, y, z, w) {
        [x, y, z, w] = Vector4.Destructure(x, y, z, w);
        this.X -= x;
        this.Y -= y;
        this.Z -= z;
        this.W -= w;
        return this;
    }
    Scale(scalar) {
        return this.Mult(scalar, scalar, scalar, scalar);
    }
    Mult(x, y, z, w) {
        [x, y, z, w] = Vector4.Destructure(x, y, z, w);
        return this.Set(this.X * x, this.Y * y, this.Z * z, this.W * w);
    }
    Dot(x, y, z, w) {
        [x, y, z, w] = Vector4.Destructure(x, y, z, w);
        return Math.clean(this.X * x + this.Y * y + this.Z * z + this.W * w);
    }
    Lerp(time, x, y, z, w) {
        [x, y, z, w] = Vector4.Destructure(x, y, z, w);
        return this.Set(Math.lerp(this.X, x, time), Math.lerp(this.Y, y, time), Math.lerp(this.Z, z, time), Math.lerp(this.W, w, time));
    }
    Unit() {
        let length = this.Length;
        if (length !== 0) {
            this.Scale(1 / length);
        }
        return this;
    }
    Clone() {
        return new Vector4(this);
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
        if (x instanceof Float32Array || x instanceof Array || x instanceof List_1.default) {
            [x, y, z, w] = x;
        }
        return [x, y, z, w];
    }
}
exports.default = Vector4;

},{"../Utility/List":36,"./Math":21}],28:[function(require,module,exports){
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
const Equations = __importStar(require("./Equation"));
exports.Equations = Equations;
const Matrix2_1 = __importDefault(require("./Matrix2"));
exports.Matrix2 = Matrix2_1.default;
const Matrix3_1 = __importDefault(require("./Matrix3"));
exports.Matrix3 = Matrix3_1.default;
const Matrix4_1 = __importDefault(require("./Matrix4"));
exports.Matrix4 = Matrix4_1.default;
const Vector2_1 = __importDefault(require("./Vector2"));
exports.Vector2 = Vector2_1.default;
const Vector3_1 = __importDefault(require("./Vector3"));
exports.Vector3 = Vector3_1.default;
const Vector4_1 = __importDefault(require("./Vector4"));
exports.Vector4 = Vector4_1.default;

},{"./Equation":20,"./Matrix2":22,"./Matrix3":23,"./Matrix4":24,"./Vector2":25,"./Vector3":26,"./Vector4":27}],29:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("./Item"));
const Transform_1 = __importDefault(require("./Transform"));
let OBJECT_COUNTER = 0;
exports.GameObjects = [];
class IGameObject {
}
exports.IGameObject = IGameObject;
class GameObject extends Item_1.default {
    constructor({ name = 'GameObject', visible = true, parent, children = [], transform = new Transform_1.default(), material, mesh, rigidbody, collider, animation, begin = function () { }, update = () => { }, end = () => { }, } = new IGameObject) {
        super(name);
        this.ObjectID = OBJECT_COUNTER++;
        this.Visible = visible;
        this.Parent = parent;
        this.Children = [];
        this.Transform = transform;
        this.Material = material;
        this.Mesh = mesh;
        this.RigidBody = rigidbody;
        this.Collider = collider;
        this.Animation = animation;
        this.Begin = begin;
        this.Update = update;
        this.End = end;
        if (this.Collider) {
            this.Collider.Parent = this;
        }
        for (let child of children) {
            child.Parent = this;
            this.Children.push(child);
            let index = exports.GameObjects.indexOf(child);
            if (index !== -1) {
                exports.GameObjects.splice(index, 1);
            }
        }
        exports.GameObjects.push(this);
    }
    Destroy(delay = 0) {
        setTimeout(() => {
            this.Children.forEach(child => child.Destroy());
            let index = exports.GameObjects.indexOf(this);
            if (index !== -1) {
                exports.GameObjects.splice(index, 1);
            }
            if (this.Parent) {
                index = this.Parent.Children.indexOf(this);
                if (index !== -1) {
                    this.Parent.Children.splice(index, 1);
                }
            }
        }, delay);
    }
    Clone() {
        return new GameObject({
            name: this.Name + " Clone",
            visible: this.Visible,
            children: this.Children.map(child => child.Clone()),
            transform: this.Transform.Clone(),
            material: this.Material,
            mesh: this.Mesh,
            rigidbody: this.RigidBody ? this.RigidBody.Clone() : undefined,
            collider: this.Collider ? this.Collider.Clone() : undefined,
            begin: this.Begin,
            update: this.Update,
            end: this.End
        });
    }
}
exports.default = GameObject;

},{"./Item":30,"./Transform":33}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let ID_COUNTER = 0;
function hash(number) {
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
exports.hash = hash;
class Item {
    constructor(name = 'Item') {
        this.ID = hash(ID_COUNTER++);
        this.Name = name;
    }
}
exports.default = Item;

},{}],31:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = require("../../Main");
const Colour4_1 = __importDefault(require("../../Render/Colour/Colour4"));
const Item_1 = __importDefault(require("./Item"));
require("../Maths/Math");
var ImageMapType;
(function (ImageMapType) {
    ImageMapType[ImageMapType["TEXTURE"] = 0] = "TEXTURE";
    ImageMapType[ImageMapType["NORMAL"] = 1] = "NORMAL";
    ImageMapType[ImageMapType["SPECULAR"] = 2] = "SPECULAR";
})(ImageMapType = exports.ImageMapType || (exports.ImageMapType = {}));
function ApplyImage(material, src, type) {
    let img = new Image();
    let texture = null;
    switch (type) {
        case ImageMapType.TEXTURE:
            if (material.ImageMap) {
                Main_1.GL.deleteTexture(material.ImageMap);
            }
            material.ImageMap = Main_1.GL.createTexture();
            texture = material.ImageMap;
            break;
        case ImageMapType.NORMAL:
            if (material.BumpMap) {
                Main_1.GL.deleteTexture(material.BumpMap);
            }
            material.BumpMap = Main_1.GL.createTexture();
            texture = material.BumpMap;
            break;
        case ImageMapType.SPECULAR:
            if (material.SpecularMap) {
                Main_1.GL.deleteTexture(material.SpecularMap);
            }
            material.SpecularMap = Main_1.GL.createTexture();
            texture = material.SpecularMap;
            break;
    }
    Main_1.GL.bindTexture(Main_1.GL.TEXTURE_2D, texture);
    Main_1.GL.texImage2D(Main_1.GL.TEXTURE_2D, 0, Main_1.GL.RGBA, 1, 1, 0, Main_1.GL.RGBA, Main_1.GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
    img.onload = e => {
        Main_1.GL.bindTexture(Main_1.GL.TEXTURE_2D, texture);
        Main_1.GL.texImage2D(Main_1.GL.TEXTURE_2D, 0, Main_1.GL.RGBA, Main_1.GL.RGBA, Main_1.GL.UNSIGNED_BYTE, img);
        if (Math.isPowerOf2(img.width) && Math.isPowerOf2(img.height)) {
            Main_1.GL.generateMipmap(Main_1.GL.TEXTURE_2D);
            Main_1.GL.texParameteri(Main_1.GL.TEXTURE_2D, Main_1.GL.TEXTURE_MAG_FILTER, Main_1.GL.LINEAR);
            Main_1.GL.texParameteri(Main_1.GL.TEXTURE_2D, Main_1.GL.TEXTURE_MIN_FILTER, Main_1.GL.LINEAR_MIPMAP_NEAREST);
        }
        else {
            Main_1.GL.texParameteri(Main_1.GL.TEXTURE_2D, Main_1.GL.TEXTURE_WRAP_S, Main_1.GL.CLAMP_TO_EDGE);
            Main_1.GL.texParameteri(Main_1.GL.TEXTURE_2D, Main_1.GL.TEXTURE_WRAP_T, Main_1.GL.CLAMP_TO_EDGE);
            Main_1.GL.texParameteri(Main_1.GL.TEXTURE_2D, Main_1.GL.TEXTURE_MIN_FILTER, Main_1.GL.LINEAR);
        }
        Main_1.GL.bindTexture(Main_1.GL.TEXTURE_2D, null);
    };
    img.src = src;
}
exports.ApplyImage = ApplyImage;
class IMaterial {
}
exports.IMaterial = IMaterial;
class Material extends Item_1.default {
    constructor({ name = 'Render Material', ambient = [0.50, 0.50, 0.50, 1.0], diffuse = [0.65, 0.65, 0.65, 1.0], specular = [0.75, 0.75, 0.75, 1.0], alpha = 1.0, shininess = 32.0, shader, imagemap, normalmap, specularmap } = new IMaterial) {
        super(name);
        this.Ambient = new Colour4_1.default(ambient);
        this.Diffuse = new Colour4_1.default(diffuse);
        this.Specular = new Colour4_1.default(specular);
        this.Alpha = alpha;
        this.Shininess = shininess;
        this.Shader = shader;
        if (imagemap) {
            ApplyImage(this, imagemap, ImageMapType.TEXTURE);
        }
        if (normalmap) {
            ApplyImage(this, normalmap, ImageMapType.NORMAL);
        }
        if (specularmap) {
            ApplyImage(this, specularmap, ImageMapType.SPECULAR);
        }
    }
}
exports.default = Material;

},{"../../Main":38,"../../Render/Colour/Colour4":46,"../Maths/Math":21,"./Item":30}],32:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = require("../../Main");
const Item_1 = __importDefault(require("./Item"));
const Colour4_1 = __importDefault(require("../../Render/Colour/Colour4"));
const Vector2_1 = __importDefault(require("../Maths/Vector2"));
const Vector3_1 = __importDefault(require("../Maths/Vector3"));
const ArrayUtils_1 = __importDefault(require("../Utility/ArrayUtils"));
var BufferType;
(function (BufferType) {
    BufferType[BufferType["INDEX"] = 0] = "INDEX";
    BufferType[BufferType["POSITION"] = 1] = "POSITION";
})(BufferType || (BufferType = {}));
function BindBufferData(type, data) {
    if (!data || data.length <= 0)
        return null;
    let buffer = Main_1.GL.createBuffer();
    switch (type) {
        case BufferType.INDEX:
            Main_1.GL.bindBuffer(Main_1.GL.ELEMENT_ARRAY_BUFFER, buffer);
            Main_1.GL.bufferData(Main_1.GL.ELEMENT_ARRAY_BUFFER, new Uint8Array(data), Main_1.GL.STATIC_DRAW);
            break;
        case BufferType.POSITION:
            Main_1.GL.bindBuffer(Main_1.GL.ARRAY_BUFFER, buffer);
            Main_1.GL.bufferData(Main_1.GL.ARRAY_BUFFER, new Float32Array(data), Main_1.GL.STATIC_DRAW);
            break;
    }
    return buffer;
}
exports.BindBufferData = BindBufferData;
class IMesh {
}
exports.IMesh = IMesh;
class Mesh extends Item_1.default {
    constructor({ name = 'Mesh', position = [], uv = [], colour = [], normal = [], index = [], wireframe = [] } = new IMesh) {
        super(name);
        if (position.length > 0) {
            if (position[0] instanceof Vector3_1.default) {
                position = ArrayUtils_1.default.Flatten(position);
            }
            this.PositionBuffer = BindBufferData(BufferType.POSITION, position);
        }
        if (normal.length > 0) {
            if (normal[0] instanceof Vector3_1.default) {
                normal = ArrayUtils_1.default.Flatten(normal);
            }
            this.NormalBuffer = BindBufferData(BufferType.POSITION, normal);
        }
        if (colour.length > 0) {
            if (colour[0] instanceof Colour4_1.default) {
                colour = ArrayUtils_1.default.Flatten(colour);
            }
            this.ColourBuffer = BindBufferData(BufferType.POSITION, colour);
        }
        if (uv.length > 0) {
            if (uv[0] instanceof Vector2_1.default) {
                uv = ArrayUtils_1.default.Flatten(uv);
            }
            this.UVBuffer = BindBufferData(BufferType.POSITION, uv);
        }
        this.IndexBuffer = BindBufferData(BufferType.INDEX, index);
        this.WireframeBuffer = BindBufferData(BufferType.INDEX, wireframe);
        this.VertexCount = index.length;
        this.WireframeCount = wireframe.length;
    }
}
exports.default = Mesh;

},{"../../Main":38,"../../Render/Colour/Colour4":46,"../Maths/Vector2":25,"../Maths/Vector3":26,"../Utility/ArrayUtils":35,"./Item":30}],33:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector3_1 = __importDefault(require("../Maths/Vector3"));
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
    Clone() {
        return new Transform({
            position: this.Position,
            rotation: this.Rotation,
            scale: this.Scale,
            shear: this.Shear
        });
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

},{"../Maths/Vector3":26}],34:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../Object/Item"));
const Equation_1 = require("../Maths/Equation");
const Vector3_1 = __importDefault(require("../Maths/Vector3"));
const Transform_1 = __importDefault(require("../Object/Transform"));
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
            let offset = 0;
            if (currentTime + offset > this.MaxTime) {
                if (this.Loop) {
                    this.UpdateParticle(particle, this.MaxTime, i);
                    currentTime = 0;
                    offset = 0;
                }
                else {
                    offset = this.MaxTime - currentTime;
                }
            }
            this.UpdateParticle(particle, currentTime, i);
        }
        this.CurrentTime += 0;
    }
    UpdateParticle(particle, time, index) {
        particle.Position.Set(this.Transform.Position).Sum(this.Position[0](time, index), this.Position[1](time, index), this.Position[2](time, index));
        particle.Rotation.Set(this.Transform.Rotation).Sum(this.Rotation[0](time, index), this.Rotation[1](time, index), this.Rotation[2](time, index));
        particle.Scale.Set(this.Transform.Scale).Sum(this.Scale[0](time, index), this.Scale[1](time, index), this.Scale[2](time, index));
    }
}
exports.default = ParticleSystem;

},{"../Maths/Equation":20,"../Maths/Vector3":26,"../Object/Item":30,"../Object/Transform":33}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArrayUtils {
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
exports.default = ArrayUtils;

},{}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimeKeep {
    constructor(period) {
        this.period = 1000 / period;
        this.Reset();
    }
    Reset() {
        this.ready = false;
        this.then = this.now = Date.now();
        this.delta = 0;
    }
    Update() {
        this.then = this.now;
        this.now = Date.now();
        if (this.ready) {
            this.delta = this.now - this.then;
        }
        else {
            this.delta += this.now - this.then;
        }
        if (this.delta > this.period) {
            this.ready = true;
        }
        else {
            this.ready = false;
        }
    }
    get Delta() {
        return this.delta;
    }
    get Ready() {
        return this.ready;
    }
}
class Time {
    Init(render, physics) {
        this.Render = new TimeKeep(render);
        this.Physics = new TimeKeep(physics);
    }
    Update() {
        this.Render.Update();
        this.Physics.Update();
    }
    Reset() {
        this.Render.Reset();
        this.Physics.Reset();
    }
}
exports.default = Time;

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
const Animation_1 = require("./Animation/Animation");
const GameObject_1 = require("./Logic/Object/GameObject");
const Input_1 = __importDefault(require("./Logic/Input/Input"));
const ParticleSystem_1 = require("./Logic/Particle System/ParticleSystem");
const Time_1 = __importDefault(require("./Logic/Utility/Time"));
const PhysicsEngine_1 = __importStar(require("./Physics/PhysicsEngine"));
const Render_1 = __importDefault(require("./Render/Render"));
const Renderer_1 = require("./Render/Renderer");
const Shaders_1 = require("./Render/Shaders");
class IMain {
}
exports.IMain = IMain;
class Main {
    constructor() {
        this.running = false;
        this.animationFrame = -1;
        this.input = new Input_1.default;
        this.time = new Time_1.default;
        this.render = new Render_1.default;
        this.physics = new PhysicsEngine_1.default;
    }
    get Height() {
        return this.height;
    }
    set Height(height) {
        this.height = Math.clamp(height, 0, Number.MAX_SAFE_INTEGER);
    }
    get Width() {
        return this.width;
    }
    set Width(width) {
        this.width = Math.clamp(width, 0, Number.MAX_SAFE_INTEGER);
    }
    get RenderUpdate() {
        return this.renderUpdate;
    }
    set RenderUpdate(renderUpdate) {
        this.renderUpdate = Math.clamp(renderUpdate, 0, Number.MAX_SAFE_INTEGER);
        this.time.Init(this.renderUpdate, this.physicsUpdate);
    }
    get PhysicsUpdate() {
        return this.physicsUpdate;
    }
    set PhysicsUpdate(physicsUpdate) {
        this.physicsUpdate = Math.clamp(physicsUpdate, 0, Number.MAX_SAFE_INTEGER);
        this.time.Init(this.physicsUpdate, this.physicsUpdate);
    }
    get GL() {
        return exports.GL;
    }
    Init({ canvas, render = 60, physics = 30, clear = [0, 0, 0, 1], height = 1080, width = 1920 }) {
        exports.GL = canvas.getContext('webgl');
        if (!exports.GL) {
            throw new Error('Webgl context could not be initialized.');
        }
        this.Height = canvas.height = height;
        this.Width = canvas.width = width;
        exports.GL.clearColor(clear[0], clear[1], clear[2], clear[3]);
        this.input.Init(canvas);
        this.time.Init(render, physics);
        Renderer_1.InitRender();
        Shaders_1.InitShaders();
    }
    Start() {
        if (this.animationFrame !== -1) {
            window.cancelAnimationFrame(this.animationFrame);
        }
        this.render.Reset();
        this.physics.Reset();
        this.GameLoop();
    }
    Stop() {
        if (this.animationFrame !== -1) {
            window.cancelAnimationFrame(this.animationFrame);
        }
    }
    Update() {
    }
    GameLoop() {
        this.animationFrame = window.requestAnimationFrame(this.GameLoop);
        this.time.Update();
        for (let gameObject of GameObject_1.GameObjects) {
            gameObject.Update(this.time.Render.Delta);
        }
        for (let animation of Animation_1.Animations) {
            animation.Update();
        }
        for (let particleSystem of ParticleSystem_1.ParticleSystems) {
            particleSystem.Update();
        }
        if (this.time.Physics.Ready) {
            PhysicsEngine_1.UpdatePhysics(this.time.Physics.Delta);
        }
        if (this.time.Render.Ready) {
            Renderer_1.UpdateRender(this.time.Render.Delta);
        }
        this.input.Reset();
    }
}
exports.default = Main;

},{"./Animation/Animation":1,"./Logic/Input/Input":10,"./Logic/Object/GameObject":29,"./Logic/Particle System/ParticleSystem":34,"./Logic/Utility/Time":37,"./Physics/PhysicsEngine":45,"./Render/Render":47,"./Render/Renderer":48,"./Render/Shaders":52}],39:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CircleCollider_1 = __importDefault(require("./Collision/CircleCollider"));
const CubeCollider_1 = __importDefault(require("./Collision/CubeCollider"));
const SphereCollider_1 = __importDefault(require("./Collision/SphereCollider"));
const SquareCollider_1 = __importDefault(require("./Collision/SquareCollider"));
function IsColission(first, second) {
    if (first instanceof CircleCollider_1.default) {
        if (second instanceof CircleCollider_1.default) {
            return CircleCircle(first, second);
        }
        if (second instanceof SquareCollider_1.default) {
            return CircleSquare(first, second);
        }
        if (second instanceof SphereCollider_1.default) {
            return CircleSphere(first, second);
        }
        if (second instanceof CubeCollider_1.default) {
            return CircleCube(first, second);
        }
    }
    if (first instanceof SquareCollider_1.default) {
        if (second instanceof CircleCollider_1.default) {
            return CircleSquare(second, first);
        }
        if (second instanceof SquareCollider_1.default) {
            return SquareSquare(first, second);
        }
        if (second instanceof SphereCollider_1.default) {
            return SquareSphere(first, second);
        }
        if (second instanceof CubeCollider_1.default) {
            return SquareCube(first, second);
        }
    }
    if (first instanceof SphereCollider_1.default) {
        if (second instanceof CircleCollider_1.default) {
            return CircleSphere(second, first);
        }
        if (second instanceof SquareCollider_1.default) {
            return SquareSphere(second, first);
        }
        if (second instanceof SphereCollider_1.default) {
            return SphereSphere(first, second);
        }
        if (second instanceof CubeCollider_1.default) {
            return SphereCube(first, second);
        }
    }
    if (first instanceof CubeCollider_1.default) {
        if (second instanceof CircleCollider_1.default) {
            return CircleCube(second, first);
        }
        if (second instanceof SquareCollider_1.default) {
            return SquareCube(second, first);
        }
        if (second instanceof SphereCollider_1.default) {
            return SphereCube(second, first);
        }
        if (second instanceof CubeCollider_1.default) {
            return CubeCube(first, second);
        }
    }
    return false;
}
exports.IsColission = IsColission;
function CircleCircle(first, second) {
    return first.Position.Clone().Diff(second.Position).Length < first.Radius + second.Radius;
}
exports.CircleCircle = CircleCircle;
function CircleSquare(first, second) {
    return false;
}
exports.CircleSquare = CircleSquare;
function CircleSphere(first, second) {
    return false;
}
exports.CircleSphere = CircleSphere;
function CircleCube(first, second) {
    return false;
}
exports.CircleCube = CircleCube;
function SquareSquare(first, second) {
    return false;
}
exports.SquareSquare = SquareSquare;
function SquareSphere(first, second) {
    return false;
}
exports.SquareSphere = SquareSphere;
function SquareCube(first, second) {
    return false;
}
exports.SquareCube = SquareCube;
function SphereSphere(first, second) {
    return first.Position.Clone().Diff(second.Position).Length < first.Radius + second.Radius;
}
exports.SphereSphere = SphereSphere;
function SphereCube(first, second) {
    return false;
}
exports.SphereCube = SphereCube;
function CubeCube(first, second) {
    return false;
}
exports.CubeCube = CubeCube;

},{"./Collision/CircleCollider":40,"./Collision/CubeCollider":42,"./Collision/SphereCollider":43,"./Collision/SquareCollider":44}],40:[function(require,module,exports){
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
const Vector2_1 = __importDefault(require("../../Logic/Maths/Vector2"));
const Collider_1 = __importStar(require("./Collider"));
class ICircleCollider extends Collider_1.ICollider {
}
exports.ICircleCollider = ICircleCollider;
class CircleCollider extends Collider_1.default {
    constructor({ name = 'Sphere Collider', position = [0, 0], scale = [1, 1], radius = 1.0 } = new ICircleCollider) {
        super({ name });
        this.Radius = radius;
        this.Position = new Vector2_1.default(position);
        this.Scale = new Vector2_1.default(scale);
    }
    Clone() {
        return new CircleCollider({
            name: this.Name + ' Clone',
            radius: this.Radius,
            position: this.Position,
            scale: this.Scale
        });
    }
}
exports.default = CircleCollider;

},{"../../Logic/Maths/Vector2":25,"./Collider":41}],41:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../../Logic/Object/Item"));
exports.Colliders = [];
class ICollider {
}
exports.ICollider = ICollider;
class Collider extends Item_1.default {
    constructor({ name = 'Collider', onCollisionEnter = function (other) { }, onCollision = function (other) { }, onCollisionExit = function (other) { } } = new ICollider) {
        super(name);
        this.OnCollisionEnter = onCollisionEnter;
        this.OnCollision = onCollision;
        this.OnCollisionExit = onCollisionExit;
        exports.Colliders.push(this);
    }
    Clone() { return null; }
}
exports.default = Collider;

},{"../../Logic/Object/Item":30}],42:[function(require,module,exports){
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
const Collider_1 = __importStar(require("./Collider"));
class ICubeCollider extends Collider_1.ICollider {
}
exports.ICubeCollider = ICubeCollider;
class CubeCollider extends Collider_1.default {
    constructor({ name = 'BoxCollider', position = [0, 0, 0], height = 1.0, width = 1.0, breadth = 1.0 } = new ICubeCollider) {
        super({ name });
        this.Position = new Vector3_1.default(position);
        this.Height = height;
        this.Width = width;
        this.Breadth = breadth;
    }
    Clone() {
        return new CubeCollider({
            name: this.Name + ' Clone',
            position: this.Position,
            height: this.Height,
            width: this.Width,
            breadth: this.Breadth
        });
    }
}
exports.default = CubeCollider;

},{"../../Logic/Maths/Vector3":26,"./Collider":41}],43:[function(require,module,exports){
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
const Collider_1 = __importStar(require("./Collider"));
class ISphereCollider extends Collider_1.ICollider {
}
exports.ISphereCollider = ISphereCollider;
class SphereCollider extends Collider_1.default {
    get Position() {
        return this.Parent.Transform.Position.Clone().Sum(this.Offset);
    }
    constructor({ name = 'Sphere Collider', offset = [0, 0, 0], scale = [1, 1, 1], radius = 1.0 } = new ISphereCollider) {
        super({ name });
        this.Radius = radius;
        this.Offset = new Vector3_1.default(offset);
        this.Scale = new Vector3_1.default(scale);
    }
    Clone() {
        return new SphereCollider({
            name: this.Name + ' Clone',
            radius: this.Radius,
            offset: this.Offset,
            scale: this.Scale
        });
    }
}
exports.default = SphereCollider;

},{"../../Logic/Maths/Vector3":26,"./Collider":41}],44:[function(require,module,exports){
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
const Vector2_1 = __importDefault(require("../../Logic/Maths/Vector2"));
const Collider_1 = __importStar(require("./Collider"));
class ISquareCollider extends Collider_1.ICollider {
}
exports.ISquareCollider = ISquareCollider;
class SquareCollider extends Collider_1.default {
    constructor({ name = 'BoxCollider', position = [0, 0, 0], height = 1.0, width = 1.0 } = new ISquareCollider) {
        super({ name });
        this.Position = new Vector2_1.default(position);
        this.Height = height;
        this.Width = width;
    }
    Clone() {
        return new SquareCollider({
            name: this.Name + ' Clone',
            position: this.Position,
            height: this.Height,
            width: this.Width
        });
    }
}
exports.default = SquareCollider;

},{"../../Logic/Maths/Vector2":25,"./Collider":41}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collider_1 = require("./Collision/Collider");
const CollisionDetection_1 = require("./CollisionDetection");
class PhysicsEngine {
    Init() {
        throw new Error("Method not implemented.");
    }
    Update() {
        throw new Error("Method not implemented.");
    }
    Reset() {
        throw new Error("Method not implemented.");
    }
}
exports.default = PhysicsEngine;
exports.GRAVITY = 9.81;
exports.Force = (mass) => exports.GRAVITY * mass;
function UpdatePhysics(delta) {
    let colliders = [...Collider_1.Colliders];
    colliders.forEach((curr, _, arr) => {
        let others = arr.filter(c => c !== curr);
        others.forEach(other => CollisionDetection_1.IsColission(curr, other));
    });
}
exports.UpdatePhysics = UpdatePhysics;

},{"./Collision/Collider":41,"./CollisionDetection":39}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../Logic/Maths/Math");
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
        if (r !== undefined) {
            if (typeof r === 'number') {
                this.Set(r, g, b, a);
            }
            else if (typeof r === 'string') {
                this.Set(r, g);
            }
            else {
                this.Set([...r]);
            }
        }
    }
    Set(r, g, b, a) {
        [r, g, b, a] = Colour4.Deconstruct(r, g, b, a);
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;
        return this;
    }
    static Deconstruct(r, g, b, a) {
        if (typeof r === 'string') {
            let alpha = Number.isSafeInteger(g) ? g : 1;
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
                [r, g, b] = [0, 0, 0];
            }
            a = alpha;
        }
        else if (r instanceof Float32Array || r instanceof Array) {
            [r = 0, g = 0, b = 0, a = 0] = r;
        }
        return [r, g, b, a];
    }
}
exports.default = Colour4;

},{"../../Logic/Maths/Math":21}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RenderEngine {
    Init() {
        throw new Error("Method not implemented.");
    }
    Update() {
        throw new Error("Method not implemented.");
    }
    Reset() {
        throw new Error("Method not implemented.");
    }
}
exports.default = RenderEngine;

},{}],48:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = require("../Main");
const Camera_1 = __importDefault(require("../Logic/Camera/Camera"));
const GameObject_1 = require("../Logic/Object/GameObject");
const DirectionalLight_1 = require("../Logic/Light/DirectionalLight");
const PointLight_1 = require("../Logic/Light/PointLight");
const Matrix3_1 = __importDefault(require("../Logic/Maths/Matrix3"));
const Matrix4_1 = __importDefault(require("../Logic/Maths/Matrix4"));
const Shader_1 = require("./Shader/Shader");
const Shaders_1 = require("./Shaders");
let ObjectList = new Map;
function InitRender() {
    Main_1.GL.enable(Main_1.GL.DEPTH_TEST);
    Main_1.GL.disable(Main_1.GL.BLEND);
    Main_1.GL.blendFunc(Main_1.GL.SRC_ALPHA, Main_1.GL.ONE);
    ClearBuffer();
    GameObject_1.GameObjects.forEach(object => CalculateObjectMatrices(object));
    Shader_1.Shaders.filter(shader => shader.Filter).forEach(shader => {
        RunProgram(shader, null);
    });
}
exports.InitRender = InitRender;
function UpdateRender(delta) {
    ClearBuffer();
    Shader_1.Shaders.filter(shader => !shader.Filter).forEach(shader => ClearBuffer(shader));
    GameObject_1.GameObjects.forEach(object => CalculateObjectMatrices(object));
    MainPass();
}
exports.UpdateRender = UpdateRender;
function ClearBuffer(shader) {
    let width = shader ? shader.Width : Main_1.GL.drawingBufferWidth;
    let height = shader ? shader.Height : Main_1.GL.drawingBufferHeight;
    let buffer = shader ? shader.FrameBuffer : null;
    let clear = shader ? shader.Clear : [0.0, 0.0, 0.0, 0.0];
    Main_1.GL.bindFramebuffer(Main_1.GL.FRAMEBUFFER, buffer);
    Main_1.GL.viewport(0, 0, width, height);
    Main_1.GL.clearColor(clear[0], clear[1], clear[2], clear[3]);
    Main_1.GL.clear(Main_1.GL.COLOR_BUFFER_BIT | Main_1.GL.DEPTH_BUFFER_BIT);
}
exports.ClearBuffer = ClearBuffer;
function RunProgram(shader, object) {
    if (!shader)
        return;
    Main_1.GL.useProgram(shader.Program);
    ClearBuffer(shader);
    BindGlobalUniforms(shader);
    if (!shader.Attribute.Exists || !object) {
        Main_1.GL.bindFramebuffer(Main_1.GL.FRAMEBUFFER, null);
        Main_1.GL.drawElements(Main_1.GL.TRIANGLES, 0, Main_1.GL.UNSIGNED_BYTE, 0);
    }
    else {
        if (object.material.Alpha !== 1.0) {
            Main_1.GL.enable(Main_1.GL.BLEND);
            Main_1.GL.disable(Main_1.GL.DEPTH_TEST);
        }
        BindAttributes(shader, object.mesh);
        BindObjectUniforms(shader, object.material, object.modelView, object.normal);
        Main_1.GL.uniform1i(shader.BaseUniforms.Global.ObjectID, object.id);
        Main_1.GL.bindFramebuffer(Main_1.GL.FRAMEBUFFER, null);
        Main_1.GL.drawElements(Main_1.GL.TRIANGLES, object.mesh.VertexCount, Main_1.GL.UNSIGNED_BYTE, 0);
        if (object.material.Alpha !== 1.0) {
            Main_1.GL.enable(Main_1.GL.DEPTH_TEST);
            Main_1.GL.disable(Main_1.GL.BLEND);
        }
    }
    Main_1.GL.useProgram(null);
}
exports.RunProgram = RunProgram;
function BindAttributes(shader, mesh) {
    const position = shader.Attribute.Position;
    const normal = shader.Attribute.Normal;
    const uv = shader.Attribute.UV;
    const colour = shader.Attribute.Colour;
    if (position !== -1) {
        if (mesh.PositionBuffer) {
            Main_1.GL.enableVertexAttribArray(position);
            Main_1.GL.bindBuffer(Main_1.GL.ARRAY_BUFFER, mesh.PositionBuffer);
            Main_1.GL.vertexAttribPointer(position, 3, Main_1.GL.FLOAT, false, 0, 0);
        }
        else {
            Main_1.GL.disableVertexAttribArray(position);
        }
    }
    if (normal !== -1) {
        if (mesh.NormalBuffer) {
            Main_1.GL.enableVertexAttribArray(normal);
            Main_1.GL.bindBuffer(Main_1.GL.ARRAY_BUFFER, mesh.NormalBuffer);
            Main_1.GL.vertexAttribPointer(normal, 3, Main_1.GL.FLOAT, false, 0, 0);
        }
        else {
            Main_1.GL.disableVertexAttribArray(normal);
        }
    }
    if (uv !== -1) {
        if (mesh.UVBuffer) {
            Main_1.GL.enableVertexAttribArray(uv);
            Main_1.GL.bindBuffer(Main_1.GL.ARRAY_BUFFER, mesh.UVBuffer);
            Main_1.GL.vertexAttribPointer(uv, 2, Main_1.GL.FLOAT, false, 0, 0);
        }
        else {
            Main_1.GL.disableVertexAttribArray(uv);
        }
    }
    if (colour !== -1) {
        if (mesh.ColourBuffer) {
            Main_1.GL.enableVertexAttribArray(colour);
            Main_1.GL.bindBuffer(Main_1.GL.ARRAY_BUFFER, mesh.ColourBuffer);
            Main_1.GL.vertexAttribPointer(colour, 4, Main_1.GL.FLOAT, false, 0, 0);
        }
        else {
            Main_1.GL.disableVertexAttribArray(colour);
        }
    }
    Main_1.GL.bindBuffer(Main_1.GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);
}
exports.BindAttributes = BindAttributes;
function BindGlobalUniforms(shader) {
    let directional_count = 0;
    for (let light of DirectionalLight_1.DirectionalLights) {
        Main_1.GL.uniform4fv(shader.BaseUniforms.DirectionalLights[directional_count].Colour, light.Colour);
        Main_1.GL.uniform1f(shader.BaseUniforms.DirectionalLights[directional_count].Intensity, light.Intensity);
        Main_1.GL.uniform3fv(shader.BaseUniforms.DirectionalLights[directional_count].Direction, light.Direction);
        ++directional_count;
    }
    let point_count = 0;
    for (let light of PointLight_1.PointLights) {
        Main_1.GL.uniform4fv(shader.BaseUniforms.PointLights[point_count].Colour, light.Colour);
        Main_1.GL.uniform1f(shader.BaseUniforms.PointLights[point_count].Intensity, light.Intensity);
        Main_1.GL.uniform3fv(shader.BaseUniforms.PointLights[point_count].Position, light.Position);
        Main_1.GL.uniform1f(shader.BaseUniforms.PointLights[point_count].Radius, light.Radius);
        Main_1.GL.uniform1f(shader.BaseUniforms.PointLights[point_count].Angle, light.Angle);
        ++point_count;
    }
    Main_1.GL.uniform1i(shader.BaseUniforms.DirectionalLightCount, directional_count);
    Main_1.GL.uniform1i(shader.BaseUniforms.PointLightCount, point_count);
    Main_1.GL.uniformMatrix4fv(shader.BaseUniforms.Matrix.Projection, false, []);
    Main_1.GL.uniformMatrix4fv(shader.BaseUniforms.Matrix.View, false, []);
    Main_1.GL.uniform1i(shader.BaseUniforms.Global.Time, Date.now());
    Main_1.GL.uniform2f(shader.BaseUniforms.Global.Resolution, shader.Width, shader.Height);
    Main_1.GL.uniform1f(shader.BaseUniforms.Global.NearClip, Camera_1.default.Main.NearClipping);
    Main_1.GL.uniform1f(shader.BaseUniforms.Global.FarClip, Camera_1.default.Main.FarClipping);
    Main_1.GL.uniform1i(shader.BaseUniforms.Global.ObjectCount, GameObject_1.GameObjects.length);
}
exports.BindGlobalUniforms = BindGlobalUniforms;
function BindObjectUniforms(shader, material, mv, n) {
    Main_1.GL.uniform4fv(shader.BaseUniforms.Material.AmbientColour, material.Ambient);
    Main_1.GL.uniform4fv(shader.BaseUniforms.Material.DiffuseColour, material.Diffuse);
    Main_1.GL.uniform4fv(shader.BaseUniforms.Material.SpecularColour, material.Specular);
    Main_1.GL.uniform1f(shader.BaseUniforms.Material.Shininess, material.Shininess);
    Main_1.GL.uniform1f(shader.BaseUniforms.Material.Alpha, material.Alpha);
    if (material.ImageMap) {
        Main_1.GL.activeTexture(Main_1.GL.TEXTURE0);
        Main_1.GL.bindTexture(Main_1.GL.TEXTURE_2D, material.ImageMap);
        Main_1.GL.uniform1i(shader.BaseUniforms.Material.ImageSampler, 0);
    }
    else {
        Main_1.GL.activeTexture(Main_1.GL.TEXTURE0);
        Main_1.GL.bindTexture(Main_1.GL.TEXTURE_2D, null);
    }
    if (material.BumpMap) {
        Main_1.GL.activeTexture(Main_1.GL.TEXTURE1);
        Main_1.GL.bindTexture(Main_1.GL.TEXTURE_2D, material.BumpMap);
        Main_1.GL.uniform1i(shader.BaseUniforms.Material.BumpSampler, 0);
    }
    else {
        Main_1.GL.activeTexture(Main_1.GL.TEXTURE1);
        Main_1.GL.bindTexture(Main_1.GL.TEXTURE_2D, null);
    }
    if (material.SpecularMap) {
        Main_1.GL.activeTexture(Main_1.GL.TEXTURE2);
        Main_1.GL.bindTexture(Main_1.GL.TEXTURE_2D, material.SpecularMap);
        Main_1.GL.uniform1i(shader.BaseUniforms.Material.SpecularSampler, 0);
    }
    else {
        Main_1.GL.activeTexture(Main_1.GL.TEXTURE2);
        Main_1.GL.bindTexture(Main_1.GL.TEXTURE_2D, null);
    }
    Main_1.GL.uniformMatrix4fv(shader.BaseUniforms.Matrix.Model, false, mv);
    Main_1.GL.uniformMatrix3fv(shader.BaseUniforms.Matrix.Normal, false, n);
}
exports.BindObjectUniforms = BindObjectUniforms;
function CalculateObjectMatrices(gameObject) {
    let mv = Matrix4_1.default.ZERO;
    ObjectList.set(gameObject.ID, {
        id: gameObject.ObjectID,
        mesh: gameObject.Mesh,
        material: gameObject.Material,
        modelView: mv,
        normal: new Matrix3_1.default(mv.Clone().Inverse())
    });
    gameObject.Children.forEach(child => CalculateObjectMatrices(child));
}
exports.CalculateObjectMatrices = CalculateObjectMatrices;
function ShadowPass() {
    for (var light of PointLight_1.PointLights) {
        ObjectList.forEach(object => RunProgram(Shaders_1.DepthShader, object));
    }
}
exports.ShadowPass = ShadowPass;
function MainPass() {
    ObjectList.forEach(object => RunProgram(object.material.Shader, object));
}
exports.MainPass = MainPass;
function PostprocessingPass() {
}
exports.PostprocessingPass = PostprocessingPass;

},{"../Logic/Camera/Camera":5,"../Logic/Light/DirectionalLight":16,"../Logic/Light/PointLight":18,"../Logic/Maths/Matrix3":23,"../Logic/Maths/Matrix4":24,"../Logic/Object/GameObject":29,"../Main":38,"./Shader/Shader":51,"./Shaders":52}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = require("../../../Main");
class ShaderAttribute {
    constructor(program) {
        this.Position = Main_1.GL.getAttribLocation(program, 'A_Position');
        this.Colour = Main_1.GL.getAttribLocation(program, 'A_Colour');
        this.UV = Main_1.GL.getAttribLocation(program, 'A_UV');
        this.Normal = Main_1.GL.getAttribLocation(program, 'A_Normal');
        this.Exists = (this.Position + this.Colour + this.UV + this.Normal) > -4;
    }
}
exports.default = ShaderAttribute;

},{"../../../Main":38}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = require("../../../Main");
class MatrixUniform {
    constructor(mv, p, n, c) {
        this.Model = mv;
        this.Projection = p;
        this.Normal = n;
        this.View = c;
    }
}
exports.MatrixUniform = MatrixUniform;
class DirectionalLightUniform {
    constructor(c, i, d) {
        this.Colour = c;
        this.Intensity = i;
        this.Direction = d;
    }
}
exports.DirectionalLightUniform = DirectionalLightUniform;
class PointLightUniform {
    constructor(c, i, p, r, a) {
        this.Colour = c;
        this.Intensity = i;
        this.Position = p;
        this.Radius = r;
        this.Angle = a;
    }
}
exports.PointLightUniform = PointLightUniform;
class MaterialUniform {
    constructor(ac, dc, sc, s, a, is, bs, ss) {
        this.AmbientColour = ac;
        this.DiffuseColour = dc;
        this.SpecularColour = sc;
        this.Shininess = s;
        this.Alpha = a;
        this.ImageSampler = is;
        this.BumpSampler = bs;
        this.SpecularSampler = ss;
    }
}
exports.MaterialUniform = MaterialUniform;
class GlobalUniform {
    constructor(t, r, n, f, oid, oc) {
        this.Time = t;
        this.Resolution = r;
        this.NearClip = n;
        this.FarClip = f;
        this.ObjectID = oid;
        this.ObjectCount = oc;
    }
}
exports.GlobalUniform = GlobalUniform;
class ShaderBaseUniform {
    constructor(program) {
        this.DIRECTIONAL_COUNT = 3;
        this.POINT_COUNT = 8;
        this.Matrix = new MatrixUniform(Main_1.GL.getUniformLocation(program, 'U_Matrix.Model'), Main_1.GL.getUniformLocation(program, 'U_Matrix.Projection'), Main_1.GL.getUniformLocation(program, 'U_Matrix.Normal'), Main_1.GL.getUniformLocation(program, 'U_Matrix.View'));
        this.DirectionalLights = [];
        for (let i = 0; i < this.DIRECTIONAL_COUNT; ++i) {
            this.DirectionalLights.push(new DirectionalLightUniform(Main_1.GL.getUniformLocation(program, `U_Directional[${i}].Colour`), Main_1.GL.getUniformLocation(program, `U_Directional[${i}].Intensity`), Main_1.GL.getUniformLocation(program, `U_Directional[${i}].Direction`)));
        }
        this.DirectionalLightCount = Main_1.GL.getUniformLocation(program, `U_Directional_Count`);
        this.PointLights = [];
        for (let i = 0; i < this.POINT_COUNT; ++i) {
            this.PointLights.push(new PointLightUniform(Main_1.GL.getUniformLocation(program, `U_Point[${i}].Colour`), Main_1.GL.getUniformLocation(program, `U_Point[${i}].Intensity`), Main_1.GL.getUniformLocation(program, `U_Point[${i}].Position`), Main_1.GL.getUniformLocation(program, `U_Point[${i}].Radius`), Main_1.GL.getUniformLocation(program, `U_Point[${i}].Angle`)));
        }
        this.PointLightCount = Main_1.GL.getUniformLocation(program, `U_Point_Count`);
        this.Material = new MaterialUniform(Main_1.GL.getUniformLocation(program, 'U_Material.Ambient'), Main_1.GL.getUniformLocation(program, 'U_Material.Diffuse'), Main_1.GL.getUniformLocation(program, 'U_Material.Specular'), Main_1.GL.getUniformLocation(program, 'U_Material.Shininess'), Main_1.GL.getUniformLocation(program, 'U_Material.Alpha'), Main_1.GL.getUniformLocation(program, 'U_Material.ImageMap'), Main_1.GL.getUniformLocation(program, 'U_Material.BumpMap'), Main_1.GL.getUniformLocation(program, 'U_Material.SpecularMap'));
        this.Global = new GlobalUniform(Main_1.GL.getUniformLocation(program, 'U_Global.Time'), Main_1.GL.getUniformLocation(program, 'U_Global.Resolution'), Main_1.GL.getUniformLocation(program, 'U_Global.NearClip'), Main_1.GL.getUniformLocation(program, 'U_Global.FarClip'), Main_1.GL.getUniformLocation(program, 'U_Global.ObjectID'), Main_1.GL.getUniformLocation(program, 'U_Global.ObjectCount'));
    }
}
exports.default = ShaderBaseUniform;

},{"../../../Main":38}],51:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = require("../../Main");
const Item_1 = __importDefault(require("../../Logic/Object/Item"));
const Colour4_1 = __importDefault(require("../Colour/Colour4"));
const ShaderAttribute_1 = __importDefault(require("./Definition/ShaderAttribute"));
const ShaderBaseUniform_1 = __importDefault(require("./Definition/ShaderBaseUniform"));
exports.Shaders = [];
class IShader {
}
exports.IShader = IShader;
class Shader extends Item_1.default {
    get VertexProgram() {
        return this.vertexProgram;
    }
    set VertexProgram(vertexProgram) {
        this.vertexProgram = vertexProgram;
        this.Build();
    }
    get FragmentProgram() {
        return this.fragmentProgram;
    }
    set FragmentProgram(fragmentProgram) {
        this.fragmentProgram = fragmentProgram;
        this.Build();
    }
    constructor({ name = 'Shader', height = 1080, width = 1920, filter = true, clear = [0, 0, 0, 1], vertex, fragment } = new IShader) {
        super(name);
        this.Height = height;
        this.Width = width;
        this.Filter = filter;
        this.Clear = new Colour4_1.default(clear);
        this.vertexProgram = vertex;
        this.fragmentProgram = fragment;
        this.Build();
        exports.Shaders.push(this);
    }
    Build() {
        this.ClearShader();
        this.BuildShaders();
        this.CreateBuffers();
        this.Attribute = new ShaderAttribute_1.default(this.Program);
        this.BaseUniforms = new ShaderBaseUniform_1.default(this.Program);
        this.UserUniforms = new Map();
        this.ParseProperties();
    }
    ClearShader() {
        if (this.Program) {
            Main_1.GL.deleteProgram(this.Program);
        }
        if (this.Texture) {
            Main_1.GL.deleteTexture(this.Texture);
        }
        if (this.VertexShader) {
            Main_1.GL.deleteShader(this.VertexShader);
        }
        if (this.FragmentShader) {
            Main_1.GL.deleteShader(this.FragmentShader);
        }
        if (this.FrameBuffer) {
            Main_1.GL.deleteFramebuffer(this.FrameBuffer);
        }
        if (this.RenderBuffer) {
            Main_1.GL.deleteRenderbuffer(this.RenderBuffer);
        }
        this.Program = Main_1.GL.createProgram();
        this.Texture = Main_1.GL.createTexture();
        this.FrameBuffer = Main_1.GL.createFramebuffer();
        this.RenderBuffer = Main_1.GL.createRenderbuffer();
    }
    BuildShaders() {
        let errorLog = [];
        this.VertexShader = Main_1.GL.createShader(Main_1.GL.VERTEX_SHADER);
        Main_1.GL.shaderSource(this.VertexShader, this.VertexProgram);
        Main_1.GL.compileShader(this.VertexShader);
        if (!Main_1.GL.getShaderParameter(this.VertexShader, Main_1.GL.COMPILE_STATUS)) {
            errorLog.push('Vertex Shader: ' + Main_1.GL.getShaderInfoLog(this.VertexShader));
        }
        this.FragmentShader = Main_1.GL.createShader(Main_1.GL.FRAGMENT_SHADER);
        Main_1.GL.shaderSource(this.FragmentShader, this.FragmentProgram);
        Main_1.GL.compileShader(this.FragmentShader);
        if (!Main_1.GL.getShaderParameter(this.FragmentShader, Main_1.GL.COMPILE_STATUS)) {
            errorLog.push('Fragment Shader: ' + Main_1.GL.getShaderInfoLog(this.FragmentShader));
        }
        Main_1.GL.attachShader(this.Program, this.VertexShader);
        Main_1.GL.attachShader(this.Program, this.FragmentShader);
        Main_1.GL.linkProgram(this.Program);
        if (!Main_1.GL.getProgramParameter(this.Program, Main_1.GL.LINK_STATUS)) {
            errorLog.push(Main_1.GL.getProgramInfoLog(this.Program));
        }
        if (errorLog.length > 0) {
            throw errorLog;
        }
    }
    ParseProperties() {
        const regex = /uniform\s+(?<type>bool|int|float|([biu]?vec|mat)[2-4])\s+(?<name>\w+);/;
        const regexGroup = /uniform\s+(bool|int|float|([biu]?vec|mat)[2-4])\s+(\w+);/g;
        let text = this.VertexProgram + "\n" + this.FragmentProgram;
        let matches = text.match(regexGroup) || [];
        for (const match of matches) {
            let groups = match.match(regex);
            let type = groups.groups.type;
            let name = groups.groups.name;
            let index = Main_1.GL.getUniformLocation(this.Program, name);
            if (!this.UserUniforms.has(name)) {
                this.UserUniforms.set(name, { index, type });
            }
        }
    }
    CreateBuffers() {
        let data = [];
        for (let i = 0; i < this.Height * this.Width; ++i) {
            data.push(255, 255, 255, 255);
        }
        let arr = new Uint8Array(data);
        Main_1.GL.bindFramebuffer(Main_1.GL.FRAMEBUFFER, this.FrameBuffer);
        Main_1.GL.bindRenderbuffer(Main_1.GL.RENDERBUFFER, this.RenderBuffer);
        Main_1.GL.renderbufferStorage(Main_1.GL.RENDERBUFFER, Main_1.GL.DEPTH_COMPONENT16, this.Width, this.Height);
        Main_1.GL.bindTexture(Main_1.GL.TEXTURE_2D, this.Texture);
        Main_1.GL.texParameteri(Main_1.GL.TEXTURE_2D, Main_1.GL.TEXTURE_MAG_FILTER, Main_1.GL.LINEAR);
        Main_1.GL.texParameteri(Main_1.GL.TEXTURE_2D, Main_1.GL.TEXTURE_MIN_FILTER, Main_1.GL.LINEAR);
        Main_1.GL.texParameteri(Main_1.GL.TEXTURE_2D, Main_1.GL.TEXTURE_WRAP_S, Main_1.GL.CLAMP_TO_EDGE);
        Main_1.GL.texParameteri(Main_1.GL.TEXTURE_2D, Main_1.GL.TEXTURE_WRAP_T, Main_1.GL.CLAMP_TO_EDGE);
        Main_1.GL.texImage2D(Main_1.GL.TEXTURE_2D, 0, Main_1.GL.RGBA, this.Width, this.Height, 0, Main_1.GL.RGBA, Main_1.GL.UNSIGNED_BYTE, arr);
        Main_1.GL.framebufferTexture2D(Main_1.GL.FRAMEBUFFER, Main_1.GL.COLOR_ATTACHMENT0, Main_1.GL.TEXTURE_2D, this.Texture, 0);
        Main_1.GL.framebufferRenderbuffer(Main_1.GL.FRAMEBUFFER, Main_1.GL.DEPTH_ATTACHMENT, Main_1.GL.RENDERBUFFER, this.RenderBuffer);
        Main_1.GL.bindTexture(Main_1.GL.TEXTURE_2D, null);
        Main_1.GL.bindRenderbuffer(Main_1.GL.RENDERBUFFER, null);
        Main_1.GL.bindFramebuffer(Main_1.GL.FRAMEBUFFER, null);
    }
}
exports.default = Shader;

},{"../../Logic/Object/Item":30,"../../Main":38,"../Colour/Colour4":46,"./Definition/ShaderAttribute":49,"./Definition/ShaderBaseUniform":50}],52:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Shader_1 = __importDefault(require("./Shader/Shader"));
function InitShaders() {
    exports.DepthShader = new Shader_1.default({
        clear: [0, 0, 0, 0],
        filter: false,
        vertex: `#ifdef GL_VERTEX_PRECISION_HIGH
        precision highp float;
    #else
        precision mediump float;
    #endif
        precision mediump int;

    attribute vec3 A_Position;

    struct Matrix
    {
        mat4 ModelView;
        mat4 Projection;
        mat4 Camera;
    };
    uniform Matrix U_Matrix;

    varying vec4 V_Position;

    void main(void)
    {
        V_Position = U_Matrix.Camera * U_Matrix.ModelView * vec4(A_Position, 1.0);
        
        gl_Position = U_Matrix.Projection * V_Position;
    }`,
        fragment: `#ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
    #else
        precision mediump float;
    #endif
        precision mediump int;

    struct Global
    {
        int U_ObjectID;
    };
    uniform Global U_Global;

    varying vec4 V_Position;

    void main(void)
    { 
        gl_FragColor = vec4(float(U_Global.U_ObjectID), 0.0, 0.0, V_Position.z);
    }`,
        width: 1024,
        height: 1024
    });
}
exports.InitShaders = InitShaders;

},{"./Shader/Shader":51}],53:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = __importDefault(require("./Main"));
const index_1 = require("./Animation/index");
const index_2 = require("./Logic/Camera/index");
const index_3 = require("./Logic/Converter/index");
const index_4 = require("./Logic/Input/index");
const index_5 = require("./Logic/Light/index");
const index_6 = require("./Logic/Maths/index");
class FWGE {
}
window.FWGE = new FWGE;
window.FWGE.Main = Main_1.default;
window.FWGE.Animation = index_1.Animation;
window.FWGE.AnimationFrame = index_1.AnimationFrame;
window.FWGE.Camera = index_2.Camera;
window.FWGE.OBJConverter = index_3.OBJConverter;
window.FWGE.Input = index_4.Input;
window.FWGE.ButtonState = index_4.ButtonState;
window.FWGE.KeyboardState = index_4.KeyboardState;
window.FWGE.WheelState = index_4.WheelState;
window.FWGE.AmbientLight = index_5.AmbientLight;
window.FWGE.DirectionalLight = index_5.DirectionalLight;
window.FWGE.PointLight = index_5.PointLight;
window.FWGE.ShadowQuality = index_5.ShadowQuality;
window.FWGE.Equations = index_6.Equations;
window.FWGE.Matrix2 = index_6.Matrix2;
window.FWGE.Matrix3 = index_6.Matrix3;
window.FWGE.Matrix4 = index_6.Matrix4;
window.FWGE.Vector2 = index_6.Vector2;
window.FWGE.Vector3 = index_6.Vector3;
window.FWGE.Vector4 = index_6.Vector4;

},{"./Animation/index":3,"./Logic/Camera/index":7,"./Logic/Converter/index":9,"./Logic/Input/index":14,"./Logic/Light/index":19,"./Logic/Maths/index":28,"./Main":38}]},{},[53]);
