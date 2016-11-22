function LightObject(request)
{
    var $ = this;
    
    if (!request.colour) request.colour = new Float32Array(3);
    if (!request.intensity) request.intensity = 1;
    
    GameItem.call($, request.gameobject, request.type);
    
    var _Colour = request.colour;
    var _Intensity = request.intensity;
    
    Object.defineProperties($,
    {
        Colour:
        {
            get: function getColour(){ return _Colour; },
            set: function setColour()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Colour, arguments[0]);
            }
        },
        Intensity:
        {
            get: function getIntensity(){ return _Intensity; },
            set: function setIntensity()
            {
                if (typeof arguments[0] === 'number')
                    _Intensity = arguments[0];
            }
        }
    });
    
    __LIGHT__.push($);
}

