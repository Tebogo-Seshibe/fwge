import Vector2 from '../Maths/Vector2'
import Vector3 from '../Maths/Vector3'
import Vector4 from '../Maths/Vector4'

export default class ArrayUtiils
{
    public Flatten(this: Vector4[]): number[]
    public Flatten(this: Vector3[]): number[]
    public Flatten(this: Vector2[]): number[]
    public Flatten(this: Float32Array): number[]
    public Flatten(this: Uint8Array): number[]
    public Flatten(this: number[]): number[]
    public Flatten(this: Vector4[] | Vector3[] | Vector2[]| Float32Array | Uint8Array | number[]): number[]
    {
        let flattened: number[] = new Array<number>()

        for (let list_item of this)
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