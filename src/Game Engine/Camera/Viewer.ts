import { Vector3 } from '../Maths/Vector3';
import { Matrix4 } from '../Maths/Matrix4';

export interface IViewer
{
    Position?:  Vector3;
    Target?:    Vector3;
}

export class Viewer
{
    public Position:    Vector3 = Vector3.Zero;
    public Target:      Vector3 = Vector3.Zero;
    public Matrix:      Matrix4 = Matrix4.Identity;

    private Direction:  Vector3 = Vector3.Zero;
    private Up:         Vector3 = Vector3.Zero;
    private Right:      Vector3 = Vector3.Zero;

    constructor(request?: IViewer)
    {
        if (!!request)
        {
            if (request.Position)
                this.Position = request.Position;
            if (request.Target)
                this.Target = request.Target;
        }
    }

    public Update(): void
    {
        this.Direction.Set(this.Position).Diff(this.Target).Unit();
        this.Right.Set(this.Up).Cross(this.Direction).Unit();
        this.Up.Set(this.Direction).Cross(this.Right).Unit();

        this.Matrix.Set(
        [
            this.Right.X,       this.Right.Y,       this.Right.Z,       0,
            this.Up.X,          this.Up.Y,          this.Up.Z,          0,
            this.Direction.X,   this.Direction.Y,   this.Direction.Z,   0,
            0,                  0,                  0,                  1
        ]).Mult(
        [
            1,                  0,                  0,                  0,
            0,                  1,                  0,                  0,
            0,                  0,                  1,                  0,
            this.Position.X,    this.Position.Y,    this.Position.Z,    1
        ]);
    }
}
