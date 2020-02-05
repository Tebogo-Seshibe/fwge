import Colour4 from '../../Render/Colour/Colour4';
import Vector3 from '../Maths/Vector3';
import List from '../Utility/List';
import Light, { ShadowQuality } from './Light';

export const MAX_POINT_LIGHT: number = 12

export const PointLights: List<PointLight> = new List<PointLight>(MAX_POINT_LIGHT)

export class IPointLight
{
    name?: string
    colour?: Colour4 | number[]
    intensity?: number
    position?: Vector3 | number[]
    radius?: number
    angle?: number
    shadows?: ShadowQuality
}

export default class PointLight extends Light
{
    public Position: Vector3
    public Radius: number
    public Angle: number
    public Shadows: ShadowQuality

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
        super(name)

        this.Colour = new Colour4([ ...colour ])
        this.Intensity = intensity
        this.Position = new Vector3([ ...position ])
        this.Radius = radius
        this.Angle = angle
        this.Shadows = shadows

        PointLights.Add(this)
    }
}
