import Colour4 from '../Colour/Colour4'
import Item from '../Object/Item'

export enum ShadowQuality
{
    NONE,
    LOW,
    HIGH
}

export default class Light extends Item
{
    public Colour: Colour4
    public Intensity: number
    public Shadows: ShadowQuality

    constructor(name: string, colour: number[] | Float32Array, intensity: number, shadows: ShadowQuality)
    {
        super(name)

        this.Colour = new Colour4(colour as Float32Array)
        this.Intensity = intensity
        this.Shadows = shadows
    }
}