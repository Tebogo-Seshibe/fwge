import Vector3 from '..//Maths/Vector3';
import List from '../Utility/List';
import LightItem, { ILightItem } from './LightItem';

export let PointLights: List<PointLight> = new List<PointLight>(12)

export class IPointLight extends ILightItem
{
    position?: Vector3 | Float32Array | number[]
    radius?: number
    angle?: number
    shininess?: number
}

export default class PointLight extends LightItem
{
    public Position: Vector3 = Vector3.ZERO
    public Radius: number = 5
    public Angle: number = 180
    public Shininess: number = 32

    constructor()
    constructor(pointLight: IPointLight)
    constructor({ name = 'Point Light', colour, intensity, position, radius, angle, shininess }: IPointLight = new IPointLight)
    {
        super({ name, colour, intensity })

        if (position)
        {
            this.Position = new Vector3(position as number[])
        }

        if (radius)
        {
            this.Radius = radius
        }

        if (angle)
        {
            this.Angle = angle
        }

        if (shininess)
        {
            this.Shininess = shininess
        }

        PointLights.Add(this)
    }
}