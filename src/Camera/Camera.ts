import Updateable from '../Interfaces/Updateable';
import Matrix4 from '../Maths/Matrix4';
import Vector3 from '../Maths/Vector3';
import { GL } from '../Utility/Control';
import Viewer from './Viewer';

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
    private Matrix: Matrix4 = Matrix4.IDENTITY
    
    public Position: Vector3 = new Vector3(0, 0, -10)
    public Target: Vector3 = new Vector3(0, 0, 0)
    public Up: Vector3 = new Vector3(0, 1, 0)

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
        this.AspectRatio = GL.canvas.clientWidth / GL.canvas.clientHeight
        
        let n = this.Position.Clone().Diff(this.Target).Unit()
        let u = this.Up.Clone().Cross(n).Unit()
        let v = n.Clone().Cross(u).Unit()
        let p = this.Position

        this.Matrix.Set(
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
}
