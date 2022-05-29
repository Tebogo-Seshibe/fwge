import { Matrix4 } from "../matrix"
import { Vector3 } from "../vector"
import { radian } from "./Math"

export function CalcuateModelView(matrix: Matrix4, translation: Vector3, rotation: Vector3, scale: Vector3): void
{
    Scale(matrix, scale)
    Rotate(matrix, rotation)
    Translate(matrix, translation)
}

export function Translate(matrix: Matrix4, translation: Vector3): void
{
    matrix[12] += translation[0]
    matrix[13] += translation[1]
    matrix[14] += translation[2]
}

export function Rotation(rotation: Vector3): Matrix4
{
    const matrix = Matrix4.IDENTITY

    const x = radian(rotation[0])
    const y = radian(rotation[1])
    const z = radian(rotation[2])

    const sin_x = Math.sin(x)
    const sin_y = Math.sin(y)
    const sin_z = Math.sin(z)

    const cos_x = Math.cos(x)
    const cos_y = Math.cos(y)
    const cos_z = Math.cos(z)
    
    const rot_0  = cos_y * cos_z
    const rot_1  = sin_x * sin_y * cos_z - cos_x * sin_z
    const rot_2  = cos_x * sin_y * cos_z + sin_x * sin_z
    const rot_4  = cos_y * sin_z
    const rot_5  = sin_x * sin_y * sin_z + cos_x * cos_z
    const rot_6  = cos_x * sin_y * sin_z - sin_x * cos_z
    const rot_8  = -sin_y
    const rot_9  = sin_x * cos_y
    const rot_10 = cos_x * cos_y

    const m0  = matrix[0]  * rot_0 + matrix[1]  * rot_4 + matrix[2]  * rot_8
    const m1  = matrix[0]  * rot_1 + matrix[1]  * rot_5 + matrix[2]  * rot_9
    const m2  = matrix[0]  * rot_2 + matrix[1]  * rot_6 + matrix[2]  * rot_10
    const m4  = matrix[4]  * rot_0 + matrix[5]  * rot_4 + matrix[6]  * rot_8
    const m5  = matrix[4]  * rot_1 + matrix[5]  * rot_5 + matrix[6]  * rot_9
    const m6  = matrix[4]  * rot_2 + matrix[5]  * rot_6 + matrix[6]  * rot_10
    const m8  = matrix[8]  * rot_0 + matrix[9]  * rot_4 + matrix[10] * rot_8
    const m9  = matrix[8]  * rot_1 + matrix[9]  * rot_5 + matrix[10] * rot_9
    const m10 = matrix[8]  * rot_2 + matrix[9]  * rot_6 + matrix[10] * rot_10
    const m12 = matrix[12] * rot_0 + matrix[13] * rot_4 + matrix[14] * rot_8
    const m13 = matrix[12] * rot_1 + matrix[13] * rot_5 + matrix[14] * rot_9
    const m14 = matrix[12] * rot_2 + matrix[13] * rot_6 + matrix[14] * rot_10

    matrix[0]  = m0
    matrix[1]  = m1
    matrix[2]  = m2
    matrix[4]  = m4
    matrix[5]  = m5
    matrix[6]  = m6
    matrix[8]  = m8
    matrix[9]  = m9
    matrix[10] = m10
    matrix[12] = m12
    matrix[13] = m13
    matrix[14] = m14

    return matrix
}

