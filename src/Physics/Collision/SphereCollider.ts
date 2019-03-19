import Collider, { ICollider } from './Collider'

export class ISphereCollider extends ICollider
{
    radius: number = 1
}

export default class SphereCollider extends Collider
{
    public Radius: number

    constructor({ name = 'Sphere Collider', position, physicsitem, radius = 1 }: ISphereCollider = new ISphereCollider)
    {
        super(name, position, physicsitem)

        this.Radius = radius
    }
}