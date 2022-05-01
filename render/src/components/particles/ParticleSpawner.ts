import { GL, randBetween, Vector2, Vector3 } from "@fwge/common"
import { UniqueComponent } from "@fwge/core"
import { Colour4 } from "../../base"
import { COLOUR_INDEX, COLOUR_SIZE, NORMAL_INDEX, NORMAL_SIZE, POSITION_INDEX, POSITION_SIZE, UV_INDEX, UV_SIZE } from "../../constants"
import { Material } from "../Material"
import { Mesh, StaticMesh } from "../mesh"

type UpdateVectorMethod = (inVec: Vector3, outVec: Vector3, index: number, t: number) => void
type UpdateColourMethod = (inVec: Colour4, outVec: Colour4, index: number, t: number) => void
interface IParticleConfig
{
    lifetime?: number
    loop?: boolean
    position?: Vector3
    rotation?: Vector3
    scale?: Vector3
    colour?: Colour4
    delay?: (index: number, length: number) => number
    updatePosition?: UpdateVectorMethod
    updateRotation?: UpdateVectorMethod
    updateScale?: UpdateVectorMethod
    updateColour?: UpdateColourMethod
}
interface ISystemConfig
{
    
}
interface IParticleSpawner
{
    size?: number
    mesh?: Mesh
    material?: Material
    system?: ISystemConfig
    particle?: IParticleConfig
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

    public Lifetime: number = 0

    constructor(
        delay: number = 0,
        public readonly Position: Vector3 = new Vector3(0.0),
        public readonly Rotation: Vector3 = new Vector3(0.0),
        public readonly Scale: Vector3 = new Vector3(0.0),
        public readonly Colour: Colour4 = new Colour4(0.0),
    ) {
        this.Lifetime = -delay
    }    
}

export class ParticleSpawner extends UniqueComponent
{
    public readonly VertexArrayBuffer: WebGLVertexArrayObject
    public readonly ParticleVertexBuffer: WebGLBuffer
    public readonly ParticleCount: number
    public readonly Mesh?: Mesh
    public readonly Material?: Material
    public readonly BufferData: Float32Array
    public readonly Particles: Particle[]

    public readonly BaseColour: Colour4 = new Colour4(1.0, 1.0, 1.0, 1.0)

    private static _defaultMesh: StaticMesh
    private static _defaultMaterial: Material

    public Offset: number = 0

    public get Completed(): boolean
    {
        return this.Offset === this.ParticleCount
    }

    public readonly ParticleConfig:
    {
        Lifetime: number,
        Loop: boolean,
        
        Position: Vector3
        Rotation: Vector3
        Scale: Vector3
        Colour: Colour4

        UpdatePosition: UpdateVectorMethod
        UpdateRotation: UpdateVectorMethod
        UpdateScale: UpdateVectorMethod
        UpdateColour: UpdateColourMethod
    }

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

    public get ParticleMaterial(): Material
    {
        if (this.Material)
        {
            return this.Material
        }

        if (!ParticleSpawner._defaultMaterial)
        {
            ParticleSpawner._defaultMaterial = new Material()
        }

        return ParticleSpawner._defaultMaterial
    }

    constructor()
    constructor(config: IParticleSpawner)
    constructor(config: IParticleSpawner = { })
    {
        super()

        const vertexSize = POSITION_SIZE + UV_SIZE + NORMAL_SIZE + COLOUR_SIZE
        const delay = config.particle?.delay ?? (() => 0)

        this.VertexArrayBuffer = GL.createVertexArray()!
        this.ParticleVertexBuffer = GL.createBuffer()!
        this.ParticleCount = config.size ?? 100
        this.Mesh = config.mesh
        this.Material = config.material
        this.BufferData = new Float32Array(new ArrayBuffer(Particle.ParticleSize * this.ParticleCount))
        
        this.ParticleConfig =
        {
            Lifetime: config.particle?.lifetime ?? 1,
            Loop: config.particle?.loop ?? true,

            Position: config.particle?.position ?? new Vector3(0, 0, 0),
            Rotation: config.particle?.rotation ?? new Vector3(0, 0, 0),
            Scale: config.particle?.scale ?? new Vector3(1, 1, 1),
            Colour: config.particle?.colour ?? new Colour4(1, 1, 1, 1),

            UpdatePosition: config.particle?.updatePosition ?? ((inVec: Vector3, outVec: Vector3, _1: number, _2: number ) => outVec.Set(inVec) ),
            UpdateRotation: config.particle?.updateRotation ?? ((inVec: Vector3, outVec: Vector3, _1: number, _2: number ) => outVec.Set(inVec) ),
            UpdateScale: config.particle?.updateScale ?? ((inVec: Vector3, outVec: Vector3, _1: number, _2: number ) => outVec.Set(inVec) ),
            UpdateColour: config.particle?.updateColour ?? ((inVec: Colour4, outVec: Colour4, _1: number, _2: number ) => outVec.Set(inVec) ),

        }
        this.Particles = new Array(this.ParticleCount)
            .fill(undefined)
            .map((_, index, arr) => 
            {
                const particle = new Particle(
                    delay(index, arr.length),
                    this.ParticleConfig.Position.Clone(),
                    this.ParticleConfig.Rotation.Clone(),
                    this.ParticleConfig.Scale.Clone(),
                    this.ParticleConfig.Colour.Clone()
                )

                this.ParticleConfig.UpdatePosition(this.ParticleConfig.Position, particle.Position, index, 0),
                this.ParticleConfig.UpdateRotation(this.ParticleConfig.Rotation, particle.Rotation, index, 0),
                this.ParticleConfig.UpdateScale(this.ParticleConfig.Scale, particle.Scale, index, 0),
                this.ParticleConfig.UpdateColour(this.ParticleConfig.Colour, particle.Colour, index, 0)

                return particle
            })

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
            this.BufferData[offset + 12] = this.Particles[i].Colour[3]
        }
        GL.bufferData(GL.ARRAY_BUFFER, this.BufferData, GL.DYNAMIC_DRAW)
        GL.bindBuffer(GL.ARRAY_BUFFER, null)
        /* ============= PARTICLE BUFFER DATA SETUP ============= */
    
        
        
        //#region ============= VERTEX ARRAY OBJECT SETUP =============        
        GL.bindVertexArray(this.VertexArrayBuffer)
        
        GL.bindBuffer(GL.ARRAY_BUFFER, this.ParticleMesh.VertexBuffer)
        GL.enableVertexAttribArray(POSITION_INDEX)
        GL.vertexAttribPointer(POSITION_INDEX, Vector3.SIZE, GL.FLOAT, false, vertexSize, 0)
        GL.enableVertexAttribArray(NORMAL_INDEX)
        GL.vertexAttribPointer(NORMAL_INDEX, Vector3.SIZE, GL.FLOAT, false, vertexSize, POSITION_SIZE)
        GL.enableVertexAttribArray(UV_INDEX)
        GL.vertexAttribPointer(UV_INDEX, Vector2.SIZE, GL.FLOAT, false, vertexSize, POSITION_SIZE + NORMAL_SIZE)
        GL.enableVertexAttribArray(COLOUR_INDEX)
        GL.vertexAttribPointer(COLOUR_INDEX, Colour4.SIZE, GL.FLOAT, false, vertexSize, POSITION_SIZE + NORMAL_SIZE + UV_SIZE)

        if (this.ParticleMesh.IndexBuffer)
        {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.ParticleMesh.IndexBuffer)
        }

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
