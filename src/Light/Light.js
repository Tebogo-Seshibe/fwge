    /**
     * @name        Light
     * @module      FWGE.Game
     * @description Module used to create lightobject in the scene.
     *              There can only be 12 lights at a given time:
     *              1: Ambient Light
     *              3: Directional Lights
     *              8: Point Lights
     */

let Lights = new Array();

(function()
{
    function Light()
    {
        var AmbientCount = 0;
        var DirectionalCount = 0;
        var PointCount = 0;
        
        const MAX_AMBIENT = 1;
        const MAX_DIRECTIONAL = 3;
        const MAX_POINT = 8;
        const MAX_LIGHTS = 12;

        Object.defineProperties(this,
        {    
            /**
             * @function    Ambient
             * @param       {Object} request 
             * @param       {string} request.name 
             * @param       {GameObject | undefined} request.gameobject 
             * @param       {Array | undefined} request.colour
             * @param       {number | undefined} request.intensity
             * @return      {AmbientLight | undefined}
             */        
            Ambient:
            {
                value: function Ambient(request)
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
            },
            
            /**
             * @function    Ambient
             * @param       {Object} request 
             * @param       {string} request.name
             * @param       {GameObject | null | undefined} request.gameobject
             * @param       {Array} request.colour
             * @param       {number} request.intensity
             * @param       {Array} request.direction
             * @return      {AmbientLight | undefined}
             */ 
            Directional:
            {
                value: function Directional(request)
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
            },
            
            /**
             * @function    Ambient
             * @param       {Object} request 
             * @param       {string} request.name 
             * @param       {GameObject | undefined} request.gameobject 
             * @param       {Array | undefined} request.colour
             * @param       {number | undefined} request.intensity
             * @return      {AmbientLight | undefined}
             */ 
            Point:
            {
                value: function Point(request)
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
            },
            
            /**
             * @function    Ambient
             * @param       {AmbientLight | DirectionalLight | PointLight} light 
             * @return      {AmbientLight | DirectionalLight | PointLight}
             * @description Removes a light from the given scene.
             */ 
            Remove:
            {
                valeu: function Remove(light)
                {
                    for (var i in  Light.Lights)
                        if (!!Light.Lights[i] && light.ID === Light.Lights[i].ID)
                            Light.Lights[i] = null;

                    return light;
                }
            }
        });
    }
    Light.prototype = Object.create(null);
    Object.defineProperties(Light,
    {    
        Lights: { value: new Array(12), configurable: false, enumerable: true, writable: false }
    });
})();