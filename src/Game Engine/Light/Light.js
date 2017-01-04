var __LIGHT__ = new Array(12);

/*!
 * @constructor Light
 * @module		FWGE.Game
 * @description	This module is used to create the lights in the scene.
 */
function Light()
{
	var _AmbientCount 		= 0;
	var _DirectionalCount 	= 0;
	var _PointCount 		= 0;
    
    var _MAX_AMBIENT 		= 1;
    var _MAX_DIRECTIONAL 	= 3;
    var _MAX_POINT 			= 8;

    Object.defineProperties(this,
    {
    	/*!
    	 * @function	Ambient
    	 * @description	Returns a new ambient light object. It is treated as a singleton,
		 * 				i.e. there is only one ambient light object in a scene.
		 * @param 		{Object: request}
		 * 				> {GameObject: parent}
		 * 				> {Float32Array: colour}	[nullable]
		 * 				> {Number: intensity}		[nullable]
    	 * @return 		AmbientLight
    	 */
        Ambient:
        {
        	value: function Ambient(request)
        	{
        		if (_AmbientCount < _MAX_AMBIENT)
        		{
        			__LIGHT__[0] = new AmbientLight(request);
        			_AmbientCount++;
        		}
    		
    			return __LIGHT__[0];
        	}
        },

    	/*!
    	 * @function	Directional
    	 * @description	Returns a new directional light object. There can up to three
		 * 				directional light objects in a scene.
		 * @param 		{Object: request}
		 * 				> {GameObject: parent}
		 * 				> {Float32Array: colour}	[nullable]
		 * 				> {Number: intensity}		[nullable]
		 * 				> {Float32Array: direction}	[nullable]
    	 * @return 		DirectionalLight
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
		        			_DirectionalCount++;

		        			return __LIGHT__[i];		
        				}
        			}
        		}

        		return undefined;
        	}
        },

    	/*!
    	 * @function	Point
    	 * @description	Returns a new point light object. There can up to eight
		 * 				point light objects in a scene.
		 * @param 		{Object: request}
		 * 				> {GameObject: parent}
		 * 				> {Float32Array: colour}	[nullable]
		 * 				> {Number: intensity}		[nullable]
		 * 				> {Number: radius}			[nullable]
		 * 				> {Number: angle}			[nullable]
    	 * @return 		PointLight
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
		        			_PointCount++;

		        			return __LIGHT__[i];		
        				}
        			}
        		}

        		return undefined;
        	}
        },

    	/*!
    	 * @function	Remove
    	 * @description	Removes a given light object from the scene.
		 * @param 		{LightItem: light}
    	 */
        Remove:
        {
        	value: function Remove(light)
        	{
        		if (!!light)
        		{
        			switch (light.Type)
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

