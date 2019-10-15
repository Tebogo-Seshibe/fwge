 import Matrix4 from '../Maths/Matrix4';
import Vector3 from '../Maths/Vector3';
import Viewer, { ViewMode } from './Viewer';
import Transform from '../Transform';
import Matrix3 from '../Maths/Matrix3';

export let Cameras: Camera[] = []

export class ICamera
{
    name?: string
    position?: Vector3 | Float32Array | number[]
    target?: Vector3 | Float32Array | number[]
    up?: Vector3 | Float32Array | number[]
}

export default class Camera extends Viewer
{
    public Transform: Transform
    public Position: Vector3
    public Target: Vector3
    public Up: Vector3

    //#region Properties
    public get ProjectionMatrix(): Matrix4
    {
        switch (this.Mode)
        {
            case ViewMode.PERSPECTIVE:
                return this.Perspective

            case ViewMode.ORTHOGRAPHIC:
                return this.Orthographic

            case ViewMode.LOOKAT:
                return this.LookAt
        }
    }

    public get LookAt(): Matrix4
    {
        return Camera.LookAt(
            this.Position,
            this.Target,
            this.Up
        )
    }

    public get Orthographic(): Matrix4
    {
        return Camera.Orthographic(
            this.Left, 
            this.Right,
            this.Top,
            this.Bottom,
            this.NearClipping,
            this.FarClipping,
            this.HorizontalTilt,
            this.VericalTilt
        )
    }
    
    public get Perspective(): Matrix4
    {
        return Camera.Perspective(
            this.NearClipping,
            this.FarClipping,
            this.FieldOfView,
            this.AspectRatio
        )
    }

    public get LocationMatrix(): Matrix4
    {
        return Camera.LocationMatrix(
            this.Transform.Position,
            this.Transform.Rotation
        )
    }

    public static get Main()
    {
        return Cameras[0]
    }
    //#endregion

    constructor()
    constructor(viewer: ICamera)
    constructor({ name = 'Viewer', position = [0, 0, -10], target = [0, 0, 0], up = [0, 1, 0] }: ICamera = new ICamera)
    {
        super(name)
        this.Position = new Vector3(position as number[])
        this.Target = new Vector3(target as number[])
        this.Up = new Vector3(up as number[])

        this.Transform = new Transform()

        Cameras.push(this)
    }

    //#region Static Methods
    public static LookAt(position: Vector3, target: Vector3, up: Vector3 = new Vector3(0, 1, 0)): Matrix4
    {
        let f = position.Clone().Diff(target).Unit() // forward
        let r = up.Clone().Cross(f).Unit() // right
        let u = f.Clone().Cross(r).Unit() // up
        let p = new Vector3(r.Dot(position), u.Dot(position), f.Dot(position))

        return new Matrix4
        (
             r.X,  r.Y,  r.Z, -p.X,
             u.X,  u.Y,  u.Z, -p.Y,
             f.X,  f.Y,  f.Z, -p.Z,
               0,    0,    0,    1
        )
    }

    public static Orthographic(left: number, right: number, top: number, bottom: number, near: number, far: number, theta: number, phi: number): Matrix4
    {
        theta = Math.cot(Math.radian(theta))
        phi = Math.cot(Math.radian(phi))

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
    
    public static Perspective(near: number, far: number, fieldOfView: number, aspectRatio: number): Matrix4
    {
        let top: number = near * Math.tan(Math.radian(fieldOfView))

        let right: number = top * aspectRatio
        let left: number = -right
        let bottom: number = -top
        let width: number = right - left
        let height: number = top - bottom
        let depth: number = far - near

        return new Matrix4
        (
                  2 * near / width,                       0,                         0,  0,
                                 0,       2 * near / height,                         0,  0,
            (right + left) / width, (top + bottom) / height,     -(far + near) / depth, -1,
                                 0,                       0, -(2 * far * near) / depth,  1
        )
    }

    public static LocationMatrix(position: Vector3, rotation: Vector3): Matrix4
    {
        const x = Math.radian(rotation.X)
        const y = Math.radian(rotation.Y)
        const z = Math.radian(rotation.Z)

        let rot = new Matrix3(
            // Z rotation
            Math.cos(z), -Math.sin(z), 0,
            Math.sin(z),  Math.cos(z), 0,
                      0,            0, 1
        ).Mult(
            // Y rotation
             Math.cos(y), 0, Math.sin(y),
                       0, 1,           0,
            -Math.sin(y), 0, Math.cos(y)
        ).Mult(
            // X rotation
            1,          0,             0,
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
    //#endregion
}

new Camera()