import Collider, { ICollider } from './Collider';

export class IBoxCollider extends ICollider
{
    height?: number
    width?: number
    breadth?: number
}

export default class BoxCollider extends Collider
{
    public Height: number = 1
    public Width: number = 1
    public Breadth: number = 1
    
    constructor()
    constructor(boxCollider: IBoxCollider)
    constructor({ name = 'BoxCollider', physicsitem, position, height, width, breadth }: IBoxCollider = new IBoxCollider)
    {
        super(name, position, physicsitem)

        this.Height = height
        this.Width = width
        this.Breadth = breadth
    }
}
