import Maths from '../Maths/Maths'
import Matrix4 from '../Maths/Matrix4'

export default class Projection
{
    public static Orthographic(left: number, right: number, top: number, bottom: number, near: number, far: number, theta: number, phi: number): Matrix4
    {
        theta = Maths.Cot(Maths.Radian(theta))
        phi = Maths.Cot(Maths.Radian(phi))
        left -= near * theta
        right -= near * theta
        top -= near * phi
        bottom -= near * phi

        return new Matrix4
        (
                            2 / (right - left),                                0,                            0, 0,
                                            0,               2 / (top - bottom),                            0, 0,
                                        theta,                              phi,            -2 / (far - near), 0,
            -(left + right) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
        );
        
    }
    
    public static Perspective(field_of_view: number, aspect_ratio: number, near: number, far: number): Matrix4
    {
        let top = near * Math.tan(Maths.Radian(field_of_view))
        let right = top * aspect_ratio
        let left = -right
        let bottom = -top
        let width = right - left
        let height = top - bottom
        let depth = far - near

        return new Matrix4
        (
                    2 * near / width,                       0,                         0,  0,
                                    0,       2 * near / height,                         0,  0,
            (right + left) / width, (top + bottom) / height,     -(far + near) / depth, -1,
                                    0,                       0, -(2 * far * near) / depth,  1
        );
    }
}