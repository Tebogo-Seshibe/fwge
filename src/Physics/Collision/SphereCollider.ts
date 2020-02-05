import Vector3 from '../../Logic/Maths/Vector3';
import Collider, { ICollider } from './Collider';

export class ISphereCollider extends ICollider
{
    radius: number
    offset: Vector3 | Float32Array | number[]
    scale: Vector3 | Float32Array | number[]
}

export default class SphereCollider extends Collider
{
    public Radius: number
    public Offset: Vector3
    public Scale: Vector3
    
    public get Position(): Vector3
    {
        return this.Parent.Transform.Position.Clone().Sum(this.Offset)
    }

    constructor()
    constructor(sphereCollider: ISphereCollider)
    constructor({ name = 'Sphere Collider', offset = [0, 0, 0], scale = [1, 1, 1], radius = 1.0 }: ISphereCollider = new ISphereCollider)
    {
        super({ name })

        this.Radius = radius
        this.Offset = new Vector3(offset as number[])
        this.Scale = new Vector3(scale as number[])
    }

    public Clone(): SphereCollider
    {
        return new SphereCollider(
        {
            name:   this.Name + ' Clone',
            radius: this.Radius,
            offset: this.Offset,
            scale:  this.Scale
        })
    }
}