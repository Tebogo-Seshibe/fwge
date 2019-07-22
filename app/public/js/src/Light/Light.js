import DirectionalLight from './DirectionalLight';
import List from '../Utility/List';
import PointLight from './PointLight';
export let AmbientLights = new List(1);
export let DirectionalLights = new List(3);
export let PointLights = new List(12);
export function Add(light) {
    let list = light instanceof PointLight
        ? PointLights
        : light instanceof DirectionalLight
            ? DirectionalLights
            : AmbientLights;
    list.Add(light);
}
export function Remove(light) {
    let list = light instanceof PointLight
        ? PointLights
        : light instanceof DirectionalLight
            ? DirectionalLights
            : AmbientLights;
    list.Remove(light);
}
//# sourceMappingURL=Light.js.map