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
    constructor({ name = 'Sphere Collider', position, radius = 1.0 }: ISphereCollider = new ISphereCollider)
    {
        super({ name, position })

        this.Radius = radius
    }
}