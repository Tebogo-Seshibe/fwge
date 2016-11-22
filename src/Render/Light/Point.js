function Point(request)
{
    var $ = this;
    
    if (!request) request = {};
    if (!request.transform) request.transform = new FWGE.Item.Transform();
    if (!request.radius) request.radius = 5;
    if (!request.angle) request.angle = 180;       
    
    request.type = "POINTLIGHT";
    LightObject.call($, request);
    
    var _Transform = request.transform;
    var _Radius = request.radius;
    var _Angle = request.angle;
    
    Object.defineProperties($, 
    {
        Radius:
        {
            get: function getRadius() { return _Radius; },
            set: function setRadius()
            {
                if (typeof arguments[0] === 'number')
                    _Radius = arguments[0];
            }
        },
        Angle:
        {
            get: function getAngle() { return _Angle; },
            set: function setAngle()
            {
                if (typeof arguments[0] === 'number')
                    _Angle = arguments[0];
            }
        },
        Transform: { get: function getTransform(){ return _Transform; } }
    });
}

