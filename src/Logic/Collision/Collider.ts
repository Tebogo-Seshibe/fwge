import Item from '../../Item';
import Cloneable from '../Interfaces/Cloneable';
import ColliderMaterial from './PhysicsMaterial';
import GameObject from '../GameObject';

export let Colliders: Collider[] = []

export class ICollider
{
    name?: string
    onCollisionEnter?: (other: Collider) => void
    onCollision?: (other: Collider) => void
    onCollisionExit?: (other: Collider) => void
}

export default class Collider extends Item implements Cloneable<Collider>
{
    public Parent: GameObject
    public Material: ColliderMaterial
    
    public OnCollisionEnter: (other: Collider) => void
    public OnCollision: (other: Collider) => void
    public OnCollisionExit: (other: Collider) => void

    public CollisionDetected: boolean
    
    constructor(
    {
        name = 'Collider',
        onCollisionEnter = function(other: Collider) { },
        onCollision = function(other: Collider) { },
        onCollisionExit = function(other: Collider) { }
    }: ICollider = new ICollider)
    {
        super(name)

        this.OnCollisionEnter = onCollisionEnter
        this.OnCollision = onCollision
        this.OnCollisionExit = onCollisionExit

        Colliders.push(this)
    }

    public Clone(): Collider { return null }
}