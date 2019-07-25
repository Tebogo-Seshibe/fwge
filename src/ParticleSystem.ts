import Updateable from './Interfaces/Updateable';
import Item from './Item';
import { Equation, Unary, UnaryExpressionType, BinaryExpressionType, Binary } from './Maths/Equation';
import Vector3 from './Maths/Vector3';
import Mesh from './Render/Mesh';
import RenderMaterial from './Render/RenderMaterial';
import Transform, { ITransform } from './Transform';
import Time from './Utility/Time';

export let ParticleSystems: ParticleSystem[] = new Array<ParticleSystem>()

export class IParticleSystem
{
    name: string
    mesh: Mesh
    material: RenderMaterial
    length: number
    transform: Transform | ITransform
    count: number
    delay: Equation
    speed?: number
    position?: [ Equation, Equation, Equation ]
    rotation?: [ Equation, Equation, Equation ]
    scale?: [ Equation, Equation, Equation ]
    colour?: [ Equation, Equation, Equation, Equation ]
    loop?: boolean
}

// default function
let df0: Equation = Unary(UnaryExpressionType.NONE, 0)
let df1: Equation = Unary(UnaryExpressionType.NONE, 1)

export default class ParticleSystem extends Item implements Updateable
{
    public Transform: Transform
    public Mesh: Mesh
    public Material: RenderMaterial
    
    private CurrentTime: number
    public MaxTime: number
    public Loop: boolean

    public Particles: Transform[]

    public Position: [ Equation, Equation, Equation ]
    public Rotation: [ Equation, Equation, Equation ]
    public Scale: [ Equation, Equation, Equation ]
    public Colour: [ Equation, Equation, Equation, Equation ]

    public Delay: Equation
    public Speed: number

    constructor()
    constructor(particleSystem: IParticleSystem)
    constructor({ name = 'Particle System', mesh, length = 0, material, transform, position = [df0, df0, df0], rotation = [df0, df0, df0], scale = [df1, df1, df1], colour = [df0, df0, df0, df0], loop = true, delay, speed = 1, count }: IParticleSystem = new IParticleSystem)
    {
        super(name)

        this.Mesh = mesh
        this.Material = material
        this.Delay = Binary(BinaryExpressionType.MULTIPLICATION, delay, 1000)
        this.MaxTime = (length * 1000) + this.Delay(count - 1)
        this.CurrentTime = 0
        this.Loop = loop
        this.Speed = speed

        if (transform instanceof Transform)
        {
            transform = {
                position: transform.Position,
                rotation: transform.Rotation,
                scale: transform.Scale,
                shear: transform.Shear
            }
        }
        this.Transform = new Transform(transform)
        
        this.Particles = new Array<Transform>()
        for (let i = 0; i < count; ++i)
        {
            this.Particles.push(new Transform(
            {
                position: new Vector3(this.Transform.Position),
                rotation: new Vector3(this.Transform.Rotation),
                scale: new Vector3(this.Transform.Scale),
                shear: new Vector3(this.Transform.Position)
            }))
        }

        this.Position = position
        this.Rotation = rotation
        this.Scale = scale
        this.Colour = colour

        ParticleSystems.push(this)
    }
    
    public Update(): void
    {
        if (this.CurrentTime >= this.MaxTime)
        {
            if (!this.Loop)
            {
                return
            }
            else
            {
                this.CurrentTime -= this.MaxTime
            }
        }

        for (let i = 0; i < this.Particles.length; ++i)
        {
            let particle = this.Particles[i]

            let currentTime: number = this.CurrentTime - this.Delay(i)
            if (currentTime < 0)
            {
                continue
            }
            
            let offset = Time.Render.Delta
            if (currentTime + offset > this.MaxTime)
            {
                if (this.Loop)
                {
                    this.UpdateParticle(particle, this.MaxTime, i)
                    currentTime = 0
                    offset = Time.Render.Delta - offset
                }
                else
                {
                    offset = this.MaxTime - currentTime
                }
            }
            currentTime *= this.Speed
            this.UpdateParticle(particle, currentTime, i)
        }

        this.CurrentTime += Time.Render.Delta
    }

    private UpdateParticle(particle: Transform, time: number, index: number): void
    {
        particle.Position.Set(this.Transform.Position).Sum(this.Position[0](time, index), this.Position[1](time, index), this.Position[2](time, index))
        particle.Rotation.Set(this.Transform.Rotation).Sum(this.Rotation[0](time, index), this.Rotation[1](time, index), this.Rotation[2](time, index))
        particle.Scale.Set(this.Transform.Scale).Sum(this.Scale[0](time, index), this.Scale[1](time, index), this.Scale[2](time, index))
    }
}
