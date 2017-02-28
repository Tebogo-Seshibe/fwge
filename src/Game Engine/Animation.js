/**
 * @name        Particle
 * @description Definition of an animator
 * @module      FWGE.Game
 */
function Animation(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type = "ANIMATION ";
    
    GameItem.call(this, request);    
}

