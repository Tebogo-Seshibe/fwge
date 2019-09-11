import Item from '../../Item';
import Vector3 from '../Maths/Vector3';
import ColliderMaterial from './PhysicsMaterial';
import Cloneable from '../Interfaces/Cloneable';

export class ICollider
{
    name?: string
    position?: Vector3 | Float32Array | number[]
}

export default class Collider extends Item implements Cloneable<Collider>
{
    public Position: Vector3
    public Material: ColliderMaterial
    
    constructor({name = 'Collider', position = [0, 0, 0]}: ICollider = new ICollider)
    {
        super(name)

        this.Position = new Vector3(position as number[])
    }

    public Clone(): Collider { return null }
}