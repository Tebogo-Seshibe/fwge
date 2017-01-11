var __PHYSICSMATERIAL__ = [];

/**
 * @constructor PhysicsMaterial
 * @description Some words of encouragement
 * @param       request: {Object}
 */
function PhysicsMaterial(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "PHYSICSMATERIAL ";

    Item.call(this, request);
}