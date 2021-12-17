import { cot, radian } from "../atoms/helpers/Math"
import { Matrix3, Matrix4 } from "../atoms/matrix"
import { Vector3 } from "../atoms/vector"


export function LookAt(position: Vector3, target: Vector3, up: Vector3): Matrix4
{
    const f = target.Clone().Diff(position).Unit()
    const r = up.Clone().Cross(f).Unit()
    const u = f.Clone().Cross(r).Unit()
    const p = position.Clone() // origin
    
    return new Matrix4
    (
        r.X, u.X, f.X, p.X,
        r.Y, u.Y, f.Y, p.Y,
        r.Z, u.Z, f.Z, p.Z,
          0,   0,   0,   1
    ).Transpose().Inverse()
}

export function Orthographic(left: number, right: number, top: number, bottom: number, near: number, far: number, theta: number, phi: number): Matrix4
{
    theta = cot(radian(theta))
    phi = cot(radian(phi))

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
    )
}

export function Perspective(near: number, far: number, fieldOfView: number, aspectRatio: number): Matrix4
{
    const top       = near * Math.tan(radian(fieldOfView))
    const right     = top * aspectRatio
    const left      = -right
    const bottom    = -top
    const width     = right - left
    const height    = top - bottom
    const depth     = far - near

    return new Matrix4
    (
              2 * near / width,                        0,                         0,  0,
                             0,        2 * near / height,                         0,  0,
        (right + left) / width,  (top + bottom) / height,     -(far + near) / depth, -1,
                             0,                        0, -(2 * far * near) / depth,  1
    )
}

export function LocationMatrix(position: Vector3, rotation: Vector3): Matrix4
{
    const x = radian(rotation.X)
    const y = radian(rotation.Y)
    const z = radian(rotation.Z)

    let rot = new Matrix3(
        Math.cos(z), -Math.sin(z), 0,
        Math.sin(z),  Math.cos(z), 0,
                  0,            0, 1
    ).Mult(
         Math.cos(y), 0, Math.sin(y),
                   0, 1,           0,
        -Math.sin(y), 0, Math.cos(y)
    ).Mult(
        1,           0,            0,
        0, Math.cos(x), -Math.sin(x),
        0, Math.sin(x),  Math.cos(x)
    ).Inverse()

    return new Matrix4
    (
        rot.M11, rot.M12, rot.M13, position.X,
        rot.M21, rot.M22, rot.M23, position.Y,
        rot.M31, rot.M32, rot.M33, position.Z,
              0,       0,       0,          1
    )
}