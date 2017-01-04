/*!
 * 	@constructor	AmbientLight
 *	@description 	Ambient lighting
 *	@param			{Object: request}[nullable]
 */
function AmbientLight(request)
{
    if (!request)   request = {};
    request.type = "AMBIENTLIGHT";
    
    LightItem.call(this, request);
}

