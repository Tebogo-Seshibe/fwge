import Item from './Item'
import Transform, {ITransform}  from './Transform'
import Updateable from './Interfaces/Updateable';
import Mesh from './Render/Mesh';
import RenderMaterial from './Render/RenderMaterial';
import Vector3 from './Maths/Vector3';
import { Equation } from './Maths/Equation';
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
    updates: [ Equation, Equation, Equation ]
    loop?: boolean
}

export default class ParticleSystem extends Item implements Updateable
{
    public Transform: Transform
    public Mesh: Mesh
    public Material: RenderMaterial
    
    private CurrentTime: number
    public MaxTime: number
    public Loop: boolean

    public Particles: Transform[]
    public Updates: [ Equation, Equation, Equation ]
    public Delay: Equation

    constructor()
    constructor(particleSystem: IParticleSystem)
    constructor({ name = 'Particle System', mesh, length = 0, material, transform, updates, loop = true, delay, count }: IParticleSystem = new IParticleSystem)
    {
        super(name)

        this.Mesh = mesh
        this.Material = material
        this.MaxTime = length * 1000
        this.CurrentTime = 0
        this.Updates = updates
        this.Loop = loop
        this.Delay = delay

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

        ParticleSystems.push(this)
    }
    
    public Update(): void
    {
        for (let i = 0; i < this.Particles.length; ++i)
        {
            let particle = this.Particles[i]

            let currentTime: number = this.CurrentTime - this.Delay(i)
            if (currentTime < 0)
            {
                continue
            }
            
            currentTime %= this.MaxTime
            let offset = Time.Render.Delta
            if (currentTime + offset > this.MaxTime)
            {
                if (this.Loop)
                {
                    this.UpdateParticle(particle, this.MaxTime)
                    currentTime = 0
                    offset = Time.Render.Delta - offset
                }
                else
                {
                    offset = this.MaxTime - currentTime
                }
            }
            this.UpdateParticle(particle, currentTime)
            this.CurrentTime += Time.Render.Delta
        }
    }

    private UpdateParticle(particle: Transform, index: number): void
    {
        particle.Position.Set(this.Updates[0](index), this.Updates[1](index), this.Updates[2](index))
    }
}
