import Item from '../../Item';
import Vector3 from '../../Logic/Maths/Vector3';

export class ICollider
{
    name?: string
    position?: Vector3 | Float32Array | number[]
}

export default class Collider extends Item
{
    public Position: Vector3
    
    constructor({name = 'Collider', position = [0, 0, 0]}: ICollider = new ICollider)
    {
        super(name)

        this.Position = new Vector3(position as number[])
    }
}