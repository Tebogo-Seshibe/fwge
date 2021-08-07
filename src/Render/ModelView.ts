import Matrix4 from '../Maths/Matrix4';
import Vector3 from '../Maths/Vector3';
import Transform from '../Object/Transform';
import Stack from '../Utility/Stack';
import { radian } from '../Maths/Math';

export default class ModelView
{
    private MVStack: Stack<Matrix4> = new Stack<Matrix4>()

    public Push(transform: Transform): Matrix4
    {
        this.MVStack.Push(
            ModelView.Scale(
                ModelView.Rotate(
                    ModelView.Translate(
                        this.Peek(),
                        transform.Position
                    ),
                    transform.Rotation
                ),
                transform.Scale
            )
        )
            
        return this.Peek()
    }
        
    public Peek(): Matrix4
    {
        let mat = this.MVStack.Peek()
        if (!mat)
        {
            return Matrix4.IDENTITY
        }

        return mat
    }
    
    public Pop(): Matrix4
    {
        let mat = this.MVStack.Pop()
        if (!mat)
        {
            return Matrix4.IDENTITY
        }

        return mat
    }
        
    public static Translate(matrix: Matrix4, translation: Vector3): Matrix4
    {
        return new Matrix4
        (
            matrix.M11, matrix.M12, matrix.M13, matrix.M14,
            matrix.M21, matrix.M22, matrix.M23, matrix.M24,
            matrix.M31, matrix.M32, matrix.M33, matrix.M34,

            matrix.M11 * translation.X + matrix.M21 * translation.Y + matrix.M31 * translation.Z + matrix.M41,
            matrix.M12 * translation.X + matrix.M22 * translation.Y + matrix.M32 * translation.Z + matrix.M42,
            matrix.M13 * translation.X + matrix.M23 * translation.Y + matrix.M33 * translation.Z + matrix.M43,
            matrix.M14 * translation.X + matrix.M24 * translation.Y + matrix.M34 * translation.Z + matrix.M44
        );
    }
    
    public static Rotate(matrix: Matrix4, rotation: Vector3): Matrix4
    {
        let x = radian(rotation.X)
        let y = radian(rotation.Y)
        let z = radian(rotation.Z)

        return new Matrix4
        (
            Math.cos(z), -Math.sin(z), 0.0, 0.0,
            Math.sin(z),  Math.cos(z), 0.0, 0.0,
                    0.0,          0.0, 1.0, 0.0,
                    0.0,          0.0, 0.0, 1.0
        ).Mult(
            Math.cos(y), 0.0, Math.sin(y), 0.0,
                    0.0, 1.0,         0.0, 0.0,
            -Math.sin(y), 0.0, Math.cos(y), 0.0,
                    0.0, 0.0,         0.0, 1.0
        ).Mult(
            1.0,         0.0,          0.0, 0.0,
            0.0, Math.cos(x), -Math.sin(x), 0.0,
            0.0, Math.sin(x),  Math.cos(x), 0.0,
            0.0,         0.0,          0.0, 1.0
        ).Mult(matrix)
    }

    public static Scale(matrix: Matrix4, scalers: Vector3): Matrix4
    {                    
        return new Matrix4
        (
            matrix.M11 * scalers.X, matrix.M12 * scalers.X, matrix.M13 * scalers.X, matrix.M14 * scalers.X,
            matrix.M21 * scalers.Y, matrix.M22 * scalers.Y, matrix.M23 * scalers.Y, matrix.M24 * scalers.Y,
            matrix.M31 * scalers.Z, matrix.M32 * scalers.Z, matrix.M33 * scalers.Z, matrix.M34 * scalers.Z,
                        matrix.M41,             matrix.M42,             matrix.M43,             matrix.M44
        )
    }
    
    public static Shear(matrix: Matrix4, angles: Vector3): Matrix4
    {
        var phi = radian(angles.X)
        var theta = radian(angles.Y)
        var rho = radian(angles.Z)

        return new Matrix4
        (
                      1.0,             0.0, Math.tan(rho), 0.0,
            Math.tan(phi),             1.0,           0.0, 0.0,
                      0.0, Math.tan(theta),           1.0, 0.0,
                      0.0,             0.0,           0.0, 1.0
        ).Mult(matrix)
    }
}
