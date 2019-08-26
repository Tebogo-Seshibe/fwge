import Vector3 from '..//Maths/Vector3';
import List from '../Utility/List';
import LightItem, { ILightItem } from './LightItem';

export let PointLights: List<PointLight> = new List<PointLight>(12)

export class IPointLight extends ILightItem
{
    position: Vector3 | [number, number, number]
    radius: number
    angle: number
    shininess: number
}

export default class PointLight extends LightItem
{
    public Position: Vector3
    public Radius: number
    public Angle: number
    public Shininess: number

    constructor()
    constructor(pointLight: IPointLight)
    constructor({ name = 'Point Light', colour, intensity, position = [0, 0, 0], radius = 5, angle = 180, shininess = 32 }: IPointLight = new IPointLight)
    {
        super(name, colour, intensity)

        if (!(position instanceof Vector3))
        {
            position = new Vector3(position)
        }

        this.Position = new Vector3(position)
        this.Radius = radius
        this.Angle = angle
        this.Shininess = shininess

        PointLights.Add(this)
    }
}