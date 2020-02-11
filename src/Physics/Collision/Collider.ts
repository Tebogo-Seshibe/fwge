import Item from '../../Logic/Object/Item';
import Cloneable from '../../Logic/Interfaces/Cloneable';
import ColliderMaterial from './PhysicsMaterial';
import GameObject from '../../Logic/Object/GameObject';
import Updateable from '../../Logic/Interfaces/Updateable';

export let Colliders: Collider[] = []

export class ICollider
{
    name?: string
}

export default class Collider extends Item implements Cloneable<Collider>, Updateable
{
    public Parent: GameObject
    public Material: ColliderMaterial
    public CollisionDetected: boolean
    
    constructor({ name = 'Collider' }: ICollider = new ICollider)
    {
        super(name)

        Colliders.push(this)
    }

    public Clone(): Collider { return null }

    public Update(): void { }
}