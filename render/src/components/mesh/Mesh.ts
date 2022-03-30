import { GL } from "@fwge/common"
import { SharedComponent } from "@fwge/core"

export class Mesh extends SharedComponent
{
    public readonly VertexArrayBuffer: WebGLVertexArrayObject | null = GL.createVertexArray()
    
    get VertexCount(): number
    {
        return this.vertexCount
    }

    get IndexCount(): number
    {
        return this.indexCount
    }

    get WireframeCount(): number
    {
        return this.wireframeCount
    }

    constructor(
        protected vertexCount: number,
        protected indexCount: number,
        protected wireframeCount: number
    ) { super(Mesh) }
}
