import Collider, { ICollider } from './Collider';
export class ISphereCollider extends ICollider {
    constructor() {
        super(...arguments);
        this.radius = 1;
    }
}
export default class SphereCollider extends Collider {
    constructor({ name = 'Sphere Collider', position, physicsitem, radius = 1 } = new ISphereCollider) {
        super(name, position, physicsitem);
        this.Radius = radius;
    }
}
//# sourceMappingURL=SphereCollider.js.map