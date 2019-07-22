import Item from '../Item';
export declare class IPhysicsBody {
    name?: string;
    mass?: number;
    lockx?: boolean;
    locky?: boolean;
    lockz?: boolean;
}
export default class PhysicsBody extends Item {
    Mass: number;
    LockX: boolean;
    LockY: boolean;
    LockZ: boolean;
    Velocity: number;
    Speed: number;
    constructor({ name, mass, lockx, locky, lockz }?: IPhysicsBody);
}
