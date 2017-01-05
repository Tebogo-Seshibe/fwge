/**
 * @constructor AmbientLight
 * @description Describes a light that evenly lights the scene.
 * @module      FWGE.Game.Light
 * @param		request:        {Object}
 *              > colour:       {Float32Array}  [nullable]
 *              > intensity:    {Number}        [nullable]
 */
function AmbientLight(request)
{
    if (!request) request = {};
    request.type = "AMBIENTLIGHT";

    LightItem.call(this, request);
}

