// import Colour4 from '../Colour/Colour4';
// import List from '../Utility/List';
import Light, { ShadowQuality } from './Light';

// export const AmbientLights: List<AmbientLight> = new List<AmbientLight>(1)
export const AmbientLights: Array<AmbientLight> = Array<AmbientLight>()

export class IAmbientLight
{
    name?: string
    colour?: [number, number, number, number]
    intensity?: number
}

export default class AmbientLight extends Light
{
    constructor()
    constructor(ambientLight: IAmbientLight)
    constructor({ name = 'Directional Light', colour = [1, 1, 1, 1], intensity = 1 }: IAmbientLight = new IAmbientLight)
    {
        super(name)

        this.Colour = [ ...colour ]
        this.Intensity = intensity
        this.Shadows = ShadowQuality.NONE

        AmbientLights.push(this)
    }
}