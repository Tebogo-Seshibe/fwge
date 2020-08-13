import Vector2 from '../../Maths/Vector2';
import Collider, { ICollider } from './Collider';

export class ISquareCollider extends ICollider
{
    position: Vector2 | Float32Array | number[]
    height?: number
    width?: number
}

export default class SquareCollider extends Collider
{
    public Position: Vector2 | Float32Array | number[]
    public Height: number
    public Width: number
    
    constructor()
    constructor(boxCollider: ISquareCollider)
    constructor({ name = 'BoxCollider', position = [0, 0, 0], height = 1.0, width = 1.0 }: ISquareCollider = new ISquareCollider)
    {
        super({ name })

        this.Position = new Vector2(position as number[])
        this.Height = height
        this.Width = width
    }

    public Clone(): SquareCollider
    {
        return new SquareCollider(
        {
            name:       this.Name + ' Clone',
            position:   this.Position,
            height:     this.Height,
            width:      this.Width
        })
    }
}
