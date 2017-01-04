/*!
 * @constructor PointLight
 * @description Defines a light Object that emits from a given point within a radius.
 * @param       {Object: request}
 *              > {Float32Array: colour}    [nullable]
 *              > {Number: intensity}       [nullable]
 *              > {Number: radius}          [nullable]
 *              > {Number: angle}           [nullable]
 */
function PointLight(request)
{
    if (!request) request = {};
    request.type = "POINTLIGHT";
    LightObject.call(this, request);
    
    var _Radius = typeof request.radius === 'number' ? request.radius   : 5;
    var _Angle  = typeof request.angle  === 'number' ? request.angle    : 180;
    
    Object.defineProperties(this, 
    {
        Radius:
        {
            get: function getRadius() { return _Radius; },
            set: function setRadius(radius)
            {
                if (typeof radius === 'number')
                    _Radius = radius;
            }
        },
        Angle:
        {
            get: function getAngle() { return _Angle; },
            set: function setAngle(angle)
            {
                if (typeof angle === 'number')
                    _Angle = Math.clamp(0, 180, angle);
            }
        }
    });
}

