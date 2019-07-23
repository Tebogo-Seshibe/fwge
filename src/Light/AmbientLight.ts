import LightItem, { ILightItem } from './LightItem'
import List from '../Utility/List'

export let AmbientLights: List<AmbientLight> = new List<AmbientLight>(1)

export class IAmbientLight extends ILightItem
{

}

export default class AmbientLight extends LightItem
{
    constructor({ name = 'Ambient Light', colour, intensity }: IAmbientLight = new IAmbientLight)
    {
        super(name, colour, intensity)

        AmbientLights.Add(this)
    }
}