import Item from './Item'
import Transform from './Transform';

type Particle = Transform

class IParticleSystem
{
    name: string = 'Particle System'
}

export default class ParticleSystem extends Item
{
    public readonly Particles: Particle[]

    constructor({name}: IParticleSystem)
    {
        super(name)
    }
}


