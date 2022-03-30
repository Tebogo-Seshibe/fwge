import { GL, Vector2, Vector3, Vector4 } from "@fwge/common"
import { Colour4 } from '../../base'
import { Mesh } from './Mesh'

const POSITION_INDEX: number    = 0
const NORMAL_INDEX: number      = 1
const UV_INDEX: number          = 2
const COLOUR_INDEX: number      = 3

const POSITION_SIZE: number = Vector3.BYTES_PER_ELEMENT * Vector3.SIZE
const NORMAL_SIZE: number   = Vector3.BYTES_PER_ELEMENT * Vector3.SIZE
const COLOUR_SIZE: number   = Colour4.BYTES_PER_ELEMENT * Colour4.SIZE
const UV_SIZE: number       = Vector2.BYTES_PER_ELEMENT * Vector2.SIZE

interface IMesh
{
    position: Vector3[] | [number, number, number][]
    normal?: Vector3[] | [number, number, number][]
    colour?: Vector4[] | Colour4[] | [number, number, number, number][]
    uv?: Vector2[] | [number, number][]
    index?: number[]
    wireframe?: number[]
}

export class StaticMesh extends Mesh
{
    public readonly VertexBuffer: WebGLBuffer | null
    public readonly IndexBuffer: WebGLBuffer | null = null
    public readonly WireframeBuffer: WebGLBuffer | null = null

    constructor(args: IMesh)
    {
        super(
            args.position.length * Vector3.SIZE,
            args.index?.length ?? -1,
            args.wireframe?.length ?? -1
        )
    
        const vertexSize = (
              POSITION_SIZE
            + NORMAL_SIZE    * (args.normal ? 1 : 0)
            + UV_SIZE        * (args.uv ? 1 : 0)
            + COLOUR_SIZE    * (args.colour ? 1 : 0)
        )
        const bufferSize = vertexSize * args.position.length

        let positionOffset: number = 0
        let normalOffset: number = -1
        let uvOffset: number = -1
        let colourOffset: number = -1

        if (args.normal)
        {
            normalOffset = POSITION_SIZE
        }

        if (args.uv)
        { 
            uvOffset = POSITION_SIZE
            
            if (args.normal)
            {
                uvOffset += NORMAL_SIZE
            }
        }
        
        if (args.colour)
        {
            colourOffset = POSITION_SIZE

            if (args.normal)
            {
                colourOffset += NORMAL_SIZE
            }
        
            if (args.uv)
            {
                colourOffset += UV_SIZE
            }
        }

        //#region Buffer Setup
        const vertexBuffer = new Float32Array(new ArrayBuffer(bufferSize))
        
        for (let i = 0, offset = 0; i < args.position.length; i++)
        {
            const position = args.position[i] as [number, number, number]

            vertexBuffer[offset + 0] = position[0]
            vertexBuffer[offset + 1] = position[1]
            vertexBuffer[offset + 2] = position[2]

            offset += Vector3.SIZE
            
            if (args.normal)
            {
                const normal = args.normal[i] as [number, number, number]
                
                vertexBuffer[offset + 0] = normal[0]
                vertexBuffer[offset + 1] = normal[1]
                vertexBuffer[offset + 2] = normal[2]

                offset += Vector3.SIZE
            }
            
            if (args.uv)
            {
                const uv = args.uv[i] as [number, number]
                
                vertexBuffer[offset + 0] = uv[0]
                vertexBuffer[offset + 1] = uv[1]

                offset += Vector2.SIZE
            }
            
            if (args.colour)
            {
                const colour = args.colour[i] as [number, number, number, number]
                
                vertexBuffer[offset + 0] = colour[0]
                vertexBuffer[offset + 1] = colour[1]
                vertexBuffer[offset + 2] = colour[2]
                vertexBuffer[offset + 3] = colour[3]

                offset += Colour4.SIZE
            }
        }

        this.VertexBuffer = GL.createBuffer()
        GL.bindBuffer(GL.ARRAY_BUFFER, this.VertexBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, vertexBuffer, GL.STATIC_DRAW)
        
        if (args.index)
        {
            this.IndexBuffer = GL.createBuffer()
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.IndexBuffer)
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint8Array(args.index), GL.STATIC_DRAW)
        }
        
        if (args.wireframe)
        {
            this.WireframeBuffer = GL.createBuffer()
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.WireframeBuffer)
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint8Array(args.wireframe), GL.STATIC_DRAW)
        }
        //#endregion

        //#region VAO Setup
        GL.bindVertexArray(this.VertexArrayBuffer)
        GL.enableVertexAttribArray(POSITION_INDEX)
        GL.vertexAttribPointer(POSITION_INDEX, Vector3.SIZE, GL.FLOAT, false, vertexSize, positionOffset)
        if (normalOffset !== -1)
        {
            GL.enableVertexAttribArray(NORMAL_INDEX)
            GL.vertexAttribPointer(NORMAL_INDEX, Vector3.SIZE, GL.FLOAT, false, vertexSize, normalOffset)
        }
        if (uvOffset !== -1)
        {
            GL.enableVertexAttribArray(UV_INDEX)
            GL.vertexAttribPointer(UV_INDEX, Vector2.SIZE, GL.FLOAT, false, vertexSize, uvOffset)
        }
        if (colourOffset !== -1)
        {
            GL.enableVertexAttribArray(COLOUR_INDEX)
            GL.vertexAttribPointer(COLOUR_INDEX, Colour4.SIZE, GL.FLOAT, false, vertexSize, colourOffset)
        }
        GL.bindVertexArray(null)
        //#endregion
    }
}