export function Rotate(matrix: Matrix4, rotation: Vector3): void
{
    const x = radian(rotation[0])
    const y = radian(rotation[1])
    const z = radian(rotation[2])

    const sin_x = Math.sin(x)
    const sin_y = Math.sin(y)
    const sin_z = Math.sin(z)

    const cos_x = Math.cos(x)
    const cos_y = Math.cos(y)
    const cos_z = Math.cos(z)
    
    const rot_0  = cos_y * cos_z
    const rot_1  = sin_x * sin_y * cos_z - cos_x * sin_z
    const rot_2  = cos_x * sin_y * cos_z + sin_x * sin_z
    const rot_4  = cos_y * sin_z
    const rot_5  = sin_x * sin_y * sin_z + cos_x * cos_z
    const rot_6  = cos_x * sin_y * sin_z - sin_x * cos_z
    const rot_8  = -sin_y
    const rot_9  = sin_x * cos_y
    const rot_10 = cos_x * cos_y

    const m0  = matrix[0]  * rot_0 + matrix[1]  * rot_4 + matrix[2]  * rot_8
    const m1  = matrix[0]  * rot_1 + matrix[1]  * rot_5 + matrix[2]  * rot_9
    const m2  = matrix[0]  * rot_2 + matrix[1]  * rot_6 + matrix[2]  * rot_10
    const m4  = matrix[4]  * rot_0 + matrix[5]  * rot_4 + matrix[6]  * rot_8
    const m5  = matrix[4]  * rot_1 + matrix[5]  * rot_5 + matrix[6]  * rot_9
    const m6  = matrix[4]  * rot_2 + matrix[5]  * rot_6 + matrix[6]  * rot_10
    const m8  = matrix[8]  * rot_0 + matrix[9]  * rot_4 + matrix[10] * rot_8
    const m9  = matrix[8]  * rot_1 + matrix[9]  * rot_5 + matrix[10] * rot_9
    const m10 = matrix[8]  * rot_2 + matrix[9]  * rot_6 + matrix[10] * rot_10
    const m12 = matrix[12] * rot_0 + matrix[13] * rot_4 + matrix[14] * rot_8
    const m13 = matrix[12] * rot_1 + matrix[13] * rot_5 + matrix[14] * rot_9
    const m14 = matrix[12] * rot_2 + matrix[13] * rot_6 + matrix[14] * rot_10

    matrix[0]  = m0
    matrix[1]  = m1
    matrix[2]  = m2
    matrix[4]  = m4
    matrix[5]  = m5
    matrix[6]  = m6
    matrix[8]  = m8
    matrix[9]  = m9
    matrix[10] = m10
    matrix[12] = m12
    matrix[13] = m13
    matrix[14] = m14
    // matrix.Mult
    // (
    //     /*  rot_0 */ cos_y * cos_z,
    //     /*  rot_1 */ sin_x * sin_y * cos_z - cos_x * sin_z,
    //     /*  rot_2 */ cos_x * sin_y * cos_z + sin_x * sin_z,
    //     0,
        
    //     /*  rot_4 */ cos_y * sin_z,
    //     /*  rot_5 */ sin_x * sin_y * sin_z + cos_x * cos_z,
    //     /*  rot_6 */ cos_x * sin_y * sin_z - sin_x * cos_z,
    //     0,
        
    //     /*  rot_8 */ -sin_y,
    //     /*  rot_9 */ sin_x * cos_y,
    //     /* rot_10 */ cos_x * cos_y,
    //     0,
        
    //     0,
    //     0,
    //     0,
    //     1        
    // )
}

export function RotateX(angle: number): Matrix4
{
    const x = radian(angle)

    return new Matrix4
    (
                 1.0,          0.0,          0.0,          0.0,
                 0.0,  Math.cos(x), -Math.sin(x),          0.0,
                 0.0,  Math.sin(x),  Math.cos(x),          0.0,
                 0.0,         0.0,           0.0,          1.0
    )
}

export function RotateY(angle: number): Matrix4
{
    const y = radian(angle)

    return new Matrix4
    (
         Math.cos(y),          0.0,  Math.sin(y),          0.0,
                 0.0,          1.0,          0.0,          0.0,
        -Math.sin(y),          0.0,  Math.cos(y),          0.0,
                 0.0,          0.0,          0.0,          1.0
    )
}

export function RotateZ(angle: number): Matrix4
{
    const z = radian(angle)

    return new Matrix4
    (
         Math.cos(z), -Math.sin(z),          0.0,          0.0,
         Math.sin(z),  Math.cos(z),          0.0,          0.0,
                 0.0,          0.0,          1.0,          0.0,
                 0.0,          0.0,          0.0,          1.0
    )
}

export function Scale(matrix: Matrix4, scalers: Vector3): void
{
    matrix[0]  *= scalers[0]
    matrix[5]  *= scalers[1]
    matrix[10] *= scalers[2]
}

export function Shear(matrix: Matrix4, angles: Vector3): void
{
    var phi   = radian(angles[0])
    var theta = radian(angles[1])
    var rho   = radian(angles[2])

    matrix.Mult
    (
                  1.0,             0.0, Math.tan(rho), 0.0,
        Math.tan(phi),             1.0,           0.0, 0.0,
                  0.0, Math.tan(theta),           1.0, 0.0,
                  0.0,             0.0,           0.0, 1.0
    )
}

