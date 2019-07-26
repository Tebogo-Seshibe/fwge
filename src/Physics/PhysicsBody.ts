import Item from '../Item'

export class IPhysicsBody
{
    name?: string
    mass?: number
    lockx?: boolean
    locky?: boolean
    lockz?: boolean
}

export default class PhysicsBody extends Item
{
    public Mass: number
    public LockX: boolean
    public LockY: boolean
    public LockZ: boolean
    public Velocity: number
    public Speed: number
    
    constructor()
    constructor(physicsBody: IPhysicsBody)
    constructor({ name = 'Physics Body', mass = 1, lockx = true, locky = true, lockz = true }: IPhysicsBody = new IPhysicsBody)
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