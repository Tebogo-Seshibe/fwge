import Cloneable from '../../Interfaces/Cloneable';
import Updateable from '../../Interfaces/Updateable';
import GameObject from '../../Object/GameObject';
import Item from '../../Object/Item';
import ColliderMaterial from './PhysicsMaterial';

export let Colliders: Collider[] = []

export class ICollider
{
    name?: string
}

export default class Collider extends Item implements Cloneable<Collider>, Updateable
{
    public Parent: GameObject
    public Material: ColliderMaterial
    
    constructor({ name = 'Collider' }: ICollider = new ICollider)
    {
        super(name)

        Colliders.push(this)
    }

    public Clone(): Collider { return null }

    public Update(): void { }
}