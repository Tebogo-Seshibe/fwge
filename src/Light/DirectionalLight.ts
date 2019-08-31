import Vector3 from '../Maths/Vector3';
import List from '../Utility/List';
import LightItem, { ILightItem } from './LightItem';

export let DirectionalLights: List<DirectionalLight> = new List<DirectionalLight>(3)

export class IDirectionalLight extends ILightItem
{
    direction?: Vector3 | Float32Array | number[]
}

export default class DirectionalLight extends LightItem
{
    public Direction: Vector3 = Vector3.ZERO

    constructor()
    constructor(directionalLight: IDirectionalLight)
    constructor({ name = 'Directional Light', colour, intensity, direction }: IDirectionalLight = new IDirectionalLight)
    {
        super({ name, colour, intensity })

        if (direction)
        {
            direction = new Vector3(direction as number[])
        }

        DirectionalLights.Add(this)
    }
}