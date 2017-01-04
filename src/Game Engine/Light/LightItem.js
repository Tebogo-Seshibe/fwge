/*!
 *  @constructor    LightItem
 *  @description    Hello
 *  @param          {Object: request}
 *                  > {Float32Array: colour}
 *                  > {Number: intensity}
 */
function LightItem(request)
{
    GameItem.call(this, request);

    if (!request) request = {};
    
    var $ = this;
    var _Colour     = request.colour instanceof Float32Array ? request.colour    : new Float32Array(3);
    var _Intensity  = typeof request.intensity === 'number'  ? request.intensity : 1.0;
    
    Object.defineProperties($,
    {
        Colour:
        {
            get: function getColour(){ return _Colour; },
            set: function setColour(colour)
            {
                if (colour instanceof Float32Array && colour.length === 3)
                    FWGE.Game.Maths.Vector3.Set(_Colour, colour);
            }
        },
        Intensity:
        {
            get: function getIntensity(){ return _Intensity; },
            set: function setIntensity(colour)
            {
                if (typeof colour === 'number')
                    _Intensity = colour;
            }
        }
    });
    
    __LIGHT__.push($);
}

