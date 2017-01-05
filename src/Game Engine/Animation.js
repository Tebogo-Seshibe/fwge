/**
 * @constructor	Particle
 * @description	Definition of an animator
 * @module		FWGE.Game
 * @param		request: 	{Object}
 */
function Animation(request)
{
    if (!request) request = {};
    request.type = "ANIMATION";
    GameItem.call(this, request);    
}

