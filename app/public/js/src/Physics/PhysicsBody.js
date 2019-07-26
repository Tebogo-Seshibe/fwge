import Item from '../Item';
export class IPhysicsBody {
}
export default class PhysicsBody extends Item {
    constructor({ name = 'Physics Body', mass = 1, lockx = true, locky = true, lockz = true } = new IPhysicsBody()) {
        super(name);
        this.Mass = mass;
        this.LockX = lockx;
        this.LockY = locky;
        this.LockZ = lockz;
        this.Speed = 0;
        this.Velocity = 0;
    }
}
//# sourceMappingURL=PhysicsBody.js.map