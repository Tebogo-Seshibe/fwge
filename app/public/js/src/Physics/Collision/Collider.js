import Item from '../../Item';
import Vector3 from '../../Maths/Vector3';
export class ICollider {
}
export default class Collider extends Item {
    constructor(name, position = Vector3.ZERO, physicsitem = null) {
        super(name);
        this.Position = new Vector3(position);
        this.PhysicsItem = physicsitem;
    }
}
//# sourceMappingURL=Collider.js.map