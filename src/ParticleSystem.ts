import Item from './Item'
import Transform from './Transform'

type Particle = Transform

class IParticleSystem
{
    name: string
}

export default class ParticleSystem extends Item
{
    public readonly Particles: Particle[]

    constructor({ name = 'Particle System' }: IParticleSystem = new IParticleSystem())
    {
        super(name)
    }
}


