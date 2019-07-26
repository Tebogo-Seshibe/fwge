import LightItem, { ILightItem } from './LightItem';
declare class IAmbientLight extends ILightItem {
}
export default class AmbientLight extends LightItem {
    constructor({ name, colour, intensity }?: IAmbientLight);
}
export {};
