import Vector2 from '../../Maths/Vector2';
import Collider, { ICollider } from './Collider';

export class ICircleCollider extends ICollider
{
    radius: number
    position: Vector2 | Float32Array | number[]
    scale: Vector2 | Float32Array | number[]
}

export default class CircleCollider extends Collider
{
    public Radius: number
    public Position: Vector2
    public Scale: Vector2

    constructor()
    constructor(sphereCollider: ICircleCollider)
    constructor({ name = 'Sphere Collider', position = [0, 0], scale = [1, 1], radius = 1.0 }: ICircleCollider = new ICircleCollider)
    {
        super({ name })

        this.Radius = radius
        this.Position = new Vector2(position as number[])
        this.Scale = new Vector2(scale as number[])
    }
    
    public Clone(): CircleCollider
    {
        return new CircleCollider(
        {
            radius:     this.Radius,
            position:   this.Position,
            scale:      this.Scale
        })
    }
}