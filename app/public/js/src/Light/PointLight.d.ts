import LightItem, { ILightItem } from './LightItem';
import Vector3 from '..//Maths/Vector3';
export declare class IPointLight extends ILightItem {
    position: Vector3 | Float32Array | number[];
    radius: number;
    angle: number;
    shininess: number;
}
export default class PointLight extends LightItem {
    Position: Vector3;
    Radius: number;
    Angle: number;
    Shininess: number;
    constructor({ name, colour, intensity, position, radius, angle, shininess }?: IPointLight);
}
