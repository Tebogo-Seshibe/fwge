import Light, { ShadowQuality } from './Light';

// export const AmbientLights: List<AmbientLight> = new List<AmbientLight>(1)
export const AmbientLights: Array<AmbientLight> = Array<AmbientLight>()

export interface IAmbientLight
{
    name?: string
    colour?: number[] | Float32Array
    intensity?: number
}

export default class AmbientLight extends Light
{
    constructor(ambientLight: IAmbientLight)
    constructor({ name = 'Directional Light', colour = [1, 1, 1, 1], intensity = 1 }: IAmbientLight)
    {
        super(name, colour, intensity, ShadowQuality.NONE)
        

        this.Colour = [ ...colour ]
        this.Intensity = intensity
        this.Shadows = ShadowQuality.NONE

        AmbientLights.push(this)
    }
}