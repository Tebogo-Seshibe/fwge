import Vector2 from '../Maths/Vector2';
import Vector3 from '../Maths/Vector3';
import Vector4 from '../Maths/Vector4';
export default class ArrayUtiils {
    static Flatten(list: Array<Vector4> | Array<Vector3> | Array<Vector2> | Float32Array | Uint8Array | Array<number>): Array<number>;
}
