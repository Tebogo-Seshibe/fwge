import LightItem from './LightItem'
import List from '../Utility/List'
import AmbientLight from './AmbientLight'
import DirectionalLight from './DirectionalLight'
import PointLight from './PointLight'


export default class Light
{
    public static AmbientCount: number = 0
    public static DirectionalCount: number = 0
    public static PointCount: number = 0
    
    public static readonly MAX_AMBIENT: number = 1
    public static readonly MAX_DIRECTIONAL: number = 3
    public static readonly MAX_POINT: number = 8
    public static readonly MAX_LIGHTS: number = 12
    private static Lights: List<LightItem> = new List(12)

    static Add(light: LightItem): void
    {
        if (Light.Lights.Add(light))
        {
            if (light instanceof AmbientLight)
            {
                ++Light.AmbientCount
            }
            if (light instanceof DirectionalLight)
            {
                ++Light.DirectionalCount
            }
            if (light instanceof PointLight)
            {
                ++Light.PointCount
            }
        }
    }

    static Remove(light: LightItem): void
    {
        let node = Light.Lights.Remove(light)

        if (node)
        {
            if (light instanceof AmbientLight)
            {
                --Light.AmbientCount
            }
            if (light instanceof DirectionalLight)
            {
                --Light.DirectionalCount
            }
            if (light instanceof PointLight)
            {
                --Light.PointCount
            }
        }
    }
}