import { Colour4, Vector2, Vector3 } from "@fwge/common";
import { Game } from "../../base";
import { COLOUR_INDEX, COLOUR_SIZE, NORMAL_INDEX, NORMAL_SIZE, POSITION_INDEX, POSITION_SIZE, UV_INDEX, UV_SIZE } from "./constants";
import { IMesh, Mesh } from './Mesh';

export class StaticMesh extends Mesh
{
    private _positionOffset: number = 0;
    private _normalOffset: number = -1;
    private _uvOffset: number = -1;
    private _colourOffset: number = -1;
    private _vertexSizeInBytes: number = -1;

    constructor(args: IMesh)
    {
        super((POSITION_SIZE
            + (args.normal ? NORMAL_SIZE : 0)
            + (args.uv     ? UV_SIZE     : 0)
            + (args.colour ? COLOUR_SIZE : 0)),
            args.position.length, args.index, args.name ?? 'Static Mesh')
    
        this._vertexSizeInBytes =
              POSITION_SIZE
            + (args.normal ? NORMAL_SIZE : 0)
            + (args.uv     ? UV_SIZE     : 0)
            + (args.colour ? COLOUR_SIZE : 0)
        const bufferSize = this._vertexSizeInBytes * args.position.length

        if (args.normal)
        {
            this._normalOffset = POSITION_SIZE
        }

        if (args.uv)
        { 
            this._uvOffset = POSITION_SIZE
            
            if (args.normal)
            {
                this._uvOffset += NORMAL_SIZE
            }
        }
        
        if (args.colour)
        {
            this._colourOffset = POSITION_SIZE

            if (args.normal)
            {
                this._colourOffset += NORMAL_SIZE
            }
        
            if (args.uv)
            {
                this._colourOffset += UV_SIZE
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
        this.MeshData.View('vertices').set(buffer)
        //#endregion
    }

    override async Load(game: Game): Promise<void>
    {
        await super.Load(game);
        
        //#region VAO Setup
        game.GL.bindVertexArray(this.VertexArrayBuffer)
        game.GL.bindBuffer(game.GL.ARRAY_BUFFER, this.VertexBuffer)
        game.GL.bufferData(game.GL.ARRAY_BUFFER, this.MeshData.View('vertices'), game.GL.STATIC_DRAW)
        
        game.GL.enableVertexAttribArray(POSITION_INDEX)
        game.GL.vertexAttribPointer(POSITION_INDEX, Vector3.SIZE, game.GL.FLOAT, false, this._vertexSizeInBytes, this._positionOffset)

        if (this._normalOffset !== -1)
        {
            game.GL.enableVertexAttribArray(NORMAL_INDEX)
            game.GL.vertexAttribPointer(NORMAL_INDEX, Vector3.SIZE, game.GL.FLOAT, false, this._vertexSizeInBytes, this._normalOffset)
        }

        if (this._uvOffset !== -1)
        {
            game.GL.enableVertexAttribArray(UV_INDEX)
            game.GL.vertexAttribPointer(UV_INDEX, Vector2.SIZE, game.GL.FLOAT, false, this._vertexSizeInBytes, this._uvOffset)
        }

        if (this._colourOffset !== -1)
        {
            game.GL.enableVertexAttribArray(COLOUR_INDEX)
            game.GL.vertexAttribPointer(COLOUR_INDEX, Colour4.SIZE, game.GL.FLOAT, false, this._vertexSizeInBytes, this._colourOffset)
        }

        game.GL.bindVertexArray(null)
        game.GL.bindBuffer(game.GL.ARRAY_BUFFER, null)
        //#endregion
    }
}
