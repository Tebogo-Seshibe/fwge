import Item from '../Item';
export declare class IPhysicsMaterial {
    name?: string;
}
export default class PhysicsMaterial extends Item {
    constructor({ name }?: IPhysicsMaterial);
}
