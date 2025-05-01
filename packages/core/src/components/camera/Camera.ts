import { CubeGeometry, Geometry3D, Matrix4, Vector3 } from "@fwge/common";
import { Component } from "@fwge/ecs";

export class Camera extends Component
{
    public static Main?: Camera;

    private static Corners = new Geometry3D([
        [-1.0, 1.0, 1.0],
        [-1.0,-1.0, 1.0],
        [ 1.0,-1.0, 1.0],
        [ 1.0, 1.0, 1.0],
        [-1.0, 1.0,-1.0],
        [-1.0,-1.0,-1.0],
        [ 1.0,-1.0,-1.0],
        [ 1.0, 1.0,-1.0],
    ]);
    public readonly ProjectionMatrix: Matrix4 = Matrix4.Identity;
    private readonly NormalMatrix: Matrix4 = Matrix4.Identity;

    get ViewMatrix(): Matrix4
    {
        return Matrix4.Identity;
        // const transform = this.Owner?.GetComponent(Transform)
        
        // return transform 
        //     ? Matrix4.Inverse(transform.ModelViewMatrix(this.NormalMatrix))
        //     : this.NormalMatrix.Identity()
    }

    get BoundingBox(): Geometry3D
    {
        const inverseCameraMatrix = Matrix4.Multiply(this.ProjectionMatrix, this.ViewMatrix).Inverse();
        const vertices = Camera.Corners.TransformedVertices(inverseCameraMatrix);
        
        const min  = Vector3.Min(vertices);
        const max  = Vector3.Max(vertices);

        return new CubeGeometry(min, max);
    }

    UpdateProjection(): void {}
}
