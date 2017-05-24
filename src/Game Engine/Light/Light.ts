import { AmbientLight, IAmbientLight } from "./AmbientLight";
import { DirectionalLight, IDirectionalLight } from "./DirectionalLight";
import { PointLight, IPointLight } from "./PointLight";
import { LightItem } from "./LightItem";

export class Light
{
    private AmbientCount:       number = 0;
    private DirectionalCount:   number = 0;
    private PointCount:         number = 0;
    
    private MAX_AMBIENT:        number = 1;
    private MAX_DIRECTIONAL:    number = 3;
    private MAX_POINT:          number = 8;
    private MAX_LIGHTS:         number = 12;

    public static Lights:       Array<LightItem | null> = new Array();

    constructor()
    {
        for (var i = 0; i < this.MAX_LIGHTS; ++i)
            Light.Lights.push(null);
    }
    
    public Ambient(request: IAmbientLight): AmbientLight | null
    {
        var light = null;

        if (this.AmbientCount < this.MAX_AMBIENT)
        {
            light = new AmbientLight(request);
            light.GameObject.Light = light;
            
            this.AmbientCount++;
            Light.Lights[0] = light;
        }

        return light;
    }
    
    public Directional(request: IDirectionalLight): DirectionalLight | null
    {
        var light = null;

        if (this.DirectionalCount < this.MAX_DIRECTIONAL)
        {
            for (var i = this.MAX_AMBIENT; i < this.MAX_DIRECTIONAL; ++i)
            {
                if (!Light.Lights[i])
                {
                    light = new DirectionalLight(request);
                    light.GameObject.Light = light;

                    this.DirectionalCount++;
                    Light.Lights[i] = light;

                    break;
                }
            }
        }

        return light;
    }
    
    public Point(request: IPointLight): PointLight | null
    {
        var light = null;

        if (this.PointCount < this.MAX_POINT)
        {
            for (var i = this.MAX_DIRECTIONAL; i < this.MAX_LIGHTS; ++i)
            {
                if (!Light.Lights[i])
                {
                    light = new PointLight(request);
                    light.GameObject.Light = light;

                    this.PointCount++;
                    Light.Lights[i] = light;

                    break;
                }
            }
        }

        return light
    }
    
    public Remove(light: LightItem): void
    {
        for (var i in  Light.Lights)
            if (!!Light.Lights[i] && light.ID === Light.Lights[i].ID)
                Light.Lights[i] = null;
    }
}
