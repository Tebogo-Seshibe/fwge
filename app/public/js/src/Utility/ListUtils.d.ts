import List from './List';
import Vector2 from '../Maths/Vector2';
import Vector3 from '../Maths/Vector3';
import Vector4 from '../Maths/Vector4';
export default class ListUtiils {
    static FlattenVector(list: List<Vector2>): List<number>;
    static FlattenVector(list: List<Vector3>): List<number>;
    static FlattenVector(list: List<Vector4>): List<number>;
}
