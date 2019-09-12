import Collider, { ICollider } from './Collider';

export class IBoxCollider extends ICollider
{
    height?: number
    width?: number
}

export default class SquareCollider extends Collider
{
    public Height: number
    public Width: number
    
    constructor()
    constructor(boxCollider: IBoxCollider)
    constructor({ name = 'BoxCollider', transform, height = 1.0, width = 1.0 }: IBoxCollider = new IBoxCollider)
    {
        super({ name, transform })

        this.Height = height
        this.Width = width
    }

    public Clone(): SquareCollider
    {
        return new SquareCollider(
        {
            name:       this.Name + ' Clone',
            transform:  this.Transform.Clone(),
            height:     this.Height,
            width:      this.Width
        })
    }
}
