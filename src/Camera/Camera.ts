import Updateable from '../Interfaces/Updateable';
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

export default class Camera extends Viewer implements Updateable
{
    public Position: Vector3 = new Vector3(0, 0, -10)
    public Target: Vector3 = new Vector3(0, 0, 0)
    public Up: Vector3 = new Vector3(0, 1, 0)

    public get ProjectionMatrix(): Matrix4
    {
        switch (this.Mode)
        {
            case ViewMode.PERSPECTIVE:
                return this.Perspective

            case ViewMode.ORTHOGRAPHIC:
                return this.Orthographic
        }
    }

    public get LookAt(): Matrix4
    {
        let n = this.Position.Clone().Diff(this.Target).Unit()
        let u = this.Up.Clone().Cross(n).Unit()
        let v = n.Clone().Cross(u).Unit()
        let p = this.Position

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

    public get Orthographic(): Matrix4
    {
        let near: number = this.NearClipping
        let far: number = this.FarClipping

        let theta: number = Math.cot(Math.radian(this.HorizontalTilt))
        let phi: number = Math.cot(Math.radian(this.VericalTilt))

        let left: number = this.Left - (near * theta)
        let right: number = this.Right - (near * theta)
        let top: number = this.Top - (near * phi)
        let bottom: number = this.Bottom - (near * phi)

        return new Matrix4
        (
                          2 / (right - left),                                0,                            0, 0,
                                           0,               2 / (top - bottom),                            0, 0,
                                       theta,                              phi,            -2 / (far - near), 0,
            -(left + right) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
        )
    }
    
    public get Perspective(): Matrix4
    {
        let near: number = this.NearClipping
        let far: number = this.FarClipping

        let top: number = near * Math.tan(Math.radian(this.FieldOfView))
        let right: number = top * this.AspectRatio
        
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

    public static get Main()
    {
        return Cameras[0]
    }

    constructor()
    constructor(viewer: ICamera)
    constructor({ name = 'Viewer', position, target, up }: ICamera = new ICamera)
    {
        super(name)
        
        if (position)
        {
            this.Position = new Vector3(position as number[])
        }

        if (target)
        {
            this.Target = new Vector3(target as number[])
        }

        if (up)
        {
            this.Up = new Vector3(up as number[])
        }        

        Cameras.push(this)
    }        

    public Update(): void
    {
    }
    //#endregion
}

new Camera()