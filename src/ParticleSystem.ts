import Item from './Item'
import Transform, {ITransform}  from './Transform'
import Updateable from './Interfaces/Updateable';
import Mesh from './Render/Mesh';
import RenderMaterial from './Render/RenderMaterial';
import Vector3 from './Maths/Vector3';

export let ParticleSystems: ParticleSystem[] = new Array<ParticleSystem>()

export class IParticle
{
    count: number
    start: Vector3 | Float32Array | number[]
    end: Vector3 | Float32Array | number[]
}

export class IParticleSystem
{
    name: string
    mesh: Mesh
    material: RenderMaterial
    length: number
    transform: Transform | ITransform
    delay: number
    particles: IParticle
}

export default class ParticleSystem extends Item implements Updateable
{
    public Transform: Transform

    public Mesh: Mesh
    public Material: RenderMaterial
    public Delay: number
    public Particles: Transform[]

    constructor()
    constructor(particleSystem: IParticleSystem)
    constructor({ name = 'Particle System', mesh, length = 0, material, transform,  delay = 0, particles }: IParticleSystem = new IParticleSystem)
    {
        super(name)

        this.Mesh = mesh
        this.Material = material

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
        for (let i = 0; i < particles.count; ++i)
        {
            this.Particles.push(new Transform(
            {
                position: new Vector3(particles.start).Sum(this.Transform.Position)
            }))
        }

        ParticleSystems.push(this)
    }

    public Update()
    {
        for (let particle of this.Particles)
        {
            // TODO
            // Do the update stuffs
        }
    }
}
