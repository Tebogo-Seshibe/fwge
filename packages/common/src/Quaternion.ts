import { NumberArray } from "./types"
import { Vector3, Vector4 } from "./vector"

export class Quaternion extends Float32Array
{
    //#region Local Properties
    get X(): number
    {
        return this[0]
    }

    set X(x: number)
    {
        this[0] = x
    }

    get Y(): number
    {
        return this[1]
    }

    set Y(y: number)
    {
        this[1] = y
    }

    get Z(): number
    {
        return this[2]
    }

    set Z(z: number)
    {
        this[2] = z
    }

    get W(): number
    {
        return this[3]
    }

    set W(w: number)
    {
        this[3] = w
    }
    //#endregion

    constructor()
    constructor(xyzw: number)
    constructor(x: number, y: number, z: number, w: number)
    constructor(quaternion: Quaternion)
    constructor(vector: Vector4)
    constructor(vector: Vector3, w: number)
    constructor(array: NumberArray)
    constructor(_0: Quaternion | Vector4 | Vector3 | NumberArray | number = 0, _1: number = 0, _2?: number, _3?: number)
    {
        super(typeof _0 === 'number' ?
        [
            _0,
            _1 !== undefined ? _1 : _0,
            _2 !== undefined ? _2 : _0,
            _3 !== undefined ? _3 : _0
        ] : _0 instanceof Vector3 ?
        [
            _0[0], _0[1], _0[2], _1
        ] : _0)
    }

    //#region Local Methods
    //#endregion

    //#region Static Properties
    static get Zero(): Quaternion
    {
        return new Quaternion(0, 0, 0, 0)
    }

    static get Identity(): Quaternion
    {
        return new Quaternion(0, 0, 0, 1)
    }
    //#endregion

    //#region Static Methods
    //#endregion
}
