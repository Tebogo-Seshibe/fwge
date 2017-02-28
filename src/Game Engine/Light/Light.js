var __LIGHT__ = new Array(12);

/**
 * @name        Light
 * @module      FWGE.Game
 * @description This module is used to create the lights in the scene.
 */
function Light()
{
    var _AmbientCount     = 0;
    var _DirectionalCount = 0;
    var _PointCount       = 0;
    
    var _MAX_AMBIENT      = 1;
    var _MAX_DIRECTIONAL  = 3;
    var _MAX_POINT        = 8;

    Object.defineProperties(this,
    {
        /**
         * @function    Ambient: {AmbientLight}
         * @description Returns a new ambient light object. There is only one ambient
         *              light object in a scene.
         * @see         FWGE.Game.Light.AmbientLight
         * @param       request:        {Object}
         *              > parent:       {GameObject}    [nullable]
         *              > colour:       {Float32Array}  [nullable]
         *              > intensity:    {Number}        [nullable]
         */
        Ambient:
        {
            value: function Ambient(request)
            {
                if (_AmbientCount < _MAX_AMBIENT)
                {
                    __LIGHT__[0] = new AmbientLight(request);
                    __LIGHT__[0].GameObject = request.parent instanceof GameObject ? request.parent : FWGE.Game.GameObject();
                    __LIGHT__[0].GameObject.LightItem = __LIGHT__[0];
                    
                    _AmbientCount++;
                    return __LIGHT__[0];
                }

                return undefined;
            }
        },

        /**
         * @function    Directional: {DirectionalLight}
         * @description Returns a new directional light object. There can up to three
         *              directional light objects in a scene.
         * @see         FWGE.Game.Light.DirectionalLight
         * @param       request:         {Object}
         *              > parent:        {GameObject}    [nullable]
         *              > colour:        {Float32Array}  [nullable]
         *              > intensity:     {Number}        [nullable]
         *              > direction:     {Float32Array}  [nullable]
         */
        Directional:
        {
            value: function Directional(request)
            {
                if (_DirectionalCount < _MAX_DIRECTIONAL)
                {
                    for (var i = 1; i < 4; ++i)
                    {
                        if (__LIGHT__[i] === undefined)
                        {
                            __LIGHT__[i] = new DirectionalLight(request);
                            __LIGHT__[i].GameObject = request.parent instanceof GameObject ? request.parent : FWGE.Game.GameObject();
                            __LIGHT__[i].GameObject.LightItem = __LIGHT__[i];

                            _DirectionalCount++;
                            return __LIGHT__[i];        
                        }
                    }
                }

                return undefined;
            }
        },

        /**
         * @function    Point: {PointLight}
         * @description Returns a new point light object. There can up to eight
         *              point light objects in a scene.
         * @see         FWGE.Game.Light.PointLight
         * @param       request:        {Object}
         *              > parent:       {GameObject}    [nullable]
         *              > colour:       {Float32Array}  [nullable]
         *              > intensity:    {Number}        [nullable]
         *              > radius:       {Number}        [nullable]
         *              > angle:        {Number}        [nullable]
         */
        Point:
        {
            value: function Point(request)
            {
                if (_PointCount < _MAX_DIRECTIONAL)
                {
                    for (var i = 4; i < 12; ++i)
                    {
                        if (__LIGHT__[i] === undefined)
                        {
                            __LIGHT__[i] = new PointLight(request);
                            __LIGHT__[i].GameObject = request.parent instanceof GameObject ? request.parent : FWGE.Game.GameObject();
                            __LIGHT__[i].GameObject.LightItem = __LIGHT__[i];

                            _PointCount++;
                            return __LIGHT__[i];        
                        }
                    }
                }

                return undefined;
            }
        },

        /**
         * @function    Remove: void
         * @description Removes a given light object from the scene.
         * @param       light: {LightItem}
         */
        Remove:
        {
            value: function Remove(light)
            {
                if (!!light)
                {
                    switch (light.Type[0])
                    {
                        case "AMBIENTLIGHT":
                            __LIGHT__[0] = undefined;
                            --_AmbientCount;
                        break;

                        case "DIRECTIONALLIGHT":
                            for (var i = 1; i < 4; ++i)
                            {
                                if (__LIGHT__[i] === light)
                                {
                                    __LIGHT__[i] = undefined;
                                    --_DirectionalCount;
                                    break;
                                }
                            }
                        break;

                        case "POINTLIGHT":
                            for (var i = 4; i < 12; ++i)
                            {
                                if (__LIGHT__[i] === light)
                                {
                                    __LIGHT__[i] = undefined;
                                    --_PointCount;
                                    break;
                                }
                            }
                        break;
                    }
                }
            }
        }
    });
}

