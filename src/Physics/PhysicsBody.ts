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
    LockX: boolean = true
    LockY: boolean = true
    LockZ: boolean = true
    Velocity: number = 0
    Speed: number = 0
    
    constructor({name, mass, lockx, locky, lockz}: IPhysicsBody = new IPhysicsBody)
    {
        super(name)

        this.Mass = mass
        this.LockX = lockx
        this.LockY = locky
        this.LockZ = lockz
        this.Speed = 0
        this.Velocity = 0
    }
}