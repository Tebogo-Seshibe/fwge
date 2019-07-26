import Colour4 from '../Render/Colour4';
import Item from '../Item';
export class ILightItem {
}
export default class LightItem extends Item {
    constructor(name, colour = [255, 255, 255, 255], intensity = 1) {
        super(name);
        this.Colour = new Colour4(colour);
        this.Intensity = intensity;
    }
}
//# sourceMappingURL=LightItem.js.map