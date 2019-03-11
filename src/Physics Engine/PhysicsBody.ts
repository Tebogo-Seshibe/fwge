import Item from '../Item'

export class IPhysicsBody
{
    name: string = 'Physics Body'
    mass: number = 1
    lockx: boolean = true
    locky: boolean = true
    lockz: boolean = true
}

export default class PhysicsBody extends Item
{
    Mass: number = 1
    Velocity: number = 0
    Speed: number = 0
    LockX: boolean = true
    LockY: boolean = true
    LockZ: boolean = true
    
    constructor({name, mass, lockx, locky, lockz}: IPhysicsBody = new IPhysicsBody)
    {
        super(name)
    }
}