import Vector3 from '../Maths/Vector3';
import List from '../Utility/List';
import LightItem, { ILightItem } from './LightItem';

export let PointLights: List<PointLight> = new List<PointLight>(12)

export class IPointLight extends ILightItem
{
    position?: Vector3 | Float32Array | number[]
    radius?: number
    angle?: number
    shininess?: number
    shadows?: boolean
}

export default class PointLight extends LightItem
{
    public Position: Vector3
    public Radius: number
    public Angle: number
    public Shininess: number
    public Shadows: boolean

    constructor()
    constructor(pointLight: IPointLight)
    constructor(
    { 
        name = 'Point Light',
        colour,
        intensity,
        position,
        radius = 5,
        angle = 180,
        shininess = 32,
        shadows = false
    }: IPointLight = new IPointLight)
    {
        super({ name, colour, intensity })

        this.Position = new Vector3(position as number[])
        this.Radius = radius
        this.Angle = angle
        this.Shininess = shininess
        this.Shadows = shadows

        PointLights.Add(this)
    }
}
