import LightItem, { ILightItem } from './LightItem'
import Vector3 from '../Maths/Vector3'

export class IDirectionalLight extends ILightItem
{
    direction: Vector3 | Float32Array | Array<number>
}

export default class DirectionalLight extends LightItem
{
    public Direction: Vector3

    constructor({ name = 'Directional Light', colour, intensity, direction = Vector3.ZERO }: IDirectionalLight = new IDirectionalLight)
    {
        super(name, colour, intensity)

        this.Direction = new Vector3(direction)
    }
}