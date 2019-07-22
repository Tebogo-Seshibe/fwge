import AmbientLight from './AmbientLight'
import DirectionalLight from './DirectionalLight'
import LightItem from './LightItem'
import List from '../Utility/List'
import PointLight from './PointLight'

export let AmbientLights: List<AmbientLight> = new List(1)
export let DirectionalLights: List<DirectionalLight> = new List(3)
export let PointLights: List<PointLight> = new List(12)

export function Add(ambientLight: AmbientLight): void
export function Add(directionalLight: DirectionalLight): void
export function Add(pointLight: PointLight): void
export function Add(light: AmbientLight | DirectionalLight | PointLight): void
{
    let list = light instanceof PointLight
        ? PointLights
        : light instanceof DirectionalLight
            ? DirectionalLights
            : AmbientLights

    list.Add(light)
}

export function Remove(light: LightItem): void
{
    let list = light instanceof PointLight
        ? PointLights
        : light instanceof DirectionalLight
            ? DirectionalLights
            : AmbientLights
    
    list.Remove(light)
}