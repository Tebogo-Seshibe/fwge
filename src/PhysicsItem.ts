import GameItem from './GameItem'

export class IPhysicsItem
{
    name = 'Physics Item', parent = undefined, body = undefined, collider = undefined, material = undefined
}

export default class PhysicsItem implements GameItem
{
    public Collider: Collider
    public Material: PhysicsMaterial
    public Body: PhysicsBody
    
    constructor({name, parent, body, collider, material} = {})
    {
        super(name, parent)
    }
}