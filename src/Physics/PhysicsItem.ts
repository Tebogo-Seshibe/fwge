import Item from '../Item'
import PhysicsBody from './PhysicsBody'
import PhysicsMaterial from './PhysicsMaterial'
import Collider from './Collision/Collider'

export class IPhysicsItem
{
    name = 'Physics Item'
    body: PhysicsBody = undefined
    collider: Collider = undefined
    material: PhysicsMaterial = undefined
}

export default class PhysicsItem extends Item
{
    public Collider: Collider
    public Material: PhysicsMaterial
    public Body: PhysicsBody
    
    constructor({name, body, collider, material}: IPhysicsItem = new IPhysicsItem)
    {
        super(name)
        this.Collider = collider
        this.Material = material
        this.Body = body
    }
}