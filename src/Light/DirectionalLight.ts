import LightItem, { ILightItem } from './LightItem';
import Vector3 from '../../Utility/Maths/Vector3';

export class IDirectionalLight extends ILightItem
{
    name: string = 'Directional Light'
    direction: Vector3 | Float32Array | number[] = Vector3.ZERO
}

export default class DirectionalLight extends LightItem
{
    public Direction: Vector3

    constructor({name, colour, intensity, direction}: IDirectionalLight = new IDirectionalLight)
    {
        super({name, colour, intensity})

        this. Direction = new Vector3(direction)
    }
}