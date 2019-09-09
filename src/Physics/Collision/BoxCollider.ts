import Collider, { ICollider } from './Collider';

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
    
    constructor()
    constructor(boxCollider: IBoxCollider)
    constructor({ name = 'BoxCollider', position, height = 1.0, width = 1.0, breadth = 1.0 }: IBoxCollider = new IBoxCollider)
    {
        super({ name, position })

        this.Height = height
        this.Width = width
        this.Breadth = breadth
    }
}
