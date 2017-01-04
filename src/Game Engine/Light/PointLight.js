/*!
 *  @constructor    PointLight
 *  @description    Point lighting
 *  @param          {Object: request}
 *                  > {Number: radius}
 *                  > {Number: angle}
 */
function PointLight(request)
{
    if (!request) request = {};
    request.type = "POINTLIGHT";
    LightObject.call(this, request);
    
    var $       = this;
    var _Radius = typeof request.radius === 'number' ? request.radius   : 5;
    var _Angle  = typeof request.angle  === 'number' ? request.angle    : 180;
    
    Object.defineProperties($, 
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

