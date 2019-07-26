import Collider, { ICollider } from './Collider';
export declare class ISphereCollider extends ICollider {
    radius: number;
}
export default class SphereCollider extends Collider {
    Radius: number;
    constructor({ name, position, physicsitem, radius }?: ISphereCollider);
}
