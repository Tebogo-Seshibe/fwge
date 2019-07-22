import LightItem, { ILightItem } from './LightItem'
import Vector3 from '..//Maths/Vector3'

export class IPointLight extends ILightItem
{
    position: Vector3 | Float32Array | number[]
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

    constructor({ name = 'Point Light', colour, intensity, position = Vector3.ZERO, radius = 5, angle = 180, shininess = 32 }: IPointLight = new IPointLight)
    {
        super(name, colour, intensity)

        this.Position = new Vector3(position)
        this.Radius = radius
        this.Angle = angle
        this.Shininess = shininess
    }
}