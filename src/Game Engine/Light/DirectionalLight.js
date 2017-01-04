/*!
 *  @constructor    DirectionalLight
 *  @description    Directional lighting
 *  @param          {Object: request} [nullable]
 */
function DirectionalLight(request)
{
    if (!request)   request = {};
    request.type = "DIRECTIONALLIGHT";
    LightObject.call(this, request);
    
    var $           = this;
    var _Direction  = (request.direction instanceof Float32Array && request.direction.length === 3) ? request.direction : new Float32Array(3);
    
    Object.defineProperties($,
    {
        Direction: { get: function getDirection() { return _Direction; } },

        DirectionalUpdate:
        {
            value: function DirectionalUpdate()
            {
                // TODO
                // Update the direction based on the orientation of the containing object.
            }
        }
    });
}

