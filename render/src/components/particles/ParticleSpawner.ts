import { GL, Matrix4, randBetween, Vector2, Vector3, Vector4 } from "@fwge/common"
import { Transform, UniqueComponent } from "@fwge/core"
import { Colour4 } from "../../base"
import { COLOUR_INDEX, COLOUR_SIZE, MODEL_VIEW_MATRIX_INDEX, NORMAL_INDEX, NORMAL_SIZE, POSITION_INDEX, POSITION_SIZE, UV_INDEX, UV_SIZE } from "../../constants"
import { Mesh, StaticMesh } from "../mesh"

interface IParticleSpawner
{
    size?: number
    mesh?: Mesh
}

export class Particle
{
    public static readonly PositionSize: number = 
        Vector3.BYTES_PER_ELEMENT * Vector3.SIZE
    public static readonly RotationSize: number = 
        Vector3.BYTES_PER_ELEMENT * Vector3.SIZE
    public static readonly ScaleSize: number = 
        Vector3.BYTES_PER_ELEMENT * Vector3.SIZE
    public static readonly ColourSize: number = 
        Colour4.BYTES_PER_ELEMENT * Colour4.SIZE

    public static readonly ParticleSize: number = 
        Particle.PositionSize +
        Particle.RotationSize +
        Particle.ScaleSize +
        Particle.ColourSize

    public static readonly ParticleLength: number = 
        (Vector3.SIZE * 3) + Colour4.SIZE

    constructor(
        public readonly Position: Vector3,
        public readonly Rotation: Vector3,
        public readonly Scale: Vector3,
        public readonly Colour: Colour4,
    ) {}
}
export class ParticleSpawner extends UniqueComponent
{
    public readonly VertexArrayBuffer: WebGLVertexArrayObject
    public readonly ParticleVertexBuffer: WebGLBuffer
    public readonly ParticleCount: number
    public readonly Mesh?: Mesh
    public readonly BufferData: Float32Array
    public readonly Particles: Particle[]

    public readonly BaseColour: Colour4 = new Colour4(1.0, 1.0, 1.0, 1.0)

    private static _defaultMesh: StaticMesh

