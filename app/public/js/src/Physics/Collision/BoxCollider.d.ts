import Collider, { ICollider } from './Collider';
export declare class IBoxCollider extends ICollider {
    height?: number;
    width?: number;
    breadth?: number;
}
export default class BoxCollider extends Collider {
    Height: number;
    Width: number;
    Breadth: number;
    constructor({ name, physicsitem, position, height, width, breadth }?: IBoxCollider);
}
