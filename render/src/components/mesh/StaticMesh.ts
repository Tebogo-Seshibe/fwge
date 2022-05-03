import { GL, Vector2, Vector3, Vector4 } from "@fwge/common"
import { Colour4 } from '../../base'
import { COLOUR_INDEX, COLOUR_SIZE, NORMAL_INDEX, NORMAL_SIZE, POSITION_INDEX, POSITION_SIZE, UV_INDEX, UV_SIZE } from "../../constants"
import { Mesh } from './Mesh'

interface IMesh
{
    position: Vector3[] | [number, number, number][]
    normal?: Vector3[] | [number, number, number][]
    colour?: Vector4[] | Colour4[] | [number, number, number, number][]
    uv?: Vector2[] | [number, number][]
    index?: number[]
}

export class StaticMesh extends Mesh
{
    constructor(args: IMesh)
    {
        super(
            args.position.length * Vector3.SIZE,
            args.index?.length ?? -1,
            (args.index?.length ?? args.position.length) * 2
        )
    
        const vertexSize = (
              POSITION_SIZE
            + NORMAL_SIZE    * (args.normal ? 1 : 0)
            + UV_SIZE        * (args.uv     ? 1 : 0)
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
            const position = args.position[i]

            vertexBuffer[offset + 0] = position[0]
            vertexBuffer[offset + 1] = position[1]
            vertexBuffer[offset + 2] = position[2]

            offset += Vector3.SIZE
            
            if (args.normal)
            {
                const normal = args.normal[i]
                
                vertexBuffer[offset + 0] = normal[0]
                vertexBuffer[offset + 1] = normal[1]
                vertexBuffer[offset + 2] = normal[2]

                offset += Vector3.SIZE
            }
            
            if (args.uv)
            {
                const uv = args.uv[i]
                
                vertexBuffer[offset + 0] = uv[0]
                vertexBuffer[offset + 1] = uv[1]

                offset += Vector2.SIZE
            }
            
            if (args.colour)
            {
                const colour = args.colour[i]
                
                vertexBuffer[offset + 0] = colour[0]
                vertexBuffer[offset + 1] = colour[1]
                vertexBuffer[offset + 2] = colour[2]
                vertexBuffer[offset + 3] = colour[3]

                offset += Colour4.SIZE
            }
        }

        this.VertexBuffer = GL.createBuffer()
        this.WireframeBuffer = GL.createBuffer()
        const wireframeBufferData: number[] = []
        GL.bindBuffer(GL.ARRAY_BUFFER, this.VertexBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, vertexBuffer, GL.STATIC_DRAW)
        GL.bindBuffer(GL.ARRAY_BUFFER, null)
        
        if (args.index)
        {
            this.IndexBuffer = GL.createBuffer()
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.IndexBuffer)
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint8Array(args.index), GL.STATIC_DRAW)
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null)

            for (let i = 0; i < args.index.length; i += 3)
            {
                wireframeBufferData.push(
                    args.index[i + 0], args.index[i + 1],
                    args.index[i + 1], args.index[i + 2],
                    args.index[i + 2], args.index[i + 0]
                )
            }
        }
        else
        {
            for (let i = 0; i < args.position.length; i += 3)
            {
                wireframeBufferData.push(
                    i + 0, i + 1,
                    i + 1, i + 2,
                    i + 2, i + 0
                )
            }
        }

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.WireframeBuffer)
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint8Array(wireframeBufferData), GL.STATIC_DRAW)
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null)
        //#endregion

        //#region VAO Setup
        GL.bindVertexArray(this.VertexArrayBuffer)
        GL.bindBuffer(GL.ARRAY_BUFFER, this.VertexBuffer)

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
        GL.bindBuffer(GL.ARRAY_BUFFER, null)
        //#endregion
    }
}
