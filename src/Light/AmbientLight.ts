import LightItem, { ILightItem } from './LightItem'

class IAmbientLight extends ILightItem
{

}

export default class AmbientLight extends LightItem
{
    constructor({ name, colour, intensity }: IAmbientLight = new IAmbientLight)
    {
        super({ name, colour, intensity })
    }
}