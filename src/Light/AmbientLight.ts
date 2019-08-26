import List from '../Utility/List';
import LightItem, { ILightItem } from './LightItem';

export let AmbientLights: List<AmbientLight> = new List<AmbientLight>(1)

export class IAmbientLight extends ILightItem
{

}

export default class AmbientLight extends LightItem
{
    constructor()
    constructor(ambientLight: IAmbientLight)
    constructor({ name = 'Ambient Light', colour, intensity }: IAmbientLight = new IAmbientLight)
    {
        super(name, colour, intensity)

        AmbientLights.Add(this)
    }
}