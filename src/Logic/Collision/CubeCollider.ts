import Vector3 from '../Maths/Vector3';
import Collider, { ICollider } from './Collider';

export class ICubeCollider extends ICollider
{
    position: Vector3 | Float32Array | number[]
    height?: number
    width?: number
    breadth?: number
}

export default class CubeCollider extends Collider
{
    public Position: Vector3 | Float32Array | number[]
    public Height: number
    public Width: number
    public Breadth: number
    
    constructor()
    constructor(boxCollider: ICubeCollider)
    constructor({ name = 'BoxCollider', position = [0, 0, 0], height = 1.0, width = 1.0, breadth = 1.0 }: ICubeCollider = new ICubeCollider)
    {
        super({ name })

        this.Position = new Vector3(position as number[])
        this.Height = height
        this.Width = width
        this.Breadth = breadth
    }

    public Clone(): CubeCollider
    {
        return new CubeCollider(
        {
            name:       this.Name + ' Clone',
            position:   this.Position,
            height:     this.Height,
            width:      this.Width,
            breadth:    this.Breadth
        })
    }
}
