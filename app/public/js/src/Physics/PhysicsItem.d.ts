import Collider from './Collision/Collider';
import Item from '../Item';
import PhysicsBody from './PhysicsBody';
import PhysicsMaterial from './PhysicsMaterial';
export declare class IPhysicsItem {
    name?: string;
    body?: PhysicsBody;
    collider?: Collider;
    material?: PhysicsMaterial;
}
export default class PhysicsItem extends Item {
    Collider: Collider;
    Material: PhysicsMaterial;
    Body: PhysicsBody;
    constructor({ name, body, collider, material }?: IPhysicsItem);
}
