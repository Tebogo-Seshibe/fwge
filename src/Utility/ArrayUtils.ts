import List from './List'
import Vector2 from '../Maths/Vector2'
import Vector3 from '../Maths/Vector3'
import Vector4 from '../Maths/Vector4'

export default class ArrayUtiils
{
    public static FlattenVector(list: Array<Vector2>): Array<number>
    public static FlattenVector(list: Array<Vector3>): Array<number>
    public static FlattenVector(list: Array<Vector4>): Array<number>
    public static FlattenVector(list: Array<Vector4> | Array<Vector3> | Array<Vector2>): Array<number>
    {
        let flattened: Array<number> = new Array<number>()

        for (let list_item of list)
        {
            flattened.unshift(...list_item)
        }

        return flattened
    }
}