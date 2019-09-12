import Item from '../../Item';
import Cloneable from '../Interfaces/Cloneable';
import ColliderMaterial from './PhysicsMaterial';
import Transform from '../Transform';

export class ICollider
{
    name?: string
    transform?: Transform
}

export default class Collider extends Item implements Cloneable<Collider>
{
    public Transform: Transform
    public Material: ColliderMaterial
    
    constructor({ name = 'Collider', transform }: ICollider = new ICollider)
    {
        super(name)

        this.Transform = transform
    }

    public Clone(): Collider { return null }
}