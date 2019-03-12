import LightItem, { ILightItem } from './LightItem'
import Vector3 from '..//Maths/Vector3'

export class IPointLight extends ILightItem
{
    name = 'Point Light'
    position: Vector3 | Float32Array | number[] = Vector3.ZERO
    radius: number = 5
    angle: number = 180
    shininess: number = 255
}

export default class PointLight extends LightItem
{
    public Position: Vector3
    public Radius: number
    public Angle: number
    public Shininess: number

    constructor({ name, position, colour, intensity, radius, angle, shininess }: IPointLight = new IPointLight)
    {
        super({ name, colour, intensity })

        this.Position = new Vector3(position)
        this.Radius = radius
        this.Angle = angle
        this.Shininess = shininess
    }
}