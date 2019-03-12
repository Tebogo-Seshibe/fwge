import Collider, { ICollider } from './Collider'

export class ISphereCollider extends ICollider
{
    name = 'Sphere Collider'
    radius: number = 1
}

export default class SphereCollider extends Collider
{
    public Radius: number

    constructor({ name, position, radius, physicsitem }: ISphereCollider = new ISphereCollider)
    {
        super({ name, position, physicsitem })

        this.Radius = radius
    }
}