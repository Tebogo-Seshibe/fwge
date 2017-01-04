/*!
 * @constructor AmbientLight
 * @description Describes a light that evenly lights the scene.
 * @module      FWGE.Game.Light
 * @param		{Object: request}
 *              > {Float32Array: colour}    [nullable]
 *              > {Number: intensity}       [nullable]
 */
function AmbientLight(request)
{
    if (!request) request = {};
    request.type = "AMBIENTLIGHT";

    LightItem.call(this, request);
}