    public get ParticleMesh(): Mesh
    {
        if (this.Mesh)
        {
            return this.Mesh
        }
        
        if (!ParticleSpawner._defaultMesh)
        {
            ParticleSpawner._defaultMesh = new StaticMesh(
            {
                position:
                [
                    [ -0.5,  0.5,  0.0 ],
                    [ -0.5, -0.5,  0.0 ],
                    [  0.5, -0.5,  0.0 ],
                    [  0.5,  0.5,  0.0 ],
                ],
                uv:
                [
                    [ 0.0, 1.0 ],
                    [ 0.0, 0.0 ],
                    [ 1.0, 0.0 ],
                    [ 1.0, 1.0 ],
                ],
                colour:
                [
                    [ 1.0, 1.0, 1.0, 1.0 ],
                    [ 1.0, 1.0, 1.0, 1.0 ],
                    [ 1.0, 1.0, 1.0, 1.0 ],
                    [ 1.0, 1.0, 1.0, 1.0 ],
                ],
                normal:
                [
                    [ 0.0, 0.0, 1.0 ],
                    [ 0.0, 0.0, 1.0 ],
                    [ 0.0, 0.0, 1.0 ],
                    [ 0.0, 0.0, 1.0 ],
                ],
                index:
                [
                    0, 1, 2,
                    0, 2, 3,
                ]
            })
        }

        return ParticleSpawner._defaultMesh
    }
    constructor()
    constructor(config: IParticleSpawner)
    constructor(config: IParticleSpawner = { })
    {
        super()

        const vertexSize = POSITION_SIZE + UV_SIZE + NORMAL_SIZE + COLOUR_SIZE
        
        this.VertexArrayBuffer = GL.createVertexArray()!
        this.ParticleVertexBuffer = GL.createBuffer()!
        this.ParticleCount = config.size ?? 100
        this.Mesh = config.mesh
        this.BufferData = new Float32Array(new ArrayBuffer(Particle.ParticleSize * this.ParticleCount))
        this.Particles = new Array(this.ParticleCount)
            .fill(undefined)
            .map(() => new Particle(
                new Vector3(
                    randBetween(0, 5) - 2.5,
                    randBetween(0, 5) - 2.5,
                    0
                ),
                Vector3.ZERO,
                new Vector3(0.1, 0.1, 0.1),
                new Colour4(Math.random(),Math.random(),Math.random(),1)
            ))

        /* ============= PARTICLE BUFFER DATA SETUP ============= */
        GL.bindBuffer(GL.ARRAY_BUFFER, this.ParticleVertexBuffer)
        for (let i = 0; i < this.Particles.length; i++)
        {
            const offset = i * Particle.ParticleLength

            this.BufferData[offset +  0] = this.Particles[i].Position[0]
            this.BufferData[offset +  1] = this.Particles[i].Position[1]
            this.BufferData[offset +  2] = this.Particles[i].Position[2]

            this.BufferData[offset +  3] = this.Particles[i].Rotation[0]
            this.BufferData[offset +  4] = this.Particles[i].Rotation[1]
            this.BufferData[offset +  5] = this.Particles[i].Rotation[2]

            this.BufferData[offset +  6] = this.Particles[i].Scale[0]
            this.BufferData[offset +  7] = this.Particles[i].Scale[1]
            this.BufferData[offset +  8] = this.Particles[i].Scale[2]

            this.BufferData[offset +  9] = this.Particles[i].Colour[0]
            this.BufferData[offset + 10] = this.Particles[i].Colour[1]
            this.BufferData[offset + 11] = this.Particles[i].Colour[2]
            this.BufferData[offset + 11] = this.Particles[i].Colour[3]
        }
        GL.bufferData(GL.ARRAY_BUFFER, this.BufferData, GL.DYNAMIC_DRAW)
        GL.bindBuffer(GL.ARRAY_BUFFER, null)
        /* ============= PARTICLE BUFFER DATA SETUP ============= */
    
        
        
        //#region ============= VERTEX ARRAY OBJECT SETUP =============        
        GL.bindVertexArray(this.VertexArrayBuffer)
        
        GL.bindBuffer(GL.ARRAY_BUFFER, this.ParticleMesh.VertexBuffer)
        GL.enableVertexAttribArray(0)
        GL.vertexAttribPointer(0, Vector3.SIZE, GL.FLOAT, false, vertexSize, 0)
        GL.enableVertexAttribArray(1)
        GL.vertexAttribPointer(1, Vector3.SIZE, GL.FLOAT, false, vertexSize, POSITION_SIZE)
        GL.enableVertexAttribArray(2)
        GL.vertexAttribPointer(2, Vector2.SIZE, GL.FLOAT, false, vertexSize, POSITION_SIZE + UV_SIZE)
        GL.enableVertexAttribArray(3)
        GL.vertexAttribPointer(3, Colour4.SIZE, GL.FLOAT, false, vertexSize, POSITION_SIZE + UV_SIZE + NORMAL_SIZE)

        GL.bindBuffer(GL.ARRAY_BUFFER, this.ParticleVertexBuffer)
        GL.enableVertexAttribArray(4)
        GL.vertexAttribDivisor(4, 1)
        GL.vertexAttribPointer(4, Vector3.SIZE, GL.FLOAT, false, Particle.ParticleSize, 0)
        GL.enableVertexAttribArray(5)
        GL.vertexAttribDivisor(5, 1)
        GL.vertexAttribPointer(5, Vector3.SIZE, GL.FLOAT, false, Particle.ParticleSize, Particle.PositionSize)
        GL.enableVertexAttribArray(6)
        GL.vertexAttribDivisor(6, 1)
        GL.vertexAttribPointer(6, Vector3.SIZE, GL.FLOAT, false, Particle.ParticleSize, Particle.PositionSize + Particle.RotationSize)
        GL.enableVertexAttribArray(7)
        GL.vertexAttribDivisor(7, 1)
        GL.vertexAttribPointer(7, Colour4.SIZE, GL.FLOAT, false, Particle.ParticleSize, Particle.PositionSize + Particle.RotationSize + Particle.ScaleSize)

        GL.bindVertexArray(null)
        //#endregion ============= VERTEX ARRAY OBJECT SETUP =============

        console.log(this)
    }
}
