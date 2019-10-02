import Vector2 from '../Maths/Vector2';
import Vector3 from '../Maths/Vector3';
import Vector4 from '../Maths/Vector4';

export default class ArrayUtils
{
    public static Flatten(vector: Vector4[]): number[]
    public static Flatten(vector: Vector3[]): number[]
    public static Flatten(vector: Vector2[]): number[]
    public static Flatten(array: Float32Array): number[]
    public static Flatten(array: Uint8Array): number[]
    public static Flatten(array: number[]): number[]
    public static Flatten(data: Vector4[] | Vector3[] | Vector2[]| Float32Array | Uint8Array | number[]): number[]
    public static Flatten(data: Vector4[] | Vector3[] | Vector2[]| Float32Array | Uint8Array | number[]): number[]
    {
        let flattened: number[] = new Array<number>()

        for (let list_item of data)
        {
            if (typeof list_item === 'number')
            {
                flattened.push(list_item)
            }
            else
            {
                flattened.unshift(...list_item)
            }
        }

        return flattened
    }
}