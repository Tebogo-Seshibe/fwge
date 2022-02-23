import { radian } from "../atoms/helpers/Math"
import { Matrix4 } from "../atoms/matrix/Matrix4"
import { Vector3 } from "../atoms/vector/Vector3"
import { Transform } from "../components"

export function CalcuateModelView(transform: Transform): Matrix4
{
    return Scale(transform.Scale)
        .Mult(Rotate(transform.Rotation))
        .Mult(Translate(transform.Position))
    // return Scale(
    //     Rotate(
    //         Translate(
    //             Matrix4.IDENTITY,
    //             transform.Position
    //         ), transform.Rotation
    //     ), transform.Scale)
}

export function Translate(translation: Vector3): Matrix4
{
    return new Matrix4(
                     1,              0,              0, 0,
                     0,              1,              0, 0,
                     0,              0,              1, 0,
        translation[0], translation[1], translation[2], 1
    );
}

export function Rotate(rotation: Vector3): Matrix4
{
    const x = radian(rotation[0])
    const y = radian(rotation[1])
    const z = radian(rotation[2])

    return new Matrix4
    (
        Math.cos(y) * Math.cos(z),
        Math.sin(x) * Math.sin(y) * Math.cos(z) - Math.cos(x) * Math.sin(z),
        Math.cos(x) * Math.sin(y) * Math.cos(z) + Math.sin(x) * Math.sin(z),
        0,
        
        Math.cos(y) * Math.sin(z),
        Math.sin(x) * Math.sin(y) * Math.sin(z) + Math.cos(x) * Math.cos(z),
        Math.cos(x) * Math.sin(y) * Math.sin(z) - Math.sin(x) * Math.cos(z),
        0,
        
        -Math.sin(y),
        Math.sin(x) * Math.cos(y),
        Math.cos(x) * Math.cos(y),
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

export function Scale(scalers: Vector3): Matrix4
{                    
    return new Matrix4
    (
        scalers[0],          0,          0, 0,
                 0, scalers[1],          0, 0,
                 0,          0, scalers[2], 0,
                 0,          0,          0, 1
    )
}

export function Shear(angles: Vector3): Matrix4
{
    var phi   = radian(angles[0])
    var theta = radian(angles[1])
    var rho   = radian(angles[2])

    return new Matrix4
    (
                  1.0,             0.0, Math.tan(rho), 0.0,
        Math.tan(phi),             1.0,           0.0, 0.0,
                  0.0, Math.tan(theta),           1.0, 0.0,
                  0.0,             0.0,           0.0, 1.0
    )
}
