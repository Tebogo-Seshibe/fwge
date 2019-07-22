import LightItem, { ILightItem } from './LightItem';
import Vector3 from '..//Maths/Vector3';
export class IPointLight extends ILightItem {
}
export default class PointLight extends LightItem {
    constructor({ name = 'Point Light', colour, intensity, position = Vector3.ZERO, radius = 5, angle = 180, shininess = 32 } = new IPointLight) {
        super(name, colour, intensity);
        this.Position = new Vector3(position);
        this.Radius = radius;
        this.Angle = angle;
        this.Shininess = shininess;
    }
}
//# sourceMappingURL=PointLight.js.map