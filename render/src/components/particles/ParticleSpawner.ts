import { GL, Matrix4, randBetween, Vector3, Vector4 } from "@fwge/common"
import { Transform, UniqueComponent } from "@fwge/core"
import { Colour4 } from "../../base"
import { COLOUR_INDEX, COLOUR_SIZE, MODEL_VIEW_MATRIX_INDEX, NORMAL_INDEX, POSITION_INDEX, POSITION_SIZE, UV_INDEX } from "../../constants"
import { Mesh } from "../mesh"

interface IParticleSpawner
{
    size?: number
    mesh?: Mesh
}

export class ParticleSpawner extends UniqueComponent
{
    public readonly VertexArrayBuffer: WebGLVertexArrayObject
    public readonly ParticleCount: number
    public readonly BufferData: Float32Array
    public readonly Particles: Transform[]
    public readonly MeshIndexCount: number = 6

    public readonly BaseColour: Colour4 = new Colour4(1.0, 1.0, 1.0, 1.0)
    public readonly Mesh?: Mesh

    constructor()
    constructor(config: IParticleSpawner)
    constructor(config: IParticleSpawner = { })
    {
        super()

        const modelViewRowSize = (Vector4.BYTES_PER_ELEMENT * Vector4.SIZE)
        const modelViewSize = (Matrix4.BYTES_PER_ELEMENT * Matrix4.SIZE)
        const colourSize =  (Colour4.BYTES_PER_ELEMENT * Colour4.SIZE)
        const particleSize = modelViewSize + colourSize
        const particleBuffer = GL.createBuffer()!
        const planeBuffer = GL.createBuffer()!

        this.VertexArrayBuffer = GL.createVertexArray()!
        this.ParticleCount = config.size ?? 100
        this.Mesh = config.mesh
        this.BufferData = new Float32Array(new ArrayBuffer(particleSize * this.ParticleCount))
        this.Particles = new Array(this.ParticleCount)
            .fill(undefined)
            .map(() => new Transform({
                scale: [ 0.1, 0.1, 0.1 ],
                position: [
                    1 - randBetween(0, 2),
                    1 - randBetween(0, 2),
                    0
                ]
            }))

        GL.bindVertexArray(this.VertexArrayBuffer)
        
        GL.bindBuffer(GL.ARRAY_BUFFER, planeBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(
        [
            -0.5,  0.5,  0,
            -0.5, -0.5,  0,
             0.5, -0.5,  0,
            -0.5,  0.5,  0,
             0.5, -0.5,  0,
             0.5,  0.5,  0,
        ]), GL.STATIC_DRAW)
        GL.vertexAttribPointer(POSITION_INDEX, Vector3.SIZE, GL.FLOAT, false, 0, 0)
        GL.enableVertexAttribArray(POSITION_INDEX)

        GL.bindBuffer(GL.ARRAY_BUFFER, particleBuffer)
        let a = 0
        for (let i = 0; i < this.BufferData.length; i += particleSize)
        {
            const offset = i * particleSize
            const mv = this.Particles[a++].ModelViewMatrix

            console.log(mv.toString())
            this.BufferData[offset + 0] = Math.random()
            this.BufferData[offset + 1] = Math.random()
            this.BufferData[offset + 2] = Math.random()
            this.BufferData[offset + 3] = 1.0
            
            this.BufferData[offset +  4] = mv[ 0]
            this.BufferData[offset +  5] = mv[ 1]
            this.BufferData[offset +  6] = mv[ 2]
            this.BufferData[offset +  7] = mv[ 3]
            this.BufferData[offset +  8] = mv[ 4]
            this.BufferData[offset +  9] = mv[ 5]
            this.BufferData[offset + 10] = mv[ 6]
            this.BufferData[offset + 11] = mv[ 7]
            this.BufferData[offset + 12] = mv[ 8]
            this.BufferData[offset + 13] = mv[ 9]
            this.BufferData[offset + 14] = mv[10]
            this.BufferData[offset + 15] = mv[11]
            this.BufferData[offset + 16] = mv[12]
            this.BufferData[offset + 17] = mv[13]
            this.BufferData[offset + 18] = mv[14]
            this.BufferData[offset + 19] = mv[15]
        }
        GL.bufferData(GL.ARRAY_BUFFER, this.BufferData, GL.DYNAMIC_DRAW)

        GL.enableVertexAttribArray(COLOUR_INDEX)
        GL.enableVertexAttribArray(MODEL_VIEW_MATRIX_INDEX + 0)
        GL.enableVertexAttribArray(MODEL_VIEW_MATRIX_INDEX + 1)
        GL.enableVertexAttribArray(MODEL_VIEW_MATRIX_INDEX + 2)
        GL.enableVertexAttribArray(MODEL_VIEW_MATRIX_INDEX + 3)

        GL.vertexAttribDivisor(COLOUR_INDEX, 1)
        GL.vertexAttribDivisor(MODEL_VIEW_MATRIX_INDEX + 0, 1)
        GL.vertexAttribDivisor(MODEL_VIEW_MATRIX_INDEX + 1, 1)
        GL.vertexAttribDivisor(MODEL_VIEW_MATRIX_INDEX + 2, 1)
        GL.vertexAttribDivisor(MODEL_VIEW_MATRIX_INDEX + 3, 1)

        GL.vertexAttribPointer(COLOUR_INDEX, Colour4.SIZE, GL.FLOAT, false, particleSize, 0)
        GL.vertexAttribPointer(MODEL_VIEW_MATRIX_INDEX + 0, Vector4.SIZE, GL.FLOAT, false, particleSize, colourSize + (modelViewRowSize * 0))
        GL.vertexAttribPointer(MODEL_VIEW_MATRIX_INDEX + 1, Vector4.SIZE, GL.FLOAT, false, particleSize, colourSize + (modelViewRowSize * 1))
        GL.vertexAttribPointer(MODEL_VIEW_MATRIX_INDEX + 2, Vector4.SIZE, GL.FLOAT, false, particleSize, colourSize + (modelViewRowSize * 2))
        GL.vertexAttribPointer(MODEL_VIEW_MATRIX_INDEX + 3, Vector4.SIZE, GL.FLOAT, false, particleSize, colourSize + (modelViewRowSize * 3))

        GL.bindVertexArray(null)

        console.log(this)
    }
}
