import List from './List'
import Vector2 from '../Maths/Vector2'
import Vector3 from '../Maths/Vector3'
import Vector4 from '../Maths/Vector4'

export default class ListUtiils
{
    public static FlattenVector(list: List<Vector2>): List<number>
    public static FlattenVector(list: List<Vector3>): List<number>
    public static FlattenVector(list: List<Vector4>): List<number>
    public static FlattenVector(list: List<Vector4> | List<Vector3> | List<Vector2>): List<number>
    {
        let flattened: List<number> = new List<number>()

        for (let list_item of list)
        {
            flattened.AddMany(...list_item)
        }

        return flattened
    }
}