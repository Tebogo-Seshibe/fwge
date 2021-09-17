import Vector2 from '../maths/Vector2'
import Vector3 from '../maths/Vector3'
import Vector4 from '../maths/Vector4'
import List from './List'

export default class ListUtiils
{
    public static FlattenVector(list: List<Vector2>): List<number>
    public static FlattenVector(list: List<Vector3>): List<number>
    public static FlattenVector(list: List<Vector4>): List<number>
    public static FlattenVector(list: List<Vector4> | List<Vector3> | List<Vector2>): List<number>
    {
        let flattened: List<number> = new List<number>()

        // for (let list_item of list)
        // {
        //     flattened.AddMany(...list_item)
        // }

        return flattened
    }
}