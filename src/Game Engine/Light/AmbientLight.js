/**
 * @name        AmbientLight
 * @module      FWGE.Game.Light
 * @description This type of light is used to light the scene evenely
 *				in one colour.
 */
function AmbientLight(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "AMBIENTLIGHT ";

    LightItem.call(this, request);
}

