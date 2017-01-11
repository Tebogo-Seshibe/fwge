/**
 * @constructor PointLight
 * @description Defines a light Object that emits from a given point within a radius.
 * @module      FWGE.Game.Light
 * @param       request:        {Object}
 *              > colour:       {Float32Array}  [nullable]
 *              > intensity:    {Number}        [nullable]
 *              > radius:       {Number}        [nullable]
 *              > angle:        {Number}        [nullable]
 */
function PointLight(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "POINTLIGHT ";
    
    LightItem.call(this, request);
    
    var _Radius = typeof request.radius === 'number' ? request.radius : 5;
    var _Angle = typeof request.angle  === 'number' ? request.angle : 180;
    
    Object.defineProperties(this, 
    {
        /**
         * @property    Radius: {Number}
         *              > get
         *              > set
         * @description The range the light will illuminate 
         */
        Radius:
        {
            get: function getRadius() { return _Radius; },
            set: function setRadius()
            {
                if (typeof arguments[0] === 'number')
                    _Radius = arguments[0];
            }
        },
        
        /**
         * @property    Angle: {Number}
         *              > get
         *              > set
         * @description The angle the light will illuminate.
         *              35 would be a spotlight while 180 would be a globe.
         */
        Angle:
        {
            get: function getAngle() { return _Angle; },
            set: function setAngle()
            {
                if (typeof arguments[0] === 'number')
                    _Angle = Math.clamp(arguments[0], 0, 180);
            }
        }
    });
}

