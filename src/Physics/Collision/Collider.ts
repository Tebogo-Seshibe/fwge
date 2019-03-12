import Item from '../../Item'
import PhysicsItem from '../PhysicsItem'
import Vector3 from '../../Maths/Vector3'

export class ICollider
{
    name: string = 'Collider'
    position: Vector3 = Vector3.ZERO
    physicsitem: any = undefined
}

export default class Collider extends Item
{
    public Position: Vector3
    public PhysicsItem: PhysicsItem
    
    constructor({ name, position, physicsitem }: ICollider)
    {
        super(name)

        this.Position = new Vector3(position)
        this.PhysicsItem = physicsitem
    }
}