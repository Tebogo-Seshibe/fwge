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
        translation.X, translation.Y, translation.Z, 1
    );
}

export function Rotate(matrix: Matrix4, rotation: Vector3): void
{
    const x = radian(rotation.X)
    const y = radian(rotation.Y)
    const z = radian(rotation.Z)

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
        scalers.X,          0,          0, 0,
                 0, scalers.Y,          0, 0,
                 0,          0, scalers.Z, 0,
                 0,          0,          0, 1
    )
}

export function Shear(matrix: Matrix4, angles: Vector3): void
{
    var phi   = radian(angles.X)
    var theta = radian(angles.Y)
    var rho   = radian(angles.Z)

    matrix.Mult
    (
                  1.0,             0.0, Math.tan(rho), 0.0,
        Math.tan(phi),             1.0,           0.0, 0.0,
                  0.0, Math.tan(theta),           1.0, 0.0,
                  0.0,             0.0,           0.0, 1.0
    )
}
