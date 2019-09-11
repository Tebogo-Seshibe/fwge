import Item from '../Item';
import Cloneable from './Interfaces/Cloneable';

export class IRigidBody
{
    name?: string
    mass?: number
    lockx?: boolean
    locky?: boolean
    lockz?: boolean
}

export default class RigidBody extends Item implements Cloneable<RigidBody>
{
    public Mass: number
    public LockX: boolean
    public LockY: boolean
    public LockZ: boolean
    
    private speed: number

    public get Velocity(): number
    {
        return 0
    }

    public get Speed(): number
    {
        return this.speed
    }
    
    constructor()
    constructor(physicsBody: IRigidBody)
    constructor({ name = 'Physics Body', mass = 1.0, lockx = true, locky = false, lockz = false }: IRigidBody = new IRigidBody)
    {
        super(name)

        this.Mass = mass
        this.LockX = lockx
        this.LockY = locky
        this.LockZ = lockz
    }

    public Clone(): RigidBody
    {
        return new RigidBody(
        {
            mass:   this.Mass,
            lockx:  this.LockX,
            locky:  this.LockY,
            lockz:  this.LockZ
        })
    }
}