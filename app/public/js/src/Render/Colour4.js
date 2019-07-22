import Maths from '../Maths/Maths';
export default class Colour4 extends Float32Array {
    get R() {
        return this[0];
    }
    set R(red) {
        this[0] = Maths.CleanFloat(Maths.Clamp(red, 0, 1));
    }
    get G() {
        return this[1];
    }
    set G(green) {
        this[1] = Maths.CleanFloat(Maths.Clamp(green, 0, 1));
    }
    get B() {
        return this[2];
    }
    set B(blue) {
        this[2] = Maths.CleanFloat(Maths.Clamp(blue, 0, 1));
    }
    get A() {
        return this[3];
    }
    set A(alpha) {
        this[3] = Maths.CleanFloat(Maths.Clamp(alpha, 0, 1));
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
//# sourceMappingURL=Colour4.js.map