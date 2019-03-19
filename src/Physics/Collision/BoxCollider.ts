import Collider, { ICollider } from './Collider'

export class IBoxCollider extends ICollider
{
    height?: number
    width?: number
    breadth?: number
}

export default class BoxCollider extends Collider
{
    public Height: number
    public Width: number
    public Breadth: number
    
    constructor({ name = 'BoxCollider', physicsitem, position, height = 1, width = 1, breadth = 1 }: IBoxCollider = new IBoxCollider)
    {
        super(name, position, physicsitem)

        this.Height = height
        this.Width = width
        this.Breadth = breadth
    }
}
