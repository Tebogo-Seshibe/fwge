export interface IPhysicsBody
{
    Name?:  string;
    Mass?:  number;
    LockX?: boolean;
    LockY?: boolean;
    LockZ?: boolean;
}

/**
 * @name PhysicsBody
 * @description This object provides the masic physical properties of an object.
 * @module      FWGE.Physics
 */
export class PhysicsBody extends Item
{
    /**
     * @property    Mass: {Number} [read|write]
     * @description The mass of the gameobject this physics body is attached to.
     */
    public Mass     : number; 
    /**
     * @property    LockX: {Boolean} [read|write]
     * @description Determines whether gravity will affect it along the x-axis
     */
    public LockX    : boolean;
        /**
         * @property    LockY: {Boolean} [read|write]
         * @description Determines whether gravity will affect it along the y-axis
         */
    public LockY    : boolean;
        /**
         * @property    LockZ: {Boolean} [read|write]
         * @description Determines whether gravity will affect it along the z-axis
         */
    public LockZ    : boolean;
        /**
         * @property    Grounded: {Boolean} [read]
         * @description Determines whether the object is on top of another
         */
    public Grounded : boolean = false;
    /**
     * @property    Velocity: {Number} [read|write]
     * @description The mass of the gameobject this physics body is attached to.
     */
    public Velocity : number = 0.0;
    
    constructor(request: IPhysicsBody)
    {
        super(request.Name || "Phsyics Body");

        this.Mass = request.Mass || 1.0;
        this.LockX = request.LockX || true;
        this.LockY = request.LockY || true;
        this.LockZ = request.LockZ || true;
    }
}
