import { Matrix4 } from "@fwge/common"
import { UniqueComponent } from "../../ecs"
import { Transform } from "../Transform"

export class Camera extends UniqueComponent
{
    public static Main?: Camera
    public readonly ProjectionMatrix: Matrix4 = Matrix4.Identity
    private readonly NormalMatrix: Matrix4 = Matrix4.Identity

    get ViewMatrix(): Matrix4
    {
        const transform = this.Owner?.GetComponent(Transform)
        
        return transform 
            ? Matrix4.Inverse(transform.ModelViewMatrix(this.NormalMatrix))
            : this.NormalMatrix.Identity()
    }

    UpdateProjection(): void {}
    
    constructor()
    {
        super(Camera)
    }
}
