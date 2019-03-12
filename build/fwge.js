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
define("FWGE", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let GL;
    class IFWGE {
        constructor() {
            this.renderUpdate = 60;
            this.physcisUpdate = 30;
            this.clear = [0, 0, 0, 1];
        }
    }
    exports.IFWGE = IFWGE;
    class FWGE {
        static get GL() {
            return GL;
        }
        static Init({ canvas, renderUpdate, physcisUpdate, clear }) {
            if (!canvas) {
                throw new Error('Field {canvas: HTMLCanvasElement} is required');
            }
            GL = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!GL) {
                throw new Error('Webgl context could not be initialized.');
            }
            GL.clearColor(clear[0], clear[1], clear[2], clear[3]);
        }
        Start() {
            // GameEngine.Start();
        }
        Pause() {
            // GameEngine.Pause();
        }
        Stop() {
            // GameEngine.Stop();
        }
    }
    exports.default = FWGE;
});
define("Item", ["require", "exports"], function (require, exports) {
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
});
define("Interfaces/Destroyable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Utility/List", ["require", "exports"], function (require, exports) {
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
});
define("Interfaces/Cloneable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Maths/Maths", ["require", "exports"], function (require, exports) {
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
});
define("Maths/Vector2", ["require", "exports", "Maths/Maths"], function (require, exports, Maths_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Maths_1 = __importDefault(Maths_1);
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
});
define("Maths/Vector3", ["require", "exports", "Maths/Maths"], function (require, exports, Maths_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Maths_2 = __importDefault(Maths_2);
    class Vector3 extends Float32Array {
        constructor(x, y, z) {
            super(3);
            this.Set(x, y, z);
        }
        get X() {
            return this[0];
        }
        set X(x) {
            this[0] = Maths_2.default.CleanFloat(x);
        }
        get Y() {
            return this[1];
        }
        set Y(y) {
            this[1] = Maths_2.default.CleanFloat(y);
        }
        get Z() {
            return this[2];
        }
        set Z(z) {
            this[2] = Maths_2.default.CleanFloat(z);
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
            return Maths_2.default.CleanFloat(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)));
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
            return Maths_2.default.CleanFloat(vector.X * x + vector.Y * y + vector.Z * z);
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
});
define("Maths/Vector4", ["require", "exports", "Utility/List", "Maths/Maths", "Maths/Vector2", "Maths/Vector3"], function (require, exports, List_1, Maths_3, Vector2_1, Vector3_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    List_1 = __importDefault(List_1);
    Maths_3 = __importDefault(Maths_3);
    Vector2_1 = __importDefault(Vector2_1);
    Vector3_1 = __importDefault(Vector3_1);
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
            this[0] = Maths_3.default.CleanFloat(w);
        }
        get X() {
            return this[1];
        }
        set X(x) {
            this[1] = Maths_3.default.CleanFloat(x);
        }
        get Y() {
            return this[2];
        }
        set Y(y) {
            this[2] = Maths_3.default.CleanFloat(y);
        }
        get Z() {
            return this[3];
        }
        set Z(z) {
            this[3] = Maths_3.default.CleanFloat(z);
        }
        get Length() {
            return Vector4.Length(this);
        }
        static Length(w, x, y, z) {
            if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array || w instanceof List_1.default) {
                [w, x, y, z] = w;
            }
            return Maths_3.default.CleanFloat(Math.sqrt(Math.pow(w, 2) + Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)));
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
            vector.W = Maths_3.default.CleanFloat(w);
            vector.X = Maths_3.default.CleanFloat(x);
            vector.Y = Maths_3.default.CleanFloat(y);
            vector.Z = Maths_3.default.CleanFloat(z);
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
});
define("Utility/ArrayUtils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ArrayUtiils {
        static FlattenVector(list) {
            let flattened = new Array();
            for (let list_item of list) {
                flattened.unshift(...list_item);
            }
            return flattened;
        }
    }
    exports.default = ArrayUtiils;
});
define("Utility/ListUtils", ["require", "exports", "Utility/List"], function (require, exports, List_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    List_2 = __importDefault(List_2);
    class ListUtiils {
        static FlattenVector(list) {
            let flattened = new List_2.default();
            for (let list_item of list) {
                flattened.AddAll([...list_item]);
            }
            return flattened;
        }
    }
    exports.default = ListUtiils;
});
define("Render/Mesh", ["require", "exports", "Utility/ArrayUtils", "FWGE", "Item", "Utility/List", "Utility/ListUtils"], function (require, exports, ArrayUtils_1, FWGE_1, Item_1, List_3, ListUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ArrayUtils_1 = __importDefault(ArrayUtils_1);
    FWGE_1 = __importDefault(FWGE_1);
    Item_1 = __importDefault(Item_1);
    List_3 = __importDefault(List_3);
    ListUtils_1 = __importDefault(ListUtils_1);
    class BufferType {
    }
    BufferType.INDEX = 0;
    BufferType.POSITION = 1;
    exports.BufferType = BufferType;
    class IMesh {
        constructor() {
            this.name = 'Mesh';
        }
    }
    exports.IMesh = IMesh;
    class Mesh extends Item_1.default {
        constructor({ name, position, uv, colour, normal, index, wireframe } = new IMesh) {
            super(name);
            this.PositionBuffer = this.Bind(FWGE_1.default.GL, BufferType.POSITION, position);
            this.UVBuffer = this.Bind(FWGE_1.default.GL, BufferType.POSITION, uv);
            this.ColourBuffer = this.Bind(FWGE_1.default.GL, BufferType.POSITION, colour);
            this.NormalBuffer = this.Bind(FWGE_1.default.GL, BufferType.POSITION, normal);
            this.IndexBuffer = this.Bind(FWGE_1.default.GL, BufferType.INDEX, index);
            this.WireframeBuffer = this.Bind(FWGE_1.default.GL, BufferType.INDEX, wireframe);
        }
        Bind(gl, type, data) {
            if (!data)
                return null;
            let buffer = gl.createBuffer();
            if (data instanceof Array) {
                data = ArrayUtils_1.default.FlattenVector(data);
            }
            if (data instanceof List_3.default) {
                data = ListUtils_1.default.FlattenVector(data);
            }
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
});
define("Physics/PhysicsMaterial", ["require", "exports", "Item"], function (require, exports, Item_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Item_2 = __importDefault(Item_2);
    class IPhysicsMaterial {
        constructor() {
            this.name = 'Physics Material';
        }
    }
    exports.IPhysicsMaterial = IPhysicsMaterial;
    class PhysicsMaterial extends Item_2.default {
        constructor({ name } = new IPhysicsMaterial) {
            super(name);
        }
    }
    exports.default = PhysicsMaterial;
});
define("Render/Colour4", ["require", "exports", "Maths/Maths"], function (require, exports, Maths_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Maths_4 = __importDefault(Maths_4);
    class Colour4 extends Float32Array {
        get R() {
            return this[0];
        }
        set R(red) {
            this[0] = Maths_4.default.CleanFloat(Maths_4.default.Clamp(red, 0, 1));
        }
        get G() {
            return this[1];
        }
        set G(green) {
            this[1] = Maths_4.default.CleanFloat(Maths_4.default.Clamp(green, 0, 1));
        }
        get B() {
            return this[2];
        }
        set B(blue) {
            this[2] = Maths_4.default.CleanFloat(Maths_4.default.Clamp(blue, 0, 1));
        }
        get A() {
            return this[3];
        }
        set A(alpha) {
            this[3] = Maths_4.default.CleanFloat(Maths_4.default.Clamp(alpha, 0, 1));
        }
        get BIN() {
            let str = 'b';
            this.forEach(i => str += i.toString(2));
            return str;
        }
        get OCT() {
            let str = 'o';
            this.forEach(i => str += i.toString(8));
            return str;
        }
        get HEX() {
            let str = '#';
            this.forEach(i => str += i.toString(16));
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
});
define("Shader/ShaderAttributes", ["require", "exports"], function (require, exports) {
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
});
define("Shader/MaterialUniforms", ["require", "exports"], function (require, exports) {
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
});
define("Shader/MatrixUniforms", ["require", "exports"], function (require, exports) {
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
});
define("Shader/AmbientUniforms", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AmbientUniforms {
        constructor(gl, program) {
            this.Colour = gl.getUniformLocation(program, 'U_Ambient.Colour');
            this.Intensity = gl.getUniformLocation(program, 'U_Ambient.Intensity');
        }
    }
    exports.default = AmbientUniforms;
});
define("Shader/DirectionalUniforms", ["require", "exports"], function (require, exports) {
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
});
define("Shader/PointUniform", ["require", "exports"], function (require, exports) {
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
});
define("Shader/LightUniforms", ["require", "exports", "Shader/AmbientUniforms", "Shader/DirectionalUniforms", "Shader/PointUniform"], function (require, exports, AmbientUniforms_1, DirectionalUniforms_1, PointUniform_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    AmbientUniforms_1 = __importDefault(AmbientUniforms_1);
    DirectionalUniforms_1 = __importDefault(DirectionalUniforms_1);
    PointUniform_1 = __importDefault(PointUniform_1);
    class LightUniforms {
        constructor(gl, program) {
            this.Ambient = new AmbientUniforms_1.default(gl, program);
            this.Directional = new DirectionalUniforms_1.default(gl, program);
            this.PointCount = gl.getUniformLocation(program, `U_Point_Count`);
            this.Point;
            for (var i = 0; i < LightUniforms.MAX_LIGHT; ++i) {
                this.Point.push(new PointUniform_1.default(gl, program, i));
            }
        }
    }
    LightUniforms.MAX_LIGHT = 8;
    exports.default = LightUniforms;
});
define("Shader/SamplerUniforms", ["require", "exports"], function (require, exports) {
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
});
define("Shader/ShaderUniforms", ["require", "exports", "Shader/MaterialUniforms", "Shader/MatrixUniforms", "Shader/LightUniforms", "Shader/SamplerUniforms"], function (require, exports, MaterialUniforms_1, MatrixUniforms_1, LightUniforms_1, SamplerUniforms_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MaterialUniforms_1 = __importDefault(MaterialUniforms_1);
    MatrixUniforms_1 = __importDefault(MatrixUniforms_1);
    LightUniforms_1 = __importDefault(LightUniforms_1);
    SamplerUniforms_1 = __importDefault(SamplerUniforms_1);
    class ShaderUniforms {
        constructor(gl, program) {
            this.Material = new MaterialUniforms_1.default(gl, program);
            this.Matrix = new MatrixUniforms_1.default(gl, program);
            this.Light = new LightUniforms_1.default(gl, program);
            this.Sampler = new SamplerUniforms_1.default(gl, program);
        }
    }
    exports.default = ShaderUniforms;
});
define("Shader/Shader", ["require", "exports", "Item", "Shader/ShaderAttributes", "Shader/ShaderUniforms"], function (require, exports, Item_3, ShaderAttributes_1, ShaderUniforms_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Item_3 = __importDefault(Item_3);
    ShaderAttributes_1 = __importDefault(ShaderAttributes_1);
    ShaderUniforms_1 = __importDefault(ShaderUniforms_1);
    class IShader {
        constructor() {
            this.name = 'Shader';
            this.height = 1024;
            this.width = 1024;
            this.vertexshader = '';
            this.fragmentshader = '';
        }
    }
    exports.Shaders = [];
    class Shader extends Item_3.default {
        constructor({ name, height, width, vertexshader, fragmentshader, gl }) {
            super(name);
            this.Program = gl.createProgram();
            this.Texture = gl.createTexture();
            this.FrameBuffer = gl.createFramebuffer();
            this.RenderBuffer = gl.createRenderbuffer();
            this.Height = height;
            this.Width = width;
            this.Attributes = new ShaderAttributes_1.default(gl, this.Program);
            this.Uniforms = new ShaderUniforms_1.default(gl, this.Program);
            Shader.Init(this, new WebGLRenderingContext, vertexshader, fragmentshader);
            exports.Shaders.push(this);
        }
        ;
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
            if (!gl.getProgramParameter(shader.Program, gl.LINK_STATUS))
                errorLog.push(gl.getProgramInfoLog(shader.Program));
            throw errorLog;
        }
    }
    exports.default = Shader;
});
define("Render/RenderMaterial", ["require", "exports", "FWGE", "Item", "Maths/Maths"], function (require, exports, FWGE_2, Item_4, Maths_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    FWGE_2 = __importDefault(FWGE_2);
    Item_4 = __importDefault(Item_4);
    Maths_5 = __importDefault(Maths_5);
    class IRenderMaterial {
        constructor() {
            this.name = 'Render Material';
            this.ambient = [0.50, 0.50, 0.50, 1.00];
            this.diffuse = [0.75, 0.75, 0.75, 1.00];
            this.specular = [1.00, 1.00, 1.00, 1.00];
            this.alpha = 1;
            this.shininess = 5;
        }
    }
    exports.IRenderMaterial = IRenderMaterial;
    class RenderMaterial extends Item_4.default {
        constructor({ name, ambient, diffuse, specular, alpha, shininess, shader, texture } = new IRenderMaterial) {
            super(name);
        }
        AttachShader(shader) {
        }
        static BindMap() {
        }
        static ApplyImage(src, material, type) {
            let img = new Image();
            let texture = null;
            switch (type) {
                case 'image':
                    material.ImageMap = FWGE_2.default.GL.createTexture();
                    texture = material.ImageMap;
                    break;
                case 'bump':
                    material.BumpMap = FWGE_2.default.GL.createTexture();
                    texture = material.BumpMap;
                    break;
                case 'specular':
                    material.SpecularMap = FWGE_2.default.GL.createTexture();
                    texture = material.SpecularMap;
                    break;
                default: texture = null;
            }
            FWGE_2.default.GL.bindTexture(FWGE_2.default.GL.TEXTURE_2D, texture);
            FWGE_2.default.GL.texImage2D(FWGE_2.default.GL.TEXTURE_2D, 0, FWGE_2.default.GL.RGBA, 1, 1, 0, FWGE_2.default.GL.RGBA, FWGE_2.default.GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
            img.onload = function () {
                FWGE_2.default.GL.bindTexture(FWGE_2.default.GL.TEXTURE_2D, texture);
                FWGE_2.default.GL.texImage2D(FWGE_2.default.GL.TEXTURE_2D, 0, FWGE_2.default.GL.RGBA, FWGE_2.default.GL.RGBA, FWGE_2.default.GL.UNSIGNED_BYTE, img);
                // then either generate mips if the image uses power-of-2 dimensions or 
                // set the filtering correctly for non-power-of-2 images.
                if (Maths_5.default.IsPowerOf2(img.width) && Maths_5.default.IsPowerOf2(img.height)) {
                    FWGE_2.default.GL.generateMipmap(FWGE_2.default.GL.TEXTURE_2D);
                    FWGE_2.default.GL.texParameteri(FWGE_2.default.GL.TEXTURE_2D, FWGE_2.default.GL.TEXTURE_MAG_FILTER, FWGE_2.default.GL.LINEAR);
                    FWGE_2.default.GL.texParameteri(FWGE_2.default.GL.TEXTURE_2D, FWGE_2.default.GL.TEXTURE_MIN_FILTER, FWGE_2.default.GL.LINEAR_MIPMAP_NEAREST);
                }
                else {
                    FWGE_2.default.GL.texParameteri(FWGE_2.default.GL.TEXTURE_2D, FWGE_2.default.GL.TEXTURE_WRAP_S, FWGE_2.default.GL.CLAMP_TO_EDGE);
                    FWGE_2.default.GL.texParameteri(FWGE_2.default.GL.TEXTURE_2D, FWGE_2.default.GL.TEXTURE_WRAP_T, FWGE_2.default.GL.CLAMP_TO_EDGE);
                    FWGE_2.default.GL.texParameteri(FWGE_2.default.GL.TEXTURE_2D, FWGE_2.default.GL.TEXTURE_MIN_FILTER, FWGE_2.default.GL.LINEAR);
                }
                //FWGE.GL.pixelStorei(FWGE.GL.UNPACK_FLIP_Y_WEBGL, true);                
                FWGE_2.default.GL.bindTexture(FWGE_2.default.GL.TEXTURE_2D, null);
            };
            img.src = src;
        }
        SetTextures({ imagemap = 'undefined', bumpmap = 'undefined', specularmap = 'undefined' } = {}) {
            if (!!imagemap) {
                if (!!this.ImageMap)
                    FWGE_2.default.GL.deleteTexture(this.ImageMap);
                RenderMaterial.ApplyImage(imagemap, this, 'image');
            }
            if (!!bumpmap) {
                if (!!this.BumpMap)
                    FWGE_2.default.GL.deleteTexture(this.BumpMap);
                RenderMaterial.ApplyImage(bumpmap, this, 'bump');
            }
            if (!!specularmap) {
                if (!!this.SpecularMap)
                    FWGE_2.default.GL.deleteTexture(this.SpecularMap);
                RenderMaterial.ApplyImage(specularmap, this, 'specular');
            }
        }
    }
    exports.default = RenderMaterial;
});
define("Transform", ["require", "exports", "Maths/Vector3"], function (require, exports, Vector3_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Vector3_2 = __importDefault(Vector3_2);
    class ITransform {
        constructor() {
            this.position = Vector3_2.default.ZERO;
            this.rotation = Vector3_2.default.ZERO;
            this.scale = Vector3_2.default.ONE;
            this.shear = Vector3_2.default.ZERO;
        }
    }
    class Transform {
        constructor({ position, rotation, scale, shear } = new ITransform) {
            this.Position = new Vector3_2.default(position);
            this.Rotation = new Vector3_2.default(rotation);
            this.Scale = new Vector3_2.default(scale);
            this.Shear = new Vector3_2.default(shear);
        }
        get UP() {
            return new Vector3_2.default(0, 1, 0);
        }
        get FORWARD() {
            return new Vector3_2.default(0, 0, 1);
        }
        get RIGHT() {
            return new Vector3_2.default(1, 0, 0);
        }
    }
    exports.default = Transform;
});
define("GameObject", ["require", "exports", "Item", "Transform"], function (require, exports, Item_5, Transform_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Item_5 = __importDefault(Item_5);
    Transform_1 = __importDefault(Transform_1);
    class IGameObject {
    }
    exports.IGameObject = IGameObject;
    class GameObject extends Item_5.default {
        constructor({ name, transform, material, mesh, physics, animation, begin, update, end, children } = new IGameObject) {
            super(name);
            this.Begin = begin.bind(this);
            this.Update = update.bind(this);
            this.End = end.bind(this);
            // this.AttachMany(transform, material, mesh, physics, animation)
        }
        Attach(item) {
            if (item instanceof GameObject) {
                // do stuff
            }
            // and so forth
            item.GameObjects.Add(this);
        }
        AttachMany(...items) {
            items.filter(item => item !== null && item !== undefined).forEach(item => this.Attach(item));
        }
        Detach(item) {
            if (item instanceof GameObject) {
                // do stuff
            }
            // and so forth
            item.GameObjects.Remove(this);
        }
        DetachMany(...items) {
            items.filter(item => item !== null && item !== undefined).forEach(item => this.Attach(item));
        }
        Clone() {
            return GameObject.Clone(this);
        }
        static Clone(gameObject) {
            var clone = new GameObject({
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
                end: gameObject.End
            });
            clone.Children.AddAll(gameObject.Children.ToArray().map(child => child.Clone()));
            return clone;
        }
    }
    exports.default = GameObject;
});
define("Interfaces/Updateable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("GameItem", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("ParticleSystem", ["require", "exports", "Item"], function (require, exports, Item_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Item_6 = __importDefault(Item_6);
    class IParticleSystem {
        constructor() {
            this.name = 'Particle System';
        }
    }
    class ParticleSystem extends Item_6.default {
        constructor({ name }) {
            super(name);
        }
    }
    exports.default = ParticleSystem;
});
define("Animation/AnimationFrame", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class IAnimationFrame {
        constructor() {
            this.length = 0;
        }
    }
    exports.IAnimationFrame = IAnimationFrame;
    class AnimationFrame {
        constructor({ before, after, length }) {
            this.Before = before;
            this.After = after;
            this.Length = length;
        }
    }
    exports.default = AnimationFrame;
});
define("Animation/Animation", ["require", "exports", "Animation/AnimationFrame", "Item"], function (require, exports, AnimationFrame_1, Item_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    AnimationFrame_1 = __importDefault(AnimationFrame_1);
    Item_7 = __importDefault(Item_7);
    class IAnimation {
        constructor() {
            this.name = 'Animation';
            this.length = 0;
        }
    }
    exports.IAnimation = IAnimation;
    class Animation extends Item_7.default {
        constructor({ name, mesh, material, frames, length } = new IAnimation) {
            super(name);
            this.Mesh = mesh;
            this.Material = material;
            this.Length = length;
            if (frames) {
                this.Add(frames);
            }
        }
        Add(frame) {
            if (frame instanceof AnimationFrame_1.default) {
                this.Frames.Add;
            }
            else {
                this.Frames.AddAll(frame);
            }
        }
        Update() {
            throw new Error('Method not implemented.');
        }
    }
    exports.default = Animation;
});
define("Camera/Camera", ["require", "exports", "Item"], function (require, exports, Item_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Item_8 = __importDefault(Item_8);
    var ViewMode;
    (function (ViewMode) {
        ViewMode[ViewMode["PERSPECTIVE"] = 0] = "PERSPECTIVE";
        ViewMode[ViewMode["ORTHOGRAPHIC"] = 1] = "ORTHOGRAPHIC";
    })(ViewMode = exports.ViewMode || (exports.ViewMode = {}));
    class ICamera {
        constructor() {
            this.mode = ViewMode.PERSPECTIVE;
            this.fieldOfView = 35;
            this.aspectRatio = 16 / 9;
            this.nearClipping = 0.01;
            this.farClipping = 900;
            this.left = -10;
            this.right = 10;
            this.top = 10;
            this.bottom = -10;
            this.horizontalTilt = 90;
            this.vericalTilt = 90;
        }
    }
    exports.ICamera = ICamera;
    class Camera extends Item_8.default {
        constructor({ mode, fieldOfView, aspectRatio, nearClipping, farClipping, left, right, top, bottom, horizontalTilt, vericalTilt }) {
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
        Update() {
            /*if (FWGE.GL.canvas.width != FWGE.GL.canvas.clientWidth || FWGE.GL.canvas.height != FWGE.GL.canvas.clientHeight)
            {
                FWGE.GL.canvas.width  = FWGE.GL.canvas.clientWidth;
                FWGE.GL.canvas.height = FWGE.GL.canvas.clientHeight;
            }
            
            this.Aspect = FWGE.GL.drawingBufferWidth / FWGE.GL.drawingBufferHeight;*/
        }
    }
    exports.default = Camera;
});
define("Maths/Matrix3", ["require", "exports", "Utility/List", "Maths/Matrix2", "Maths/Matrix4"], function (require, exports, List_4, Matrix2_1, Matrix4_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    List_4 = __importDefault(List_4);
    Matrix2_1 = __importDefault(Matrix2_1);
    Matrix4_1 = __importDefault(Matrix4_1);
    class Matrix3 extends Float32Array {
        constructor(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
            super(4);
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
            else if (m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_4.default) {
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
            if (m11 instanceof Matrix3 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_4.default) {
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
            if (m11 instanceof Matrix3 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_4.default) {
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
            if (m11 instanceof Matrix3 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_4.default) {
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
});
define("Maths/Matrix2", ["require", "exports", "Utility/List", "Maths/Matrix3", "Maths/Matrix4"], function (require, exports, List_5, Matrix3_1, Matrix4_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    List_5 = __importDefault(List_5);
    Matrix3_1 = __importDefault(Matrix3_1);
    Matrix4_2 = __importDefault(Matrix4_2);
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
            if (m11 instanceof Matrix2 || m11 instanceof Matrix3_1.default || m11 instanceof Matrix4_2.default) {
                [
                    m11, m12,
                    m21, m22
                ] = [
                    m11.M11, m11.M12,
                    m11.M21, m11.M22
                ];
            }
            else if (m11 instanceof Float32Array || m11 instanceof List_5.default || m11 instanceof Array) {
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
            if (m11 instanceof Matrix2 || m11 instanceof Float32Array || m11 instanceof List_5.default || m11 instanceof Array) {
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
            if (m11 instanceof Matrix2 || m11 instanceof Float32Array || m11 instanceof List_5.default || m11 instanceof Array) {
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
            if (m11 instanceof Matrix2 || m11 instanceof Float32Array || m11 instanceof List_5.default || m11 instanceof Array) {
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
});
define("Maths/Matrix4", ["require", "exports", "Utility/List", "Maths/Matrix2", "Maths/Matrix3"], function (require, exports, List_6, Matrix2_2, Matrix3_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    List_6 = __importDefault(List_6);
    Matrix2_2 = __importDefault(Matrix2_2);
    Matrix3_2 = __importDefault(Matrix3_2);
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
            if (m11 instanceof Matrix2_2.default) {
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
            else if (m11 instanceof Matrix3_2.default) {
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
            else if (m11 instanceof Matrix4 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_6.default) {
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
            if (m11 instanceof Matrix4 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_6.default) {
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
            if (m11 instanceof Matrix4 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_6.default) {
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
            return Matrix4.Set(this, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);
        }
        static Mult(matrix, m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
            if (m11 instanceof Matrix4 || m11 instanceof Float32Array || m11 instanceof Array || m11 instanceof List_6.default) {
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
});
define("Camera/Viewer", ["require", "exports", "Maths/Matrix4", "Maths/Vector3"], function (require, exports, Matrix4_3, Vector3_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Matrix4_3 = __importDefault(Matrix4_3);
    Vector3_3 = __importDefault(Vector3_3);
    class IViewer {
        constructor() {
            this.position = Vector3_3.default.ZERO;
            this.target = Vector3_3.default.ZERO;
        }
    }
    exports.IViewer = IViewer;
    class Viewer {
        constructor({ position, target } = new IViewer) {
            this.Position = new Vector3_3.default(position);
            this.Target = new Vector3_3.default(target);
            this.Up = new Vector3_3.default(0, 1, 0);
            this.Matrix = Matrix4_3.default.IDENTITY;
        }
        Update() {
            let n = this.Position.Clone().Diff(this.Target).Unit();
            let u = this.Up.Clone().Cross(n).Unit();
            let v = n.Clone().Cross(u).Unit();
            let p = this.Position;
            this.Matrix.Set(v.X, v.Y, v.Z, 0, u.X, u.Y, u.Z, 0, n.X, n.Y, n.Z, 0, 0, 0, 0, 1).Mult(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, p.X, p.Y, p.Z, 1);
        }
    }
    exports.default = Viewer;
});
define("Interfaces/Attachable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Light/DirectionalLight", ["require", "exports", "Light/LightItem", "Maths/Vector3"], function (require, exports, LightItem_1, Vector3_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    LightItem_1 = __importStar(LightItem_1);
    Vector3_4 = __importDefault(Vector3_4);
    class IDirectionalLight extends LightItem_1.ILightItem {
        constructor() {
            super(...arguments);
            this.name = 'Directional Light';
            this.direction = Vector3_4.default.ZERO;
        }
    }
    exports.IDirectionalLight = IDirectionalLight;
    class DirectionalLight extends LightItem_1.default {
        constructor({ name, colour, intensity, direction } = new IDirectionalLight) {
            super({ name, colour, intensity });
            this.Direction = new Vector3_4.default(direction);
        }
    }
    exports.default = DirectionalLight;
});
define("Light/PointLight", ["require", "exports", "Light/LightItem", "Maths/Vector3"], function (require, exports, LightItem_2, Vector3_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    LightItem_2 = __importStar(LightItem_2);
    Vector3_5 = __importDefault(Vector3_5);
    class IPointLight extends LightItem_2.ILightItem {
        constructor() {
            super(...arguments);
            this.name = 'Point Light';
            this.position = Vector3_5.default.ZERO;
            this.radius = 5;
            this.angle = 180;
            this.shininess = 255;
        }
    }
    exports.IPointLight = IPointLight;
    class PointLight extends LightItem_2.default {
        constructor({ name, position, colour, intensity, radius, angle, shininess } = new IPointLight) {
            super({ name, colour, intensity });
            this.Position = new Vector3_5.default(position);
            this.Radius = radius;
            this.Angle = angle;
            this.Shininess = shininess;
        }
    }
    exports.default = PointLight;
});
define("Light/Light", ["require", "exports", "Light/AmbientLight", "Light/DirectionalLight", "Utility/List", "Light/PointLight"], function (require, exports, AmbientLight_1, DirectionalLight_1, List_7, PointLight_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    AmbientLight_1 = __importDefault(AmbientLight_1);
    DirectionalLight_1 = __importDefault(DirectionalLight_1);
    List_7 = __importDefault(List_7);
    PointLight_1 = __importDefault(PointLight_1);
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
    Light.Lights = new List_7.default(12);
    exports.default = Light;
});
define("Light/LightItem", ["require", "exports", "Render/Colour4", "Item"], function (require, exports, Colour4_1, Item_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Colour4_1 = __importDefault(Colour4_1);
    Item_9 = __importDefault(Item_9);
    class ILightItem {
        constructor() {
            this.name = 'Light';
        }
    }
    exports.ILightItem = ILightItem;
    class LightItem extends Item_9.default {
        constructor({ name, colour, intensity } = new ILightItem) {
            super(name);
            this.Colour = new Colour4_1.default(colour);
            this.Intensity = intensity;
        }
    }
    exports.default = LightItem;
});
define("Light/AmbientLight", ["require", "exports", "Light/LightItem"], function (require, exports, LightItem_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    LightItem_3 = __importStar(LightItem_3);
    class IAmbientLight extends LightItem_3.ILightItem {
    }
    class AmbientLight extends LightItem_3.default {
        constructor({ name, colour, intensity } = new IAmbientLight) {
            super({ name, colour, intensity });
        }
    }
    exports.default = AmbientLight;
});
define("Maths/Quaternion", ["require", "exports", "Maths/Vector4"], function (require, exports, Vector4_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Vector4_1 = __importDefault(Vector4_1);
    class Quaternion extends Vector4_1.default {
        constructor(w, x, y, z) {
            super();
            Vector4_1.default.Set(this, w, x, y, z);
        }
    }
    exports.default = Quaternion;
});
define("Physics/PhysicsBody", ["require", "exports", "Item"], function (require, exports, Item_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Item_10 = __importDefault(Item_10);
    class IPhysicsBody {
        constructor() {
            this.name = 'Physics Body';
            this.mass = 1;
            this.lockx = true;
            this.locky = true;
            this.lockz = true;
        }
    }
    exports.IPhysicsBody = IPhysicsBody;
    class PhysicsBody extends Item_10.default {
        constructor({ name, mass, lockx, locky, lockz } = new IPhysicsBody) {
            super(name);
            this.Mass = 1;
            this.LockX = true;
            this.LockY = true;
            this.LockZ = true;
            this.Velocity = 0;
            this.Speed = 0;
            this.Mass = mass;
            this.LockX = lockx;
            this.LockY = locky;
            this.LockZ = lockz;
            this.Speed = 0;
            this.Velocity = 0;
        }
    }
    exports.default = PhysicsBody;
});
define("Physics/Collision/Collider", ["require", "exports", "Item", "Maths/Vector3"], function (require, exports, Item_11, Vector3_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Item_11 = __importDefault(Item_11);
    Vector3_6 = __importDefault(Vector3_6);
    class ICollider {
        constructor() {
            this.name = 'Collider';
            this.position = Vector3_6.default.ZERO;
            this.physicsitem = undefined;
        }
    }
    exports.ICollider = ICollider;
    class Collider extends Item_11.default {
        constructor({ name, position, physicsitem }) {
            super(name);
            this.Position = new Vector3_6.default(position);
            this.PhysicsItem = physicsitem;
        }
    }
    exports.default = Collider;
});
define("Physics/PhysicsItem", ["require", "exports", "Item"], function (require, exports, Item_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Item_12 = __importDefault(Item_12);
    class IPhysicsItem {
        constructor() {
            this.name = 'Physics Item';
        }
    }
    exports.IPhysicsItem = IPhysicsItem;
    class PhysicsItem extends Item_12.default {
        constructor({ name, body, collider, material } = new IPhysicsItem) {
            super(name);
            this.Collider = collider;
            this.Material = material;
            this.Body = body;
        }
    }
    exports.default = PhysicsItem;
});
define("Physics/Collision/BoxCollider", ["require", "exports", "Physics/Collision/Collider"], function (require, exports, Collider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Collider_1 = __importStar(Collider_1);
    class IBoxCollider extends Collider_1.ICollider {
        constructor() {
            super(...arguments);
            this.name = 'BoxCollider';
            this.height = 1;
            this.width = 1;
            this.breadth = 1;
        }
    }
    exports.IBoxCollider = IBoxCollider;
    class BoxCollider extends Collider_1.default {
        constructor({ name, physicsitem, position, height, width, breadth } = new IBoxCollider) {
            super({ name, position, physicsitem });
            this.Height = height;
            this.Width = width;
            this.Breadth = breadth;
        }
    }
    exports.default = BoxCollider;
});
define("Physics/Collision/CollisionEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CollisionEvent {
        constructor() {
            // TODO
            // Add timestamp 
            // Add collider
            // Add collided
            // Add collision type
        }
    }
    exports.default = CollisionEvent;
});
define("Physics/Collision/SphereCollider", ["require", "exports", "Physics/Collision/Collider"], function (require, exports, Collider_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Collider_2 = __importStar(Collider_2);
    class ISphereCollider extends Collider_2.ICollider {
        constructor() {
            super(...arguments);
            this.name = 'Sphere Collider';
            this.radius = 1;
        }
    }
    exports.ISphereCollider = ISphereCollider;
    class SphereCollider extends Collider_2.default {
        constructor({ name, position, radius, physicsitem } = new ISphereCollider) {
            super({ name, position, physicsitem });
            this.Radius = radius;
        }
    }
    exports.default = SphereCollider;
});
define("Render/ModelView", ["require", "exports", "Maths/Maths", "Maths/Matrix4"], function (require, exports, Maths_6, Matrix4_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Maths_6 = __importDefault(Maths_6);
    Matrix4_4 = __importDefault(Matrix4_4);
    class ModelView {
        static Push() {
            ModelView.Stack.push(ModelView.Peek());
        }
        static Peek() {
            if (ModelView.Stack.length === 0)
                return Matrix4_4.default.IDENTITY;
            else
                return ModelView.Stack[ModelView.Stack.length - 1];
        }
        static Pop() {
            if (ModelView.Stack.length === 0)
                return Matrix4_4.default.IDENTITY;
            else
                return ModelView.Stack.pop();
        }
        static Transform(transform) {
            this.Peek().Set(this.Shear(this.Scale(this.Rotate(this.Translate(this.Peek(), transform.Position), transform.Rotation), transform.Scale), transform.Shear));
        }
        static Translate(matrix, translation) {
            return new Matrix4_4.default(matrix.M11, matrix.M12, matrix.M13, matrix.M14, matrix.M21, matrix.M22, matrix.M23, matrix.M24, matrix.M31, matrix.M32, matrix.M33, matrix.M34, matrix.M11 * translation.X + matrix.M21 * translation.Y + matrix.M31 * translation.Z + matrix.M41, matrix.M12 * translation.X + matrix.M22 * translation.Y + matrix.M32 * translation.Z + matrix.M42, matrix.M13 * translation.X + matrix.M23 * translation.Y + matrix.M33 * translation.Z + matrix.M43, matrix.M14 * translation.X + matrix.M24 * translation.Y + matrix.M34 * translation.Z + matrix.M44);
        }
        static Rotate(matrix, rotation) {
            let x = Maths_6.default.Radian(rotation.X);
            let y = Maths_6.default.Radian(rotation.Y);
            let z = Maths_6.default.Radian(rotation.Z);
            return new Matrix4_4.default(Math.cos(z), -Math.sin(z), 0.0, 0.0, Math.sin(z), Math.cos(z), 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0).Mult(Math.cos(y), 0.0, Math.sin(y), 0.0, 0.0, 1.0, 0.0, 0.0, -Math.sin(y), 0.0, Math.cos(y), 0.0, 0.0, 0.0, 0.0, 1.0).Mult(1.0, 0.0, 0.0, 0.0, 0.0, Math.cos(x), -Math.sin(x), 0.0, 0.0, Math.sin(x), Math.cos(x), 0.0, 0.0, 0.0, 0.0, 1.0).Mult(matrix);
        }
        static Scale(matrix, scalers) {
            return new Matrix4_4.default(matrix.M11 * scalers.X, matrix.M12 * scalers.X, matrix.M13 * scalers.X, matrix.M14 * scalers.X, matrix.M21 * scalers.Y, matrix.M22 * scalers.Y, matrix.M23 * scalers.Y, matrix.M24 * scalers.Y, matrix.M31 * scalers.Z, matrix.M32 * scalers.Z, matrix.M33 * scalers.Z, matrix.M34 * scalers.Z, matrix.M41, matrix.M42, matrix.M43, matrix.M44);
        }
        static Shear(matrix, angles) {
            var phi = Maths_6.default.Radian(angles.X);
            var theta = Maths_6.default.Radian(angles.Y);
            var rho = Maths_6.default.Radian(angles.Z);
            return new Matrix4_4.default(1.0, 0.0, Math.tan(rho), 0.0, Math.tan(phi), 1.0, 0.0, 0.0, 0.0, Math.tan(theta), 1.0, 0.0, 0.0, 0.0, 0.0, 1.0).Mult(matrix);
        }
    }
    ModelView.Stack = new Array();
    exports.default = ModelView;
});
define("Render/Projection", ["require", "exports", "Maths/Maths", "Maths/Matrix4"], function (require, exports, Maths_7, Matrix4_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Maths_7 = __importDefault(Maths_7);
    Matrix4_5 = __importDefault(Matrix4_5);
    class Projection {
        static Orthographic(left, right, top, bottom, near, far, theta, phi) {
            theta = Maths_7.default.Cot(Maths_7.default.Radian(theta));
            phi = Maths_7.default.Cot(Maths_7.default.Radian(phi));
            left -= near * theta;
            right -= near * theta;
            top -= near * phi;
            bottom -= near * phi;
            return new Matrix4_5.default(2 / (right - left), 0, 0, 0, 0, 2 / (top - bottom), 0, 0, theta, phi, -2 / (far - near), 0, -(left + right) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1);
        }
        static Perspective(field_of_view, aspect_ratio, near, far) {
            let top = near * Math.tan(Maths_7.default.Radian(field_of_view));
            let right = top * aspect_ratio;
            let left = -right;
            let bottom = -top;
            let width = right - left;
            let height = top - bottom;
            let depth = far - near;
            return new Matrix4_5.default(2 * near / width, 0, 0, 0, 0, 2 * near / height, 0, 0, (right + left) / width, (top + bottom) / height, -(far + near) / depth, -1, 0, 0, -(2 * far * near) / depth, 1);
        }
    }
    exports.default = Projection;
});
define("Render/Renderer", ["require", "exports", "Light/AmbientLight", "Light/DirectionalLight", "FWGE", "Light/Light", "Render/ModelView", "Maths/Matrix3", "Maths/Matrix4", "Light/PointLight", "Shader/Shader"], function (require, exports, AmbientLight_2, DirectionalLight_2, FWGE_3, Light_1, ModelView_1, Matrix3_3, Matrix4_6, PointLight_2, Shader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    AmbientLight_2 = __importDefault(AmbientLight_2);
    DirectionalLight_2 = __importDefault(DirectionalLight_2);
    FWGE_3 = __importDefault(FWGE_3);
    Light_1 = __importDefault(Light_1);
    ModelView_1 = __importDefault(ModelView_1);
    Matrix3_3 = __importDefault(Matrix3_3);
    Matrix4_6 = __importDefault(Matrix4_6);
    PointLight_2 = __importDefault(PointLight_2);
    class Renderer {
        static Render() {
            Renderer.ClearBuffers();
            /*for (var  i = 0, arr = GameObject.Objects; i < arr.length; ++i)
            {
                Renderer.SetGlobalUniforms();
                Renderer.RenderObject(arr[i]);
            }*/
            //Renderer.FinalDraw();
        }
        /*public static Init(): void
        {
            Renderer.WireframeShader = new Shader(Renderer.WireframeShader);    Shaders.pop();
            Renderer.CombinedShader = new Shader(Renderer.CombinedShader);      Shaders.pop();
    
            FWGE.GL.enable(FWGE.GL.DEPTH_TEST);
            FWGE.GL.disable(FWGE.GL.BLEND);
        }*/
        static ClearBuffers() {
            var i = Shader_1.Shaders.length;
            while (--i >= 0) {
                var shader = Shader_1.Shaders[i];
                FWGE_3.default.GL.bindFramebuffer(FWGE_3.default.GL.FRAMEBUFFER, shader.FrameBuffer);
                FWGE_3.default.GL.viewport(0, 0, shader.Width, shader.Height);
                FWGE_3.default.GL.clear(FWGE_3.default.GL.COLOR_BUFFER_BIT | FWGE_3.default.GL.DEPTH_BUFFER_BIT);
            }
            FWGE_3.default.GL.bindFramebuffer(FWGE_3.default.GL.FRAMEBUFFER, null);
            FWGE_3.default.GL.viewport(0, 0, FWGE_3.default.GL.drawingBufferWidth, FWGE_3.default.GL.drawingBufferHeight);
            FWGE_3.default.GL.clear(FWGE_3.default.GL.COLOR_BUFFER_BIT | FWGE_3.default.GL.DEPTH_BUFFER_BIT);
        }
        static RenderObject(gameObject) {
            ModelView_1.default.Push();
            ModelView_1.default.Transform(gameObject.Transform);
            var mv = ModelView_1.default.Peek();
            for (var i = 0; i < gameObject.Children.Length; ++i)
                Renderer.RenderObject(gameObject.Children.Get(i).Value);
            if (gameObject.Mesh && gameObject.Material && gameObject.Material.Shader) {
                var shader = gameObject.Material.Shader;
                FWGE_3.default.GL.useProgram(shader.Program);
                FWGE_3.default.GL.enableVertexAttribArray(shader.Attributes.Position);
                if (shader.Attributes.Normal !== -1)
                    FWGE_3.default.GL.enableVertexAttribArray(shader.Attributes.Normal);
                if (shader.Attributes.Colour !== -1)
                    FWGE_3.default.GL.enableVertexAttribArray(shader.Attributes.Colour);
                if (shader.Attributes.UV !== -1)
                    FWGE_3.default.GL.enableVertexAttribArray(shader.Attributes.UV);
                if (gameObject.Material.Alpha !== 1.0) {
                    FWGE_3.default.GL.enable(FWGE_3.default.GL.BLEND);
                    FWGE_3.default.GL.disable(FWGE_3.default.GL.DEPTH_TEST);
                    FWGE_3.default.GL.blendFunc(FWGE_3.default.GL.SRC_ALPHA, FWGE_3.default.GL.ONE);
                }
                Renderer.BindAttributes(gameObject.Mesh, shader.Attributes);
                Renderer.SetObjectUniforms(gameObject.Material, shader.Uniforms, mv);
                Renderer.Draw(gameObject.Mesh.VertexCount, shader.FrameBuffer);
                // if (!!gameObject.Mesh.WireframeBuffer && gameObject.Mesh.DrawWireframe) Renderer.DrawWireframe(gameObject.Mesh, mv);
                if (gameObject.Material.Alpha !== 1.0) {
                    FWGE_3.default.GL.enable(FWGE_3.default.GL.DEPTH_TEST);
                    FWGE_3.default.GL.disable(FWGE_3.default.GL.BLEND);
                }
                FWGE_3.default.GL.disableVertexAttribArray(shader.Attributes.Position);
                if (shader.Attributes.Normal !== -1)
                    FWGE_3.default.GL.disableVertexAttribArray(shader.Attributes.Normal);
                if (shader.Attributes.Colour !== -1)
                    FWGE_3.default.GL.disableVertexAttribArray(shader.Attributes.Colour);
                if (shader.Attributes.UV !== -1)
                    FWGE_3.default.GL.disableVertexAttribArray(shader.Attributes.UV);
                FWGE_3.default.GL.useProgram(null);
            }
            ModelView_1.default.Pop();
        }
        static BindAttributes(mesh, attributes) {
            FWGE_3.default.GL.bindBuffer(FWGE_3.default.GL.ARRAY_BUFFER, mesh.PositionBuffer);
            FWGE_3.default.GL.vertexAttribPointer(attributes.Position, 3, FWGE_3.default.GL.FLOAT, false, 0, 0);
            if (attributes.UV !== -1) {
                if (mesh.UVBuffer) {
                    FWGE_3.default.GL.bindBuffer(FWGE_3.default.GL.ARRAY_BUFFER, mesh.UVBuffer);
                    FWGE_3.default.GL.vertexAttribPointer(attributes.UV, 2, FWGE_3.default.GL.FLOAT, false, 0, 0);
                }
                else
                    FWGE_3.default.GL.disableVertexAttribArray(attributes.UV);
            }
            if (attributes.Colour !== -1) {
                if (mesh.ColourBuffer) {
                    FWGE_3.default.GL.bindBuffer(FWGE_3.default.GL.ARRAY_BUFFER, mesh.ColourBuffer);
                    FWGE_3.default.GL.vertexAttribPointer(attributes.Colour, 3, FWGE_3.default.GL.FLOAT, false, 0, 0);
                }
                else
                    FWGE_3.default.GL.disableVertexAttribArray(attributes.Colour);
            }
            if (attributes.Normal !== -1) {
                if (!!mesh.NormalBuffer) {
                    FWGE_3.default.GL.bindBuffer(FWGE_3.default.GL.ARRAY_BUFFER, mesh.NormalBuffer);
                    FWGE_3.default.GL.vertexAttribPointer(attributes.Normal, 3, FWGE_3.default.GL.FLOAT, false, 0, 0);
                }
                else
                    FWGE_3.default.GL.disableVertexAttribArray(attributes.Normal);
            }
            FWGE_3.default.GL.bindBuffer(FWGE_3.default.GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);
        }
        static SetObjectUniforms(material, uniforms, mv) {
            FWGE_3.default.GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, mv);
            //FWGE.GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, Renderer.CalculateNormalMatrix());
            FWGE_3.default.GL.uniform4fv(uniforms.Material.Ambient, material.Ambient);
            FWGE_3.default.GL.uniform4fv(uniforms.Material.Diffuse, material.Diffuse);
            FWGE_3.default.GL.uniform4fv(uniforms.Material.Specular, material.Specular);
            FWGE_3.default.GL.uniform1f(uniforms.Material.Shininess, material.Shininess);
            FWGE_3.default.GL.uniform1f(uniforms.Material.Alpha, material.Alpha);
            if (material.ImageMap) {
                FWGE_3.default.GL.activeTexture(FWGE_3.default.GL.TEXTURE0);
                FWGE_3.default.GL.bindTexture(FWGE_3.default.GL.TEXTURE_2D, material.ImageMap);
                FWGE_3.default.GL.uniform1i(uniforms.Material.HasImage, 1);
                FWGE_3.default.GL.uniform1i(uniforms.Sampler.Image, 0);
            }
            else {
                FWGE_3.default.GL.activeTexture(FWGE_3.default.GL.TEXTURE0);
                FWGE_3.default.GL.bindTexture(FWGE_3.default.GL.TEXTURE_2D, null);
                FWGE_3.default.GL.uniform1i(uniforms.Material.HasImage, 0);
            }
            if (material.BumpMap) {
                FWGE_3.default.GL.activeTexture(FWGE_3.default.GL.TEXTURE1);
                FWGE_3.default.GL.bindTexture(FWGE_3.default.GL.TEXTURE_2D, material.BumpMap);
                FWGE_3.default.GL.uniform1i(uniforms.Material.HasBump, 1);
                FWGE_3.default.GL.uniform1i(uniforms.Sampler.Bump, 1);
            }
            else {
                FWGE_3.default.GL.activeTexture(FWGE_3.default.GL.TEXTURE1);
                FWGE_3.default.GL.bindTexture(FWGE_3.default.GL.TEXTURE_2D, null);
                FWGE_3.default.GL.uniform1i(uniforms.Material.HasBump, 0);
            }
            if (material.SpecularMap) {
                FWGE_3.default.GL.activeTexture(FWGE_3.default.GL.TEXTURE2);
                FWGE_3.default.GL.bindTexture(FWGE_3.default.GL.TEXTURE_2D, material.SpecularMap);
                FWGE_3.default.GL.uniform1i(uniforms.Material.HasSpecular, 1);
                FWGE_3.default.GL.uniform1i(uniforms.Sampler.Specular, 2);
            }
            else {
                FWGE_3.default.GL.activeTexture(FWGE_3.default.GL.TEXTURE2);
                FWGE_3.default.GL.bindTexture(FWGE_3.default.GL.TEXTURE_2D, null);
                FWGE_3.default.GL.uniform1i(uniforms.Material.HasBump, 0);
            }
        }
        static SetGlobalUniforms() {
            var i = Shader_1.Shaders.length;
            while (--i >= 0) {
                var point_count = 0;
                FWGE_3.default.GL.useProgram(Shader_1.Shaders[i].Program);
                var uniforms = Shader_1.Shaders[i].Uniforms.Light;
                for (var j = 0; j < Light_1.default.Lights.Length; ++j) {
                    var light = Light_1.default.Lights[j];
                    if (light instanceof AmbientLight_2.default) {
                        FWGE_3.default.GL.uniform4fv(uniforms.Ambient.Colour, light.Colour);
                        FWGE_3.default.GL.uniform1f(uniforms.Ambient.Intensity, light.Intensity);
                    }
                    else if (light instanceof DirectionalLight_2.default) {
                        FWGE_3.default.GL.uniform4fv(uniforms.Directional.Colour, light.Colour);
                        FWGE_3.default.GL.uniform1f(uniforms.Directional.Intensity, light.Intensity);
                        FWGE_3.default.GL.uniform3fv(uniforms.Directional.Direction, light.Direction);
                    }
                    else if (light instanceof PointLight_2.default) {
                        FWGE_3.default.GL.uniform4fv(uniforms.Point[point_count].Colour, light.Colour);
                        FWGE_3.default.GL.uniform1f(uniforms.Point[point_count].Intensity, light.Intensity);
                        FWGE_3.default.GL.uniform3fv(uniforms.Point[point_count].Position, light.Position);
                        FWGE_3.default.GL.uniform1f(uniforms.Point[point_count].Radius, light.Radius);
                        FWGE_3.default.GL.uniform1f(uniforms.Point[point_count].Angle, light.Angle);
                        point_count++;
                    }
                }
                FWGE_3.default.GL.uniform1i(uniforms.PointCount, point_count);
                // SET UNIFORM FOR NUMBER OF POINT LIGHTS
                FWGE_3.default.GL.uniformMatrix4fv(Shader_1.Shaders[i].Uniforms.Matrix.Projection, false, new Float32Array(0)); // Projection.ViewerMatrix);
            }
            FWGE_3.default.GL.useProgram(null);
        }
        CalculateNormalMatrix() {
            let mat = new Matrix4_6.default(ModelView_1.default.Peek());
            return new Matrix3_3.default(mat.Inverse());
            /*(
                mat.M11, mat.M21, mat.M31,
                mat.M12, mat.M22, mat.M32,
                mat.M13, mat.M23, mat.M33
            );*/
        }
        static Draw(vertexCount, framebuffer) {
            //FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, framebuffer);
            FWGE_3.default.GL.bindFramebuffer(FWGE_3.default.GL.FRAMEBUFFER, null);
            FWGE_3.default.GL.drawElements(FWGE_3.default.GL.TRIANGLES, vertexCount, FWGE_3.default.GL.UNSIGNED_SHORT, 0);
            FWGE_3.default.GL.bindFramebuffer(FWGE_3.default.GL.FRAMEBUFFER, null);
        }
    }
    exports.default = Renderer;
});
define("Utility/Tree", ["require", "exports", "Utility/List"], function (require, exports, List_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    List_8 = __importDefault(List_8);
    class TreeNode {
        constructor(children, value) {
            this.Value = value;
            this.Children = new List_8.default(children);
        }
    }
    exports.TreeNode = TreeNode;
    class Tree {
        constructor(size = 1) {
            this.size = size;
            this.root = null;
        }
        Add(value) {
            if (value instanceof TreeNode) {
                value = value.Value;
            }
            let node = new TreeNode(this.size, value);
            let curr = this.root;
            while (curr) {
                if (curr.Children.Length === 0) {
                    curr.Children.Add(node);
                    curr;
                }
                else {
                }
                curr = null;
            }
        }
    }
    exports.default = Tree;
});
define("Utility/BinaryTree", ["require", "exports", "Utility/Tree"], function (require, exports, Tree_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Tree_1 = __importDefault(Tree_1);
    class BinaryTree extends Tree_1.default {
        constructor() {
            super(2);
        }
    }
    exports.default = BinaryTree;
});
define("Utility/Control", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Control {
        constructor() {
            this.Running = false;
            this.AnimationFrame = -1;
        }
        Run() {
            this.AnimationFrame = window.requestAnimationFrame(this.Run);
            this.Update();
            /*if (this.Running)
            {
                PhysicsEngine.Update();
                RenderEngine.Update();
            }*/
        }
        Update() {
            /*Time.Update();
            Camera.Update();
    
            var i = GameObject.Objects.length;
            while (--i >= 0)
                GameObject.Objects[i].ObjectUpdate();
    
            Input.InputUpdate();*/
        }
        Start() {
            if (!this.Running)
                this.Running = true;
            if (this.AnimationFrame === -1)
                this.Run();
        }
        Pause() {
            if (!this.Running)
                this.Running = false;
        }
        Stop() {
            if (this.Running)
                this.Running = false;
            if (this.AnimationFrame !== -1) {
                window.cancelAnimationFrame(this.AnimationFrame);
                this.AnimationFrame = -1;
            }
            //Time.Reset();
        }
    }
    exports.default = Control;
});
define("Utility/FWGEEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FWGEEvent {
        constructor() {
        }
    }
    exports.default = FWGEEvent;
});
define("Utility/Time", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Time {
        get Delta() {
            if (this._now && this._then) {
                return (this._now - this._then);
            }
            return 0;
        }
        get RenderDelta() {
            return this.Delta / this.RenderUpdate;
        }
        get PhysicsDelta() {
            return this.Delta / this.PhysicsUpdate;
        }
        get Now() {
            return new Date(Date.now());
        }
        Update() {
            if (!this._now) {
                this._now = Date.now();
            }
            this._then = this._now;
            this._now = Date.now();
        }
    }
    exports.default = Time;
});
define("Utility/Converter/Converter", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Converter {
        static Parse() { return null; }
    }
    exports.default = Converter;
});
define("Utility/Converter/OBJConverter", ["require", "exports", "Render/Colour4", "GameObject", "Utility/List", "Render/Mesh", "Render/RenderMaterial", "Maths/Vector2", "Maths/Vector3"], function (require, exports, Colour4_2, GameObject_1, List_9, Mesh_1, RenderMaterial_1, Vector2_2, Vector3_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Colour4_2 = __importDefault(Colour4_2);
    GameObject_1 = __importDefault(GameObject_1);
    List_9 = __importDefault(List_9);
    Mesh_1 = __importStar(Mesh_1);
    RenderMaterial_1 = __importStar(RenderMaterial_1);
    Vector2_2 = __importDefault(Vector2_2);
    Vector3_7 = __importDefault(Vector3_7);
    class OBJConverter {
        static Parse(obj, mtl) {
            return new GameObject_1.default({
                mesh: OBJConverter.ParseMesh(obj),
                material: OBJConverter.ParseRenderMaterial(mtl)
            });
        }
        static ParseMesh(obj) {
            let lines = obj.split('\n');
            let vertices;
            let normals;
            let uvs;
            let face_offset = 0;
            let wireframe_offset = 0;
            let { name, position, normal, uv, colour, index, wireframe } = new Mesh_1.IMesh;
            position = new List_9.default();
            normal = new List_9.default();
            uv = new List_9.default();
            colour = new List_9.default();
            index = new List_9.default();
            wireframe = new List_9.default();
            for (var i = 0; i < lines.length; ++i) {
                let line = lines[i];
                let type = line.split(' ')[0];
                let value = line.substring(type.length).trim();
                let values = value.split(' ');
                switch (type) {
                    case 'o':
                        name = value;
                        break;
                    case 'v':
                        vertices.Add(new Vector3_7.default(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])));
                        break;
                    case 'vn':
                        normals.Add(new Vector3_7.default(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])));
                        break;
                    case 'vt':
                        uvs.Add(new Vector2_2.default(parseFloat(values[0]), parseFloat(values[1])));
                        break;
                    case 'f':
                        for (var i = 0; i < values.length; ++i) {
                            let faces = values[i].split('/').map(val => parseInt(val) - 1);
                            if (!isNaN(faces[0])) {
                                position.Add(vertices.Get(faces[0]));
                            }
                            if (!isNaN(faces[1])) {
                                uv.Add(uvs.Get(faces[1]));
                            }
                            if (!isNaN(faces[2])) {
                                normal.Add(normals.Get(faces[2]));
                            }
                            if (i >= 2) {
                                index.AddMany(face_offset, face_offset + i - 1, face_offset + i);
                            }
                        }
                        for (var i = 0; i < values.length; ++i) {
                            if (i === values.length - 1) {
                                wireframe.AddMany(wireframe_offset + i, wireframe_offset);
                            }
                            else {
                                wireframe.AddMany(wireframe_offset + i, wireframe_offset + i + 1);
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
            let { name, shininess, ambient, diffuse, specular, alpha } = new RenderMaterial_1.IRenderMaterial;
            for (var i = 0; i < lines.length; ++i) {
                var line = lines[i];
                var type = line.split(' ')[0];
                var value = line.substring(type.length).trim();
                var values = value.split(' ');
                switch (type) {
                    case 'newmtl':
                        name = value;
                        break;
                    case 'Ns':
                        shininess = parseFloat(value);
                        break;
                    case 'Ka':
                        ambient = new Colour4_2.default(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                        break;
                    case 'Kd':
                        diffuse = new Colour4_2.default(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                        break;
                    case 'Ks':
                        specular = new Colour4_2.default(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                        break;
                    case 'd':
                        alpha = parseFloat(value);
                        break;
                    case 'Tr':
                        alpha = 1 - parseFloat(value);
                        break;
                }
            }
            return new RenderMaterial_1.default({ name, shininess, ambient, diffuse, specular, alpha });
        }
    }
    exports.default = OBJConverter;
});
//# sourceMappingURL=fwge.js.map