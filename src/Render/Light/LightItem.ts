import Item from '../../Item';
import Colour4 from '../Colour/Colour4';

export class ILightItem
{
    name: string
    colour?: Colour4 | Float32Array | number[]
    intensity?: number
}

export default class LightItem extends Item
{
    public Colour: Colour4
    public Intensity: number

    constructor()
    constructor(light: ILightItem)
    constructor({ name, colour = [255,255,255,255], intensity = 1.0}: ILightItem = new ILightItem)
    {
        super(name)

        this.Colour = new Colour4(colour as number[])
        this.Intensity = intensity
    }
}