import { GL } from '../FWGE';
import Updateable from '../Interfaces/Updateable';
import Matrix4 from '../Maths/Matrix4';
import Vector3 from '../Maths/Vector3';
import Viewer, { ViewMode } from './Viewer';

export let Cameras: Camera[] = []

export class ICamera
{
    name?: string
    mode?: ViewMode
    fieldOfView?: number
    aspectRatio?: number
    nearClipping?: number
    farClipping?: number
    left?: number
    right?: number
    top?: number
    bottom?: number
    horizontalTilt?: number
    vericalTilt?: number

    position?: Vector3 | [number, number, number]
    target?: Vector3 | [number, number, number]
    up?: Vector3 | [number, number, number]
}

export default class Camera extends Viewer implements Updateable
{
    public Position: Vector3
    public Target: Vector3
    private Up: Vector3 = new Vector3(0, 1, 0)
    private Matrix: Matrix4 = Matrix4.IDENTITY

    public get ViewMatrix(): Matrix4
    {
        return this.Matrix.Clone()
    }

    public static get Main()
    {
        return Cameras[0]
    }

    constructor()
    constructor(viewer: ICamera)
    constructor(
    {
        name = 'Viewer', 
        mode, fieldOfView,
        aspectRatio,
        nearClipping,
        farClipping,
        left,
        right,
        top,
        bottom,
        horizontalTilt = 0,
        vericalTilt = 0,
        position = [0, 0, -10],
        target = [0, 0, 0],
        up = [0, 1, 0] 
    }: ICamera = new ICamera)
    {
        super(name)

        this.Mode = mode
        this.FieldOfView = fieldOfView
        this.AspectRatio = aspectRatio
        this.NearClipping = nearClipping
        this.FarClipping = farClipping
        this.Left = left
        this.Right = right
        this.Top = top
        this.Bottom = bottom
        this.HorizontalTilt = horizontalTilt
        this.VericalTilt = vericalTilt
        
        this.Position = new Vector3(position as number[])
        this.Target = new Vector3(target as number[])
        this.Up = new Vector3(up as number[])

        Cameras.push(this)
    }        

    public Update(): void
    {
        this.AspectRatio = GL.canvas.clientWidth / GL.canvas.clientHeight
        
        let n = this.Position.Clone().Diff(this.Target).Unit()
        let u = this.Up.Clone().Cross(n).Unit()
        let v = n.Clone().Cross(u).Unit()
        let p = this.Position

        this.Matrix.Set(
            v.X, v.Y, v.Z, 0,
            u.X, u.Y, u.Z, 0,
            n.X, n.Y, n.Z, 0,
            0,   0,   0, 1
        ).Mult(
            1,   0,   0, 0,
            0,   1,   0, 0,
            0,   0,   1, 0,
            p.X, p.Y, p.Z, 1
        )
    }
}
