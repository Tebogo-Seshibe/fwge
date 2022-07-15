import { Matrix4 } from '@fwge/common'
import { Transform, UniqueComponent } from '@fwge/core'

export class Camera extends UniqueComponent
{
    public static Main?: Camera
    public readonly ProjectionMatrix: Matrix4 = Matrix4.Identity

    get ViewMatrix(): Matrix4
    {
        const transform = this.Owner?.GetComponent(Transform)
        
        return transform 
            ? Matrix4.Inverse(transform.ModelViewMatrix())
            : Matrix4.Identity
    }

    UpdateProjection(): void {}
    
    constructor()
    {
        super(Camera)
    }
}
