import LightItem, { ILightItem } from './LightItem';
import Vector3 from '../Maths/Vector3';
export class IDirectionalLight extends ILightItem {
}
export default class DirectionalLight extends LightItem {
    constructor({ name = 'Directional Light', colour, intensity, direction = Vector3.ZERO } = new IDirectionalLight) {
        super(name, colour, intensity);
        this.Direction = new Vector3(direction);
    }
}
//# sourceMappingURL=DirectionalLight.js.map