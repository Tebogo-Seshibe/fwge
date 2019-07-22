import Item from '../../Item';
import PhysicsItem from '../PhysicsItem';
import Vector3 from '../../Maths/Vector3';
export declare class ICollider {
    name?: string;
    position?: Vector3;
    physicsitem?: any;
}
export default class Collider extends Item {
    Position: Vector3;
    PhysicsItem: PhysicsItem;
    constructor(name: string, position?: Vector3, physicsitem?: any);
}
