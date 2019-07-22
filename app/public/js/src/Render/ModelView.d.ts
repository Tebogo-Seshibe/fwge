import Matrix4 from '../Maths/Matrix4';
import Transform from '../Transform';
export default class ModelView {
    private static Stack;
    static Push(transform: Transform): Matrix4;
    static Peek(): Matrix4;
    static Pop(): Matrix4;
    private static Transform;
    private static Translate;
    private static Rotate;
    private static Scale;
    private static Shear;
}
