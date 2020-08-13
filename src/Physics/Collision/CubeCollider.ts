import Vector3 from '../../Maths/Vector3';
import Collider, { ICollider } from './Collider';

export class ICubeCollider extends ICollider
{
    offset?: Float32Array | number[]
    height?: number
    width?: number
    breadth?: number
}

export default class CubeCollider extends Collider
{
    public Offset: Vector3
    public Height: number
    public Width: number
    public Breadth: number
    
    private position: Vector3
    public get Position(): Vector3
    {
        return this.position.Clone()
    }

    constructor()
    constructor(boxCollider: ICubeCollider)
    constructor({ name = 'CubeCollider', offset = [0, 0, 0], height = 1.0, width = 1.0, breadth = 1.0 }: ICubeCollider = new ICubeCollider)
    {
        super({ name })

        this.Offset = new Vector3(offset as number[])
        this.Height = height
        this.Width = width
        this.Breadth = breadth
        
        this.position = new Vector3()
    }

    public Clone(): CubeCollider
    {
        return new CubeCollider(
        {
            name:       this.Name + ' Clone',
            offset:     this.Offset,
            height:     this.Height,
            width:      this.Width,
            breadth:    this.Breadth
        })
    }

    public Update(): void
    {
        this.position.Set(this.Parent.Transform.Position).Sum(this.Offset)
    }
}
