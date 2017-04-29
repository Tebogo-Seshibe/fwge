/**
 * @name Colour
 * @description This module is used to create simple 3 valued arrays
 *              representing the rgb values of colours.
 * @module      FWGE.Render
 */
export class Colour
{
    public Buffer: Float32Array;
    get R(): number  { return this.Buffer[0]; }
    set R(r: number) { this.Buffer[0] = Maths.Clamp(r, 0, 1); }
    get G(): number  { return this.Buffer[1]; }
    set G(g: number) { this.Buffer[1] = Maths.Clamp(g, 0, 1); }
    get B(): number  { return this.Buffer[2]; }
    set B(b: number) { this.Buffer[2] = Maths.Clamp(b, 0, 1); }
    get A(): number  { return this.Buffer[3]; }
    set A(a: number) { this.Buffer[3] = Maths.Clamp(a, 0, 1); }

    get BIN():      string { return `(${this.R.toString(2) }, ${this.G.toString(2) }, ${this.B.toString(2) }, ${this.A.toString(2) })`; }
    get OCT():      string { return `(${this.R.toString(8) }, ${this.G.toString(8) }, ${this.B.toString(8) }, ${this.A.toString(8) })`; }
    get HEX():      string { return `(${this.R.toString(16)}, ${this.G.toString(16)}, ${this.B.toString(16)}, ${this.A.toString(16)})`; }
    get DEC():      string { return `(${this.R},              ${this.G},              ${this.B},              ${this.A})`; }
    get FLOAT():    string { return `(${this.R * 255},        ${this.G * 255},        ${this.B * 255},        ${this.A * 255})`; }

    public toString(): string { return this.FLOAT; }

    public static GetArgs(args: any[]): number[]
    {
        args = args[0];
        if (args instanceof Colour)
            return [args.R, args.G, args.B, args.A];
        else if ((args instanceof Float32Array && args.length >= 4) || 
                    (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number" && typeof args[3] === "number"))
            return args;

        return [0, 0, 0, 0];
    }

    /**
     * @function    Create: {Float32Array}
     * @description Creates a new Float32Array array. These arrays have R,G, and B accessors.
     * @param       {Float32Array}  [nullable, override 1]
     * @param       {Number}        [nullable, override 2]
     * @param       {Number}        [nullable, override 2]
     * @param       {Number}        [nullable, override 2]
     */
    constructor()
    {
        this.Buffer = new Float32Array(4);
    }

    Set(colour: Colour): Colour;
    Set(array: Float32Array): Colour;
    Set(array: number[]): Colour;
    Set(r: number, g: number, b: number, a: number): Colour;
    Set(...args: any[]): Colour
    {
        let [r, b, g, a] = Colour.GetArgs(args);

        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;

        return this;
    }
}
