import LightItem, { ILightItem } from './LightItem';
class IAmbientLight extends ILightItem {
}
export default class AmbientLight extends LightItem {
    constructor({ name = 'Ambient Light', colour, intensity } = new IAmbientLight) {
        super(name, colour, intensity);
    }
}
//# sourceMappingURL=AmbientLight.js.map