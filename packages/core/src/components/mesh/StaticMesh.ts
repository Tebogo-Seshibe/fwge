import { Colour4, GL, Vector2, Vector3 } from "@fwge/common"
import { POSITION_SIZE, NORMAL_SIZE, UV_SIZE, COLOUR_SIZE, POSITION_INDEX, NORMAL_INDEX, UV_INDEX, COLOUR_INDEX } from "./constants"
import { IMesh, Mesh } from './Mesh'

export class StaticMesh extends Mesh
{
    constructor(args: IMesh)
    {
        super(args.position.length, args.index, args.name ?? 'Static Mesh')
    
        const vertexSizeInBytes =
              POSITION_SIZE
            + (args.normal ? NORMAL_SIZE : 0)
            + (args.uv     ? UV_SIZE     : 0)
            + (args.colour ? COLOUR_SIZE : 0)
        const bufferSize = vertexSizeInBytes * args.position.length

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
        const buffer = new Float32Array(new ArrayBuffer(bufferSize))
        
        for (let i = 0, offset = 0; i < args.position.length; i++)
        {
            const position = args.position[i]

            buffer[offset + 0] = position[0]
            buffer[offset + 1] = position[1]
            buffer[offset + 2] = position[2]

            offset += Vector3.SIZE
            
            if (args.normal)
            {
                const normal = args.normal[i]
                
                buffer[offset + 0] = normal[0]
                buffer[offset + 1] = normal[1]
                buffer[offset + 2] = normal[2]

                offset += Vector3.SIZE
            }
            
            if (args.uv)
            {
                const uv = args.uv[i]
                
                buffer[offset + 0] = uv[0]
                buffer[offset + 1] = uv[1]

                offset += Vector2.SIZE
            }
            
            if (args.colour)
            {
                const colour = args.colour[i]
                
                buffer[offset + 0] = colour[0]
                buffer[offset + 1] = colour[1]
                buffer[offset + 2] = colour[2]
                buffer[offset + 3] = colour[3]

                offset += Colour4.SIZE
            }
        }
        //#endregion

        //#region VAO Setup
        GL.bindVertexArray(this.VertexArrayBuffer)
        GL.bindBuffer(GL.ARRAY_BUFFER, this.VertexBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, buffer, GL.STATIC_DRAW)
        
        GL.enableVertexAttribArray(POSITION_INDEX)
        GL.vertexAttribPointer(POSITION_INDEX, Vector3.SIZE, GL.FLOAT, false, vertexSizeInBytes, positionOffset)

        if (normalOffset !== -1)
        {
            GL.enableVertexAttribArray(NORMAL_INDEX)
            GL.vertexAttribPointer(NORMAL_INDEX, Vector3.SIZE, GL.FLOAT, false, vertexSizeInBytes, normalOffset)
        }

        if (uvOffset !== -1)
        {
            GL.enableVertexAttribArray(UV_INDEX)
            GL.vertexAttribPointer(UV_INDEX, Vector2.SIZE, GL.FLOAT, false, vertexSizeInBytes, uvOffset)
        }

        if (colourOffset !== -1)
        {
            GL.enableVertexAttribArray(COLOUR_INDEX)
            GL.vertexAttribPointer(COLOUR_INDEX, Colour4.SIZE, GL.FLOAT, false, vertexSizeInBytes, colourOffset)
        }

        GL.bindVertexArray(null)
        GL.bindBuffer(GL.ARRAY_BUFFER, null)
        //#endregion
    }
}
