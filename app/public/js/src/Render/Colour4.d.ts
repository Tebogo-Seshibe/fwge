export default class Colour4 extends Float32Array {
    R: number;
    G: number;
    B: number;
    A: number;
    readonly BIN: string;
    readonly OCT: string;
    readonly DEC: string;
    readonly HEX: string;
    constructor();
    constructor(hex: string);
    constructor(colour: Colour4 | Float32Array | number[]);
    constructor(r: number, g: number, b: number, a: number);
    Set(r?: Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number): Colour4;
    static Set(colour: Colour4, r?: Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number): Colour4;
    static FromBin(bin: string): Colour4;
    static ToBin(bin: Colour4 | Float32Array | Array<number>): string;
    static FromOct(oct: string): Colour4;
    static ToOct(oct: Colour4 | Float32Array | Array<number>): string;
    static FromHex(hex: string): Colour4;
    static ToHex(hex: Colour4 | Float32Array | Array<number>): string;
}
