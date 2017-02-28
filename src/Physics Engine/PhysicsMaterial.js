var __PHYSICSMATERIAL__ = [];

/**
 * @name        PhysicsMaterial
 * @description Some words of encouragement
 */
function PhysicsMaterial(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "PHYSICSMATERIAL ";

    Item.call(this, request);
}