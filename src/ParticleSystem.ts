import Item from './Item'
import Transform, {ITransform}  from './Transform'
import Updateable from './Interfaces/Updateable';
import Mesh from './Render/Mesh';
import RenderMaterial from './Render/RenderMaterial';

export let ParticleSystems: ParticleSystem[] = []

class IParticleSystem
{
    name: string
    mesh: Mesh
    material: RenderMaterial
    length: number
    transform: Transform | ITransform
    // TODO
    // add delay
    // add timeout
    // add material
    // add burst
    // add timeline
    details: any
}

// export class Particle
// {
//     Transform: Transform
//     Transform: Transform
//     Transform: Transform
//     Transform: Transform
// }

export default class ParticleSystem extends Item implements Updateable
{
    public Transform: Transform

    public readonly Mesh: Mesh
    public readonly Material: RenderMaterial
    public readonly Particles: Transform[]

    constructor({ name = 'Particle System', mesh, length = 0, material, transform,  details }: IParticleSystem = new IParticleSystem)
    {
        super(name)

        this.Mesh = mesh
        this.Material = material
        this.Particles = new Array()

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
        
        while (--length >= 0)
        {
            this.Particles.push(new Transform())
        }

        ParticleSystems.push(this)
    }

    public Update()
    {
        for (let particle of this.Particles)
        {

        }
    }
}
