import LightItem, { ILightItem } from './LightItem'
import Vector3 from '../Maths/Vector3'
import List from '../Utility/List'

export let DirectionalLights: List<DirectionalLight> = new List<DirectionalLight>(3)

export class IDirectionalLight extends ILightItem
{
    direction: Vector3 | [number, number, number]
}

export default class DirectionalLight extends LightItem
{
    public Direction: Vector3

    constructor()
    constructor(directionalLight: IDirectionalLight)
    constructor({ name = 'Directional Light', colour, intensity, direction = Vector3.ZERO }: IDirectionalLight = new IDirectionalLight)
    {
        super(name, colour, intensity)

        if (!(direction instanceof Vector3))
        {
            direction = new Vector3(direction)
        }

        this.Direction = new Vector3(direction)

        DirectionalLights.Add(this)
    }
}