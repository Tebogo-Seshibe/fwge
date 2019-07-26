import Item from '../Item';
export class IPhysicsItem {
}
export default class PhysicsItem extends Item {
    constructor({ name = 'Physics Item', body, collider, material } = new IPhysicsItem()) {
        super(name);
        this.Collider = collider;
        this.Material = material;
        this.Body = body;
    }
}
//# sourceMappingURL=PhysicsItem.js.map