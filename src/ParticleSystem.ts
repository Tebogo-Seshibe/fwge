import Item from './Item'
import Transform from './Transform'
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
    public readonly Mesh: Mesh
    public readonly Material: RenderMaterial
    public readonly Particles: Transform[]

    constructor({ name = 'Particle System', mesh, length = 0, material, details }: IParticleSystem = new IParticleSystem)
    {
        super(name)

        this.Mesh = mesh
        this.Material = material
        this.Particles = new Array()
        
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
