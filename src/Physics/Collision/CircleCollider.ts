import Collider, { ICollider } from './Collider';

export class ICircleCollider extends ICollider
{
    radius: number
}

export default class CircleCollider extends Collider
{
    public Radius: number

    constructor()
    constructor(sphereCollider: ICircleCollider)
    constructor({ name = 'Sphere Collider', position, radius = 1.0 }: ICircleCollider = new ICircleCollider)
    {
        super({ name, position })

        this.Radius = radius
    }
}