import { LookAt } from '../../Render/Projection';
import Matrix4 from '../Maths/Matrix4';
import Vector3 from '../Maths/Vector3';
import List from '../Utility/List';
import LightItem, { ILightItem } from './LightItem';

export let PointLights: List<PointLight> = new List<PointLight>(12)

export class IPointLight extends ILightItem
{
    position?: Vector3 | Float32Array | number[]
    radius?: number
    angle?: number
    shadows?: boolean
}

export default class PointLight extends LightItem
{
    public Position: Vector3
    public Radius: number
    public Angle: number
    public Shadows: boolean

    public LookAt(target: Vector3): Matrix4
    {
        return LookAt(this.Position, target, new Vector3(0, 1, 0))
    }

    constructor()
    constructor(pointLight: IPointLight)
    constructor(
    { 
        name = 'Point Light',
        colour,
        intensity,
        position,
        radius = 5,
        angle = 180,
        shadows = false
    }: IPointLight = new IPointLight)
    {
        super({ name, colour, intensity })

        this.Position = new Vector3(position as number[])
        this.Radius = radius
        this.Angle = angle
        this.Shadows = shadows

        PointLights.Add(this)
    }
}
