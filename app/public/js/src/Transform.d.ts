import Vector3 from './Maths/Vector3';
export declare class ITransform {
    position?: Vector3 | Float32Array | Array<number>;
    rotation?: Vector3 | Float32Array | Array<number>;
    scale?: Vector3 | Float32Array | Array<number>;
    shear?: Vector3 | Float32Array | Array<number>;
}
export default class Transform {
    Position: Vector3;
    Rotation: Vector3;
    Scale: Vector3;
    Shear: Vector3;
    constructor({ position, rotation, scale, shear }?: ITransform);
    static readonly UP: Vector3;
    static readonly FORWARD: Vector3;
    static readonly RIGHT: Vector3;
}
