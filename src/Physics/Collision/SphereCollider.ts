import Collider, { ICollider } from './Collider';

export class ISphereCollider extends ICollider
{
    radius: number
}

export default class SphereCollider extends Collider
{
    public Radius: number = 1

    constructor()
    constructor(sphereCollider: ISphereCollider)
    constructor({ name = 'Sphere Collider', position, physicsitem, radius }: ISphereCollider = new ISphereCollider)
    {
        super(name, position, physicsitem)

        this.Radius = radius
    }
}