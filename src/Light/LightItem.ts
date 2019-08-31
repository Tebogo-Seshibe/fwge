import Item from '../Item';
import Colour4 from '../Render/Colour4';

export class ILightItem
{
    name: string
    colour?: Colour4 | Float32Array | number[]
    intensity?: number
}

export default class LightItem extends Item
{
    public Colour: Colour4 = new Colour4(255, 255, 255, 255)
    public Intensity: number = 1.0

    constructor()
    constructor(light: ILightItem)
    constructor({ name, colour, intensity}: ILightItem = new ILightItem)
    {
        super(name)

        if (colour)
        {
            this.Colour = new Colour4(colour as number[])
        }

        if (intensity)
        {
            this.Intensity = intensity
        }
    }
}