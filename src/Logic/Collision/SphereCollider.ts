import Collider, { ICollider } from './Collider';

export class ISphereCollider extends ICollider
{
    radius: number
}

export default class SphereCollider extends Collider
{
    public Radius: number

    constructor()
    constructor(sphereCollider: ISphereCollider)
    constructor({ name = 'Sphere Collider', transform, radius = 1.0 }: ISphereCollider = new ISphereCollider)
    {
        super({ name, transform })

        this.Radius = radius
    }

    public Clone(): SphereCollider
    {
        return new SphereCollider(
        {
            name:       this.Name + ' Clone',
            transform:  this.Transform.Clone(),
            radius:     this.Radius
        })
    }
}