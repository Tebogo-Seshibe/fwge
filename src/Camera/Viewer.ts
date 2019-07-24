import Updateable from '../Interfaces/Updateable'
import Matrix4 from '../Maths/Matrix4'
import Vector3 from '../Maths/Vector3'
import Camera, { ICamera } from './Camera'

export class IViewer extends ICamera
{
    up: Vector3 = new Vector3(0, 1, 0)
    position: Vector3 = Vector3.ZERO
    target: Vector3 = Vector3.ZERO
}

export default class Viewer extends Camera implements Updateable
{
    public Position: Vector3
    public Target: Vector3
    private Up: Vector3 = new Vector3(0, 1, 0)
    private Matrix: Matrix4 = Matrix4.IDENTITY

    public get ViewMatrix(): Matrix4
    {
        return this.Matrix.Clone()
    }
    
    constructor()
    constructor(viewer: IViewer)
    constructor({ name = 'Viewer', mode, fieldOfView, aspectRatio, nearClipping, farClipping, left, right, top, bottom, horizontalTilt, vericalTilt, position, target }: IViewer = new IViewer)
    {
        super(name, mode, fieldOfView, aspectRatio, nearClipping, farClipping, left, right, top, bottom, horizontalTilt, vericalTilt)

        this.Position = new Vector3(position)
        this.Target = new Vector3(target)
    }

    public Update(): void
    {
        super.Update()

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