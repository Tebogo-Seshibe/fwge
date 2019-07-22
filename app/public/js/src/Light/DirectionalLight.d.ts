import LightItem, { ILightItem } from './LightItem';
import Vector3 from '../Maths/Vector3';
export declare class IDirectionalLight extends ILightItem {
    direction: Vector3 | Float32Array | Array<number>;
}
export default class DirectionalLight extends LightItem {
    Direction: Vector3;
    constructor({ name, colour, intensity, direction }?: IDirectionalLight);
}
