import Collider, { ICollider } from './Collider';
export class IBoxCollider extends ICollider {
}
export default class BoxCollider extends Collider {
    constructor({ name = 'BoxCollider', physicsitem, position, height = 1, width = 1, breadth = 1 } = new IBoxCollider) {
        super(name, position, physicsitem);
        this.Height = height;
        this.Width = width;
        this.Breadth = breadth;
    }
}
//# sourceMappingURL=BoxCollider.js.map