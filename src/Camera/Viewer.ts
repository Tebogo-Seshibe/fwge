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
    protected Matrix: Matrix4
    
    constructor({position, target}: IViewer = new IViewer)
    {
        this.Position = new Vector3(position)
        this.Target = new Vector3(target)
        this.Matrix = Matrix4.IDENTITY
            
    }

    Update(): void
    {
        let direction = this.Position.Clone().Diff(this.Target).Unit()
        let right = up.Cross(direction).Unit()
        let up = direction.Cross(right).Unit()

        this.Matrix.Set(
        
            right.X,       right.Y,       right.Z,       0,
            up.X,          up.Y,          up.Z,          0,
            direction.X,   direction.Y,   direction.Z,   0,
            0,                  0,                  0,                  1
        ).Mult(
            1,                  0,                  0,                  0,
            0,                  1,                  0,                  0,
            0,                  0,                  1,                  0,
            this.Position.X,    this.Position.Y,    this.Position.Z,    1
        );
    }
}