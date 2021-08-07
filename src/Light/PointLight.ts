// import Colour4 from '../Colour/Colour4';
// import Vector3 from '../Maths/Vector3';
// import List from '../Utility/List';
import Light, { ShadowQuality } from './Light';

export const MAX_POINT_LIGHT: number = 12

// export const PointLights: List<PointLight> = new List<PointLight>(MAX_POINT_LIGHT)
export const PointLights: Array<PointLight> = new Array<PointLight>()

export class IPointLight
{
    name?: string
    colour?: number[]
    intensity?: number
    position?: number[]
    radius?: number
    angle?: number
    shadows?: ShadowQuality
}

export default class PointLight extends Light
{
    public Position: number[]
    public Radius: number
    public Angle: number

    constructor()
    constructor(pointLight: IPointLight)
    constructor(
    { 
        name = 'Point Light',
        colour = [1, 1, 1, 1],
        intensity = 1,
        position = [0, 0, 0],
        radius = 5,
        angle = 180,
        shadows = ShadowQuality.NONE 
    }: IPointLight = new IPointLight)
    {
        super(name, colour, intensity, shadows)
        
        this.Position = [ ...position ]
        this.Radius = radius
        this.Angle = angle

        PointLights.push(this)
    }
}
