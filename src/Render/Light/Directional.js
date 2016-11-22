function Directional(request)
{
    var $ = this;
    
    if (!request)   request = {};
    if (!request.direction || !(request.direction instanceof Float32Array && request.direction.length === 3)) request.direction = FWGE.Maths.Vector3.Create();
    
    request.type = "DIRECTIONALLIGHT";
    LightObject.call($, request);
    
    var _Direction = request.direction;
    
    Object.defineProperties($,
    {
        Direction:
        {
            get: function getDirection() { return _Direction; },
            set: function setDirection()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Direction, arguments[0]);
            }
        }
    });
}

