import Item from '../Item';

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
    public Mass: number = 1
    public LockX: boolean = true
    public LockY: boolean = false
    public LockZ: boolean = true
    public Velocity: number = 0
    public Speed: number = 0
    
    constructor()
    constructor(physicsBody: IPhysicsBody)
    constructor({ name = 'Physics Body', mass, lockx, locky, lockz }: IPhysicsBody = new IPhysicsBody)
    {
        super(name)

        this.Mass = mass
        
        if (lockx !== undefined)
        {
            this.LockX = lockx
        }
        
        if (locky !== undefined)
        {
            this.LockY = locky
        }
        
        if (lockz !== undefined)
        {
            this.LockZ = lockz
        }
    }
}