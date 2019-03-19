import LightItem, { ILightItem } from './LightItem'

class IAmbientLight extends ILightItem
{

}

export default class AmbientLight extends LightItem
{
    constructor({ name = 'Ambient Light', colour, intensity }: IAmbientLight = new IAmbientLight)
    {
        super(name, colour, intensity)
    }
}