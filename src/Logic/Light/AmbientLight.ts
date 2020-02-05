import Colour4 from '../../Render/Colour/Colour4';
import List from '../Utility/List';
import Light, { ShadowQuality } from './Light';

export const AmbientLights: List<AmbientLight> = new List<AmbientLight>(1)

export class IAmbientLight
{
    name?: string
    colour?: Colour4 | number[]
    intensity?: number
}

export default class AmbientLight extends Light
{
    constructor()
    constructor(ambientLight: IAmbientLight)
    constructor({ name = 'Directional Light', colour = [1, 1, 1], intensity = 1 }: IAmbientLight = new IAmbientLight)
    {
        super(name)

        this.Colour = new Colour4([ ...colour ])
        this.Intensity = intensity
        this.Shadows = ShadowQuality.NONE

        AmbientLights.Add(this)
    }
}