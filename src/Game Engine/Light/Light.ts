import { AmbientLight }     from "./AmbientLight";
import { DirectionalLight } from "./DirectionalLight";
import { PointLight }       from "./PointLight";

/**
 * @name        Light
 * @module      FWGE.Game
 * @description This module is used to create the lights in the scene.
 */
export class Light
{
    private AmbientCount:       number = 0;
    private DirectionalCount:   number = 0;
    private PointCount:         number = 0;
    
    private MAX_AMBIENT:        number = 1;
    private MAX_DIRECTIONAL:    number = 3;
    private MAX_POINT:          number = 8;
    private MAX_LIGHTS:         number = 12;

    public static Lights:             Array<AmbientLight | DirectionalLight | PointLight | null> = new Array();

    constructor()
    {
        for (var i = 0; i < this.MAX_LIGHTS; ++i)
            Light.Lights.push(null);
    }

    /**
     * @description Returns a new ambient light object. There is only one ambient
     *              light object in a scene.
     * @see         {FWGE.Game.Light.AmbientLight}
     * @param       request:            {Object}
     * @param       request.parent:     {GameObject}
     * @param       request.colour:     {Float32Array}
     * @param       request.intensity:  {Number}
     * @return      {AmbientLight}
     */
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

    /**
     * @function    Directional: {DirectionalLight}
     * @description Returns a new directional light object. There can up to three
     *              directional light objects in a scene.
     * @see         FWGE.Game.Light.DirectionalLight
     * @param       request:         {Object}
     *              > parent:        {GameObject}    [null]
     *              > colour:        {Float32Array}  [null]
     *              > intensity:     {Number}        [null]
     *              > direction:     {Float32Array}  [null]
     */
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

    /**
     * @function    Point: {PointLight}
     * @description Returns a new point light object. There can up to eight
     *              point light objects in a scene.
     * @see         FWGE.Game.Light.PointLight
     * @param       request:        {Object}
     *              > parent:       {GameObject}    [null]
     *              > colour:       {Float32Array}  [null]
     *              > intensity:    {Number}        [null]
     *              > radius:       {Number}        [null]
     *              > angle:        {Number}        [null]
     */
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

    /**
     * @function    Remove: void
     * @description Removes a given light object from the scene.
     * @param       light: {LightItem}
     */
    Remove(light: AmbientLight | DirectionalLight | PointLight): void
    {
        for (var i in  Light.Lights)
            if (!!Light.Lights[i] && light.ID === Light.Lights[i].ID)
                Light.Lights[i] = null;
    }
}
