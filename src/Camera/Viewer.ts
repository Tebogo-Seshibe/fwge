import Vector3 from '../Maths/Vector3'
import Matrix4 from '../Maths/Matrix4';
import Updateable from '../Interfaces/Updateable'

export class IViewer
{
    position: Vector3 = Vector3.ZERO
    target: Vector3 = Vector3.ZERO
}

export default class Viewer implements Updateable
{
    public Position: Vector3
    public Target: Vector3
    public Up: Vector3
    protected Matrix: Matrix4
    
    constructor({position, target}: IViewer = new IViewer)
    {
        this.Position = new Vector3(position)
        this.Target = new Vector3(target)
        this.Up = new Vector3(0, 1, 0)
        this.Matrix = Matrix4.IDENTITY
    }

    Update(): void
    {
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
        );
    }
}