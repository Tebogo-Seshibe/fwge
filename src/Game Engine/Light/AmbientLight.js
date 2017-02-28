/**
 * @name        AmbientLight
 * @description Describes a light that evenly lights the scene.
 * @module      FWGE.Game.Light
 */
function AmbientLight(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "AMBIENTLIGHT ";

    LightItem.call(this, request);
}

