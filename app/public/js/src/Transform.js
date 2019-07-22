import Vector3 from './Maths/Vector3';
export class ITransform {
}
export default class Transform {
    constructor({ position = Vector3.ZERO, rotation = Vector3.ZERO, scale = Vector3.ONE, shear = Vector3.ZERO } = new ITransform) {
        this.Position = new Vector3(position);
        this.Rotation = new Vector3(rotation);
        this.Scale = new Vector3(scale);
        this.Shear = new Vector3(shear);
    }
    static get UP() {
        return new Vector3(0, 1, 0);
    }
    static get FORWARD() {
        return new Vector3(0, 0, 1);
    }
    static get RIGHT() {
        return new Vector3(1, 0, 0);
    }
}
//# sourceMappingURL=Transform.js.map