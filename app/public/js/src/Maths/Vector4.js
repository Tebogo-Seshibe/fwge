import List from '../Utility/List';
import Maths from './Maths';
import Vector2 from './Vector2';
import Vector3 from './Vector3';
export default class Vector4 extends Float32Array {
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
        this[0] = Maths.CleanFloat(w);
    }
    get X() {
        return this[1];
    }
    set X(x) {
        this[1] = Maths.CleanFloat(x);
    }
    get Y() {
        return this[2];
    }
    set Y(y) {
        this[2] = Maths.CleanFloat(y);
    }
    get Z() {
        return this[3];
    }
    set Z(z) {
        this[3] = Maths.CleanFloat(z);
    }
    get Length() {
        return Vector4.Length(this);
    }
    static Length(w, x, y, z) {
        if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array || w instanceof List) {
            [w, x, y, z] = w;
        }
        return Maths.CleanFloat(Math.sqrt(Math.pow(w, 2) + Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)));
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
        if (w instanceof Vector2) {
            [w, x, y, z] = [0, w.X, w.Y, 0];
        }
        else if (w instanceof Vector3) {
            [w, x, y, z] = [0, w.X, w.Y, w.Z];
        }
        else if (w instanceof Vector4 || w instanceof Float32Array || w instanceof Array || w instanceof List) {
            [w, x, y, z] = w;
        }
        vector.W = Maths.CleanFloat(w);
        vector.X = Maths.CleanFloat(x);
        vector.Y = Maths.CleanFloat(y);
        vector.Z = Maths.CleanFloat(z);
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
//# sourceMappingURL=Vector4.js.map