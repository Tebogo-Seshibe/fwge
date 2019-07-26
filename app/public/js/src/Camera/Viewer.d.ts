import Camera, { ICamera } from './Camera';
import Matrix4 from '../Maths/Matrix4';
import Updateable from '../Interfaces/Updateable';
import Vector3 from '../Maths/Vector3';
export declare class IViewer extends ICamera {
    position: Vector3;
    target: Vector3;
}
export default class Viewer extends Camera implements Updateable {
    Position: Vector3;
    Target: Vector3;
    private Up;
    private Matrix;
    readonly ViewMatrix: Matrix4;
    constructor({ name, mode, fieldOfView, aspectRatio, nearClipping, farClipping, left, right, top, bottom, horizontalTilt, vericalTilt, position, target }?: IViewer);
    Update(): void;
}
