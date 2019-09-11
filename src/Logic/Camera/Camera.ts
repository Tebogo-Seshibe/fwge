import Matrix4 from '../Maths/Matrix4';
import Vector3 from '../Maths/Vector3';
import Viewer, { ViewMode } from './Viewer';

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

        Cameras.push(this)
    }

    //#region Static Methods
    public static LookAt(position: Vector3, target: Vector3, up: Vector3 = new Vector3(0, 1, 0)): Matrix4
    {
        let n = Vector3.Diff(position, target).Unit()
        let u = Vector3.Cross(up, n).Unit()
        let v = Vector3.Cross(n, u).Unit()
        let p = position

        return new Matrix4(
            v.X, v.Y, v.Z, 0.0,
            u.X, u.Y, u.Z, 0.0,
            n.X, n.Y, n.Z, 0.0,
            0.0, 0.0, 0.0, 1.0
        ).Mult(
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            p.X, p.Y, p.Z, 1.0
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
    //#endregion
}

new Camera()