import Camera, { ICamera } from './Camera';
import Matrix4 from '../Maths/Matrix4';
import Vector3 from '../Maths/Vector3';
export class IViewer extends ICamera {
    constructor() {
        super(...arguments);
        this.position = Vector3.ZERO;
        this.target = Vector3.ZERO;
    }
}
export default class Viewer extends Camera {
    constructor({ name = 'Viewer', mode, fieldOfView, aspectRatio, nearClipping, farClipping, left, right, top, bottom, horizontalTilt, vericalTilt, position, target } = new IViewer) {
        super(name, mode, fieldOfView, aspectRatio, nearClipping, farClipping, left, right, top, bottom, horizontalTilt, vericalTilt);
        this.Up = new Vector3(0, 1, 0);
        this.Matrix = Matrix4.IDENTITY;
        this.Position = new Vector3(position);
        this.Target = new Vector3(target);
    }
    get ViewMatrix() {
        return this.Matrix.Clone();
    }
    Update() {
        super.Update();
        let n = this.Position.Clone().Diff(this.Target).Unit();
        let u = this.Up.Clone().Cross(n).Unit();
        let v = n.Clone().Cross(u).Unit();
        let p = this.Position;
        this.Matrix.Set(v.X, v.Y, v.Z, 0, u.X, u.Y, u.Z, 0, n.X, n.Y, n.Z, 0, 0, 0, 0, 1).Mult(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, p.X, p.Y, p.Z, 1);
    }
}
//# sourceMappingURL=Viewer.js.map