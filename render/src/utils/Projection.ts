import { cot, radian, Matrix3, Matrix4, Vector3 } from "@fwge/common"

export function LookAt(position: Vector3, target: Vector3, up: Vector3): Matrix4
{
    const XAxis: Vector3 = new Vector3(1, 0, 0)
    const YAxis: Vector3 = new Vector3(0, 1, 0)
    const ZAxis: Vector3 = new Vector3(0, 0, 1)
    const Eye: Vector3 = target.Clone().Scale(-1)

    const f = target.Clone().Diff(position).Normalize()
    const r = up.Clone().Cross(f).Normalize()
    const u = f.Clone().Cross(r).Normalize()
    const p = position.Clone()
    
    // return new Matrix4
    // (
    //     r.X, u.X, f.X, p.X,
    //     r.Y, u.Y, f.Y, p.Y,
    //     r.Z, u.Z, f.Z, p.Z,
    //       0,   0,   0,   1
    // )

    return new Matrix4
    (
              XAxis[0],          YAxis[0],          ZAxis[0], 0,
              XAxis[1],          YAxis[1],          ZAxis[1], 0,
              XAxis[2],          YAxis[2],          ZAxis[2], 0,
        XAxis.Dot(Eye),    XAxis.Dot(Eye),    XAxis.Dot(Eye), 1
    )
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
    const top       = near * Math.tan(radian(fieldOfView) / 2)
    const right     = top * aspectRatio
    const depth     = far - near

    return new Matrix4
    (
        near / right,          0,                         0,  0,
                   0, near / top,                         0,  0,
                   0,          0,     -(far + near) / depth, -1,
                   0,          0, -(2 * far * near) / depth,  0
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