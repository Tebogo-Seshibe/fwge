import FWGE from '../FWGE';
import Item from '../Item';
export var ViewMode;
(function (ViewMode) {
    ViewMode[ViewMode["PERSPECTIVE"] = 0] = "PERSPECTIVE";
    ViewMode[ViewMode["ORTHOGRAPHIC"] = 1] = "ORTHOGRAPHIC";
})(ViewMode || (ViewMode = {}));
export class ICamera {
}
export let Cameras = [];
export default class Camera extends Item {
    static get Main() {
        return Cameras[0];
    }
    static set Main(camera) {
        Cameras[0] = camera;
    }
    constructor(name, mode = ViewMode.PERSPECTIVE, fieldOfView = 35, aspectRatio = 16 / 9, nearClipping = 0.001, farClipping = 10000, left = -10, right = 10, top = 10, bottom = -10, horizontalTilt = 90, vericalTilt = 90) {
        super(name);
        this.Mode = mode;
        this.FieldOfView = fieldOfView;
        this.AspectRatio = aspectRatio;
        this.NearClipping = nearClipping;
        this.FarClipping = farClipping;
        this.Left = left;
        this.Right = right;
        this.Top = top;
        this.Bottom = bottom;
        this.HorizontalTilt = horizontalTilt;
        this.VericalTilt = vericalTilt;
        Cameras.push(this);
    }
    Update() {
        this.AspectRatio = FWGE.GL.canvas.clientWidth / FWGE.GL.canvas.clientHeight;
    }
}
new Camera('Main Camera');
//# sourceMappingURL=Camera.js.map