import Item from '../Item';
import Collider from './Collision/Collider';
import RigidBody from './PhysicsBody';
import PhysicsMaterial from './PhysicsMaterial';

export class IPhysicsItem
{
    name?: string
    body?: RigidBody
    collider?: Collider
    material?: PhysicsMaterial
}

export default class PhysicsItem extends Item
{
    public Body: RigidBody
    public Collider: Collider
    public Material: PhysicsMaterial
    
    constructor()
    constructor(physicsItem: IPhysicsItem)
    constructor({ name = 'Physics Item', body, collider, material }: IPhysicsItem = new IPhysicsItem)
    {
        super(name)

        this.Collider = collider
        this.Material = material
        this.Body = body
    }
}