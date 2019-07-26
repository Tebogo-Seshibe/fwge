import Colour4 from '../Render/Colour4';
import Item from '../Item';
export declare class ILightItem {
    name: string;
    colour: Colour4 | Float32Array | number[];
    intensity: number;
}
export default class LightItem extends Item {
    Colour: Colour4;
    Intensity: number;
    constructor(name: string, colour?: Colour4 | Float32Array | number[], intensity?: number);
}
