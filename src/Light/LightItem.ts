import Colour4 from '../../Colour'
import Item from '../Item';

export class ILightItem
{
    name: string = 'Light'
    colour: Colour4 | Float32Array | number[]
    intensity: number
}

export default class LightItem extends Item
{
    public Colour: Colour4
    public Intensity: number

    constructor({name, colour, intensity}: ILightItem = new ILightItem)
    {
        super(name)

        this.Colour = new Colour4(colour)
        this.Intensity = intensity
    }
}
