import { GL, randBetween, Vector3 } from "@fwge/common"
import { UniqueComponent } from "@fwge/core"
import { Colour4 } from "../../base"
import { COLOUR_INDEX, COLOUR_SIZE, NORMAL_INDEX, POSITION_INDEX, POSITION_SIZE, UV_INDEX } from "../../constants"

interface IParticleSpawner
{
    size?: number
    colour?: Colour4 | [number, number, number, number]
}

export class ParticleSpawner extends UniqueComponent
{
    public readonly VertexArrayBuffer: WebGLVertexArrayObject | null = GL.createVertexArray()
    public readonly VertexSize: number

    public Colour: Colour4 = new Colour4(1.0, 1.0, 1.0, 1.0)
    public ParticleBuffer: WebGLBuffer | null = null
    public Size: number = 0
    public Vertices: Float32Array

    constructor()
    constructor(config: IParticleSpawner)
    constructor(config: IParticleSpawner = { })
    {
        super()

        this.Size = config.size ?? 100
        this.Colour = new Colour4(config.colour as number[] ?? [1,1,1,1])
        this.VertexSize = POSITION_SIZE + COLOUR_SIZE
        const bufferSize = this.VertexSize * this.Size

        this.ParticleBuffer = GL.createBuffer()
        GL.bindBuffer(GL.ARRAY_BUFFER, this.ParticleBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, bufferSize, GL.DYNAMIC_DRAW)

        this.Vertices = new Float32Array(new ArrayBuffer(bufferSize))
        for (let i = 0; i < this.Size; i++)
        {
            this.Vertices[(i * 7) + 0] = Math.random() - 0.5
            this.Vertices[(i * 7) + 1] = Math.random() - 0.5
            this.Vertices[(i * 7) + 2] = 0

            this.Vertices[(i * 7) + 3] = 1.0
            this.Vertices[(i * 7) + 4] = 1.0
            this.Vertices[(i * 7) + 5] = 1.0
            this.Vertices[(i * 7) + 6] = 1.0
        }
    }
}
