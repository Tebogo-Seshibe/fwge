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
    matrix.Mult(
                     1,              0,              0, 0,
                     0,              1,              0, 0,
                     0,              0,              1, 0,
        translation[0], translation[1], translation[2], 1
    );
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
    
    matrix.Mult
    (
        cos_y * cos_z,
        sin_x * sin_y * cos_z - cos_x * sin_z,
        cos_x * sin_y * cos_z + sin_x * sin_z,
        0,
        
        cos_y * sin_z,
        sin_x * sin_y * sin_z + cos_x * cos_z,
        cos_x * sin_y * sin_z - sin_x * cos_z,
        0,
        
        -sin_y,
        sin_x * cos_y,
        cos_x * cos_y,
        0,
        
        0,
        0,
        0,
        1        
    )
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
    matrix.Mult
    (
        scalers[0],          0,          0, 0,
                 0, scalers[1],          0, 0,
                 0,          0, scalers[2], 0,
                 0,          0,          0, 1
    )
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
